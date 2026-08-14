import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import pg from 'pg';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import crypto from 'node:crypto';
import { courses, departments, pathways, certificateRules } from './data/catalogue.js';
import { materialsForCourse } from './data/materials.js';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 10000);
const app = express();
const memory = { enrollments: [], progress: [], contacts: [], users: [], sessions: [], emailTokens: [], assessmentAttempts: [], masteryStates: [] };
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false } }) : null;

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true }));

// Render may preserve a trailing-slash variant for some API requests. Normalise
// slashless API paths before routing so browser and direct requests behave alike.
app.use((req, _res, next) => {
  if (req.path.startsWith('/api') && !req.path.endsWith('/')) {
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    req.url = `${req.path}/${query}`;
  }
  next();
});

const normaliseEmail = (value) => String(value || '').trim().toLowerCase();
const safeText = (value, max = 240) => String(value || '').trim().slice(0, max);
const findCourse = (id) => courses.find((course) => course.id === String(id).toLowerCase());
const findPathway = (id) => pathways.find((pathway) => pathway.id === String(id).toLowerCase());
const findDepartment = (id) => departments.find((department) => department.id === String(id).toLowerCase());
const courseInDepartment = (course, departmentId) => {
  const department = findDepartment(departmentId);
  return Boolean(department && course && course.primaryDepartment === department.name);
};
const idFor = (prefix) => `${prefix}-${crypto.randomUUID()}`;
const sessionCookieName = 'ga_session';
const authPepper = process.env.AUTH_PEPPER || 'development-only-gentsacademy-pepper-change-me';
const hashToken = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');
const makePasswordHash = (password) => { const salt = crypto.randomBytes(16).toString('hex'); const derived = crypto.scryptSync(`${password}${authPepper}`, salt, 64).toString('hex'); return `scrypt$${salt}$${derived}`; };
const verifyPassword = (password, stored) => { const [, salt, expected] = String(stored || '').split('$'); if (!salt || !expected) return false; const actual = crypto.scryptSync(`${password}${authPepper}`, salt, 64).toString('hex'); return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex')); };
const parseCookies = (header = '') => Object.fromEntries(header.split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter(([key, value]) => key && value));
const setSessionCookie = (res, token, maxAge = 60 * 60 * 24 * 30) => res.setHeader('Set-Cookie', `${sessionCookieName}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax`);
const clearSessionCookie = (res) => res.setHeader('Set-Cookie', `${sessionCookieName}=; Max-Age=0; Path=/; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax`);
async function currentUser(req) { const token = parseCookies(req.headers.cookie || '')[sessionCookieName]; if (!token) return null; const tokenHash = hashToken(token); if (pool) { const result = await pool.query('SELECT u.id, u.email, u.display_name AS "displayName", u.email_verified_at AS "emailVerifiedAt" FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > NOW()', [tokenHash]); return result.rows[0] || null; } const session = memory.sessions.find((item) => item.tokenHash === tokenHash && !item.revokedAt && new Date(item.expiresAt) > new Date()); return session ? memory.users.find((item) => item.id === session.userId) || null : null; }
async function requireUser(req, res) { const user = await currentUser(req); if (!user) { res.status(401).json({ error: 'Sign in to continue.' }); return null; } return user; }
const genericAuthError = 'Email or password is incorrect.';

async function initialiseDatabase() {
  if (!pool) return;
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        email_verified_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_login_at TIMESTAMPTZ
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        revoked_at TIMESTAMPTZ
      );
      CREATE TABLE IF NOT EXISTS email_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        purpose TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        consumed_at TIMESTAMPTZ
      );
      CREATE TABLE IF NOT EXISTS assessment_attempts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL,
        week INTEGER NOT NULL,
        answers JSONB NOT NULL,
        score NUMERIC NOT NULL DEFAULT 0,
        mastery BOOLEAN NOT NULL DEFAULT FALSE,
        ai_warning BOOLEAN NOT NULL DEFAULT FALSE,
        feedback JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS mastery_states (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL,
        week INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'locked',
        concepts JSONB NOT NULL DEFAULT '[]'::jsonb,
        attempts INTEGER NOT NULL DEFAULT 0,
        best_score NUMERIC NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, course_id, week)
      );
      CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      learner_name TEXT NOT NULL,
      email TEXT NOT NULL,
      course_id TEXT NOT NULL,
      enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(email, course_id)
    );
    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      course_id TEXT NOT NULL,
      completed_modules INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(email, course_id)
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function listEnrollments(email) {
  if (pool) {
    const result = await pool.query('SELECT id, learner_name AS "learnerName", email, course_id AS "courseId", enrolled_at AS "enrolledAt" FROM enrollments WHERE email = $1 ORDER BY enrolled_at DESC', [email]);
    return result.rows;
  }
  return memory.enrollments.filter((item) => item.email === email);
}

async function listProgress(email) {
  if (pool) {
    const result = await pool.query('SELECT course_id AS "courseId", completed_modules AS "completedModules", updated_at AS "updatedAt" FROM progress WHERE email = $1', [email]);
    return result.rows;
  }
  return memory.progress.filter((item) => item.email === email);
}

async function saveEnrollment({ learnerName, email, courseId }) {
  if (pool) {
    const result = await pool.query(`INSERT INTO enrollments (id, learner_name, email, course_id) VALUES ($1, $2, $3, $4) ON CONFLICT (email, course_id) DO UPDATE SET learner_name = EXCLUDED.learner_name RETURNING id, learner_name AS "learnerName", email, course_id AS "courseId", enrolled_at AS "enrolledAt"`, [idFor('enr'), learnerName, email, courseId]);
    return result.rows[0];
  }
  const existing = memory.enrollments.find((item) => item.email === email && item.courseId === courseId);
  if (existing) return existing;
  const record = { id: idFor('enr'), learnerName, email, courseId, enrolledAt: new Date().toISOString() };
  memory.enrollments.unshift(record);
  return record;
}

async function saveProgress({ email, courseId, completedModules }) {
  if (pool) {
    const result = await pool.query(`INSERT INTO progress (id, email, course_id, completed_modules) VALUES ($1, $2, $3, $4) ON CONFLICT (email, course_id) DO UPDATE SET completed_modules = EXCLUDED.completed_modules, updated_at = NOW() RETURNING course_id AS "courseId", completed_modules AS "completedModules", updated_at AS "updatedAt"`, [idFor('progress'), email, courseId, completedModules]);
    return result.rows[0];
  }
  let record = memory.progress.find((item) => item.email === email && item.courseId === courseId);
  if (!record) {
    record = { email, courseId, completedModules, updatedAt: new Date().toISOString() };
    memory.progress.push(record);
  } else {
    record.completedModules = completedModules;
    record.updatedAt = new Date().toISOString();
  }
  return record;
}

async function saveContact({ name, email, message }) {
  if (pool) {
    await pool.query('INSERT INTO contacts (id, name, email, message) VALUES ($1, $2, $3, $4)', [idFor('contact'), name, email, message]);
    return;
  }
  memory.contacts.push({ id: idFor('contact'), name, email, message, createdAt: new Date().toISOString() });
}

app.post('/api/auth/signup', async (req, res) => {
  const displayName = safeText(req.body.displayName, 100);
  const email = normaliseEmail(req.body.email);
  const password = String(req.body.password || '');
  if (!displayName || !email.includes('@') || password.length < 12 || password.length > 128) return res.status(400).json({ error: 'Use a name, valid email, and a passphrase between 12 and 128 characters.' });
  try {
    const passwordHash = makePasswordHash(password); const id = idFor('usr');
    if (pool) { const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]); if (existing.rows[0]) return res.status(409).json({ error: 'An account already exists for this email.' }); await pool.query('INSERT INTO users (id, email, display_name, password_hash, email_verified_at) VALUES ($1, $2, $3, $4, NULL)', [id, email, displayName, passwordHash]); }
    else { if (memory.users.some((item) => item.email === email)) return res.status(409).json({ error: 'An account already exists for this email.' }); memory.users.push({ id, email, displayName, passwordHash, emailVerifiedAt: null }); }
    const rawToken = crypto.randomBytes(32).toString('base64url'); const tokenHash = hashToken(rawToken); const expiresAt = new Date(Date.now() + 86400000).toISOString();
    if (pool) await pool.query('INSERT INTO email_tokens (id, user_id, token_hash, purpose, expires_at) VALUES ($1, $2, $3, $4, $5)', [idFor('verify'), id, tokenHash, 'email_verification', expiresAt]); else memory.emailTokens.push({ id: idFor('verify'), userId: id, tokenHash, purpose: 'email_verification', expiresAt });
    const verificationUrl = process.env.NODE_ENV === 'production' && process.env.EMAIL_PROVIDER ? undefined : `/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;
    res.status(201).json({ message: 'Account created. Verify your email before signing in.', verificationRequired: true, verificationUrl });
  } catch (error) { res.status(500).json({ error: 'Account could not be created.', detail: process.env.NODE_ENV === 'production' ? undefined : error.message }); }
});
app.get('/api/auth/verify-email', async (req, res) => {
  const rawToken = String(req.query.token || ''); if (!rawToken) return res.status(400).json({ error: 'Verification token is required.' }); const tokenHash = hashToken(rawToken);
  try { let userId; if (pool) { const result = await pool.query('SELECT user_id FROM email_tokens WHERE token_hash = $1 AND purpose = $2 AND consumed_at IS NULL AND expires_at > NOW()', [tokenHash, 'email_verification']); if (!result.rows[0]) return res.status(400).json({ error: 'This verification link is invalid or expired.' }); userId = result.rows[0].user_id; await pool.query('UPDATE users SET email_verified_at = NOW(), updated_at = NOW() WHERE id = $1', [userId]); await pool.query('UPDATE email_tokens SET consumed_at = NOW() WHERE token_hash = $1', [tokenHash]); } else { const token = memory.emailTokens.find((item) => item.tokenHash === tokenHash && !item.consumedAt && new Date(item.expiresAt) > new Date()); if (!token) return res.status(400).json({ error: 'This verification link is invalid or expired.' }); userId = token.userId; token.consumedAt = new Date().toISOString(); const user = memory.users.find((item) => item.id === userId); if (user) user.emailVerifiedAt = new Date().toISOString(); } res.json({ verified: true, message: 'Email verified. You may now sign in.' }); } catch (error) { res.status(500).json({ error: 'Verification could not be completed.' }); }
});
app.post('/api/auth/login', async (req, res) => {
  const email = normaliseEmail(req.body.email); const password = String(req.body.password || '');
  try { let user; if (pool) { const result = await pool.query('SELECT id, email, display_name AS "displayName", password_hash AS "passwordHash", email_verified_at AS "emailVerifiedAt" FROM users WHERE email = $1', [email]); user = result.rows[0]; } else user = memory.users.find((item) => item.email === email); if (!user || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ error: genericAuthError }); if (!user.emailVerifiedAt) return res.status(403).json({ error: 'Verify your email before signing in.' }); const rawToken = crypto.randomBytes(32).toString('base64url'); const expiresAt = new Date(Date.now() + 2592000000).toISOString(); if (pool) { await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]); await pool.query('INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)', [idFor('ses'), user.id, hashToken(rawToken), expiresAt]); } else memory.sessions.push({ id: idFor('ses'), userId: user.id, tokenHash: hashToken(rawToken), expiresAt }); setSessionCookie(res, rawToken); res.json({ user: { id: user.id, email: user.email, displayName: user.displayName, emailVerifiedAt: user.emailVerifiedAt } }); } catch (error) { res.status(500).json({ error: 'Login could not be completed.' }); }
});
app.get('/api/auth/me', async (req, res) => { const user = await currentUser(req); res.json({ user: user ? { id: user.id, email: user.email, displayName: user.displayName, emailVerifiedAt: user.emailVerifiedAt } : null }); });
app.post('/api/auth/logout', async (req, res) => { const token = parseCookies(req.headers.cookie || '')[sessionCookieName]; if (token && pool) await pool.query('UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1', [hashToken(token)]); else if (token) { const session = memory.sessions.find((item) => item.tokenHash === hashToken(token)); if (session) session.revokedAt = new Date().toISOString(); } clearSessionCookie(res); res.json({ loggedOut: true }); });
app.get('/api/health', async (_req, res) => {
  let database = 'memory-fallback';
  if (pool) {
    try {
      await pool.query('SELECT 1');
      database = 'postgresql';
    } catch {
      database = 'postgresql-unavailable';
    }
  }
  res.json({ ok: database !== 'postgresql-unavailable', service: 'gentsacademy-api', database, timestamp: new Date().toISOString() });
});

app.get('/api/catalogue-summary', (_req, res) => {
  const published = courses.filter((course) => course.status === 'published');
  res.json({ totalCourses: published.length, departments: departments.length, pathways: pathways.length, levels: [...new Set(published.map((course) => course.level))], lastUpdated: '14 August 2026' });
});

app.get('/api/departments', (_req, res) => res.json({ departments }));
app.get('/api/departments/:departmentId/courses', (req, res) => {
  const department = findDepartment(req.params.departmentId);
  if (!department) return res.status(404).json({ error: 'Department not found.' });
  const departmentCourses = courses.filter((course) => course.status === 'published' && course.primaryDepartment === department.name);
  res.json({ department, courses: departmentCourses, total: departmentCourses.length });
});
app.get('/api/pathways', (_req, res) => res.json({ pathways: pathways.map((pathway) => ({ ...pathway, courses: pathway.courseIds.map(findCourse).filter(Boolean) })) }));
app.get('/api/certificate-rules', (_req, res) => res.json({ rules: certificateRules }));

app.get('/api/courses', (req, res) => {
  const search = safeText(req.query.search, 100).toLowerCase();
  const department = safeText(req.query.department, 100);
  const level = safeText(req.query.level, 50);
  const mode = safeText(req.query.mode, 50);
  const pathway = safeText(req.query.pathway, 80);
  const results = courses.filter((course) => {
    const matchesSearch = !search || [course.code, course.title, course.description, ...course.tags].join(' ').toLowerCase().includes(search);
    const matchesDepartment = !department || course.primaryDepartment === department;
    const matchesLevel = !level || course.level === level;
    const matchesMode = !mode || course.learningMode === mode;
    const matchesPathway = !pathway || course.pathways.includes(pathway);
    return course.status === 'published' && matchesSearch && matchesDepartment && matchesLevel && matchesMode && matchesPathway;
  });
  res.json({ courses: results, total: results.length });
});

app.get('/api/courses/:id/materials', (req, res) => {
  const course = findCourse(req.params.id);
  const departmentId = safeText(req.query.departmentId, 80);
  if (!course) return res.status(404).json({ error: 'Course not found.' });
  if (!courseInDepartment(course, departmentId)) return res.status(403).json({ error: 'Open this course from its owning academic department.' });
  res.json({ courseId: course.id, courseTitle: course.title, weeklyLessons: materialsForCourse(course) });
});

app.get('/api/courses/:id', (req, res) => {
  const course = findCourse(req.params.id);
  const departmentId = safeText(req.query.departmentId, 80);
  if (!course) return res.status(404).json({ error: 'Course not found.' });
  if (!courseInDepartment(course, departmentId)) return res.status(403).json({ error: 'Open this course from its owning academic department.' });
  const related = courses.filter((item) => item.id !== course.id && item.primaryDepartment === course.primaryDepartment && item.status === 'published').slice(0, 4);
  res.json({ course, related, weeklyLessons: materialsForCourse(course) });
});

app.post('/api/enrollments', async (req, res) => {
  const user = await requireUser(req, res); if (!user) return;
  const learnerName = safeText(req.body.learnerName, 100) || user.displayName;
  const email = user.email;
  const courseId = safeText(req.body.courseId, 40).toLowerCase();
  const departmentId = safeText(req.body.departmentId, 80);
  const course = findCourse(courseId);
  if (!learnerName || !email || !email.includes('@') || !course || course.status !== 'published') return res.status(400).json({ error: 'Provide a name, valid email, and published course.' });
  if (!courseInDepartment(course, departmentId)) return res.status(403).json({ error: 'Enrol from the academic department that owns this course.' });
  try {
    const enrollment = await saveEnrollment({ learnerName, email, courseId });
    res.status(201).json({ enrollment, message: 'Enrollment recorded. Your learning dashboard is ready.' });
  } catch (error) {
    res.status(500).json({ error: 'Enrollment could not be recorded.', detail: process.env.NODE_ENV === 'production' ? undefined : error.message });
  }
});

app.get('/api/learners/me', async (req, res) => { const user = await requireUser(req, res); if (!user) return; try { const [enrollments, progress] = await Promise.all([listEnrollments(user.email), listProgress(user.email)]); res.json({ user: { id: user.id, email: user.email, displayName: user.displayName }, email: user.email, enrollments: enrollments.map((item) => ({ ...item, course: findCourse(item.courseId) })).filter((item) => item.course), progress }); } catch { res.status(500).json({ error: 'Learner data could not be loaded.' }); } });
app.get('/api/learners/:email', async (req, res) => {
  const user = await requireUser(req, res); if (!user) return;
  const email = normaliseEmail(req.params.email);
  if (email !== user.email) return res.status(403).json({ error: 'A learner may only access their own account data.' });
  try {
    const [enrollments, progress] = await Promise.all([listEnrollments(user.email), listProgress(user.email)]);
    res.json({ user: { id: user.id, email: user.email, displayName: user.displayName }, email: user.email, enrollments: enrollments.map((item) => ({ ...item, course: findCourse(item.courseId) })).filter((item) => item.course), progress });
  } catch (error) {
    res.status(500).json({ error: 'Learner data could not be loaded.', detail: process.env.NODE_ENV === 'production' ? undefined : error.message });
  }
});

app.post('/api/assessments/attempts', async (req, res) => {
  const user = await requireUser(req, res); if (!user) return; const courseId = safeText(req.body.courseId, 40).toLowerCase(); const week = Number(req.body.week); const course = findCourse(courseId); const answers = req.body.answers && typeof req.body.answers === 'object' ? req.body.answers : {}; const shortAnswer = safeText(answers.shortAnswer, 1200); const applied = safeText(answers.applied, 1200); const lesson = course ? materialsForCourse(course).find((item) => Number(item.week) === week) : null; if (!course || !lesson || !Number.isInteger(week) || week < 1 || week > course.durationWeeks) return res.status(400).json({ error: 'Invalid course or weekly assessment.' }); const enrolled = pool ? (await pool.query('SELECT id FROM enrollments WHERE email = $1 AND course_id = $2', [user.email, courseId])).rows[0] : memory.enrollments.find((item) => item.email === user.email && item.courseId === courseId); if (!enrolled) return res.status(403).json({ error: 'Enrol in this course before submitting mastery evidence.' }); if (week > 1) { const previousWeek = week - 1; const priorMastery = pool ? (await pool.query('SELECT mastery FROM assessment_attempts WHERE user_id = $1 AND course_id = $2 AND week = $3 AND mastery = TRUE LIMIT 1', [user.id, courseId, previousWeek])).rows[0] : memory.masteryStates.find((item) => item.userId === user.id && item.courseId === courseId && item.week === previousWeek && item.status === 'mastered'); if (!priorMastery) return res.status(423).json({ error: 'Master the previous week before moving forward.', requiredWeek: previousWeek }); } const correct = answers.answer === lesson.focus; const aiWarning = /as an ai|language model|chatgpt|generated by ai/i.test(`${shortAnswer} ${applied}`); const score = (correct ? 60 : 0) + (shortAnswer.length >= 30 ? 20 : 0) + (applied.length >= 40 ? 20 : 0); const mastery = score >= 70 && !aiWarning; const feedback = { concepts: [lesson.focus], clarification: mastery ? null : `Review the week’s central idea: ${lesson.focus}. Then retry the explanation and applied evidence in your own words.` }; const attempt = { id: idFor('attempt'), userId: user.id, courseId, week, answers: req.body.answers || {}, score, mastery, aiWarning, feedback, createdAt: new Date().toISOString() }; try { if (pool) { await pool.query('INSERT INTO assessment_attempts (id, user_id, course_id, week, answers, score, mastery, ai_warning, feedback) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [attempt.id, user.id, courseId, week, JSON.stringify(attempt.answers), score, mastery, aiWarning, JSON.stringify(feedback)]); await pool.query('INSERT INTO mastery_states (id,user_id,course_id,week,status,concepts,attempts,best_score) VALUES ($1,$2,$3,$4,$5,$6,1,$7) ON CONFLICT (user_id,course_id,week) DO UPDATE SET status = CASE WHEN EXCLUDED.status = \'mastered\' THEN \'mastered\' ELSE mastery_states.status END, attempts = mastery_states.attempts + 1, best_score = GREATEST(mastery_states.best_score, EXCLUDED.best_score), updated_at = NOW()', [idFor('mastery'), user.id, courseId, week, mastery ? 'mastered' : 'needs-review', JSON.stringify(feedback.concepts || []), score]); } else { memory.assessmentAttempts.push(attempt); let state = memory.masteryStates.find((item) => item.userId === user.id && item.courseId === courseId && item.week === week); if (!state) { state = { id: idFor('mastery'), userId: user.id, courseId, week, status: mastery ? 'mastered' : 'needs-review', concepts: feedback.concepts || [], attempts: 1, bestScore: score }; memory.masteryStates.push(state); } else { state.status = state.status === 'mastered' ? 'mastered' : mastery ? 'mastered' : 'needs-review'; state.attempts += 1; state.bestScore = Math.max(state.bestScore, score); } } res.status(201).json({ attempt, mastery, nextWeekUnlocked: mastery, clarification: mastery ? null : (feedback.clarification || 'Review the highlighted concept, complete the short retry activity, and submit again in your own words.') }); } catch (error) { res.status(500).json({ error: 'Assessment attempt could not be saved.' }); }
});
app.get('/api/assessments/mastery', async (req, res) => { const user = await requireUser(req, res); if (!user) return; try { if (pool) { const result = await pool.query('SELECT course_id AS "courseId", week, status, concepts, attempts, best_score AS "bestScore", updated_at AS "updatedAt" FROM mastery_states WHERE user_id = $1 ORDER BY course_id, week', [user.id]); return res.json({ mastery: result.rows }); } res.json({ mastery: memory.masteryStates.filter((item) => item.userId === user.id) }); } catch { res.status(500).json({ error: 'Mastery state could not be loaded.' }); } });
app.post('/api/progress', async (req, res) => {
  const user = await requireUser(req, res); if (!user) return;
  const email = user.email;
  const courseId = safeText(req.body.courseId, 40).toLowerCase();
  const course = findCourse(courseId);
  const completedModules = Number(req.body.completedModules);
  if (!email.includes('@') || !course || !Number.isInteger(completedModules) || completedModules < 0 || completedModules > course.modules.length) return res.status(400).json({ error: 'Invalid learner, course, or module progress.' });
  try {
    const progress = await saveProgress({ email, courseId, completedModules });
    res.json({ progress, certificateEligible: completedModules === course.modules.length });
  } catch (error) {
    res.status(500).json({ error: 'Progress could not be saved.', detail: process.env.NODE_ENV === 'production' ? undefined : error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  const name = safeText(req.body.name, 100);
  const email = normaliseEmail(req.body.email);
  const message = safeText(req.body.message, 1000);
  if (!name || !email.includes('@') || !message) return res.status(400).json({ error: 'Please provide your name, email, and message.' });
  try {
    await saveContact({ name, email, message });
    res.status(201).json({ message: 'Your message has been received by GentsAcademy.' });
  } catch (error) {
    res.status(500).json({ error: 'Message could not be sent.', detail: process.env.NODE_ENV === 'production' ? undefined : error.message });
  }
});

app.get('/api/verification/:certificateId', (req, res) => {
  res.json({ valid: false, certificateId: safeText(req.params.certificateId, 100), message: 'Certificate verification records will appear here once a learner completes the required assessed evidence.' });
});

app.use(express.static(publicDir, { extensions: ['html'] }));
app.get(/.*/, (_req, res) => res.sendFile(path.join(publicDir, 'index.html')));

initialiseDatabase().then(() => {
  app.listen(port, () => console.log(`GentsAcademy running on port ${port}`));
}).catch((error) => {
  console.error('Database initialisation failed:', error);
  process.exit(1);
});

export { app };

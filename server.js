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
const memory = { enrollments: [], progress: [], contacts: [] };
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

async function initialiseDatabase() {
  if (!pool) return;
  await pool.query(`
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
  const learnerName = safeText(req.body.learnerName, 100);
  const email = normaliseEmail(req.body.email);
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

app.get('/api/learners/:email', async (req, res) => {
  const email = normaliseEmail(req.params.email);
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'A valid email is required.' });
  try {
    const [enrollments, progress] = await Promise.all([listEnrollments(email), listProgress(email)]);
    res.json({ email, enrollments: enrollments.map((item) => ({ ...item, course: findCourse(item.courseId) })).filter((item) => item.course), progress });
  } catch (error) {
    res.status(500).json({ error: 'Learner data could not be loaded.', detail: process.env.NODE_ENV === 'production' ? undefined : error.message });
  }
});

app.post('/api/progress', async (req, res) => {
  const email = normaliseEmail(req.body.email);
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

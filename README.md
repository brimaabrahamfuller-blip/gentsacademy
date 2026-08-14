# GentsAcademy

GentsAcademy is a single-language English learning web app for free, practical, and Liberian-grounded education. The application is implemented in JavaScript from the browser through the Node.js backend, matching the primary implementation language used by GentsConcerts while preserving the established GentsAcademy dark, navy, and gold visual identity.

## What changed

The legacy multi-page HTML implementation has been replaced with one application shell in `public/index.html`, one responsive stylesheet in `public/styles.css`, and one client application in `public/app.js`. The old authentication, admin, dashboard, course, and certificate scripts were removed because they duplicated state and could not share a reliable catalogue registry.

The curriculum strategy is now represented by one central registry at `data/catalogue.js`. It powers the homepage count, department cards, catalogue filters, course detail views, pathways, assessment metadata, capstones, career roles, support information, and certificate rules. Courses have one primary department and may have secondary departments and tags. AI is grouped under IT and Technology rather than acting as a separate academic department.

The launch registry contains the complete recommended course families and shared core, including Business and Entrepreneurship, IT and Technology, Hospitality Management, Tourism and Destination Management, Interdisciplinary programmes, and `GAC-001 Workplace and Digital Foundations`. The homepage reports the registry count instead of using a manually maintained claim.

## Application structure

| Path | Purpose |
| --- | --- |
| `server.js` | Express server, API routes, security headers, static hosting, and database adapter |
| `public/index.html` | Single English application shell |
| `public/app.js` | Client-side router, catalogue views, enrolment, progress, dashboard, and contact flow |
| `public/styles.css` | Preserved GentsAcademy design system and responsive styling |
| `data/catalogue.js` | Central course, pathway, department, and certificate registry |
| `render.yaml` | Render web service and PostgreSQL Blueprint configuration |
| `.env.example` | Environment variable template |

## Run locally

Install dependencies and start the server:

```bash
npm install
npm start
```

Open `http://localhost:10000`. If `DATABASE_URL` is not provided, the API uses an in-memory fallback so the full user flow can be tested locally. For persistent data, provide a PostgreSQL connection string.

## API surface

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service and database health check |
| `GET` | `/api/catalogue-summary` | Registry totals used by the homepage |
| `GET` | `/api/departments` | Academic departments |
| `GET` | `/api/pathways` | Career pathways and their course members |
| `GET` | `/api/certificate-rules` | Credential completion rules |
| `GET` | `/api/courses` | Searchable and filterable course registry |
| `GET` | `/api/courses/:id` | Course detail and related courses |
| `POST` | `/api/enrollments` | Create or update a learner enrollment |
| `GET` | `/api/learners/:email` | Load enrollments and saved module progress |
| `POST` | `/api/progress` | Save completed module progress |
| `POST` | `/api/contact` | Submit a learner or partner message |
| `GET` | `/api/verification/:certificateId` | Certificate verification placeholder endpoint |

## Render deployment

The included `render.yaml` defines a Node web service with a PostgreSQL database, health checks, automatic deployment from the GitHub repository, and the following environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | Yes | Set to `production` on Render |
| `PORT` | No | Render supplies the port; local default is `10000` |
| `DATABASE_URL` | Yes for persistence | PostgreSQL connection string supplied by the Render database |
| `DATABASE_SSL` | Yes | Keep `true` for Render PostgreSQL TLS |

The service should be connected to the `brimaabrahamfuller-blip/gentsacademy` repository in Render. After the first deployment, confirm `/api/health` returns `ok: true` and `database: postgresql`.

## Quality notes

The app is intentionally English-only. There is no language selector, duplicate translated content tree, or language-specific legacy route. Learner-facing flows are mobile-friendly, use accessible labels and focus styles, and include low-bandwidth support language on course pages. Certificates are described as GentsAcademy completion or pathway certificates unless an external recognition or partnership is documented.

## Attribution

Maintained and delivered under **Brima Abraham Fuller**, `brimaabrahamfuller-blip`, `brimaabrahamfuller@gmail.com`.

## Weekly learning materials

The weekly materials layer is generated for every course in catalogue order. The 41-course registry expands into 384 calendar-week lessons. Each lesson has an original graphical GentsAcademy PDF study guide at `public/materials/{course-id}/week-{n}.pdf`, an attributed open or openly accessible academic reading, a university or professor-led video link, a guided activity, a reflection prompt, and an evidence target.

`data/materials.js` contains the source-attributed material library and deterministic lesson mapping. `data/weekly-materials.json` is the generated manifest used for audits and future content operations. Run `npm run generate:materials` after changing course weeks, learning outcomes, or source assignments. The temporary Typst workspace is ignored; generated PDFs are tracked deliverables and are served by both Render and Netlify.

The PDFs are original study guides and do not reproduce proprietary textbooks or lecture files. External resources remain owned by their providers and are linked with their source, provider, kind, license or access note, and official URL. Learners can open video sources in a new tab, and direct embeddable YouTube lessons appear in the weekly lesson card when an official video URL is available.

The course interface uses CSS media queries and a small device profile on `document.documentElement` to support desktop, tablet, Android, and iOS browser widths. Weekly material cards use a side-by-side reading/video layout on larger screens and stack into a touch-friendly single-column flow on smaller screens.

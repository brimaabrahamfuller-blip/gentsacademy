import { courses } from '../data/catalogue.js';
import { writeFile } from 'node:fs/promises';

const manifest = courses.map((course, courseIndex) => ({
  sequence: courseIndex + 1,
  id: course.id,
  code: course.code,
  title: course.title,
  department: course.primaryDepartment,
  level: course.level,
  durationWeeks: course.durationWeeks,
  modules: course.modules,
  outcomes: course.outcomes,
  tags: course.tags,
}));

await writeFile('./data/course-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Extracted ${manifest.length} courses in catalogue order.`);

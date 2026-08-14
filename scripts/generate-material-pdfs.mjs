import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { courses } from '../data/catalogue.js';
import { materialsForCourses } from '../data/materials.js';

const root = process.cwd();
const outputRoot = path.join(root, 'public', 'materials');
const workRoot = path.join(root, '.materials-typst');
const manifest = materialsForCourses(courses);

const escapeTypst = (value) => String(value ?? '')
  .replaceAll('\\', '\\\\')
  .replaceAll('"', '\\"')
  .replaceAll('#', '\\#')
  .replaceAll('$', '\\$')
  .replaceAll('%', '\\%')
  .replaceAll('&', '\\&')
  .replaceAll('_', '\\_')
  .replaceAll('{', '\\{')
  .replaceAll('}', '\\}');

const link = (url, label) => `#link("${escapeTypst(url)}")[${escapeTypst(label)}]`;
const block = (heading, body, fill = 'f4f7fb') => `#rect(fill: rgb("${fill}"), radius: 8pt, inset: 12pt)[\n  #text(weight: "bold", fill: rgb("0f1b2d"))[${escapeTypst(heading)}]\\\n  ${body}\n]`;

const lessonTypst = (course, lesson) => {
  const readingBody = `${escapeTypst(lesson.reading.provider)} · ${escapeTypst(lesson.reading.kind)}\\\\${link(lesson.reading.url, lesson.reading.title)}\\\\#text(size: 8pt, fill: rgb("536273"))[${escapeTypst(lesson.reading.license)}]`;
  const videoBody = `${escapeTypst(lesson.video.provider)} · ${escapeTypst(lesson.video.title)}\\\\${link(lesson.video.url, 'Open video lesson or university channel')}\\\\#text(size: 8pt, fill: rgb("536273"))[Watch alongside this week’s study guide.]`;
  return `#set page(paper: "a4", margin: (top: 20mm, bottom: 18mm, left: 18mm, right: 18mm))
#set text(font: "Noto Sans", size: 10.5pt, fill: rgb("1d2939"))
#set par(leading: 1.15em, spacing: 0.7em)
#show link: set text(fill: rgb("0b5cad"))

#rect(fill: rgb("0f1b2d"), radius: 12pt, inset: 18pt)[
  #text(size: 9pt, weight: "bold", fill: rgb("d6b65c"))[GENTSACADEMY · WEEKLY STUDY GUIDE]\\
  #text(size: 22pt, weight: "bold", fill: white)[${escapeTypst(course.title)}]\\
  #text(size: 11pt, fill: rgb("e8edf3"))[${escapeTypst(course.code)} · Week ${lesson.week} of ${course.durationWeeks} · ${escapeTypst(course.primaryDepartment)}]
]

#v(12pt)
#grid(columns: (1fr, 1fr), gutter: 10pt,
  rect(fill: rgb("d6b65c"), radius: 8pt, inset: 12pt)[
    #text(weight: "bold", fill: rgb("0f1b2d"))[THIS WEEK’S FOCUS]\\
    ${escapeTypst(lesson.focus)}
  ],
  rect(fill: rgb("e9eef5"), radius: 8pt, inset: 12pt)[
    #text(weight: "bold", fill: rgb("0f1b2d"))[STUDY LOAD]\\
    ${lesson.estimatedHours} hours · Read · Watch · Apply
  ],
)

#v(10pt)
#text(size: 14pt, weight: "bold", fill: rgb("0f1b2d"))[Lesson pathway]
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  rect(fill: rgb("f4f7fb"), radius: 7pt, inset: 10pt)[#text(weight: "bold")[01 · Read]\\Build the concept using the attributed open resource below.],
  rect(fill: rgb("f4f7fb"), radius: 7pt, inset: 10pt)[#text(weight: "bold")[02 · Watch]\\Use the linked university or professor lesson as a second explanation.],
  rect(fill: rgb("f4f7fb"), radius: 7pt, inset: 10pt)[#text(weight: "bold")[03 · Apply]\\Create evidence from the guided activity and reflection prompt.],
)

#v(10pt)
${block('Open reading or reference', readingBody, 'eef5ff')}

#v(8pt)
${block('University or professor video', videoBody, 'f6f1df')}

#v(8pt)
${block('Guided learning activity', `${escapeTypst(lesson.activity)}\\\\#text(weight: "bold")[Evidence to save:] ${escapeTypst(course.evidenceType)}.`, 'f4f7fb')}

#v(8pt)
${block('Reflect and connect', `In 3–5 sentences, explain how this week’s concept could improve a real organisation, community service, workplace, or learner project in Liberia or your local context. Identify one assumption, one risk, and one action you would test next.`, 'eef8f2')}

#v(12pt)
#rect(fill: rgb("0f1b2d"), radius: 8pt, inset: 12pt)[
  #text(size: 8.5pt, fill: rgb("e8edf3"))[Source note: GentsAcademy has created this original study guide. External resources remain owned by their respective providers and should be used according to the licence or access terms stated on the source page.]
]
`;
};

await mkdir(outputRoot, { recursive: true });
await mkdir(workRoot, { recursive: true });
await writeFile(path.join(root, 'data', 'weekly-materials.json'), `${JSON.stringify(manifest, null, 2)}\n`);

let generated = 0;
for (const course of courses) {
  const courseDir = path.join(outputRoot, course.id);
  const workDir = path.join(workRoot, course.id);
  await mkdir(courseDir, { recursive: true });
  await mkdir(workDir, { recursive: true });
  for (const lesson of manifest[course.id]) {
    const base = `week-${lesson.week}`;
    const typstPath = path.join(workDir, `${base}.typ`);
    const pdfPath = path.join(courseDir, `${base}.pdf`);
    await writeFile(typstPath, lessonTypst(course, lesson));
    execFileSync('typst', ['compile', '--root', root, typstPath, pdfPath], { stdio: 'ignore' });
    generated += 1;
  }
}
console.log(`Generated ${generated} weekly PDFs across ${courses.length} courses.`);

import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { courses } from '../data/catalogue.js';
import { materialsForCourses } from '../data/materials.js';

const root = process.cwd();
const outputRoot = path.join(root, 'public', 'materials');
const workRoot = path.join(root, '.materials-typst');
const manifest = materialsForCourses(courses);
const maxGuides = Number(process.env.GENERATE_LIMIT || 0);

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
const label = (text, color = '0f1b2d') => `#text(size: 7.5pt, weight: "bold", fill: rgb("${color}"))[${escapeTypst(text.toUpperCase())}]`;
const blockBody = (heading, content, accent = '0f1b2d') => `
  ${label(heading, accent)}#linebreak()
  ${content}
`;
const infoBlock = (heading, content, fill = 'f4f7fb', accent = '0f1b2d') => `#rect(fill: rgb("${fill}"), radius: 10pt, inset: 13pt)[${blockBody(heading, content, accent)}]`;
const gridBlock = (heading, content, fill = 'f4f7fb', accent = '0f1b2d') => `rect(fill: rgb("${fill}"), radius: 10pt, inset: 13pt)[${blockBody(heading, content, accent)}]`;
const urlHost = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return 'Official provider website'; }
};

const sourceRecord = (resource, labelText, studyConnection, fill, accent) => `${infoBlock(`${labelText} · source record`, `#text(size: 12pt, weight: "bold", fill: rgb("0f1b2d"))[${escapeTypst(resource.title)}]
#v(4pt)
#grid(columns: (34mm, 1fr), gutter: 4pt, row-gutter: 3pt,
  [#text(size: 8pt, weight: "bold", fill: rgb("536273"))[Provider]], [#text(size: 8.5pt)[${escapeTypst(resource.provider)}]],
  [#text(size: 8pt, weight: "bold", fill: rgb("536273"))[Kind]], [#text(size: 8.5pt)[${escapeTypst(resource.kind)}]],
  [#text(size: 8pt, weight: "bold", fill: rgb("536273"))[Licence / access]], [#text(size: 8.5pt)[${escapeTypst(resource.license)}]],
  [#text(size: 8pt, weight: "bold", fill: rgb("536273"))[Official URL]], [#text(size: 8.5pt)[${link(resource.officialUrl || resource.url, `Open official source at ${urlHost(resource.officialUrl || resource.url)}`)}]],
)
#v(6pt)
#text(size: 8.5pt, fill: rgb("1d2939"))[#text(weight: "bold")[Use it this week:] ${escapeTypst(studyConnection)}]`, fill, accent)}
`;

const lessonTypst = (course, lesson) => {
  const courseImage = path.posix.join('../../public', String(course.image || '').replace(/^\//, ''));
  const glossaryEntries = `(
  (key: "selfstudy", short: "self-study", long: "self-directed study", description: [A learner plans, studies, practises, and checks understanding without waiting for a live class.]),
  (key: "evidence", short: "evidence", long: "learning evidence", description: [A saved note, plan, calculation, recording, checklist, or other item that shows what you can do.]),
  (key: "source", short: "source", long: "learning source", description: [An external reading or video credited to its original provider.])
)`;

  return `#import "@preview/glossarium:0.5.10": make-glossary, register-glossary, print-glossary, gls
#show: make-glossary
#let glossary-entries = ${glossaryEntries}
#register-glossary(glossary-entries)
#set page(paper: "a4", margin: (top: 16mm, bottom: 16mm, left: 16mm, right: 16mm))
#set text(font: "Noto Sans", size: 10.2pt, fill: rgb("1d2939"))
#set par(leading: 1.18em, spacing: 0.65em)
#show link: set text(fill: rgb("0b5cad"))

#rect(fill: rgb("0f1b2d"), radius: 14pt, inset: 16pt)[
  #grid(columns: (1.45fr, .85fr), gutter: 13pt,
    [${label('GentsAcademy · self-study field guide', 'd6b65c')}#linebreak()
    #text(size: 20pt, weight: "bold", fill: white)[${escapeTypst(course.title)}]
    #v(3pt)
    #text(size: 9.5pt, fill: rgb("e8edf3"))[${escapeTypst(course.code)} · Week ${lesson.week} of ${course.durationWeeks} · ${escapeTypst(course.primaryDepartment)}]
    #v(7pt)
    #text(size: 8.5pt, fill: rgb("d6b65c"))[Study independently · keep a notebook · save your evidence]],
    [#image("${escapeTypst(courseImage)}", width: 100%)]
  )
]

#v(10pt)
#grid(columns: (1.1fr, .9fr), gutter: 8pt,
  ${gridBlock('This week’s outcome', `#text(size: 11pt, weight: "bold", fill: rgb("0f1b2d"))[${escapeTypst(lesson.focus)}]`, 'e2c45c', '0f1b2d')},
  ${gridBlock('Study rhythm', `#text(size: 15pt, weight: "bold", fill: rgb("0f1b2d"))[${lesson.estimatedHours} hours]#linebreak()#text(size: 8.5pt, fill: rgb("536273"))[Short sessions work best: Read · Watch · Make · Reflect.]`, 'e9eef5', '0f1b2d')}
)

#v(8pt)
${infoBlock('Start here · in plain language', `#text(size: 10.3pt)[${escapeTypst(lesson.selfStudyExplanation)}]`, 'eef8f2', '0f1b2d')}

#v(8pt)
#grid(columns: (1fr, 1fr, 1fr, 1fr), gutter: 6pt,
  rect(fill: rgb("e8f0ff"), radius: 9pt, inset: 9pt)[#text(size: 15pt, weight: "bold", fill: rgb("0b5cad"))[01]#linebreak()#text(size: 8pt, weight: "bold")[READ]#linebreak()#text(size: 7.7pt)[Find the main idea.]],
  rect(fill: rgb("f6f1df"), radius: 9pt, inset: 9pt)[#text(size: 15pt, weight: "bold", fill: rgb("8a6615"))[02]#linebreak()#text(size: 8pt, weight: "bold")[WATCH]#linebreak()#text(size: 7.7pt)[Notice a method.]],
  rect(fill: rgb("eef8f2"), radius: 9pt, inset: 9pt)[#text(size: 15pt, weight: "bold", fill: rgb("1d6a48"))[03]#linebreak()#text(size: 8pt, weight: "bold")[MAKE]#linebreak()#text(size: 7.7pt)[Try it locally.]],
  rect(fill: rgb("f4edf9"), radius: 9pt, inset: 9pt)[#text(size: 15pt, weight: "bold", fill: rgb("704b9f"))[04]#linebreak()#text(size: 8pt, weight: "bold")[REFLECT]#linebreak()#text(size: 7.7pt)[Check what changed.]],
)

#v(10pt)
#text(size: 14pt, weight: "bold", fill: rgb("0f1b2d"))[Your learning path]
#grid(columns: (1fr, 1fr, 1fr), gutter: 8pt,
  ${gridBlock('Read for the idea', `#text(size: 8.5pt)[${escapeTypst(lesson.learningSteps[0])}]`, 'f4f7fb')},
  ${gridBlock('Watch for the method', `#text(size: 8.5pt)[${escapeTypst(lesson.learningSteps[1])}]`, 'f4f7fb')},
  ${gridBlock('Make evidence', `#text(size: 8.5pt)[${escapeTypst(lesson.learningSteps[2])}]`, 'f4f7fb')}
)

#v(10pt)
${infoBlock('Essential question', `#text(size: 10.5pt, weight: "bold", fill: rgb("0f1b2d"))[${escapeTypst(lesson.essentialQuestion)}]#linebreak()#text(size: 8.5pt, fill: rgb("536273"))[Write one sentence before you begin. Revisit it after you apply the activity.]`, 'f6f1df', '8a6615')}

#v(10pt)
#text(size: 15pt, weight: "bold", fill: rgb("0f1b2d"))[Detailed lesson notes]
${infoBlock('Concept note', `#text(size: 9.3pt)[${escapeTypst(lesson.notes.overview)}]#v(5pt)#text(size: 9.3pt)[${escapeTypst(lesson.notes.explanation)}]`, 'eef8f2', '1d6a48')}
#v(7pt)
#grid(columns: (1fr, 1fr, 1fr), gutter: 7pt,
  ${gridBlock('01 · Purpose', `#text(size: 8.3pt)[${escapeTypst(lesson.notes.keyIdeas[0])}]`, 'f4f7fb')},
  ${gridBlock('02 · Method', `#text(size: 8.3pt)[${escapeTypst(lesson.notes.keyIdeas[1])}]`, 'f4f7fb')},
  ${gridBlock('03 · Evidence', `#text(size: 8.3pt)[${escapeTypst(lesson.notes.keyIdeas[2])}]`, 'f4f7fb')}
)
#v(7pt)
${infoBlock('Instructions · work in order', lesson.notes.instructions.map((item, index) => `#text(size: 8.8pt)[${index + 1}. ${escapeTypst(item)}]#linebreak()`).join(''), 'f4edf9', '704b9f')}
#v(7pt)
${infoBlock('Weekly exercise', `#text(size: 9.2pt)[${escapeTypst(lesson.notes.exercise)}]`, 'f6f1df', '8a6615')}

#pagebreak(weak: true)
#text(size: 15pt, weight: "bold", fill: rgb("0f1b2d"))[Learn from trusted sources]
#text(size: 9pt, fill: rgb("536273"))[These materials extend this original GentsAcademy guide. They remain owned by the named providers. Read or watch using the source’s own access and licence terms.]

#v(8pt)
${sourceRecord(lesson.reading, 'Academic reading', lesson.reading.studyConnection, 'eef5ff', '0b5cad')}
#v(8pt)
${sourceRecord(lesson.video, 'University or professor video', lesson.video.studyConnection, 'f6f1df', '8a6615')}

#v(10pt)
#text(size: 15pt, weight: "bold", fill: rgb("0f1b2d"))[Turn study into skill]
#grid(columns: (1.1fr, .9fr), gutter: 9pt,
  ${gridBlock('Practice laboratory', `#text(size: 10pt)[${escapeTypst(lesson.activity)}]#v(5pt)#text(size: 8.5pt, fill: rgb("536273"))[Keep your work simple, local, and real. A basic note, recording, checklist, screenshot, calculation, or plan is valid practice.]`, 'f4f7fb')},
  ${gridBlock('Evidence checklist', `#text(size: 8.7pt)[□ I named the main idea.#linebreak()□ I noted one example.#linebreak()□ I tried one small action.#linebreak()□ I saved ${escapeTypst(course.evidenceType.toLowerCase())}.]`, 'eef8f2', '1d6a48')}
)

#v(8pt)
${infoBlock('Self-check · before you finish', `#text(size: 9.2pt)[${lesson.notes.checks.map((item, index) => `${index + 1}. ${escapeTypst(item)}#linebreak()`).join('')}4. What is one next action I can test or improve?]`, 'f4edf9', '704b9f')}

#v(8pt)
${infoBlock('Reflect and connect', `#text(size: 9.3pt)[In 3–5 sentences, explain how this week’s concept could improve a real organisation, community service, workplace, or learner project. Identify one assumption, one risk, and one action you would test next.]#v(12pt)#line(length: 100%, stroke: .5pt + rgb("9a9ab0"))#v(9pt)#line(length: 100%, stroke: .5pt + rgb("9a9ab0"))#v(9pt)#line(length: 100%, stroke: .5pt + rgb("9a9ab0"))`, 'eef8f2', '1d6a48')}

#pagebreak()
#text(size: 18pt, weight: "bold", fill: rgb("0f1b2d"))[Vocabulary + notebook]
#text(size: 9pt, fill: rgb("536273"))[Use this final page as a learning checkpoint. Clear terms and brief notes make independent study easier to continue.]

#v(8pt)
${infoBlock('Small self-study glossary', `#text(size: 9.2pt)[#gls("selfstudy") means you manage your own learning plan. #gls("evidence") is the proof you save. A #gls("source") is credited to its original provider.]#v(5pt)#text(size: 8pt, fill: rgb("536273"))[Glossary reference list]#linebreak()#print-glossary(glossary-entries, show-all: true, disable-back-references: true)`, 'eef5ff', '0b5cad')}

#v(9pt)
${infoBlock('My note bank', `#text(size: 9.2pt)[The one idea I want to remember:]#v(10pt)#line(length: 100%, stroke: .5pt + rgb("9a9ab0"))#v(10pt)#line(length: 100%, stroke: .5pt + rgb("9a9ab0"))#v(10pt)#text(size: 9.2pt)[The example I will look for this week:]#v(10pt)#line(length: 100%, stroke: .5pt + rgb("9a9ab0"))#v(10pt)#line(length: 100%, stroke: .5pt + rgb("9a9ab0"))`, 'eef8f2', '1d6a48')}

#v(9pt)
#grid(columns: (1fr, 1fr), gutter: 8pt,
  rect(fill: rgb("f6f1df"), radius: 10pt, inset: 11pt)[${label('Finish well', '8a6615')}#linebreak()#text(size: 8.8pt)[Choose a time for your next study session. Small regular sessions are more useful than waiting for a perfect long study day.]],
  rect(fill: rgb("f4edf9"), radius: 10pt, inset: 11pt)[${label('Share safely', '704b9f')}#linebreak()#text(size: 8.8pt)[Discuss an idea with a trusted peer, mentor, or colleague. Keep your own notes and do not share sensitive personal or workplace data.]]
)

#v(10pt)
#rect(fill: rgb("0f1b2d"), radius: 9pt, inset: 11pt)[
  #text(size: 8.3pt, fill: rgb("e8edf3"))[GentsAcademy created this original self-study guide and the learning image representing young Liberian learners. External readings and videos remain owned by their providers. Their title, provider, kind, licence/access note, and official URL are shown above for transparent, responsible use.]
]
`;
};

await mkdir(outputRoot, { recursive: true });
await mkdir(workRoot, { recursive: true });
await writeFile(path.join(root, 'data', 'weekly-materials.json'), `${JSON.stringify(manifest, null, 2)}\n`);

let generated = 0;
let shouldStop = false;
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
    execFileSync('typst', ['compile', '--root', root, typstPath, pdfPath], { stdio: 'inherit' });
    generated += 1;
    if (maxGuides && generated >= maxGuides) { shouldStop = true; break; }
  }
  if (shouldStop) break;
}
console.log(`Generated ${generated}${maxGuides ? ' preview' : ''} weekly PDFs across ${maxGuides ? 'the requested sample' : `${courses.length} courses`}.`);

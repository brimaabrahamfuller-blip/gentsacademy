const endpoints = [
  ['technology', 'tec-002'],
  ['business', 'bus-001'],
  ['hospitality', 'hos-001'],
  ['tourism', 'tur-001'],
  ['interdisciplinary', 'xdp-001'],
  ['core', 'gac-001']
];
for (const [departmentId, courseId] of endpoints) {
  const response = await fetch(`https://gentsacademy.netlify.app/api/courses/${courseId}/materials?departmentId=${departmentId}`);
  const body = await response.json();
  const lesson = body.weeklyLessons?.[0];
  console.log(JSON.stringify({ departmentId, courseId, status: response.status, lessonKeys: lesson ? Object.keys(lesson) : [], notesKeys: lesson?.notes ? Object.keys(lesson.notes) : null, readingKeys: lesson?.reading ? Object.keys(lesson.reading) : null, videoKeys: lesson?.video ? Object.keys(lesson.video) : null }));
}

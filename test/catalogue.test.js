import test from 'node:test';
import assert from 'node:assert/strict';
import { courses, departments, pathways } from '../data/catalogue.js';

test('catalogue has unique published course records with required learning metadata', () => {
  const ids = courses.map((course) => course.id);
  assert.equal(new Set(ids).size, courses.length);
  assert.ok(courses.length >= 35);
  for (const course of courses) {
    assert.ok(course.code && course.title && course.primaryDepartment);
    assert.ok(course.outcomes.length >= 4);
    assert.ok(course.modules.length >= 4);
    assert.equal(course.assessment.passThreshold, 70);
    assert.ok(course.capstone && course.careerRoles.length);
    assert.equal(course.status, 'published');
  }
});

test('academic departments and pathway references are valid', () => {
  const departmentNames = new Set(departments.map((department) => department.name));
  const courseIds = new Set(courses.map((course) => course.id));
  for (const course of courses) assert.ok(departmentNames.has(course.primaryDepartment));
  for (const pathway of pathways) {
    assert.ok(pathway.title && pathway.description);
    for (const courseId of pathway.courseIds) assert.ok(courseIds.has(courseId));
  }
});

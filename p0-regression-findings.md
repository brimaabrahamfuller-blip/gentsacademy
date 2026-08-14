# P0 regression findings

The production error is global across the sampled departments, not limited to one course. Live API inspection returned HTTP 200 for TEC-002, BUS-001, HOS-001, TUR-001, XDP-001, and GAC-001, but each lesson record contained only the legacy keys `week`, `module`, `title`, `focus`, `activity`, `studyConnection`, `reading`, `video`, `pdfPath`, `pdfTitle`, `estimatedHours`, and `lessonIndex`.

The live records did not contain `notes`, `learningSteps`, `selfStudyExplanation`, or `essentialQuestion`. The Phase 2 frontend directly read `lesson.notes.overview`, which caused the reported `Cannot read properties of undefined (reading 'overview')` error. The root cause is a frontend/backend deployment-shape mismatch: the production frontend expected enriched lesson fields while the live API was still returning the legacy material shape.

A frontend compatibility normalizer has been added to backfill those fields from the legacy lesson data and provide safe defaults for missing reading/video metadata. The existing authentication and mastery acceptance suite passes after the patch.

Local browser verification first showed the expected department-access guard when the course was opened without department context. Entering the technology department then rendered all 10 technology courses normally, confirming the department route itself is healthy. The course route is ready for a second verification with the established context.

With the technology department context established, local TEC-002 rendered successfully after the patch. The browser exposed the first panel, academic resource links, PDF download, video source, practice-lab link, study marker, and mastery check. The previous `lesson.notes.overview` crash did not recur.

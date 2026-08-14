const sourceHubs = {
  business: [
    { title: 'New Enterprises: entrepreneurship foundations', provider: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/15-390-new-enterprises-spring-2013/', kind: 'University open course', license: 'MIT OpenCourseWare terms' },
    { title: 'Open educational resources in business', provider: 'University of Washington Libraries', url: 'https://guides.lib.uw.edu/oer/business', kind: 'University OER guide', license: 'Open-resource directory; source terms apply' },
    { title: 'Business open textbooks', provider: 'University of Minnesota Libraries Publishing', url: 'https://open.umn.edu/opentextbooks/subjects/business', kind: 'University open-textbook library', license: 'Licence varies by title; verify on source page' },
    { title: 'FinTech: Shaping the Financial World', provider: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/sloan-school-of-management/15-s08-fintech-shaping-the-financial-world-spring-2020/', kind: 'University open course', license: 'MIT OpenCourseWare terms' }
  ],
  technology: [
    { title: 'Foundations of Information Systems', provider: 'OpenStax', url: 'https://openstax.org/details/books/foundations-information-systems', kind: 'Peer-reviewed open textbook', license: 'CC BY' },
    { title: 'Introduction to Computer Science and Programming in Python', provider: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/', kind: 'University open course', license: 'MIT OpenCourseWare terms' },
    { title: 'Artificial Intelligence', provider: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/', kind: 'University open course', license: 'MIT OpenCourseWare terms' },
    { title: 'OER for information technology and information systems', provider: 'California Community Colleges OERI', url: 'https://asccc-oeri.org/open-educational-resources-and-information-technology-and-information-systems-itis/', kind: 'Curated academic OER collection', license: 'Licence varies by source; verify on source page' }
  ],
  hospitality: [
    { title: 'Introduction to Tourism and Hospitality in BC', provider: 'BCcampus Open Education', url: 'https://opentextbc.ca/introtourism2e/', kind: 'Expert-reviewed open textbook', license: 'CC BY 4.0' },
    { title: 'Hospitality and tourism open educational resources', provider: 'University of Central Florida Libraries', url: 'https://guides.ucf.edu/c.php?g=1139510&p=8967664', kind: 'University OER guide', license: 'Licence varies by title; verify on source page' },
    { title: 'Introduction to Food Production and Service', provider: 'Pennsylvania State University', url: 'https://psu.pb.unizin.org/hmd329/', kind: 'University open textbook', license: 'Source terms apply' },
    { title: 'Workplace Safety in the Foodservice Industry', provider: 'BCcampus Open Education', url: 'https://opentextbc.ca/workplacesafety/', kind: 'Open textbook', license: 'Source terms apply' }
  ],
  tourism: [
    { title: 'Introduction to Tourism and Hospitality in BC', provider: 'BCcampus Open Education', url: 'https://opentextbc.ca/introtourism2e/', kind: 'Expert-reviewed open textbook', license: 'CC BY 4.0' },
    { title: 'Hospitality and tourism open educational resources', provider: 'University of Central Florida Libraries', url: 'https://guides.ucf.edu/c.php?g=1139510&p=8967664', kind: 'University OER guide', license: 'Licence varies by title; verify on source page' },
    { title: 'Cultural Heritage Tourism Event Planning and Management', provider: 'LibreTexts Workforce Library', url: 'https://workforce.libretexts.org/Bookshelves/Hospitality/Book%3A_Cultural_Heritage_Tourism_Event_Planning_and_Management_(Lumen)', kind: 'Open textbook', license: 'Source terms apply' },
    { title: 'Sustainable Tourism Destination Management', provider: 'Cornell University eCornell', url: 'https://ecornell.cornell.edu/courses/hospitality-and-foodservice-management/sustainable-tourism-destination-management/', kind: 'University course overview', license: 'Access terms apply' }
  ],
  interdisciplinary: [
    { title: 'Foundations of Information Systems', provider: 'OpenStax', url: 'https://openstax.org/details/books/foundations-information-systems', kind: 'Peer-reviewed open textbook', license: 'CC BY' },
    { title: 'Open educational resources in business', provider: 'University of Washington Libraries', url: 'https://guides.lib.uw.edu/oer/business', kind: 'University OER guide', license: 'Open-resource directory; source terms apply' },
    { title: 'Hospitality and tourism open educational resources', provider: 'University of Central Florida Libraries', url: 'https://guides.ucf.edu/c.php?g=1139510&p=8967664', kind: 'University OER guide', license: 'Licence varies by title; verify on source page' },
    { title: 'Introduction to Tourism and Hospitality in BC', provider: 'BCcampus Open Education', url: 'https://opentextbc.ca/introtourism2e/', kind: 'Expert-reviewed open textbook', license: 'CC BY 4.0' }
  ],
  core: [
    { title: 'Workplace Software and Skills', provider: 'OpenStax', url: 'https://openstax.org/details/books/workplace-software-skills', kind: 'Open textbook', license: 'CC BY' },
    { title: 'Foundations of Information Systems', provider: 'OpenStax', url: 'https://openstax.org/details/books/foundations-information-systems', kind: 'Peer-reviewed open textbook', license: 'CC BY' },
    { title: 'Open educational resources in business', provider: 'University of Washington Libraries', url: 'https://guides.lib.uw.edu/oer/business', kind: 'University OER guide', license: 'Open-resource directory; source terms apply' },
    { title: 'Culturally Responsive Computing', provider: 'Rochester Educational Technology and Open Learning', url: 'https://rotel.pressbooks.pub/culturally-responsive-computing/', kind: 'Open textbook', license: 'CC BY-NC-SA' }
  ]
};

const videoLibraries = {
  business: [
    { title: 'Lecture 1: What is Entrepreneurship?', provider: 'MIT OpenCourseWare · Bill Aulet', url: 'https://www.youtube.com/watch?v=WSkDqpBctfA', embedUrl: 'https://www.youtube.com/embed/WSkDqpBctfA' },
    { title: 'Building a Business: Future-proofing business', provider: 'Oxford Saïd Business School', url: 'https://www.youtube.com/watch?v=grzUpToarj4', embedUrl: 'https://www.youtube.com/embed/grzUpToarj4' },
    { title: 'Entrepreneurial Finance', provider: 'University of North Carolina at Chapel Hill · ECON 125', url: 'https://www.youtube.com/watch?v=E0mTeYlpEe4', embedUrl: 'https://www.youtube.com/embed/E0mTeYlpEe4' },
    { title: 'The Fundamentals of Effective Selling', provider: 'Stanford Graduate School of Business', url: 'https://www.youtube.com/watch?v=x-OvmLh2TEE', embedUrl: 'https://www.youtube.com/embed/x-OvmLh2TEE' }
  ],
  technology: [
    { title: 'Introduction to JavaScript', provider: 'MIT web.lab', url: 'https://www.youtube.com/watch?v=OMuYHyBi-Ms', embedUrl: 'https://www.youtube.com/embed/OMuYHyBi-Ms' },
    { title: 'HTML, CSS, JavaScript', provider: 'Harvard CS50', url: 'https://www.youtube.com/watch?v=yYst7puZXjw', embedUrl: 'https://www.youtube.com/embed/yYst7puZXjw' },
    { title: 'Machine Learning Lecture 1', provider: 'Stanford CS229 · Andrew Ng', url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I', embedUrl: 'https://www.youtube.com/embed/jGwO_UgTS7I' },
    { title: 'Artificial Intelligence lecture videos', provider: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/resources/lecture-videos/', embedUrl: null }
  ],
  hospitality: [
    { title: 'Hospitality and Hotel Administration lectures', provider: 'Cornell Nolan School of Hotel Administration', url: 'https://www.youtube.com/user/CornellHotelSchool', embedUrl: null },
    { title: 'The Hotel of the Future Is All About AI', provider: 'Cornell Nolan School of Hotel Administration', url: 'https://www.youtube.com/watch?v=SzImAQbOGWc', embedUrl: 'https://www.youtube.com/embed/SzImAQbOGWc' },
    { title: 'Introduction to Hotel Operations', provider: 'Cornell University eCornell', url: 'https://ecornell.cornell.edu/courses/hospitality-and-foodservice-management/introduction-to-hotel-operations/', embedUrl: null },
    { title: 'Food and service learning resources', provider: 'Pennsylvania State University', url: 'https://psu.pb.unizin.org/hmd329/', embedUrl: null }
  ],
  tourism: [
    { title: 'Sustainable Tourism Destination Management', provider: 'Cornell University eCornell', url: 'https://www.youtube.com/watch?v=8US9w1pUkjg', embedUrl: 'https://www.youtube.com/embed/8US9w1pUkjg' },
    { title: 'Tourism and smart tourism lectures', provider: 'Professor Dimitrios Buhalis', url: 'https://www.youtube.com/user/buhalid', embedUrl: null },
    { title: 'Sustainable tourism principles and impacts', provider: 'Dr Hayley Stainton · Tourism Teacher', url: 'https://www.youtube.com/playlist?list=PLIfNzIyhq0S1ZezyO8jxIqDS-rphH5EkK', embedUrl: null },
    { title: 'Hospitality and tourism OER media', provider: 'University of Texas Rio Grande Valley Libraries', url: 'https://utrgv.libguides.com/hospitality-and-tourism-management/OER', embedUrl: null }
  ],
  interdisciplinary: [
    { title: 'Stanford business and technology talks', provider: 'Stanford University', url: 'https://www.youtube.com/stanfordonline', embedUrl: null },
    { title: 'The Hotel of the Future Is All About AI', provider: 'Cornell Nolan School of Hotel Administration', url: 'https://www.youtube.com/watch?v=SzImAQbOGWc', embedUrl: 'https://www.youtube.com/embed/SzImAQbOGWc' },
    { title: 'Sustainable Tourism Destination Management', provider: 'Cornell University eCornell', url: 'https://www.youtube.com/watch?v=8US9w1pUkjg', embedUrl: 'https://www.youtube.com/embed/8US9w1pUkjg' },
    { title: 'Machine Learning Lecture 1', provider: 'Stanford CS229 · Andrew Ng', url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I', embedUrl: 'https://www.youtube.com/embed/jGwO_UgTS7I' }
  ],
  core: [
    { title: 'Business and workplace learning videos', provider: 'Stanford Graduate School of Business', url: 'https://www.youtube.com/@stanfordgsb', embedUrl: null },
    { title: 'Culturally Responsive Computing', provider: 'Rochester Educational Technology and Open Learning', url: 'https://rotel.pressbooks.pub/culturally-responsive-computing/', embedUrl: null },
    { title: 'Workplace software and digital skills', provider: 'OpenStax', url: 'https://openstax.org/details/books/workplace-software-skills', embedUrl: null },
    { title: 'Building a Business: Future-proofing business', provider: 'Oxford Saïd Business School', url: 'https://www.youtube.com/watch?v=grzUpToarj4', embedUrl: 'https://www.youtube.com/embed/grzUpToarj4' }
  ]
};

const stageNames = {
  business: ['Opportunity and context', 'Tools and decision-making', 'Applied business practice', 'Capstone and presentation'],
  technology: ['Foundations and workflow', 'Build, configure, or analyse', 'Responsible implementation and testing', 'Portfolio and review'],
  hospitality: ['Service standards and guest needs', 'Operational workflow and practice', 'Safety, quality, and teamwork', 'Service evidence capstone'],
  tourism: ['Tourism systems and local context', 'Visitor experience and communication', 'Community, safety, and sustainability', 'Destination or tour capstone'],
  interdisciplinary: ['Shared sector problem', 'Cross-department methods', 'Integrated practical delivery', 'Portfolio reflection and capstone'],
  core: ['Workplace communication', 'Digital collaboration', 'Employability and sustainability', 'Portfolio and next steps']
};

const trackFor = (department) => {
  if (department === 'Business and Entrepreneurship') return 'business';
  if (department === 'IT and Technology') return 'technology';
  if (department === 'Hospitality Management') return 'hospitality';
  if (department === 'Tourism and Destination Management') return 'tourism';
  if (department === 'Interdisciplinary') return 'interdisciplinary';
  return 'core';
};

const rangeWeeks = (range) => {
  const values = String(range).split('–').map((value) => Number(value));
  const start = values[0];
  const end = values[1] || start;
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const courseConnection = (course, stage, outcome) => `Apply this resource to ${course.title}: ${stage}. Use it to deepen the week’s target outcome, “${outcome}”`;
const resourceFor = (library, lessonIndex) => library[lessonIndex % library.length];
const withSourceMetadata = (resource, fallbackKind, fallbackLicense) => ({
  ...resource,
  kind: resource.kind || fallbackKind,
  license: resource.license || fallbackLicense,
  officialUrl: resource.officialUrl || resource.url
});
const lowerFirst = (value) => String(value || '').replace(/^./, (letter) => letter.toLowerCase());
const selfStudyExplanation = (course, stage, outcome) => `In plain language, this lesson helps you work on ${lowerFirst(outcome)}. Treat ${stage.toLowerCase()} as a skill you can build in small steps: study one idea, compare it with a real Liberian or regional example, and save a short piece of evidence of what you understood.`;
const essentialQuestion = (course, stage) => `How could ${stage.toLowerCase()} improve a real situation connected to ${course.title}?`;
const noteThemes = {
  business: { lens: 'value, evidence, and responsible decisions', example: 'a small enterprise, service, or community opportunity', action: 'state the problem, identify who is affected, test an assumption, and record what happened' },
  technology: { lens: 'clear requirements, repeatable workflow, testing, and safe implementation', example: 'a workplace or service process that could be improved with a digital tool', action: 'define the user, build a small version, test it with safe sample data, and document the result' },
  hospitality: { lens: 'guest needs, service sequence, quality, safety, and teamwork', example: 'a hotel, restaurant, event, or guest-service situation', action: 'observe the service, map the hand-offs, propose one improvement, and explain how quality will be checked' },
  tourism: { lens: 'visitor experience, local context, communication, community benefit, and sustainability', example: 'a local destination, tour, attraction, or travel experience', action: 'listen to different stakeholders, describe the experience, identify a responsible improvement, and set a simple measure' },
  interdisciplinary: { lens: 'shared problems, collaboration, responsible delivery, and evidence', example: 'a service-sector problem that needs more than one department', action: 'frame the shared problem, assign perspectives, combine methods, and review the result with others' },
  core: { lens: 'professional communication, digital confidence, employability, and personal progress', example: 'a realistic school, workplace, or community task', action: 'clarify the task, choose a useful tool, complete a small draft, and ask for focused feedback' }
};
const deepNotes = (course, track, stage, outcome) => {
  const theme = noteThemes[track];
  return {
    overview: `This original lecture note places “${outcome}” inside the wider work of ${course.title}. The week is not only about remembering a definition. It is about understanding the choices behind the work: ${theme.lens}. Begin with ${theme.example}, then use the linked academic source to compare your first idea with a more formal explanation.`,
    explanation: `A useful way to learn this topic is to move from a situation to a decision and then to evidence. First describe what is happening and who needs a better result. Next identify the information, people, tools, or constraints that shape the decision. Finally make a small, responsible attempt and explain what you would improve. This sequence keeps self-study practical and prevents a learner from copying a solution without understanding the reason for it.`,
    keyIdeas: [
      `Purpose: connect ${stage.toLowerCase()} to the outcome “${outcome}”.`,
      `Method: ${theme.action}.`,
      `Evidence: save a short record that another learner could understand and review.`
    ],
    instructions: [
      'Read the guide and linked source for the main concept; write down two unfamiliar terms.',
      'Describe a local or regional example without including private or identifying information.',
      'Complete the weekly exercise using safe sample data, a fictional scenario, or your own non-sensitive work.',
      'Review your result against the self-check questions and record one improvement for the next session.'
    ],
    exercise: `Exercise: ${course.title} learners should ${theme.action}. Use the week’s focus as your test case and save ${course.evidenceType.toLowerCase()}.`,
    checks: [
      `What is the main idea in your own words?`,
      `Which decision or assumption most affects the result?`,
      `What evidence would show that your approach is useful and responsible?`
    ]
  };
};

const materialsForCourse = (course) => {
  const track = trackFor(course.primaryDepartment);
  const readings = sourceHubs[track];
  const videos = videoLibraries[track];
  const stages = stageNames[track];
  const lessons = [];
  let lessonIndex = 0;
  for (const [moduleIndex, module] of course.modules.entries()) {
    for (const week of rangeWeeks(module.week)) {
      const outcome = course.outcomes[lessonIndex % course.outcomes.length];
      const reading = resourceFor(readings, lessonIndex);
      const video = resourceFor(videos, lessonIndex);
      const stage = stages[moduleIndex] || module.title;
      lessons.push({
        week,
        module: module.title,
        title: `${course.code} · ${stage} · Week ${week}`,
        focus: outcome,
        activity: module.activity,
        studyConnection: courseConnection(course, stage, outcome),
        selfStudyExplanation: selfStudyExplanation(course, stage, outcome),
        essentialQuestion: essentialQuestion(course, stage),
        learningSteps: [
          `Read for the main idea: ${outcome}`,
          `Watch for one method or example connected to ${stage.toLowerCase()}.`,
          `Apply the idea locally and save ${course.evidenceType.toLowerCase()}.`
        ],
        notes: deepNotes(course, track, stage, outcome),
        reading: { ...withSourceMetadata(reading, 'Academic learning resource', 'Access terms apply; verify the source page.'), studyConnection: `Read selectively for this week’s ${stage.toLowerCase()} work.` },
        video: { ...withSourceMetadata(video, 'University lecture or official educational video', 'Access terms apply; video remains the property of its provider and platform.'), studyConnection: `Watch with the ${course.title} learning outcome in mind; take notes on an idea to test locally.` },
        pdfPath: `/materials/${course.id}/week-${week}.pdf`,
        pdfTitle: `${course.code} Week ${week} Study Guide`,
        estimatedHours: Math.max(2, Math.round(course.estimatedHours / course.durationWeeks)),
        lessonIndex: lessonIndex + 1
      });
      lessonIndex += 1;
    }
  }
  return lessons;
};

const materialsForCourses = (courses) => Object.fromEntries(courses.map((course) => [course.id, materialsForCourse(course)]));

export { materialsForCourse, materialsForCourses, sourceHubs, trackFor, videoLibraries };

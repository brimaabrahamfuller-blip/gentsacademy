const sourceHubs = {
  business: [
    { title: 'University of Washington Business OER Guide', provider: 'University of Washington Libraries', url: 'https://guides.lib.uw.edu/oer/business', kind: 'OER guide', license: 'Open educational resource directory' },
    { title: 'Open Textbook Library: Business', provider: 'University of Minnesota', url: 'https://open.umn.edu/opentextbooks/subjects/business', kind: 'Open textbooks', license: 'Varies by title; verify on source page' },
    { title: 'MIT FinTech: Shaping the Financial World', provider: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/sloan-school-of-management/15-s08-fintech-shaping-the-financial-world-spring-2020/', kind: 'Open course', license: 'MIT OpenCourseWare terms' }
  ],
  technology: [
    { title: 'OER for Information Technology and Information Systems', provider: 'California Community Colleges OERI', url: 'https://asccc-oeri.org/open-educational-resources-and-information-technology-and-information-systems-itis/', kind: 'Curated OER collection', license: 'License varies by source; verify on source page' },
    { title: 'Foundations of Information Systems', provider: 'OpenStax', url: 'https://openstax.org/details/books/foundations-information-systems', kind: 'Open textbook', license: 'CC BY' },
    { title: 'Introduction to Computer Science and Programming in Python', provider: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/', kind: 'Open course', license: 'MIT OpenCourseWare terms' },
    { title: 'Security Guidance v4.0', provider: 'Cloud Security Alliance', url: 'https://cloudsecurityalliance.org/artifacts/security-guidance-v4', kind: 'Professional guidance', license: 'CC BY-NC-SA 4.0' }
  ],
  hospitality: [
    { title: 'Hospitality and Tourism Management OER', provider: 'University of Texas Rio Grande Valley Libraries', url: 'https://utrgv.libguides.com/hospitality-and-tourism-management/OER', kind: 'Curated OER collection', license: 'License varies by source; verify on source page' },
    { title: 'Introduction to Tourism and Hospitality in BC', provider: 'BCcampus Open Education', url: 'https://opentextbc.ca/introtourism/', kind: 'Open textbook', license: 'Open textbook license stated by publisher' },
    { title: 'Introduction to Food Production and Service', provider: 'Pennsylvania State University', url: 'https://psu.pb.unizin.org/hmd329/', kind: 'Open textbook', license: 'Open textbook license stated by publisher' },
    { title: 'Workplace Safety in the Foodservice Industry', provider: 'BCcampus Open Education', url: 'https://opentextbc.ca/workplacesafety/', kind: 'Open textbook', license: 'Open textbook license stated by publisher' }
  ],
  tourism: [
    { title: 'Hospitality and Tourism Management OER', provider: 'University of Texas Rio Grande Valley Libraries', url: 'https://utrgv.libguides.com/hospitality-and-tourism-management/OER', kind: 'Curated OER collection', license: 'License varies by source; verify on source page' },
    { title: 'Introduction to Tourism and Hospitality in BC', provider: 'BCcampus Open Education', url: 'https://opentextbc.ca/introtourism/', kind: 'Open textbook', license: 'Open textbook license stated by publisher' },
    { title: 'Cultural Heritage Tourism Event Planning and Management', provider: 'Lumen Learning / LibreTexts', url: 'https://workforce.libretexts.org/Bookshelves/Hospitality/Book%3A_Cultural_Heritage_Tourism_Event_Planning_and_Management_(Lumen)', kind: 'Open textbook', license: 'Open textbook license stated by publisher' }
  ],
  interdisciplinary: [
    { title: 'Open Educational Resources and Business', provider: 'ASCCC OERI', url: 'https://asccc-oeri.org/open-educational-resources-and-business/', kind: 'Curated OER collection', license: 'License varies by source; verify on source page' },
    { title: 'OER for Hospitality and Tourism', provider: 'University of Central Florida Libraries', url: 'https://guides.ucf.edu/OERforHospitality', kind: 'Curated OER collection', license: 'License varies by source; verify on source page' },
    { title: 'Foundations of Information Systems', provider: 'OpenStax', url: 'https://openstax.org/details/books/foundations-information-systems', kind: 'Open textbook', license: 'CC BY' }
  ],
  core: [
    { title: 'Workplace Software and Skills', provider: 'OpenStax', url: 'https://openstax.org/details/books/workplace-software-skills', kind: 'Open textbook', license: 'CC BY' },
    { title: 'Open Educational Resources and Business', provider: 'University of Washington Libraries', url: 'https://guides.lib.uw.edu/oer/business', kind: 'OER guide', license: 'Open educational resource directory' },
    { title: 'Culturally Responsive Computing', provider: 'Rochester Educational Technology and Open Learning', url: 'https://rotel.pressbooks.pub/culturally-responsive-computing/', kind: 'Open textbook', license: 'CC BY-NC-SA' }
  ]
};

const videoLibraries = {
  business: [
    { title: 'Building a Business: Future-proofing business', provider: 'Oxford Saïd Business School', url: 'https://www.youtube.com/watch?v=grzUpToarj4', embedUrl: 'https://www.youtube.com/embed/grzUpToarj4' },
    { title: 'Entrepreneurial Finance', provider: 'University of California / Econ 125 lecture', url: 'https://www.youtube.com/watch?v=E0mTeYlpEe4', embedUrl: 'https://www.youtube.com/embed/E0mTeYlpEe4' },
    { title: 'The Fundamentals of Effective Selling', provider: 'Stanford Graduate School of Business', url: 'https://www.youtube.com/watch?v=x-OvmLh2TEE', embedUrl: 'https://www.youtube.com/embed/x-OvmLh2TEE' },
    { title: 'Professor Thomas Hellman: Entrepreneurial finance', provider: 'University of Oxford', url: 'https://www.youtube.com/watch?v=eEjX9ussSVk', embedUrl: 'https://www.youtube.com/embed/eEjX9ussSVk' }
  ],
  technology: [
    { title: 'Introduction to JavaScript', provider: 'MIT web.lab', url: 'https://www.youtube.com/watch?v=OMuYHyBi-Ms', embedUrl: 'https://www.youtube.com/embed/OMuYHyBi-Ms' },
    { title: 'HTML, CSS, JavaScript', provider: 'Harvard CS50', url: 'https://www.youtube.com/watch?v=yYst7puZXjw', embedUrl: 'https://www.youtube.com/embed/yYst7puZXjw' },
    { title: 'Machine Learning Lecture 1', provider: 'Stanford CS229 / Andrew Ng', url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I', embedUrl: 'https://www.youtube.com/embed/jGwO_UgTS7I' },
    { title: 'Stanford Online lectures and talks', provider: 'Stanford University', url: 'https://www.youtube.com/stanfordonline', embedUrl: null }
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
    { title: 'Sustainable tourism principles and impacts', provider: 'Dr Hayley Stainton, Tourism Teacher', url: 'https://www.youtube.com/playlist?list=PLIfNzIyhq0S1ZezyO8jxIqDS-rphH5EkK', embedUrl: null },
    { title: 'Tourism and hospitality OER media', provider: 'University of Texas Rio Grande Valley Libraries', url: 'https://utrgv.libguides.com/hospitality-and-tourism-management/OER', embedUrl: null }
  ],
  interdisciplinary: [
    { title: 'Stanford business and technology talks', provider: 'Stanford University', url: 'https://www.youtube.com/stanfordonline', embedUrl: null },
    { title: 'The Hotel of the Future Is All About AI', provider: 'Cornell Nolan School of Hotel Administration', url: 'https://www.youtube.com/watch?v=SzImAQbOGWc', embedUrl: 'https://www.youtube.com/embed/SzImAQbOGWc' },
    { title: 'Sustainable Tourism Destination Management', provider: 'Cornell University eCornell', url: 'https://www.youtube.com/watch?v=8US9w1pUkjg', embedUrl: 'https://www.youtube.com/embed/8US9w1pUkjg' },
    { title: 'Machine Learning Lecture 1', provider: 'Stanford CS229 / Andrew Ng', url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I', embedUrl: 'https://www.youtube.com/embed/jGwO_UgTS7I' }
  ],
  core: [
    { title: 'Stanford GSB business videos', provider: 'Stanford Graduate School of Business', url: 'https://www.youtube.com/@stanfordgsb', embedUrl: null },
    { title: 'Culturally Responsive Computing', provider: 'Rochester Educational Technology and Open Learning', url: 'https://rotel.pressbooks.pub/culturally-responsive-computing/', embedUrl: null },
    { title: 'Workplace software and digital skills', provider: 'OpenStax', url: 'https://openstax.org/details/books/workplace-software-skills', embedUrl: null },
    { title: 'Oxford business lecture series', provider: 'Oxford Saïd Business School', url: 'https://www.youtube.com/watch?v=grzUpToarj4', embedUrl: 'https://www.youtube.com/embed/grzUpToarj4' }
  ]
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

const materialsForCourse = (course) => {
  const track = trackFor(course.primaryDepartment);
  const readings = sourceHubs[track];
  const videos = videoLibraries[track];
  const lessons = [];
  let lessonIndex = 0;
  for (const module of course.modules) {
    for (const week of rangeWeeks(module.week)) {
      const outcome = course.outcomes[lessonIndex % course.outcomes.length];
      const reading = readings[lessonIndex % readings.length];
      const video = videos[lessonIndex % videos.length];
      lessons.push({
        week,
        module: module.title,
        title: `${module.title}: week ${week}`,
        focus: outcome,
        activity: module.activity,
        reading,
        video,
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

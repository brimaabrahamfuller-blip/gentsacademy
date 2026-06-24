document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    if (courseId) {
        loadCourseDetail(courseId);
    } else {
        window.location.href = 'courses.html';
    }
    checkAuthStatus();
});

async function loadCourseDetail(id) {
    try {
        const response = await fetch('data/courses.json');
        const data = await response.json();
        const course = data.courses.find(c => c.id === id);
        
        if (!course) {
            document.getElementById('course-detail-content').innerHTML = '<h2>Course not found</h2>';
            return;
        }

        renderCourse(course);
        checkEnrollment(course.id);
    } catch (error) {
        console.error('Error loading course details:', error);
    }
}

function renderCourse(course) {
    const container = document.getElementById('course-detail-content');
    
    container.innerHTML = `
        <section class="detail-hero">
            <div class="hero-text animate-fade-up">
                <span class="course-category" style="color: var(--lib-gold); font-weight:700; text-transform:uppercase;">${course.category}</span>
                <h1 class="display-font" style="font-size: 3rem; margin: 1rem 0; color: white;">${course.title}</h1>
                <p style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; max-width: 600px; color: white;">${course.description}</p>
                <div class="hero-meta" style="display:flex; gap: 2rem; margin-bottom: 2.5rem; color: white;">
                    <div><i class="fas fa-user-tie"></i> ${course.instructor}</div>
                    <div><i class="far fa-clock"></i> ${course.duration}</div>
                    <div><i class="fas fa-signal"></i> ${course.level}</div>
                </div>
                <div class="hero-actions">
                    <button id="enroll-btn" class="btn btn-primary btn-large" onclick="enroll('${course.id}')">Enroll for Free</button>
                    <button id="continue-btn" class="btn btn-accent btn-large" style="display:none;" onclick="location.href='dashboard.html'">Continue Learning</button>
                </div>
            </div>
            <div class="hero-image">
                <img src="${course.thumbnail}" alt="${course.title}" class="course-thumb-large" style="width:100%; border-radius: 12px;">
            </div>
        </section>

        <section class="curriculum-section">
            <h2 class="display-font" style="margin-bottom: 2rem;">Course <span class="text-lib-red">Curriculum</span></h2>
            <div class="curriculum-accordion">
                ${course.modules.map((module, index) => `
                    <div class="accordion-item ${index === 0 ? 'active' : ''}">
                        <div class="accordion-header" onclick="toggleAccordion(this)">
                            <span>Week ${module.week}: ${module.title}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="accordion-content">
                            <p>${module.description}</p>
                            <div style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center;">
                                <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fas fa-play-circle"></i> ${module.duration}</span>
                                <button class="btn btn-sm" style="padding: 4px 12px; font-size: 0.8rem; background: #eee;">Preview</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function toggleAccordion(header) {
    const item = header.parentElement;
    item.classList.toggle('active');
}

function checkEnrollment(courseId) {
    const enrolledCourses = JSON.parse(localStorage.getItem('gentsacademy_enrolled') || '[]');
    
    if (enrolledCourses.includes(courseId)) {
        const enrollBtn = document.getElementById('enroll-btn');
        const continueBtn = document.getElementById('continue-btn');
        if (enrollBtn) enrollBtn.style.display = 'none';
        if (continueBtn) continueBtn.style.display = 'inline-block';
    }
}

function enroll(courseId) {
    const session = localStorage.getItem('gentsacademy_session');
    if (!session) {
        window.location.href = 'auth.html';
        return;
    }

    let enrolled = JSON.parse(localStorage.getItem('gentsacademy_enrolled') || '[]');
    if (!enrolled.includes(courseId)) {
        enrolled.push(courseId);
        localStorage.setItem('gentsacademy_enrolled', JSON.stringify(enrolled));
    }
    
    alert('Successfully enrolled!');
    checkEnrollment(courseId);
}

function checkAuthStatus() {
    const session = localStorage.getItem('gentsacademy_session');
    if (session) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const loginLink = Array.from(navLinks.querySelectorAll('a')).find(a => a.textContent === 'Login');
            if (loginLink) {
                loginLink.textContent = 'Dashboard';
                loginLink.href = 'dashboard.html';
            }
        }
    }
}

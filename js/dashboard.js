document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('gentsacademy_session');
    if (!session) {
        window.location.href = 'auth.html';
        return;
    }

    const user = JSON.parse(session);
    document.getElementById('welcome-name').textContent = user.name || user.email.split('@')[0];
    
    loadDashboardData();
    setupLogout();
});

async function loadDashboardData() {
    try {
        const response = await fetch('data/courses.json');
        const data = await response.json();
        const enrolledIds = JSON.parse(localStorage.getItem('gentsacademy_enrolled') || '[]');
        
        const enrolledCourses = data.courses.filter(c => enrolledIds.includes(c.id));
        document.getElementById('course-count').textContent = enrolledCourses.length;

        renderEnrolledCourses(enrolledCourses);
        renderCertificates(enrolledCourses);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function renderEnrolledCourses(courses) {
    const container = document.getElementById('enrolled-container');
    if (courses.length === 0) {
        container.innerHTML = `
            <div class="card" style="padding: 2rem; text-align: center;">
                <p>You haven't enrolled in any courses yet.</p>
                <a href="courses.html" class="btn btn-primary mt-sm" style="margin-top: 1rem;">Browse Courses</a>
            </div>
        `;
        return;
    }

    container.innerHTML = courses.map(course => {
        const progress = Math.floor(Math.random() * 40) + 10; // Simulated progress
        return `
            <div class="card progress-card" style="background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 1rem;">
                <div class="progress-ring" data-percent="${progress}" style="background: conic-gradient(var(--lib-blue) ${progress}%, #eee 0%);"></div>
                <div style="flex-grow: 1;">
                    <h3 style="margin: 0; font-family: 'Syne', sans-serif;">${course.title}</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin: 5px 0;">Instructor: ${course.instructor}</p>
                    <a href="course-detail.html?id=${course.id}" class="btn btn-sm btn-primary" style="margin-top: 5px; font-size: 0.8rem; padding: 5px 15px;">Continue</a>
                </div>
            </div>
        `;
    }).join('');
}

function renderCertificates(courses) {
    const container = document.getElementById('certificates-container');
    // For demo, show one completed certificate if they have courses
    if (courses.length > 0) {
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; background: #fff9e6; padding: 10px; border-radius: 8px; border: 1px solid #ffeeba;">
                <i class="fas fa-certificate text-lib-gold" style="font-size: 1.5rem;"></i>
                <div style="font-size: 0.85rem;">
                    <strong>Foundations of Business</strong>
                    <br><a href="#" style="color: var(--lib-blue); font-weight: 600;">Download PDF</a>
                </div>
            </div>
        `;
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('gentsacademy_session');
            localStorage.removeItem('gentsacademy_user');
            window.location.href = 'index.html';
        });
    }
}

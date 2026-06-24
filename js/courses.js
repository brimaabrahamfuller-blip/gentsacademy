let allCourses = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchCourses();
    setupFilters();
    checkAuthStatus();
});

async function fetchCourses() {
    try {
        const response = await fetch('data/courses.json');
        const data = await response.json();
        allCourses = data.courses;
        displayCourses(allCourses);
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

function displayCourses(courses) {
    const container = document.getElementById('courses-container');
    if (!container) return;

    if (courses.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><h3>No courses found</h3></div>';
        return;
    }

    container.innerHTML = courses.map(course => `
        <div class="card course-card" style="opacity: 0; transform: translateY(20px); transition: all 0.5s ease; overflow: hidden; display: flex; flex-direction: column;">
            <div class="course-thumb">
                <img src="${course.thumbnail}" alt="${course.title}" style="width:100%; height:180px; object-fit:cover;">
            </div>
            <div class="course-info" style="padding: var(--spacing-md); flex-grow: 1; display: flex; flex-direction: column;">
                <span class="course-category" style="color: var(--lib-red); font-weight:600; font-size:0.8rem; text-transform: uppercase;">${course.category}</span>
                <h3 style="margin: 0.5rem 0; font-size: 1.2rem; font-family: 'Syne', sans-serif;">${course.title}</h3>
                <div class="course-meta" style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); margin-bottom:1.5rem; margin-top: auto;">
                    <span><i class="far fa-clock"></i> ${course.duration}</span>
                    <span style="background: rgba(0,40,104,0.1); color: var(--lib-blue); padding: 2px 8px; border-radius: 4px; font-weight: 600;">${course.level}</span>
                </div>
                <a href="course-detail.html?id=${course.id}" class="btn btn-primary" style="width:100%; text-align:center;">Enroll Now</a>
            </div>
        </div>
    `).join('');

    // Trigger entrance animation
    setTimeout(() => {
        const cards = container.querySelectorAll('.course-card');
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 50);
        });
    }, 10);
}

function setupFilters() {
    const searchInput = document.getElementById('course-search');
    const filterBtns = document.querySelectorAll('.btn-filter');

    if (searchInput) {
        searchInput.addEventListener('input', () => filterCourses());
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCourses();
        });
    });
}

function filterCourses() {
    const searchInput = document.getElementById('course-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const activeBtn = document.querySelector('.btn-filter.active');
    const activeCategory = activeBtn ? activeBtn.dataset.category : 'all';

    const filtered = allCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm) || 
                             course.description.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    displayCourses(filtered);
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

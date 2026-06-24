/* ===========================
   MAIN APPLICATION SCRIPT
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    loadFeaturedCourses();
    initAnimations();
});

function initializePage() {
    console.log("GentsAcademy v2.0 Initialized");
    initSmoothScroll();
    checkAuthStatus();
}

async function loadFeaturedCourses() {
    try {
        const response = await fetch('data/courses.json');
        const data = await response.json();
        const container = document.getElementById('featured-courses-container');
        
        if (!container) return;

        // Show only first 3 courses on homepage
        const featured = data.courses.slice(0, 3);
        
        container.innerHTML = featured.map(course => `
            <div class="card course-card animate-fade-up">
                <div class="course-thumb">
                    <img src="${course.thumbnail}" alt="${course.title}" style="width:100%; height:200px; object-fit:cover; border-radius: var(--radius-md) var(--radius-md) 0 0;">
                </div>
                <div class="course-info" style="padding: var(--spacing-md);">
                    <span class="course-category" style="color: var(--lib-red); font-weight:600; font-size:0.8rem; text-transform:uppercase;">${course.category}</span>
                    <h3 style="margin: 0.5rem 0;">${course.title}</h3>
                    <p style="color: var(--text-muted); font-size:0.9rem; margin-bottom: 1rem;">${course.description.substring(0, 80)}...</p>
                    <div class="course-meta" style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">
                        <span><i class="far fa-clock"></i> ${course.duration}</span>
                        <span><i class="far fa-star text-lib-gold"></i> ${course.rating}</span>
                    </div>
                    <a href="course-detail.html?id=${course.id}" class="btn btn-primary" style="width:100%; text-align:center;">View Course</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function initAnimations() {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-up').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s ease-out";
        observer.observe(el);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function checkAuthStatus() {
    const session = localStorage.getItem('gentsacademy_session');
    if (session) {
        const user = JSON.parse(session);
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

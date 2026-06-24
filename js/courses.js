/* ===========================
   COURSES PAGE FUNCTIONALITY
   =========================== */

let allCourses = [];
let filteredCourses = [];
let currentFilter = 'all';
let currentSort = 'newest';

document.addEventListener('DOMContentLoaded', function() {
    initializeCoursesPage();
});

/**
 * Initialize courses page
 */
async function initializeCoursesPage() {
    try {
        // Load courses from JSON
        await loadCourses();
        
        // Set up filter buttons
        initializeFilters();
        
        // Set up search
        initializeSearch();
        
        // Set up sorting
        initializeSorting();
        
        // Display all courses initially
        displayCourses(allCourses);
        
        // Check auth status
        checkAuthStatus();
    } catch (error) {
        console.error('Error initializing courses page:', error);
        showNotification('Error loading courses. Please refresh the page.', 'error');
    }
}

/**
 * Load courses from JSON file
 */
async function loadCourses() {
    try {
        const response = await fetch('data/courses.json');
        if (!response.ok) throw new Error('Failed to load courses');
        
        const data = await response.json();
        allCourses = data.courses || [];
        filteredCourses = [...allCourses];
        
        console.log(`Loaded ${allCourses.length} courses`);
    } catch (error) {
        console.error('Error loading courses:', error);
        throw error;
    }
}

/**
 * Initialize filter buttons
 */
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            currentFilter = this.dataset.filter;
            applyFilters();
        });
    });
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            applyFilters();
        }, 300));
    }
}

/**
 * Initialize sorting
 */
function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            currentSort = e.target.value;
            applyFilters();
        });
    }
}

/**
 * Apply filters and search
 */
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter by category and search
    let result = allCourses.filter(course => {
        const matchesCategory = currentFilter === 'all' || course.category === currentFilter;
        const matchesSearch = !searchTerm || 
                            course.title.toLowerCase().includes(searchTerm) ||
                            course.description.toLowerCase().includes(searchTerm) ||
                            course.category.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesSearch;
    });
    
    // Apply sorting
    result = sortCourses(result, currentSort);
    
    // Display results
    filteredCourses = result;
    displayCourses(result);
}

/**
 * Sort courses based on selected option
 */
function sortCourses(courses, sortType) {
    const sorted = [...courses];
    
    switch(sortType) {
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        
        case 'popular':
            return sorted.sort((a, b) => b.students - a.students);
        
        case 'duration-short':
            return sorted.sort((a, b) => {
                const durationA = parseInt(a.duration);
                const durationB = parseInt(b.duration);
                return durationA - durationB;
            });
        
        case 'duration-long':
            return sorted.sort((a, b) => {
                const durationA = parseInt(a.duration);
                const durationB = parseInt(b.duration);
                return durationB - durationA;
            });
        
        case 'newest':
        default:
            return sorted;
    }
}

/**
 * Display courses in grid
 */
function displayCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');
    const noResults = document.getElementById('noResults');
    
    if (!coursesGrid) return;
    
    // Clear grid
    coursesGrid.innerHTML = '';
    
    if (courses.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Create course cards
    courses.forEach((course, index) => {
        const card = createCourseCard(course, index);
        coursesGrid.appendChild(card);
    });
}

/**
 * Create a course card element
 */
function createCourseCard(course, index) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.style.animation = `fadeIn 0.6s ease-out ${index * 0.1}s backwards`;
    
    const badgeClass = course.category === 'AI' ? 'ai' : course.category === 'Technology' ? 'tech' : '';
    
    card.innerHTML = `
        <div class="course-badge ${badgeClass}">${course.category}</div>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta">
            <span class="level">⭐ ${course.level}</span>
            <span class="duration">⏱ ${course.duration}</span>
        </div>
        <div class="course-stats">
            <div class="rating-info">
                <span class="stars">★★★★★</span>
                <span class="rating-value">${course.rating}</span>
            </div>
            <div class="students-info">
                <span class="students">${(course.students / 1000).toFixed(1)}K students</span>
            </div>
        </div>
        <button class="btn btn-card" data-course-id="${course.id}">Explore Course</button>
    `;
    
    // Add click handler
    const button = card.querySelector('.btn-card');
    button.addEventListener('click', function() {
        goToCourseDetail(course.id);
    });
    
    return card;
}

/**
 * Navigate to course detail page
 */
function goToCourseDetail(courseId) {
    // Store selected course in session storage
    sessionStorage.setItem('selectedCourse', courseId);
    window.location.href = `course-detail.html?id=${courseId}`;
}

/**
 * Check authentication and update navbar
 */
function checkAuthStatus() {
    try {
        const session = localStorage.getItem('gentsacademy_session');
        if (session) {
            const user = JSON.parse(session);
            updateNavbarForLoggedInUser(user);
        }
    } catch (error) {
        console.log('No active session');
    }
}

/**
 * Update navbar for logged-in users
 */
function updateNavbarForLoggedInUser(user) {
    const navMenu = document.querySelector('.navbar-menu');
    
    if (!navMenu) return;
    
    const loginBtn = navMenu.querySelector('.btn-login');
    const signupBtn = navMenu.querySelector('.btn-signup');
    
    if (loginBtn && signupBtn) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.href = 'dashboard.html';
        
        signupBtn.textContent = 'Logout';
        signupBtn.href = '#';
        signupBtn.onclick = logout;
    }
}

/**
 * Handle logout
 */
function logout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('gentsacademy_session');
        localStorage.removeItem('gentsacademy_user');
        window.location.href = 'index.html';
    }
}

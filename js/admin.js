/* ===========================
   ADMIN DASHBOARD FUNCTIONALITY
   =========================== */

const ADMIN_PASSWORD = 'GentsAdmin2025'; // Simple password for demo
let allCourses = [];
let allStudents = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

/**
 * Initialize admin dashboard
 */
async function initializeAdmin() {
    try {
        // Check admin authentication
        if (!isAdminAuthenticated()) {
            promptAdminPassword();
            return;
        }
        
        // Load courses
        await loadCoursesForAdmin();
        
        // Load students
        loadStudents();
        
        // Set up tabs
        setupAdminTabs();
        
        // Set up event listeners
        setupAdminEventListeners();
        
        // Display overview
        displayOverview();
        
        // Set up logout
        setupAdminLogout();
    } catch (error) {
        console.error('Error initializing admin:', error);
        showNotification('Error initializing admin dashboard', 'error');
    }
}

/**
 * Check if admin is authenticated
 */
function isAdminAuthenticated() {
    return sessionStorage.getItem('gentsacademy_admin_authenticated') === 'true';
}

/**
 * Prompt for admin password
 */
function promptAdminPassword() {
    const password = prompt('Enter admin password to access this panel:');
    
    if (password === null) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('gentsacademy_admin_authenticated', 'true');
        initializeAdmin();
    } else {
        showNotification('Incorrect password', 'error');
        promptAdminPassword();
    }
}

/**
 * Load courses for admin
 */
async function loadCoursesForAdmin() {
    try {
        const response = await fetch('data/courses.json');
        if (!response.ok) throw new Error('Failed to load courses');
        
        const data = await response.json();
        allCourses = data.courses || [];
    } catch (error) {
        console.error('Error loading courses:', error);
        throw error;
    }
}

/**
 * Load students for admin
 */
function loadStudents() {
    try {
        const registeredUsers = JSON.parse(localStorage.getItem('gentsacademy_registered_users')) || [];
        allStudents = registeredUsers;
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

/**
 * Set up admin tabs
 */
function setupAdminTabs() {
    const tabLinks = document.querySelectorAll('.admin-tab-link');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active states
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tabName}Tab`).classList.add('active');
            
            // Load tab content
            if (tabName === 'courses') {
                displayCoursesManagement();
            } else if (tabName === 'students') {
                displayStudents();
            } else if (tabName === 'certificates') {
                displayCertificates();
            }
        });
    });
}

/**
 * Set up admin event listeners
 */
function setupAdminEventListeners() {
    // Add course button
    const addCourseBtn = document.getElementById('addCourseBtn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', openAddCourseModal);
    }
    
    // Course form
    const courseForm = document.getElementById('courseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', handleSaveCourse);
    }
    
    // Student search
    const studentSearchInput = document.getElementById('studentSearchInput');
    if (studentSearchInput) {
        studentSearchInput.addEventListener('input', debounce(handleStudentSearch, 300));
    }
    
    // Modal close button
    const modal = document.getElementById('courseModal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCourseModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCourseModal();
            }
        });
    }
}

/**
 * Display overview/stats
 */
function displayOverview() {
    // Get stats
    const totalStudents = allStudents.length;
    const totalCourses = allCourses.length;
    
    let totalEnrollments = 0;
    let totalCertificates = 0;
    
    allStudents.forEach(student => {
        const enrolledCourses = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
        totalEnrollments += enrolledCourses.length;
        
        enrolledCourses.forEach(courseId => {
            const certKey = `gentsacademy_certificate_${courseId}`;
            const cert = JSON.parse(localStorage.getItem(certKey));
            if (cert) totalCertificates++;
        });
    });
    
    // Update stats
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('totalCourses').textContent = totalCourses;
    document.getElementById('totalEnrollments').textContent = totalEnrollments;
    document.getElementById('totalCertificates').textContent = totalCertificates;
    
    // Display recent activity
    displayRecentActivity();
}

/**
 * Display recent activity
 */
function displayRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    // Get recent activities
    const activities = [];
    
    allStudents.forEach(student => {
        activities.push({
            type: 'student_joined',
            text: `New student registered: ${student.fullName || student.email}`,
            time: 'Recently'
        });
    });
    
    // Display first 5 activities
    activities.slice(0, 5).forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-text">
                <div class="activity-action">${activity.text}</div>
            </div>
            <div class="activity-time">${activity.time}</div>
        `;
        activityList.appendChild(item);
    });
    
    if (activities.length === 0) {
        activityList.innerHTML = '<p style="color: var(--text-muted);">No recent activity</p>';
    }
}

/**
 * Display courses management
 */
function displayCoursesManagement() {
    const coursesList = document.getElementById('coursesList');
    
    if (!coursesList) return;
    
    coursesList.innerHTML = '';
    
    allCourses.forEach(course => {
        const item = document.createElement('div');
        item.className = 'admin-course-item';
        item.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description.substring(0, 100)}...</p>
            <p style="color: var(--text-muted); font-size: 0.85rem;">
                <strong>Category:</strong> ${course.category} | 
                <strong>Level:</strong> ${course.level} | 
                <strong>Modules:</strong> ${course.modules.length}
            </p>
            <div class="admin-course-actions">
                <button class="btn-edit" data-course-id="${course.id}">✏️ Edit</button>
                <button class="btn-delete" data-course-id="${course.id}">🗑️ Delete</button>
            </div>
        `;
        
        // Add event listeners
        item.querySelector('.btn-edit').addEventListener('click', function() {
            openEditCourseModal(course.id);
        });
        
        item.querySelector('.btn-delete').addEventListener('click', function() {
            if (confirm(`Delete course: ${course.title}?`)) {
                deleteCourse(course.id);
            }
        });
        
        coursesList.appendChild(item);
    });
}

/**
 * Open add course modal
 */
function openAddCourseModal() {
    const modal = document.getElementById('courseModal');
    const title = document.getElementById('courseModalTitle');
    const form = document.getElementById('courseForm');
    
    title.textContent = 'Add New Course';
    form.reset();
    form.dataset.mode = 'add';
    form.dataset.courseId = '';
    
    modal.classList.add('show');
}

/**
 * Open edit course modal
 */
function openEditCourseModal(courseId) {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;
    
    const modal = document.getElementById('courseModal');
    const title = document.getElementById('courseModalTitle');
    const form = document.getElementById('courseForm');
    
    title.textContent = 'Edit Course';
    document.getElementById('courseTitleInput').value = course.title;
    document.getElementById('courseCategoryInput').value = course.category;
    document.getElementById('courseDescriptionInput').value = course.description;
    
    form.dataset.mode = 'edit';
    form.dataset.courseId = courseId;
    
    modal.classList.add('show');
}

/**
 * Close course modal
 */
function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    modal.classList.remove('show');
}

/**
 * Handle save course
 */
function handleSaveCourse(e) {
    e.preventDefault();
    
    const mode = e.target.dataset.mode;
    const title = document.getElementById('courseTitleInput').value;
    const category = document.getElementById('courseCategoryInput').value;
    const description = document.getElementById('courseDescriptionInput').value;
    
    if (!title || !description) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (mode === 'add') {
        // In production, would save to database
        showNotification('Course added successfully (demo mode)', 'success');
    } else {
        // In production, would update in database
        showNotification('Course updated successfully (demo mode)', 'success');
    }
    
    closeCourseModal();
    displayCoursesManagement();
}

/**
 * Delete course
 */
function deleteCourse(courseId) {
    // In production, would delete from database
    showNotification('Course deleted successfully (demo mode)', 'success');
}

/**
 * Display students
 */
function displayStudents() {
    const studentsList = document.getElementById('studentsList');
    const noStudentsMessage = document.getElementById('noStudentsMessage');
    
    if (!studentsList) return;
    
    if (allStudents.length === 0) {
        studentsList.innerHTML = '';
        noStudentsMessage.style.display = 'block';
        return;
    }
    
    noStudentsMessage.style.display = 'none';
    studentsList.innerHTML = '';
    
    allStudents.forEach((student, index) => {
        const item = document.createElement('div');
        item.className = 'admin-student-item';
        item.innerHTML = `
            <div class="student-info">
                <h4>${student.fullName || 'Student ' + (index + 1)}</h4>
                <p class="student-email">${student.email}</p>
            </div>
            <div class="student-status">Active</div>
        `;
        
        studentsList.appendChild(item);
    });
}

/**
 * Handle student search
 */
function handleStudentSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const studentsList = document.getElementById('studentsList');
    
    if (!studentsList) return;
    
    const items = studentsList.querySelectorAll('.admin-student-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
    });
}

/**
 * Display certificates
 */
function displayCertificates() {
    const certificatesList = document.getElementById('certificatesList');
    const noCertificatesMessage = document.getElementById('noCertificatesMessage');
    
    if (!certificatesList) return;
    
    const certificates = [];
    
    // Get all certificates
    for (let courseId in localStorage) {
        if (courseId.startsWith('gentsacademy_certificate_')) {
            const cert = JSON.parse(localStorage.getItem(courseId));
            if (cert) {
                const course = allCourses.find(c => c.id === cert.courseId);
                certificates.push({
                    ...cert,
                    courseName: course ? course.title : 'Unknown Course'
                });
            }
        }
    }
    
    if (certificates.length === 0) {
        certificatesList.innerHTML = '';
        noCertificatesMessage.style.display = 'block';
        return;
    }
    
    noCertificatesMessage.style.display = 'none';
    certificatesList.innerHTML = '';
    
    certificates.forEach(cert => {
        const item = document.createElement('div');
        item.className = 'admin-certificate-item';
        item.innerHTML = `
            <div class="certificate-info">
                <h4>${cert.courseName}</h4>
                <div class="certificate-details">
                    <span class="certificate-detail">ID: ${cert.certificateId}</span>
                    <span class="certificate-detail">Issued: ${formatDate(cert.completionDate)}</span>
                </div>
            </div>
            <div class="certificate-actions">
                <button class="btn-verify" data-cert-id="${cert.certificateId}">✓ Verify</button>
                <button class="btn-revoke" data-cert-id="${cert.certificateId}">✕ Revoke</button>
            </div>
        `;
        
        // Add event listeners
        item.querySelector('.btn-verify').addEventListener('click', function() {
            showNotification(`Certificate ${cert.certificateId} verified`, 'success');
        });
        
        item.querySelector('.btn-revoke').addEventListener('click', function() {
            if (confirm('Revoke this certificate?')) {
                revokeCertificate(cert.certificateId);
                displayCertificates();
            }
        });
        
        certificatesList.appendChild(item);
    });
}

/**
 * Set up admin logout
 */
function setupAdminLogout() {
    const logoutBtn = document.getElementById('adminLogoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('gentsacademy_admin_authenticated');
            window.location.href = 'dashboard.html';
        });
    }
}

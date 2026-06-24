/* ===========================
   COURSE DETAIL PAGE FUNCTIONALITY
   =========================== */

let currentCourse = null;
let currentUser = null;
let courseModules = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeCourseDetailPage();
});

/**
 * Initialize course detail page
 */
async function initializeCourseDetailPage() {
    try {
        // Get course ID from URL
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('id');
        
        if (!courseId) {
            window.location.href = 'courses.html';
            return;
        }
        
        // Load course data
        await loadCourseData(courseId);
        
        // Display course information
        displayCourseDetails();
        
        // Set up enrollment buttons
        setupEnrollmentButtons();
        
        // Check authentication
        checkAuthStatus();
    } catch (error) {
        console.error('Error initializing course detail page:', error);
        showNotification('Error loading course details. Please go back and try again.', 'error');
    }
}

/**
 * Load course data from JSON
 */
async function loadCourseData(courseId) {
    try {
        const response = await fetch('data/courses.json');
        if (!response.ok) throw new Error('Failed to load courses');
        
        const data = await response.json();
        currentCourse = data.courses.find(c => c.id === courseId);
        
        if (!currentCourse) {
            throw new Error('Course not found');
        }
        
        courseModules = currentCourse.modules || [];
    } catch (error) {
        console.error('Error loading course data:', error);
        throw error;
    }
}

/**
 * Display course details
 */
function displayCourseDetails() {
    if (!currentCourse) return;
    
    // Update course header
    document.getElementById('courseTitle').textContent = currentCourse.title;
    document.getElementById('courseDescription').textContent = currentCourse.description;
    document.getElementById('courseLevel').textContent = currentCourse.level;
    document.getElementById('courseDuration').textContent = currentCourse.duration;
    document.getElementById('courseStudents').textContent = `${(currentCourse.students / 1000).toFixed(1)}K`;
    document.getElementById('courseRating').textContent = `${currentCourse.rating} ★`;
    
    // Update badge
    const badge = document.getElementById('courseBadge');
    badge.textContent = currentCourse.category;
    if (currentCourse.category === 'AI') {
        badge.classList.add('ai');
    } else if (currentCourse.category === 'Technology') {
        badge.classList.add('tech');
    }
    
    // Display learning outcomes
    const outcomesList = document.getElementById('learningOutcomesList');
    outcomesList.innerHTML = '';
    currentCourse.learningOutcomes.forEach(outcome => {
        const li = document.createElement('li');
        li.textContent = outcome;
        outcomesList.appendChild(li);
    });
    
    // Display curriculum
    displayCurriculum();
    
    // Update page title
    document.title = `${currentCourse.title} - GentsAcademy`;
}

/**
 * Display curriculum modules
 */
function displayCurriculum() {
    const accordion = document.getElementById('curriculumAccordion');
    accordion.innerHTML = '';
    
    courseModules.forEach((module, index) => {
        const moduleElement = createModuleElement(module, index);
        accordion.appendChild(moduleElement);
    });
}

/**
 * Create a module accordion element
 */
function createModuleElement(module, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'accordion-item';
    
    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.innerHTML = `
        <div class="module-info">
            <h3>Week ${module.week}: ${module.title}</h3>
            <p>${module.description}</p>
        </div>
        <span class="accordion-icon">+</span>
    `;
    
    // Build resources HTML
    const resourcesHTML = module.resources.map(resource => {
        if (typeof resource === 'string') {
            return `<li><span class="resource-icon">📄</span> <span>${resource}</span></li>`;
        } else if (typeof resource === 'object') {
            return `
                <li>
                    <span class="resource-icon">📄</span>
                    <a href="${resource.url}" target="_blank" rel="noopener noreferrer" style="color: #0D1B4B; text-decoration: none; border-bottom: 1px solid #0D1B4B;">
                        ${resource.title}
                    </a>
                </li>
            `;
        }
    }).join('');
    
    // Build quiz HTML
    const quizHTML = module.quiz && module.quiz.length > 0 ? `
        <div class="quiz-section">
            <h4>❓ Quiz & Assessment</h4>
            <div class="quiz-container">
                ${module.quiz.map((q, qIndex) => `
                    <div class="quiz-question" data-question="${qIndex}">
                        <p class="question-text"><strong>Q${qIndex + 1}: ${q.question}</strong></p>
                        ${q.type === 'multiple' ? `
                            <div class="quiz-options">
                                ${q.options.map((opt, optIndex) => `
                                    <label class="quiz-option">
                                        <input type="radio" name="question_${qIndex}" value="${optIndex}">
                                        <span>${opt}</span>
                                    </label>
                                `).join('')}
                            </div>
                        ` : `
                            <textarea class="quiz-answer" placeholder="Type your answer here..." data-question="${qIndex}" style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                        `}
                    </div>
                `).join('')}
                <button class="btn btn-primary" onclick="submitQuiz(${index})">Submit Answers</button>
            </div>
        </div>
    ` : '';
    
    // Build assignment HTML
    const assignmentHTML = module.assignment ? `
        <div class="assignment-section">
            <h4>✏️ Assignment</h4>
            <div class="assignment-box" style="background-color: #f9f9f9; padding: 12px; border-left: 4px solid #0D1B4B; border-radius: 4px; margin: 10px 0;">
                <p>${module.assignment}</p>
                <div style="margin-top: 12px;">
                    <button class="btn btn-secondary" onclick="downloadAssignment(${index})">Download Assignment Brief</button>
                </div>
            </div>
        </div>
    ` : '';
    
    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.innerHTML = `
        <div class="module-content-inner">
            <div class="video-section">
                <h4>📹 Video Lecture (${module.duration})</h4>
                <div class="video-container">
                    <iframe
                        width="100%"
                        height="400"
                        src="${module.videoUrl}"
                        title="${module.videoTitle}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        loading="lazy"
                    ></iframe>
                </div>
            </div>

            <div class="resources-section">
                <h4>📚 Resources & Materials</h4>
                <ul class="resources-list">
                    ${resourcesHTML}
                </ul>
            </div>

            ${assignmentHTML}
            ${quizHTML}

            <div class="module-actions">
                <label class="checkbox-label">
                    <input 
                        type="checkbox" 
                        class="module-checkbox" 
                        data-module="${module.week}"
                        ${isModuleCompleted(module.week) ? 'checked' : ''}
                    >
                    <span>✓ Mark as Complete</span>
                </label>
            </div>
        </div>
    `;
    
    // Toggle accordion
    header.addEventListener('click', function() {
        const isOpen = wrapper.classList.contains('active');
        
        // Close all other accordions
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open this one if it wasn't open
        if (!isOpen) {
            wrapper.classList.add('active');
        }
    });
    
    // Add module completion listener
    const checkbox = content.querySelector('.module-checkbox');
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            handleModuleCompletion(module.week, this.checked);
        });
    }
    
    wrapper.appendChild(header);
    wrapper.appendChild(content);
    
    return wrapper;
}
        });
    }
    
    wrapper.appendChild(header);
    wrapper.appendChild(content);
    
    return wrapper;
}

/**
 * Check if module is completed
 */
function isModuleCompleted(moduleWeek) {
    if (!currentUser) return false;
    
    try {
        const progress = JSON.parse(localStorage.getItem(`gentsacademy_progress_${currentCourse.id}`)) || {};
        return progress[`module_${moduleWeek}`] === true;
    } catch {
        return false;
    }
}

/**
 * Handle module completion
 */
function handleModuleCompletion(moduleWeek, isCompleted) {
    if (!currentUser) {
        showNotification('Please log in to track your progress', 'info');
        return;
    }
    
    try {
        const progressKey = `gentsacademy_progress_${currentCourse.id}`;
        let progress = JSON.parse(localStorage.getItem(progressKey)) || {};
        
        progress[`module_${moduleWeek}`] = isCompleted;
        localStorage.setItem(progressKey, JSON.stringify(progress));
        
        // Update progress bar
        updateProgressBar();
        
        showNotification(isCompleted ? 'Module marked as complete!' : 'Progress updated', 'success');
    } catch (error) {
        console.error('Error updating progress:', error);
        showNotification('Error updating progress', 'error');
    }
}

/**
 * Update progress bar
 */
function updateProgressBar() {
    if (!currentUser || !currentCourse) return;
    
    try {
        const progressKey = `gentsacademy_progress_${currentCourse.id}`;
        const progress = JSON.parse(localStorage.getItem(progressKey)) || {};
        
        const totalModules = courseModules.length;
        const completedModules = Object.values(progress).filter(v => v === true).length;
        const percentage = Math.round((completedModules / totalModules) * 100);
        
        document.getElementById('progressPercent').textContent = `${percentage}%`;
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = `${completedModules} of ${totalModules} modules completed`;
        
        // Show completion message if finished
        if (percentage === 100) {
            showNotification('🎉 Congratulations! You completed this course! Check your dashboard for your certificate.', 'success');
        }
    } catch (error) {
        console.error('Error updating progress bar:', error);
    }
}

/**
 * Set up enrollment buttons
 */
function setupEnrollmentButtons() {
    const enrollBtn = document.getElementById('enrollBtn');
    const continueBtn = document.getElementById('continueBtn');
    const enrollBtnCta = document.getElementById('enrollBtnCta');
    
    enrollBtn.addEventListener('click', handleEnroll);
    continueBtn.addEventListener('click', () => {
        document.getElementById('curriculumAccordion').scrollIntoView({ behavior: 'smooth' });
    });
    enrollBtnCta.addEventListener('click', handleEnroll);
}

/**
 * Handle enrollment
 */
function handleEnroll() {
    if (!currentUser) {
        // Redirect to auth if not logged in
        sessionStorage.setItem('redirectAfterLogin', `course-detail.html?id=${currentCourse.id}`);
        window.location.href = 'auth.html';
        return;
    }
    
    // Add to enrolled courses
    try {
        let enrolledCourses = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
        
        if (!enrolledCourses.includes(currentCourse.id)) {
            enrolledCourses.push(currentCourse.id);
            localStorage.setItem('gentsacademy_enrolled_courses', JSON.stringify(enrolledCourses));
            
            // Show enrolled state
            updateEnrollmentUI();
            
            showNotification('🎉 Successfully enrolled! Start learning now.', 'success');
        } else {
            showNotification('You are already enrolled in this course.', 'info');
        }
    } catch (error) {
        console.error('Error enrolling:', error);
        showNotification('Error enrolling in course', 'error');
    }
}

/**
 * Update enrollment UI
 */
function updateEnrollmentUI() {
    const enrollBtn = document.getElementById('enrollBtn');
    const continueBtn = document.getElementById('continueBtn');
    const enrollBtnCta = document.getElementById('enrollBtnCta');
    const progressContainer = document.getElementById('progressContainer');
    
    if (enrollBtn) {
        enrollBtn.style.display = 'none';
        continueBtn.style.display = 'inline-block';
    }
    
    if (enrollBtnCta) {
        enrollBtnCta.textContent = 'Continue Learning';
        enrollBtnCta.onclick = () => {
            document.getElementById('curriculumAccordion').scrollIntoView({ behavior: 'smooth' });
        };
    }
    
    if (progressContainer) {
        progressContainer.style.display = 'block';
        updateProgressBar();
    }
}

/**
 * Check authentication status
 */
function checkAuthStatus() {
    try {
        const session = localStorage.getItem('gentsacademy_session');
        if (session) {
            currentUser = JSON.parse(session);
            
            // Check if enrolled
            const enrolledCourses = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
            if (enrolledCourses.includes(currentCourse.id)) {
                updateEnrollmentUI();
            }
            
            // Update navbar
            updateNavbarForLoggedInUser(currentUser);
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

/**
 * Submit quiz answers
 */
function submitQuiz(moduleIndex) {
    if (!currentUser) {
        showNotification('Please log in to submit your quiz', 'info');
        return;
    }
    
    const module = courseModules[moduleIndex];
    const answers = [];
    let allAnswered = true;
    
    // Collect answers
    document.querySelectorAll(`[data-question]`).forEach((q) => {
        const qIndex = q.getAttribute('data-question');
        const question = module.quiz[qIndex];
        
        if (question.type === 'multiple') {
            const selected = q.querySelector('input[type="radio"]:checked');
            if (!selected) {
                allAnswered = false;
                return;
            }
            answers.push({
                question: qIndex,
                answer: selected.value,
                isCorrect: parseInt(selected.value) === question.correct
            });
        } else {
            const textarea = q.querySelector('.quiz-answer');
            if (!textarea.value.trim()) {
                allAnswered = false;
                return;
            }
            answers.push({
                question: qIndex,
                answer: textarea.value
            });
        }
    });
    
    if (!allAnswered) {
        showNotification('Please answer all questions before submitting', 'warning');
        return;
    }
    
    // Calculate score for multiple choice
    const multipleChoiceAnswers = answers.filter(a => a.isCorrect !== undefined);
    const score = multipleChoiceAnswers.length > 0 
        ? Math.round((multipleChoiceAnswers.filter(a => a.isCorrect).length / multipleChoiceAnswers.length) * 100)
        : null;
    
    // Store quiz result
    const quizKey = `gentsacademy_quiz_${currentCourse.id}_module_${module.week}`;
    localStorage.setItem(quizKey, JSON.stringify({
        answers: answers,
        score: score,
        completedAt: new Date().toISOString()
    }));
    
    // Show result
    if (score !== null) {
        showNotification(`Quiz submitted! Your score: ${score}%`, score >= 70 ? 'success' : 'warning');
    } else {
        showNotification('Short answer submitted! An instructor will review it.', 'success');
    }
}

/**
 * Download assignment brief as text file
 */
function downloadAssignment(moduleIndex) {
    const module = courseModules[moduleIndex];
    
    const assignmentContent = `
GentsAcademy - Course Assignment Brief
=====================================

Course: ${currentCourse.title}
Module: Week ${module.week} - ${module.title}
Date: ${new Date().toLocaleDateString()}

ASSIGNMENT DESCRIPTION:
${module.assignment}

REQUIREMENTS:
- Complete the assignment as described above
- Submit your work through the course platform
- Assignments should demonstrate practical understanding
- Maximum submission time: 2 weeks from assignment release

GRADING CRITERIA:
- Completeness (30%)
- Correctness (40%)
- Presentation (20%)
- Code Quality/Format (10%)

RESOURCES:
${module.resources.map((r, i) => `${i + 1}. ${typeof r === 'object' ? r.title + ' - ' + r.url : r}`).join('\n')}

VIDEO REFERENCE:
${module.videoTitle}
${module.videoUrl}

Good luck with your assignment!
===========================
GentsAcademy Support Team
    `.trim();
    
    const blob = new Blob([assignmentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GentsAcademy_Assignment_Week${module.week}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Assignment brief downloaded!', 'success');
}

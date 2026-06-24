/* ===========================
   DASHBOARD PAGE FUNCTIONALITY
   =========================== */

let currentUser = null;
let allCourses = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

/**
 * Initialize dashboard
 */
async function initializeDashboard() {
    try {
        // Check authentication
        currentUser = getCurrentUser();
        if (!currentUser) {
            window.location.href = 'auth.html';
            return;
        }
        
        // Display user info
        displayUserInfo();
        
        // Load courses
        await loadCourses();
        
        // Display enrolled courses
        displayEnrolledCourses();
        
        // Display certificates
        displayCertificates();
        
        // Set up tab switching
        setupTabSwitching();
        
        // Set up logout button
        setupLogoutButton();
        
        // Set up settings
        setupSettings();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showNotification('Error loading dashboard. Please refresh.', 'error');
    }
}

/**
 * Display user information
 */
function displayUserInfo() {
    if (!currentUser) return;
    
    document.getElementById('userName').textContent = currentUser.fullName || 'User';
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('settingsName').value = currentUser.fullName || '';
    document.getElementById('settingsEmail').value = currentUser.email;
    
    if (currentUser.createdAt) {
        document.getElementById('settingsJoinDate').value = formatDate(currentUser.createdAt);
    }
}

/**
 * Load courses from JSON
 */
async function loadCourses() {
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
 * Display enrolled courses
 */
function displayEnrolledCourses() {
    const enrolledCoursesList = document.getElementById('enrolledCoursesList');
    const noCoursesMessage = document.getElementById('noCoursesMessage');
    
    if (!enrolledCoursesList) return;
    
    try {
        const enrolledCourseIds = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
        
        if (enrolledCourseIds.length === 0) {
            enrolledCoursesList.innerHTML = '';
            noCoursesMessage.style.display = 'block';
            return;
        }
        
        noCoursesMessage.style.display = 'none';
        enrolledCoursesList.innerHTML = '';
        
        enrolledCourseIds.forEach(courseId => {
            const course = allCourses.find(c => c.id === courseId);
            if (course) {
                const card = createEnrolledCourseCard(course);
                enrolledCoursesList.appendChild(card);
            }
        });
    } catch (error) {
        console.error('Error displaying enrolled courses:', error);
    }
}

/**
 * Create enrolled course card
 */
function createEnrolledCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'enrolled-course-card';
    
    // Get progress
    const progressKey = `gentsacademy_progress_${course.id}`;
    const progress = JSON.parse(localStorage.getItem(progressKey)) || {};
    const totalModules = course.modules.length;
    const completedModules = Object.values(progress).filter(v => v === true).length;
    const progressPercent = Math.round((completedModules / totalModules) * 100);
    
    card.innerHTML = `
        <h3>${course.title}</h3>
        <div class="course-progress-section">
            <div class="progress-label">
                <span>Progress</span>
                <span>${progressPercent}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
        </div>
        <div class="course-meta-info">
            <span>📚 ${course.modules.length} Modules</span>
            <span>✅ ${completedModules} Completed</span>
            <span>⏱ ${course.duration}</span>
        </div>
        <button class="btn btn-secondary continue-btn" data-course-id="${course.id}">Continue Learning</button>
    `;
    
    // Add click handler
    const button = card.querySelector('.continue-btn');
    button.addEventListener('click', function() {
        window.location.href = `course-detail.html?id=${course.id}`;
    });
    
    return card;
}

/**
 * Display certificates
 */
function displayCertificates() {
    const certificatesList = document.getElementById('certificatesList');
    const noCertificatesMessage = document.getElementById('noCertificatesMessage');
    
    if (!certificatesList) return;
    
    try {
        const enrolledCourseIds = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
        const certificates = [];
        
        enrolledCourseIds.forEach(courseId => {
            const course = allCourses.find(c => c.id === courseId);
            if (!course) return;
            
            const progressKey = `gentsacademy_progress_${courseId}`;
            const progress = JSON.parse(localStorage.getItem(progressKey)) || {};
            const totalModules = course.modules.length;
            const completedModules = Object.values(progress).filter(v => v === true).length;
            
            if (completedModules === totalModules && totalModules > 0) {
                const certificateKey = `gentsacademy_certificate_${courseId}`;
                const existingCert = JSON.parse(localStorage.getItem(certificateKey));
                
                if (existingCert) {
                    certificates.push({
                        courseId: courseId,
                        courseName: course.title,
                        completionDate: existingCert.completionDate,
                        certificateId: existingCert.certificateId
                    });
                }
            }
        });
        
        if (certificates.length === 0) {
            certificatesList.innerHTML = '';
            noCertificatesMessage.style.display = 'block';
            return;
        }
        
        noCertificatesMessage.style.display = 'none';
        certificatesList.innerHTML = '';
        
        certificates.forEach(cert => {
            const card = createCertificateCard(cert);
            certificatesList.appendChild(card);
        });
    } catch (error) {
        console.error('Error displaying certificates:', error);
    }
}

/**
 * Create certificate card
 */
function createCertificateCard(certificate) {
    const card = document.createElement('div');
    card.className = 'certificate-card';
    
    const completionDate = formatDate(certificate.completionDate);
    
    card.innerHTML = `
        <div class="certificate-icon">📜</div>
        <div class="certificate-title">Certificate of Completion</div>
        <div class="certificate-course-name">${certificate.courseName}</div>
        <div class="certificate-date">Completed on ${completionDate}</div>
        <div class="certificate-id">ID: ${certificate.certificateId}</div>
        <div class="certificate-actions">
            <button class="btn-certificate download-cert" data-course-id="${certificate.courseId}">📥 Download PDF</button>
            <button class="btn-certificate share-cert" data-course-id="${certificate.courseId}">📤 Share</button>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.download-cert').addEventListener('click', function() {
        downloadCertificate(certificate);
    });
    
    card.querySelector('.share-cert').addEventListener('click', function() {
        shareCertificate(certificate);
    });
    
    return card;
}

/**
 * Download certificate as PDF
 */
function downloadCertificate(certificate) {
    showNotification('Generating professional PDF certificate...', 'info');
    
    // Use jsPDF if available, otherwise fall back to Canvas
    const pdfSuccess = createPDFCertificate(certificate);
    
    if (!pdfSuccess) {
        // Fallback to Canvas-based certificate
        generateAndDownloadPDF(certificate);
    } else {
        showNotification('Certificate downloaded successfully!', 'success');
    }
}

/**
 * Generate PDF certificate
 */
function generateAndDownloadPDF(certificate) {
    // Create a simple certificate using HTML Canvas
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 1200;
        canvas.height = 800;
        
        // Draw background
        ctx.fillStyle = '#0D1B4B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw border
        ctx.strokeStyle = '#C9A84C';
        ctx.lineWidth = 8;
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
        
        // Title
        ctx.fillStyle = '#C9A84C';
        ctx.font = 'bold 60px "Playfair Display", serif';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Completion', canvas.width / 2, 150);
        
        // Decorative line
        ctx.fillStyle = '#C9A84C';
        ctx.fillRect(200, 200, canvas.width - 400, 2);
        
        // Text content
        ctx.fillStyle = '#F5F5F5';
        ctx.font = 'normal 32px Inter, sans-serif';
        ctx.fillText('This certifies that', canvas.width / 2, 280);
        
        ctx.fillStyle = '#C9A84C';
        ctx.font = 'bold 48px "Playfair Display", serif';
        ctx.fillText(currentUser.fullName || 'Student', canvas.width / 2, 380);
        
        ctx.fillStyle = '#F5F5F5';
        ctx.font = 'normal 32px Inter, sans-serif';
        ctx.fillText('has successfully completed', canvas.width / 2, 450);
        
        ctx.fillStyle = '#C9A84C';
        ctx.font = 'bold 36px "Playfair Display", serif';
        ctx.textAlign = 'center';
        const maxWidth = canvas.width - 200;
        wrapText(ctx, certificate.courseName, canvas.width / 2, 540, maxWidth, 50);
        
        ctx.fillStyle = '#F5F5F5';
        ctx.font = 'normal 24px Inter, sans-serif';
        ctx.fillText('Completion Date: ' + formatDate(certificate.completionDate), canvas.width / 2, 680);
        
        ctx.fillStyle = '#9A9AB0';
        ctx.font = 'normal 16px Inter, sans-serif';
        ctx.fillText('Certificate ID: ' + certificate.certificateId, canvas.width / 2, 740);
        
        // Download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GentsAcademy_Certificate_${certificate.certificateId}.png`;
            a.click();
            URL.revokeObjectURL(url);
            showNotification('Certificate downloaded successfully!', 'success');
        });
    } catch (error) {
        console.error('Error generating certificate:', error);
        showNotification('Error generating certificate. Please try again.', 'error');
    }
}

/**
 * Wrap text in canvas
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    
    ctx.fillText(line, x, y);
}

/**
 * Share certificate
 */
function shareCertificate(certificate) {
    const shareText = `I just earned my GentsAcademy certificate for "${certificate.courseName}"! 🎓 Join me and learn for free at GentsAcademy.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'GentsAcademy Certificate',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText);
        showNotification('Share text copied to clipboard!', 'success');
    }
}

/**
 * Set up tab switching
 */
function setupTabSwitching() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active states
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
}

/**
 * Set up logout button
 */
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                clearSession();
                window.location.href = 'index.html';
            }
        });
    }
}

/**
 * Set up settings
 */
function setupSettings() {
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const notificationsToggle = document.getElementById('notificationsToggle');
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('Are you sure? This will permanently delete your account and all data. This cannot be undone.')) {
                if (confirm('Type "DELETE" to confirm permanent deletion.')) {
                    const confirmation = prompt('Type DELETE to confirm:');
                    if (confirmation === 'DELETE') {
                        // Delete account
                        localStorage.removeItem('gentsacademy_session');
                        localStorage.removeItem('gentsacademy_user');
                        localStorage.removeItem('gentsacademy_enrolled_courses');
                        localStorage.removeItem('gentsacademy_registered_users');
                        
                        showNotification('Account deleted. Redirecting...', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    }
                }
            }
        });
    }
    
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', function() {
            const prefs = JSON.parse(localStorage.getItem('gentsacademy_preferences')) || {};
            prefs.notifications = this.checked;
            localStorage.setItem('gentsacademy_preferences', JSON.stringify(prefs));
            showNotification('Settings saved!', 'success');
        });
    }
}

/**
 * Watch for certificate completion
 */
setInterval(function() {
    if (!currentUser) return;
    
    try {
        const enrolledCourseIds = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
        
        enrolledCourseIds.forEach(courseId => {
            const course = allCourses.find(c => c.id === courseId);
            if (!course) return;
            
            const progressKey = `gentsacademy_progress_${courseId}`;
            const progress = JSON.parse(localStorage.getItem(progressKey)) || {};
            const totalModules = course.modules.length;
            const completedModules = Object.values(progress).filter(v => v === true).length;
            
            // Check if course just completed
            if (completedModules === totalModules && totalModules > 0) {
                const certificateKey = `gentsacademy_certificate_${courseId}`;
                const existingCert = JSON.parse(localStorage.getItem(certificateKey));
                
                if (!existingCert) {
                    // Generate certificate
                    const certificate = {
                        courseId: courseId,
                        completionDate: new Date().toISOString(),
                        certificateId: generateCertificateId()
                    };
                    
                    localStorage.setItem(certificateKey, JSON.stringify(certificate));
                    
                    // Refresh certificates display
                    displayCertificates();
                    showNotification(`🎉 Congratulations! You earned a certificate for "${course.title}"!`, 'success');
                }
            }
        });
    } catch (error) {
        console.error('Error checking certificates:', error);
    }
}, 5000); // Check every 5 seconds

/**
 * Generate certificate ID
 */
function generateCertificateId() {
    return 'CERT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

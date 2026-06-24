/* ===========================
   CERTIFICATE GENERATION UTILITIES
   =========================== */

/**
 * Generate certificate (generic function for reuse)
 */
function generateCertificate(user, course, certificateId) {
    return {
        studentName: user.fullName,
        courseName: course.title,
        completionDate: new Date().toISOString(),
        certificateId: certificateId,
        courseId: course.id
    };
}

/**
 * Create a professional PDF certificate using jsPDF
 */
function createPDFCertificate(certificate) {
    try {
        if (typeof jsPDF === 'undefined') {
            console.warn('jsPDF not loaded, falling back to canvas');
            generateCanvasCertificate(certificate);
            return;
        }
        
        // Use jsPDF to create professional certificate
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Background
        doc.setFillColor(13, 27, 75);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Outer border
        doc.setDrawColor(201, 168, 76);
        doc.setLineWidth(1);
        doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
        
        // Inner decorative border
        doc.setLineWidth(0.3);
        doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
        
        // Title
        doc.setFont('Playfair Display', 'bold');
        doc.setFontSize(48);
        doc.setTextColor(201, 168, 76);
        doc.text('Certificate of Completion', pageWidth / 2, 35, { align: 'center' });
        
        // Decorative line
        doc.setDrawColor(201, 168, 76);
        doc.setLineWidth(0.8);
        doc.line(25, 42, pageWidth - 25, 42);
        
        // Certificate body
        doc.setFont('Inter', 'normal');
        doc.setFontSize(18);
        doc.setTextColor(245, 245, 245);
        doc.text('This certifies that', pageWidth / 2, 60, { align: 'center' });
        
        // Student name
        doc.setFont('Playfair Display', 'bold');
        doc.setFontSize(42);
        doc.setTextColor(201, 168, 76);
        doc.text(certificate.studentName, pageWidth / 2, 80, { align: 'center' });
        
        // Middle text
        doc.setFont('Inter', 'normal');
        doc.setFontSize(18);
        doc.setTextColor(245, 245, 245);
        doc.text('has successfully completed', pageWidth / 2, 100, { align: 'center' });
        
        // Course name
        doc.setFont('Playfair Display', 'bold');
        doc.setFontSize(32);
        doc.setTextColor(201, 168, 76);
        const courseTitle = certificate.courseName;
        const splitCourse = doc.splitTextToSize(courseTitle, pageWidth - 40);
        doc.text(splitCourse, pageWidth / 2, 120, { align: 'center' });
        
        // Bottom decorative line
        doc.setDrawColor(201, 168, 76);
        doc.setLineWidth(0.8);
        doc.line(25, 135, pageWidth - 25, 135);
        
        // Completion date and certificate ID
        doc.setFont('Inter', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(154, 154, 176);
        
        const completionDate = new Date(certificate.completionDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        doc.text(`Date of Completion: ${completionDate}`, pageWidth / 2, 150, { align: 'center' });
        doc.text(`Certificate ID: ${certificate.certificateId}`, pageWidth / 2, 158, { align: 'center' });
        
        // Footer
        doc.setFont('Inter', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(154, 154, 176);
        doc.text('GentsAcademy - Free Online Learning Platform', pageWidth / 2, 170, { align: 'center' });
        doc.text('Building the future of African tech education | Serving Liberia', pageWidth / 2, 176, { align: 'center' });
        
        // Save PDF
        doc.save(`GentsAcademy_Certificate_${certificate.certificateId}.pdf`);
        
        return true;
    } catch (error) {
        console.error('PDF generation error:', error);
        return false;
    }
}

/**
 * Fallback: Generate certificate as PNG using Canvas
 */
function generateCanvasCertificate(certificate) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 1200;
        canvas.height = 800;
        
        // Background
        ctx.fillStyle = '#0D1B4B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border
        ctx.strokeStyle = '#C9A84C';
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // Inner border
        ctx.lineWidth = 1;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
        
        // Title
        ctx.font = 'bold 60px Playfair Display, serif';
        ctx.fillStyle = '#C9A84C';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Completion', canvas.width / 2, 120);
        
        // Decorative line
        ctx.strokeStyle = '#C9A84C';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(200, 150);
        ctx.lineTo(canvas.width - 200, 150);
        ctx.stroke();
        
        // Body text
        ctx.font = '28px Inter, sans-serif';
        ctx.fillStyle = '#F5F5F5';
        ctx.fillText('This certifies that', canvas.width / 2, 250);
        
        // Student name
        ctx.font = 'bold 48px Playfair Display, serif';
        ctx.fillStyle = '#C9A84C';
        ctx.fillText(certificate.studentName, canvas.width / 2, 340);
        
        // Completion text
        ctx.font = '28px Inter, sans-serif';
        ctx.fillStyle = '#F5F5F5';
        ctx.fillText('has successfully completed the course', canvas.width / 2, 420);
        
        // Course name
        ctx.font = 'bold 36px Playfair Display, serif';
        ctx.fillStyle = '#C9A84C';
        ctx.fillText(certificate.courseName, canvas.width / 2, 500);
        
        // Decorative line
        ctx.strokeStyle = '#C9A84C';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(200, 530);
        ctx.lineTo(canvas.width - 200, 530);
        ctx.stroke();
        
        // Bottom details
        ctx.font = '16px Inter, sans-serif';
        ctx.fillStyle = '#9A9AB0';
        ctx.textAlign = 'center';
        
        const completionDate = new Date(certificate.completionDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        ctx.fillText(`Date of Completion: ${completionDate}`, canvas.width / 2, 630);
        ctx.fillText(`Certificate ID: ${certificate.certificateId}`, canvas.width / 2, 660);
        ctx.fillText('GentsAcademy - Free Online Learning Platform | Serving Liberia', canvas.width / 2, 720);
        
        // Download as PNG
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GentsAcademy_Certificate_${certificate.certificateId}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
    } catch (error) {
        console.error('Canvas certificate error:', error);
    }
}

/**
 * Verify certificate authenticity
 */
function verifyCertificate(certificateId) {
    try {
        // Search through all certificates
        const enrolledCourses = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
        
        for (let courseId of enrolledCourses) {
            const certificateKey = `gentsacademy_certificate_${courseId}`;
            const cert = JSON.parse(localStorage.getItem(certificateKey));
            
            if (cert && cert.certificateId === certificateId) {
                return {
                    valid: true,
                    certificate: cert
                };
            }
        }
        
        return { valid: false };
    } catch (error) {
        console.error('Error verifying certificate:', error);
        return { valid: false };
    }
}

/**
 * Get certificate by ID
 */
function getCertificateById(certificateId) {
    try {
        const enrolledCourses = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
        
        for (let courseId of enrolledCourses) {
            const certificateKey = `gentsacademy_certificate_${courseId}`;
            const cert = JSON.parse(localStorage.getItem(certificateKey));
            
            if (cert && cert.certificateId === certificateId) {
                return cert;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error getting certificate:', error);
        return null;
    }
}

/**
 * Get all certificates for a user
 */
function getUserCertificates(userId) {
    try {
        const enrolledCourses = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
        const certificates = [];
        
        for (let courseId of enrolledCourses) {
            const certificateKey = `gentsacademy_certificate_${courseId}`;
            const cert = JSON.parse(localStorage.getItem(certificateKey));
            
            if (cert) {
                certificates.push(cert);
            }
        }
        
        return certificates;
    } catch (error) {
        console.error('Error getting certificates:', error);
        return [];
    }
}

/**
 * Issue certificate to student
 */
function issueCertificate(studentId, courseId) {
    try {
        // Generate certificate
        const certificate = {
            studentId: studentId,
            courseId: courseId,
            certificateId: generateUniqueCertificateId(),
            issuedDate: new Date().toISOString(),
            verified: true
        };
        
        // Store certificate
        const certificateKey = `gentsacademy_certificate_${courseId}`;
        localStorage.setItem(certificateKey, JSON.stringify(certificate));
        
        return certificate;
    } catch (error) {
        console.error('Error issuing certificate:', error);
        return null;
    }
}

/**
 * Revoke certificate
 */
function revokeCertificate(certificateId) {
    try {
        const enrolledCourses = JSON.parse(localStorage.getItem('gentsacademy_enrolled_courses')) || [];
        
        for (let courseId of enrolledCourses) {
            const certificateKey = `gentsacademy_certificate_${courseId}`;
            const cert = JSON.parse(localStorage.getItem(certificateKey));
            
            if (cert && cert.certificateId === certificateId) {
                localStorage.removeItem(certificateKey);
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error revoking certificate:', error);
        return false;
    }
}

/**
 * Generate unique certificate ID
 */
function generateUniqueCertificateId() {
    return 'GA' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/**
 * Export certificate as image
 */
function exportCertificateAsImage(certificateId, filename) {
    // Implementation would convert canvas to image
    console.log('Exporting certificate:', certificateId);
}

/**
 * Share certificate link
 */
function generateCertificateLink(certificateId) {
    // In production, this would generate a shareable link
    const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
    return `${baseUrl}/verify-certificate.html?id=${certificateId}`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadAdminCourses();
});

async function loadAdminCourses() {
    try {
        const response = await fetch('data/courses.json');
        const data = await response.json();
        const tableBody = document.getElementById('admin-courses-table');
        
        if (!tableBody) return;

        tableBody.innerHTML = data.courses.map(course => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 1.2rem; font-weight: 600;">${course.title}</td>
                <td style="padding: 1.2rem;"><span style="background: #eee; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem;">${course.category}</span></td>
                <td style="padding: 1.2rem;">${course.students.toLocaleString()}</td>
                <td style="padding: 1.2rem;"><i class="fas fa-star text-lib-gold"></i> ${course.rating}</td>
                <td style="padding: 1.2rem;"><span style="color: #28a745;"><i class="fas fa-check-circle"></i> Active</span></td>
                <td style="padding: 1.2rem;">
                    <button style="background: none; border: none; color: var(--lib-blue); cursor: pointer; margin-right: 10px;"><i class="fas fa-edit"></i></button>
                    <button style="background: none; border: none; color: var(--lib-red); cursor: pointer;"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading admin courses:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const topbarItem = document.querySelector('.topbar-item');
    const currentPath = window.location.pathname;

    const activePaths = ['/', '/settings'];
    if (activePaths.includes(currentPath)) {
        topbarItem.classList.add('active');
    }
});
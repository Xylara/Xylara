document.addEventListener('DOMContentLoaded', () => {
    const topbarItems = document.querySelectorAll('.topbar-item');
    const currentPath = window.location.pathname;

    topbarItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
        }
    });
});
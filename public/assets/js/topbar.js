document.addEventListener('DOMContentLoaded', () => {
    const topbarItem = document.querySelector('.topbar-item');
    const currentPath = window.location.pathname;

    if (currentPath === '/') {
        topbarItem.classList.add('active');
    }

    window.addEventListener('click', () => {
        const currentPath = window.location.pathname;
        topbarItem.classList.toggle('active', currentPath === '/');
    });
});
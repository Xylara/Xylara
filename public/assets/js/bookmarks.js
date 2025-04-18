document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const bookmarkContainer = document.querySelector('.bookmark-container');
    const mainContent = document.querySelector('.main-content');
    
    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-open');
        bookmarkContainer.classList.toggle('sidebar-open');
        mainContent.classList.toggle('sidebar-open');
        document.body.classList.toggle('sidebar-open');
    }
    
    document.querySelector('.bookmark-link').addEventListener('click', function(e) {
        e.preventDefault();
        toggleSidebar();
    });
});
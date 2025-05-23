document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const bookmarkContainer = document.querySelector('.bookmark-container');
    const mainContent = document.querySelector('.main-content');
    const addBookmarkBtn = document.querySelector('.add-bookmark');
    const bookmarkForm = document.querySelector('.bookmark-form');
    const saveBtn = document.querySelector('.save-bookmark');
    const cancelBtn = document.querySelector('.cancel-form');
    const bookmarkName = document.getElementById('bookmark-name');
    const bookmarkUrl = document.getElementById('bookmark-url');

    function loadBookmarks() {
        const bookmarks = localStorage.getItem('bookmarks');
        if (bookmarks) {
            JSON.parse(bookmarks).forEach(bookmark => {
                addBookmark(bookmark.name, bookmark.url);
            });
        }
    }

    function saveBookmarks() {
        const bookmarksArray = Array.from(sidebar.querySelectorAll('.bookmark')).map(bookmark => ({
            name: bookmark.querySelector('.bookmark-name').textContent,
            url: bookmark.dataset.url
        }));
        localStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));
    }

    function addBookmark(name, url) {
        const bookmark = document.createElement('div');
        bookmark.className = 'bookmark';
        bookmark.innerHTML = `
            <span class="bookmark-name">${name}</span>
            <span class="bookmark-remove">×</span>
        `;
        bookmark.dataset.url = url;
    
        bookmark.querySelector('.bookmark-remove').addEventListener('click', function() {
            bookmark.remove();
            saveBookmarks();
        });
    
        bookmark.addEventListener('click', function(event) { 
            handleBookmarkClick(event, this.dataset.url);
        });
    
        sidebar.appendChild(bookmark);
        saveBookmarks();
    }

    loadBookmarks();
    
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
    
    addBookmarkBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        bookmarkForm.classList.add('active');
    });
    
    saveBtn.addEventListener('click', function() {
        const name = bookmarkName.value.trim();
        const url = bookmarkUrl.value.trim();
        
        if (name && url) {
            addBookmark(name, url);
            bookmarkForm.classList.remove('active');
            bookmarkName.value = '';
            bookmarkUrl.value = '';
        }
    });
    
    cancelBtn.addEventListener('click', function() {
        bookmarkForm.classList.remove('active');
        bookmarkName.value = '';
        bookmarkUrl.value = '';
    });
    
    function handleBookmarkClick(event, url) {
        event.preventDefault();
        const proxyType = localStorage.getItem("proxy") || "uv";
        
        if (proxyType === "sj") {
            sjEncode(url);
        } else {
            uvEncode(url);
        }
    }
    
    async function uvEncode(url) {
        const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
        localStorage.setItem("url", encodedUrl); 
        window.location.href = "/proccy";
    }
    
    async function sjEncode(url) {
        const encodedUrl = "/scram/service/" + encodeURIComponent(url);
        localStorage.setItem("url", encodedUrl); 
        window.location.href = "/proccy";
    }
    
    document.addEventListener('click', function(e) {
        if (e.target === bookmarkForm) {
            bookmarkForm.classList.remove('active');
            bookmarkName.value = '';
            bookmarkUrl.value = '';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookmarkForm.classList.contains('active')) {
            bookmarkForm.classList.remove('active');
            bookmarkName.value = '';
            bookmarkUrl.value = '';
        }
    });
});
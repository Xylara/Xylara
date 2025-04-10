document.addEventListener('DOMContentLoaded', function() {
    const proxySelector = document.getElementById('proxySelector');
    const proxyValue = localStorage.getItem('proxy');

    if (proxyValue) {
        proxySelector.value = proxyValue;
    }

    proxySelector.addEventListener('change', function() {
        localStorage.setItem('proxy', this.value);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const proxySelector = document.getElementById('proxySelector');
    const transportSelector = document.getElementById('transportSelector');
    const searchEngineSelector = document.getElementById('searchEngineSelector');

    
    const proxyValue = localStorage.getItem('proxy') || 'uv';
    const transportValue = localStorage.getItem('transport') || 'epoxy';
    const engineValue = localStorage.getItem('searchEngine') || 'duckduckgo';
    
    proxySelector.value = proxyValue;
    transportSelector.value = transportValue;
    searchEngineSelector.value = engineValue;


    proxySelector.addEventListener('change', function() {
        localStorage.setItem('proxy', this.value);
    });

    transportSelector.addEventListener('change', function() {
        localStorage.setItem('transport', this.value);
    });

    searchEngineSelector.addEventListener('change', function() {
        localStorage.setItem('searchEngine', this.value);
    });
});
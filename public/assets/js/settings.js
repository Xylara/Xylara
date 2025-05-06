document.addEventListener('DOMContentLoaded', function() {
    const proxySelector = document.getElementById('proxySelector');
    const transportSelector = document.getElementById('transportSelector');
    const searchEngineSelector = document.getElementById('searchEngineSelector');
    const adblockSelector = document.getElementById('adblockSelector');

    const proxyValue = localStorage.getItem('proxy') || 'uv';
    const transportValue = localStorage.getItem('transport') || 'epoxy';
    const engineValue = localStorage.getItem('searchEngine') || 'duckduckgo';
    const adblockValue = localStorage.getItem('adblocker') || 'disabled';

    proxySelector.value = proxyValue;
    transportSelector.value = transportValue;
    searchEngineSelector.value = engineValue;
    adblockSelector.value = adblockValue;

    proxySelector.addEventListener('change', function() {
        localStorage.setItem('proxy', this.value);
    });

    transportSelector.addEventListener('change', function() {
        localStorage.setItem('transport', this.value);
    });

    searchEngineSelector.addEventListener('change', function() {
        localStorage.setItem('searchEngine', this.value);
    });

    adblockSelector.addEventListener('change', function() {
        const enabled = this.value === 'enabled';
        localStorage.setItem('adblocker', this.value);
        
        fetch('/api/adblocker', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ enabled }),
        });
    });
});
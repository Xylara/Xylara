document.addEventListener('DOMContentLoaded', function() {
    const proxySelector = document.getElementById('proxySelector');
    const transportSelector = document.getElementById('transportSelector');
    
    const proxyValue = localStorage.getItem('proxy') || 'uv';
    const transportValue = localStorage.getItem('transport') || 'epoxy';
    
    proxySelector.value = proxyValue;
    transportSelector.value = transportValue;

    proxySelector.addEventListener('change', function() {
        localStorage.setItem('proxy', this.value);
    });

    transportSelector.addEventListener('change', function() {
        localStorage.setItem('transport', this.value);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage for saved theme, default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply the saved theme on page load
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Set the correct icon based on the theme
    toggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    toggleBtn.addEventListener('click', () => {
        // Toggle between light and dark
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        
        // Update the attribute and local storage
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update the button icon
        toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
});
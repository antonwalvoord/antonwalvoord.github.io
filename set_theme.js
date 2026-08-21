function load_theme() {
    const validThemes = ['dark', 'light', 'dawn'];
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = validThemes.includes(saved) ? saved : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
}

load_theme();
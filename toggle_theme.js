const root = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

toggleBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  if (current === 'dark') {
    next = 'light';
  } else if (current === 'light') {
    next = 'dawn';
  } else {
    next = 'dark';
  }
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

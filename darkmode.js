document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('darkModeToggle');
  const body = document.body;
  const icon = toggleBtn.querySelector('i');

  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode'); // attiva/disattiva dark mode

    // Cambia icona tra luna e sole
    if (body.classList.contains('dark-mode')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });
});


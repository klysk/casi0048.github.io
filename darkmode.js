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
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Facoltativo: salva la scelta nel localStorage per ricordarla
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.removeItem('darkMode');
    }
  });

  // Al caricamento della pagina, verifica se dark mode è abilitato
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
  }
});




  // Mobile menu toggle
  const toggle = document.getElementById('mobile-menu');
  const navContainer = document.getElementById('nav-container');
  const navItems = document.querySelectorAll('.nav-links > li');

  toggle.addEventListener('click', () => {
    navContainer.classList.toggle('open');
  });

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        if (item.querySelector('.dropdown-content')) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      }
    });
  });

  // Ricerca reale
  const searchInput = document.getElementById('search-input');
  const resultsBox = document.getElementById('search-results');

  // Lista dati da cercare: testo e link
  const items = [
    {name: "Incipit", href: "#"},
    {name: "Filosofia antica", href: "#"},
    {name: "Talete", href: "filosofi/talete.html"},
    {name: "Anassimandro", href: "#"},
    {name: "Parmenide", href: "#"},
    {name: "Filosofia classica", href: "#"},
    {name: "Socrate", href: "#"},
    {name: "Platone", href: "#"},
    {name: "Aristotele", href: "#"},
    {name: "Medioevo / Patristica", href: "#"},
    {name: "Filosofia moderna", href: "#"},
    {name: "Cartesio", href: "#"},
    {name: "Spinoza", href: "#"},
    {name: "Kant", href: "#"},
    {name: "Filosofia contemporanea", href: "#"},
    {name: "Nietzsche", href: "#"},
    {name: "Heidegger", href: "#"},
    {name: "Foucault", href: "#"},
    {name: "Contatti", href: "#"}
  ];

  function filterItems(query) {
    if (!query) {
      resultsBox.style.display = 'none';
      resultsBox.innerHTML = '';
      return;
    }
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    if (filtered.length === 0) {
      resultsBox.innerHTML = '<div class="no-results">Nessun risultato</div>';
      resultsBox.style.display = 'block';
      return;
    }
    resultsBox.innerHTML = filtered.map(item => 
      `<a href="${item.href}" role="option" tabindex="0">${item.name}</a>`
    ).join('');
    resultsBox.style.display = 'block';
  }

  searchInput.addEventListener('input', e => {
    filterItems(e.target.value);
  });

  // Chiudi risultati se clicco fuori
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) {
      resultsBox.style.display = 'none';
    }
  });

  // Supporto tastiera per selezione risultati (opzionale)
  resultsBox.addEventListener('keydown', e => {
    if (e.key === "Escape") {
      resultsBox.style.display = 'none';
      searchInput.focus();
    }
  });

function toggleIncipit(element) {
  element.classList.toggle("attivo");
}
document.querySelectorAll('*').forEach(el => {
  if(el.scrollWidth > window.innerWidth) console.log(el);
});

  const bottone = document.getElementById('toggleIncipit');
  const contenuto = document.getElementById('incipitContenuto');
  const freccia = bottone.querySelector('.freccia');

  bottone.addEventListener('click', () => {
    contenuto.classList.toggle('open');
    freccia.classList.toggle('ruotata');
  });



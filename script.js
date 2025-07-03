document.addEventListener('DOMContentLoaded', function () {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', function () {
      const menu = this.querySelector('.submenu, .mega-menu');
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transform = 'translateY(5px)';
      menu.style.pointerEvents = 'auto';
    });

    dropdown.addEventListener('mouseleave', function () {
      const menu = this.querySelector('.submenu, .mega-menu');
      setTimeout(() => {
        if (!this.matches(':hover') && !menu.matches(':hover')) {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.transform = 'translateY(0)';
          menu.style.pointerEvents = 'none';
        }
      }, 100);
    });

    const submenus = dropdown.querySelectorAll('.submenu, .mega-menu');
    submenus.forEach(menu => {
      menu.addEventListener('mouseenter', function () {
        this.style.opacity = '1';
        this.style.visibility = 'visible';
        this.style.transform = 'translateY(5px)';
      });

      menu.addEventListener('mouseleave', function () {
        this.style.opacity = '0';
        this.style.visibility = 'hidden';
        this.style.transform = 'translateY(0)';
      });
    });
  });
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        hideAllSubmenus();
    }
});
  document.querySelector('.search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = this.querySelector('input').value.trim();
    if (query) {
      alert(`Ricerca implementata: "${query}"\n\nQuesta è una demo. Nella pratica, collegheresti un sistema di ricerca reale.`);
    }
  });

  const title = document.querySelector('.saluto');
  title.addEventListener('mouseover', () => {
    title.style.animation = 'echoEffect 1s ease-out';
  });
  title.addEventListener('mouseout', () => {
    title.style.animation = '';
  });
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

window.addEventListener('scroll', () => {
  document.body.classList.toggle('scrolled', window.scrollY > 50);
});
document.querySelectorAll('.philosopher-link').forEach(item => {
    item.addEventListener('mouseenter', (e) => {
        const quote = e.target.dataset.quote;
        const tooltip = document.createElement('div');
        tooltip.className = 'platonic-dialog';
        tooltip.innerHTML = `
            <div class="speaker">${e.target.textContent}:</div>
            <div class="quote">"${quote}"</div>
        `;
        document.body.appendChild(tooltip);
        
        // Posiziona il tooltip logicamente
        // Anima con movimento "a scomparsa"
    });
});
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
// Trasforma la ricerca in un'intervista guidata
function socraticSearch() {
    const questions = [
        "Cosa cerchi esattamente?",
        "Perché pensi che questo concetto sia importante?",
        "Quale filosofo potrebbe aiutarti?"
    ];
    // Mostra le domande sequenzialmente
}
document.addEventListener('DOMContentLoaded', function() {
    const titolo = document.getElementById('echi-titolo-principale');
    if (titolo) {
        titolo.setAttribute('data-text', titolo.textContent);
    }
});
document.getElementById('generate-quote').addEventListener('click', function() {
    const quotes = [
        { text: "Conosci te stesso", author: "Socrate" },
        { text: "Penso, dunque sono", author: "Cartesio" }
    ];
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-display').innerHTML = 
        `<p>"${random.text}"</p><small>— ${random.author}</small>`;
});
<script>
  document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
        banner.classList.add('show');
      }, 1000);
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      banner.classList.remove('show');
    });
  });
</script>


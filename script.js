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

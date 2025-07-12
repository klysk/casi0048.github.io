// menu.js

document.querySelectorAll('.menu-btn').forEach(button => {
  button.addEventListener('click', () => {
    const parentLi = button.parentElement;

    // Chiudo tutti i dropdown aperti tranne questo
    document.querySelectorAll('.dropdown.open').forEach(openLi => {
      if (openLi !== parentLi) {
        openLi.classList.remove('open');
        openLi.querySelector('.menu-btn').setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle dropdown corrente
    const isOpen = parentLi.classList.toggle('open');
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});

// Chiudo menu se clicco fuori
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown.open').forEach(openLi => {
      openLi.classList.remove('open');
      openLi.querySelector('.menu-btn').setAttribute('aria-expanded', 'false');
    });
  }
});



<script>
  // Toggle mobile menu
  const menuToggle = document.getElementById('menu-toggle');
  const mainMenu = document.getElementById('main-menu');

  menuToggle.addEventListener('click', () => {
    mainMenu.classList.toggle('open');
  });

  // Toggle dropdowns on click
  document.querySelectorAll('button.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const isOpen = parent.classList.contains('open');

      // Close all dropdowns
      document.querySelectorAll('li.dropdown').forEach(li => li.classList.remove('open'));
      // Toggle current
      if (!isOpen) {
        parent.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdown if click outside
  document.addEventListener('click', e => {
    if (!e.target.closest('li.dropdown')) {
      document.querySelectorAll('li.dropdown').forEach(li => {
        li.classList.remove('open');
        const btn = li.querySelector('button.menu-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
// Seleziona tutti i bottoni dropdown del menu
const menuButtons = document.querySelectorAll('.menu-btn');

menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Toggle aria-expanded true/false
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);

    // Chiudi tutti gli altri menu aperti (imposta aria-expanded false)
    menuButtons.forEach(btn => {
      if (btn !== button) {
        btn.setAttribute('aria-expanded', false);
      }
    });
  });
});

// Chiude i dropdown se si clicca fuori dal menu
document.addEventListener('click', (event) => {
  menuButtons.forEach(button => {
    const megaMenu = button.nextElementSibling;
    if (
      !button.contains(event.target) &&
      megaMenu &&
      !megaMenu.contains(event.target)
    ) {
      button.setAttribute('aria-expanded', false);
    }
  });
});

</script>

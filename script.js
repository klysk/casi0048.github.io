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
</script>

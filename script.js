// Inizializza Particles.js
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#D4AF37" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5, "random": true },
    "size": { "value": 3, "random": true },
    "line_linked": { "enable": true, "distance": 150, "color": "#00E5FF", "opacity": 0.4, "width": 1 },
    "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "repulse" },
      "onclick": { "enable": true, "mode": "push" }
    }
  }
});

// Animazioni GSAP
document.addEventListener('DOMContentLoaded', () => {
  // Animazione titolo (lettera per lettera)
  gsap.to(".letter", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.05,
    delay: 0.5,
    ease: "power3.out"
  });

  // Animazione sottotitolo e pulsante
  gsap.to(".hero__subtitle, .hero__cta", {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 1.8,
    ease: "elastic.out(1, 0.5)"
  });

  // Effetto hover sul pulsante
  document.querySelector(".hero__cta").addEventListener("mouseenter", () => {
    gsap.to(".hero__cta", { scale: 1.05, duration: 0.3 });
  });
  document.querySelector(".hero__cta").addEventListener("mouseleave", () => {
    gsap.to(".hero__cta", { scale: 1, duration: 0.3 });
  });
});
// Animazione timeline al scroll
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".timeline__item").forEach(item => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 80%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    x: -50,
    duration: 1
  });
});
// Gestione completa del Cookie Banner
document.addEventListener('DOMContentLoaded', function() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const rejectBtn = document.getElementById('reject-cookies');
  const customizeBtn = document.getElementById('customize-cookies');

  // Controlla se l'utente ha già scelto
  if (!localStorage.getItem('cookieChoice')) {
    banner.style.display = 'block';
  }

  // Gestione pulsanti
  acceptBtn.addEventListener('click', function() {
    localStorage.setItem('cookieChoice', 'accepted');
    banner.style.display = 'none';
    // Qui puoi caricare tutti i cookie
  });

  rejectBtn.addEventListener('click', function() {
    localStorage.setItem('cookieChoice', 'rejected');
    banner.style.display = 'none';
    // Blocca cookie non essenziali
  });

  customizeBtn.addEventListener('click', function() {
    // Apri un modal personalizzato (esempio base)
    alert("Personalizzazione cookie: implementa qui le tue preferenze");
    // Per una versione avanzata, crea un pannello con toggle
  });
});
customizeBtn.addEventListener('click', function() {
  document.getElementById('cookie-modal').style.display = 'block';
});
// cookie-script.js
document.addEventListener('DOMContentLoaded', function() {
  const banner = document.getElementById('cookie-banner');
  
  // Mostra il banner solo se non è stata ancora fatta una scelta
  if (!getCookiePreference()) {
    banner.style.display = 'block';
  }

  // Gestione pulsanti
  document.getElementById('accept-cookies').addEventListener('click', () => setCookiePreference('all'));
  document.getElementById('reject-cookies').addEventListener('click', () => setCookiePreference('essential'));
  document.getElementById('customize-cookies').addEventListener('click', showCustomizationPanel);

  // Funzioni di supporto
  function setCookiePreference(type) {
    localStorage.setItem('cookiePref', type);
    banner.style.display = 'none';
    if (type === 'all') {
      // Carica tutti i cookie (es: Google Analytics)
    }
  }

  function getCookiePreference() {
    return localStorage.getItem('cookiePref');
  }

  function showCustomizationPanel() {
    // Implementa qui un pannello avanzato con toggle per varie categorie
    window.location.href = "/privacy-policy#cookie-settings"; // Reindirizza alla policy
  }
});

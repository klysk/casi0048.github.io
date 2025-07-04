 document.addEventListener('DOMContentLoaded', function() {
           const banner = document.getElementById('cookie-consent-banner');
           const mainMessage = document.getElementById('cookie-main-message');
           const settingsPanel = document.getElementById('cookie-settings-panel');
           
           // Mostra il banner solo se non ci sono preferenze salvate
           if(!getCookiePreferences()) {
             banner.style.display = 'block';
             banner.style.animation = 'fadeInUp 0.5s forwards';
             
             // Aggiungi stili dinamici
             const style = document.createElement('style');
             style.textContent = `
               @keyframes fadeInUp {
                 from { opacity: 0; transform: translateY(20px); }
                 to { opacity: 1; transform: translateY(0); }
               }
               #cookie-customize:hover {
                 background: rgba(255,255,255,0.1) !important;
               }
               #cookie-reject-all:hover {
                 background: rgba(255,107,107,0.1) !important;
               }
               #cookie-accept-all:hover {
                 background: #a41616 !important;
                 transform: translateY(-1px);
               }
             `;
             document.head.appendChild(style);
           }
         
           // Gestione click sui pulsanti principali
           document.getElementById('cookie-accept-all').addEventListener('click', function() {
             saveCookiePreferences({
               essential: true,
               analytics: true,
               marketing: true,
               timestamp: new Date().getTime()
             });
             hideBanner();
           });
         
           document.getElementById('cookie-reject-all').addEventListener('click', function() {
             saveCookiePreferences({
               essential: true,
               analytics: false,
               marketing: false,
               timestamp: new Date().getTime()
             });
             hideBanner();
           });
         
           document.getElementById('cookie-customize').addEventListener('click', function() {
             mainMessage.style.display = 'none';
             settingsPanel.style.display = 'block';
           });
         
           // Gestione pannello personalizzazione
           document.getElementById('cookie-settings-back').addEventListener('click', function() {
             settingsPanel.style.display = 'none';
             mainMessage.style.display = 'block';
           });
         
           document.getElementById('cookie-save-settings').addEventListener('click', function() {
             const preferences = {
               essential: true,
               analytics: document.getElementById('cookie-analytics').checked,
               marketing: document.getElementById('cookie-marketing').checked,
               timestamp: new Date().getTime()
             };
             saveCookiePreferences(preferences);
             hideBanner();
           });
         
           // Funzioni di supporto
           function getCookiePreferences() {
             const prefs = localStorage.getItem('cookiePreferences');
             return prefs ? JSON.parse(prefs) : null;
           }
         
           function saveCookiePreferences(prefs) {
             localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
             console.log('Preferenze salvate:', prefs);
             // Qui puoi caricare gli script in base alle preferenze
           }
         
           function hideBanner() {
             banner.style.animation = 'fadeInUp 0.5s reverse forwards';
             setTimeout(() => banner.style.display = 'none', 500);
           }
         });

// GESTIONE HOVER AVANZATA
            document.addEventListener('DOMContentLoaded', function() {
                const dropdowns = document.querySelectorAll('.dropdown');
                
                dropdowns.forEach(dropdown => {
                    // Apertura menu
                    dropdown.addEventListener('mouseenter', function() {
                        const menu = this.querySelector('.submenu, .mega-menu')
                        menu.style.opacity = '1';
                        menu.style.visibility = 'visible';
                        menu.style.transform = 'translateY(5px)';
                        menu.style.pointerEvents = 'auto';
                    });
                    
                    // Chiusura controllata
                    dropdown.addEventListener('mouseleave', function(e) {
                        const menu = this.querySelector('.submenu, .mega-menu');
                        
                        // Timer per evitare chiusura accidentale
                        setTimeout(() => {
                            if (!this.matches(':hover') && !menu.matches(':hover')) {
                                menu.style.opacity = '0';
                                menu.style.visibility = 'hidden';
                                menu.style.transform = 'translateY(0)';
                                menu.style.pointerEvents = 'none';
                            }
                        }, 100);
                    });
                    
                    // Gestione hover sui sottomenu
                    const submenus = dropdown.querySelectorAll('.submenu, .mega-menu');
                    submenus.forEach(menu => {
                        menu.addEventListener('mouseenter', function() {
                            this.style.opacity = '1';
                            this.style.visibility = 'visible';
                            this.style.transform = 'translateY(5px)';
                        });
                        
                        menu.addEventListener('mouseleave', function() {
                            this.style.opacity = '0';
                            this.style.visibility = 'hidden';
                            this.style.transform = 'translateY(0)';
                        });
                    });
                });
            
                // Funzionalità di ricerca
                document.querySelector('.search-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const query = this.querySelector('input').value.trim();
                    if(query) {
                        alert(`Ricerca implementata: "${query}"\n\nQuesta è una demo. Nella pratica, collegheresti un sistema di ricerca reale.`);
                       // Sostituire con: window.location.href = `/search?q=${encodeURIComponent(query)}`;
                    }
                });
            
                // Interattività aggiuntiva per il titolo
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
<script>
  fetch('articoli.json')
    .then(response => response.json())
    .then(articoli => {
      const container = document.getElementById('lista-articoli');
      articoli.forEach(articolo => {
        const div = document.createElement('div');
        div.classList.add('articolo');
        div.innerHTML = `
          <h3><a href="${articolo.link}">${articolo.titolo}</a></h3>
          <time datetime="${articolo.data}">${new Date(articolo.data).toLocaleDateString('it-IT', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</time>
          <p>${articolo.descrizione}</p>
        `;
        container.appendChild(div);
      });
    })
    .catch(error => {
      console.error('Errore nel caricamento degli articoli:', error);
    });
AOS.init({
  disable: window.innerWidth < 768, // disattiva su mobile
  startEvent: 'DOMContentLoaded', // carica più velocemente
  debounceDelay: 50, // ottimizzazione performance
  throttleDelay: 99, // ottimizzazione scroll
});
</script>

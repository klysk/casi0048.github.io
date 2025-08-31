(function(){
       const RS = getComputedStyle(document.documentElement);
       const R = parseFloat(RS.getPropertyValue('--repel-radius')) || 120;
       const S = parseFloat(RS.getPropertyValue('--repel-strength')) || 28;
       const items = Array.from(document.querySelectorAll('[data-repel-item]'));
       if(!items.length) return;
     
       let mx = 0, my = 0, raf = 0;
       function tick(){
         raf = 0;
         for(const el of items){
           const r = el.getBoundingClientRect();
           const cx = r.left + r.width/2;
           const cy = r.top  + r.height/2;
           const dx = cx - mx, dy = cy - my;
           const d  = Math.hypot(dx, dy);
           if(d < R){
             const k  = 1 - d / R;
             const tx = (dx / (d || 1)) * S * k;
             const ty = (dy / (d || 1)) * S * k;
             el.style.transform = `translate(${tx}px, ${ty}px)`;
           }else{
             el.style.transform = '';
           }
         }
       }
       function onMove(e){
         if(e.pointerType && e.pointerType !== 'mouse') return; // solo mouse
         mx = e.clientX; my = e.clientY;
         if(!raf) raf = requestAnimationFrame(tick);
       }
       window.addEventListener('pointermove', onMove, {passive:true});
       window.addEventListener('scroll', ()=>{ if(!raf) raf = requestAnimationFrame(tick); }, {passive:true});
     })();

/* ===== Estratto da ao1.html ===== */
// PATCH SAFARI: shim iniziale
             window.thunderOn = window.thunderOn ?? false;
             window.updateLabel = window.updateLabel || function(){
               var b = document.getElementById('btn-thunder');
               if (!b) return;
               b.classList.toggle('active', !!window.thunderOn);
               b.setAttribute('aria-pressed', window.thunderOn ? 'true' : 'false');
               b.textContent = window.thunderOn ? '⚡ Tuono: ON' : '⚡ Tuono';
             };

/* ===== Estratto da ao1.html ===== */
// PATCH SAFARI: WebAudio v2 (audible on phone speakers)
             (function(){
               var btn = document.getElementById('btn-thunder');
               if (!btn) return;
               var clone = btn.cloneNode(true); btn.parentNode.replaceChild(clone, btn);
               btn = document.getElementById('btn-thunder') || clone;
               var audioEl = document.getElementById('thunder-sound');
               var ctx = null;
               var isSafari = /Safari\//.test(navigator.userAgent) && !/Chrome|Chromium|Edg\//.test(navigator.userAgent);
             
               function webAudioThunder(){
                 try {
                   ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
                   var startUnlock = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
                   return startUnlock.then(function(){
                     var sr = ctx.sampleRate;
                     var now = ctx.currentTime;
                     var master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
             
                     var crackDur = 0.09, crackN = (sr*crackDur)|0;
                     var crackBuf = ctx.createBuffer(1, crackN, sr);
                     var cch = crackBuf.getChannelData(0);
                     for (var i=0;i<crackN;i++){ cch[i] = (Math.random()*2-1) * (1 - i/crackN); }
                     var crackSrc = ctx.createBufferSource(); crackSrc.buffer = crackBuf;
                     var bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 3.5;
                     var hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 600;
                     var cg = ctx.createGain(); cg.gain.setValueAtTime(0.0, now);
                     cg.gain.linearRampToValueAtTime(0.8, now + 0.01);
                     cg.gain.exponentialRampToValueAtTime(0.05, now + crackDur);
                     crackSrc.connect(bp); bp.connect(hp); hp.connect(cg); cg.connect(master);
                     crackSrc.start(now);
             
                     var rumDur = 2.6, rumN = (sr*rumDur)|0;
                     var rumBuf = ctx.createBuffer(1, rumN, sr);
                     var rch = rumBuf.getChannelData(0);
                     var last = 0;
                     for (var j=0;j<rumN;j++){
                       var white = Math.random()*2 - 1;
                       var brown = (last + 0.02*white)/1.02; last = brown;
                       var t = j/rumN;
                       var env = Math.exp(-2.1*t);
                       rch[j] = brown * 0.75 * env;
                     }
                     var rumSrc = ctx.createBufferSource(); rumSrc.buffer = rumBuf;
                     var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 220;
                     var rg = ctx.createGain(); rg.gain.setValueAtTime(0.0, now);
                     rg.gain.linearRampToValueAtTime(0.7, now + 0.02);
                     rg.gain.exponentialRampToValueAtTime(0.0001, now + rumDur);
                     rumSrc.connect(lp); lp.connect(rg); rg.connect(master);
                     rumSrc.start(now + 0.02);
             
                     var tailDur = 0.3, tailN = (sr*tailDur)|0;
                     var tailBuf = ctx.createBuffer(1, tailN, sr);
                     var tch = tailBuf.getChannelData(0);
                     for (var k=0;k<tailN;k++){ tch[k] = (Math.random()*2-1) * Math.pow(1 - k/tailN, 2); }
                     var tailSrc = ctx.createBufferSource(); tailSrc.buffer = tailBuf;
                     var tailBP = ctx.createBiquadFilter(); tailBP.type = "bandpass"; tailBP.frequency.value = 900; tailBP.Q.value = 2;
                     var tg = ctx.createGain(); tg.gain.setValueAtTime(0.0, now);
                     tg.gain.linearRampToValueAtTime(0.4, now + 0.05);
                     tg.gain.exponentialRampToValueAtTime(0.0001, now + tailDur);
                     tailSrc.connect(tailBP); tailBP.connect(tg); tg.connect(master);
                     tailSrc.start(now + 0.02);
             
                     setTimeout(function(){ try{ master.disconnect(); }catch(_){ } }, 3200);
                   });
                 } catch(e) { if (console && console.warn) console.warn('WebAudio failed', e); return Promise.resolve(); }
               }
             
               function playThunder(){
                 if (isSafari) return webAudioThunder();
                 if (audioEl){
                   try {
                     audioEl.currentTime = 0;
                     var p = audioEl.play();
                     if (p && p.then) return p.catch(function(){ return webAudioThunder(); });
                     return Promise.resolve();
                   } catch(_){ return webAudioThunder(); }
                 }
                 return webAudioThunder();
               }
             
               btn.addEventListener('click', function(e){
                 e.preventDefault();
                 window.thunderOn = !window.thunderOn;
                 if (window.updateLabel) window.updateLabel();
                 if (window.thunderOn) { playThunder(); }
                 else { try { audioEl && (audioEl.pause(), audioEl.currentTime=0); } catch(_){} }
               });
             
               if (window.updateLabel) window.updateLabel();
             })();

/* ===== Estratto da ao1.html ===== */
{ "@context": "https://schema.org", "@type": "WebSite", "name": "Echi di Sofia", "url": "https://www.echidisofia.org/", "description": "Portale di filosofia antica, moderna e contemporanea", "inLanguage": "it" }

/* ===== Estratto da ao1.html ===== */
(function(){
              // Carica GSAP solo se manca
              function ensureGSAP(cb){
                if (window.gsap) return cb();
                var s = document.createElement('script');
                s.src = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js";
                s.onload = cb;
                document.head.appendChild(s);
              }
            
              function setupExploding(){
                const exploding = document.getElementById("exploding");
                if (!exploding) return;
            
                // prepara lo split in span una sola volta
                if (!exploding.__prepared){
                  const text = exploding.textContent;
                  exploding.textContent = "";
                  const frag = document.createDocumentFragment();
                  for (const ch of text){
                    const span = document.createElement("span");
                    span.textContent = ch;
                    frag.appendChild(span);
                  }
                  exploding.appendChild(frag);
                  exploding.__prepared = true;
                }
            
                const letters = Array.from(exploding.querySelectorAll("span"));
            
                function explodeAndReturn(){
                  // evita re-entrance mentre l'animazione è in corso
                  if (explodeAndReturn.__busy) return;
                  explodeAndReturn.__busy = true;
            
                  gsap.to(letters, {
                    duration: 0.8,
                    x: () => (Math.random() - 0.5) * 400,
                    y: () => (Math.random() - 0.5) * 300,
                    rotation: () => (Math.random() - 0.5) * 720,
                    opacity: 0,
                    ease: "power3.out",
                    stagger: 0.02,
                    onComplete: () => {
                      gsap.to(letters, {
                        duration: 1.2,
                        x: 0,
                        y: 0,
                        rotation: 0,
                        opacity: 1,
                        ease: "elastic.out(1, 0.5)",
                        stagger: 0.02,
                        onComplete: () => { explodeAndReturn.__busy = false; }
                      });
                    }
                  });
                }
            
                exploding.addEventListener("click", explodeAndReturn);
              }
            
              // init
              if (document.readyState === "loading"){
                document.addEventListener("DOMContentLoaded", () => ensureGSAP(setupExploding));
              } else {
                ensureGSAP(setupExploding);
              }
            })();

/* ===== Estratto da ao1.html ===== */
(function(){
              // Carica GSAP se manca
              function ensureGSAP(cb){
                if (window.gsap) return cb();
                var s = document.createElement('script');
                s.src = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js";
                s.onload = cb;
                document.head.appendChild(s);
              }
            
              function setupExploding(){
                const exploding = document.getElementById("exploding");
                if (!exploding) return;
            
                // prepara gli span una sola volta
                if (!exploding.__prepared){
                  const text = exploding.textContent;
                  exploding.textContent = "";
                  const frag = document.createDocumentFragment();
                  for (const ch of text){
                    const span = document.createElement("span");
                    span.textContent = ch;
                    span.style.display = "inline-block";
                    frag.appendChild(span);
                  }
                  exploding.appendChild(frag);
                  exploding.__prepared = true;
                }
            
                const letters = Array.from(exploding.querySelectorAll("span"));
            
                function explodeAndReturn(){
                  if (explodeAndReturn.__busy) return;
                  explodeAndReturn.__busy = true;
            
                  gsap.to(letters, {
                    duration: 0.8,
                    x: () => (Math.random() - 0.5) * 400,
                    y: () => (Math.random() - 0.5) * 300,
                    rotation: () => (Math.random() - 0.5) * 720,
                    opacity: 0,
                    ease: "power3.out",
                    stagger: 0.02,
                    onComplete: () => {
                      gsap.to(letters, {
                        duration: 1.2,
                        x: 0, y: 0, rotation: 0, opacity: 1,
                        ease: "elastic.out(1, 0.5)",
                        stagger: 0.02,
                        onComplete: () => { explodeAndReturn.__busy = false; }
                      });
                    }
                  });
                }
            
                // 1) Esplosione automatica al caricamento (una volta)
                explodeAndReturn();
            
                // 2) Esplosioni successive al click
                exploding.addEventListener("click", explodeAndReturn);
              }
            
              if (document.readyState === "loading"){
                document.addEventListener("DOMContentLoaded", () => ensureGSAP(setupExploding));
              } else {
                ensureGSAP(setupExploding);
              }
            })();

/* ===== Estratto da ao1.html ===== */
(function(){
            const canvas = document.getElementById('nebula');
            const ctx = canvas.getContext('2d');
            function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
            resize();
          
            const nebulaParticles = [];
            const colors = ['#3a0ca3', '#7209b7', '#f72585', '#4cc9f0', '#4895ef'];
          
            class Particle {
              constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
              }
              update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.01;
              }
              draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          
            function init() { for (let i = 0; i < 120; i++) nebulaParticles.push(new Particle()); }
            function animate() {
              ctx.fillStyle = 'rgba(10, 10, 20, 0.14)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              for (let i = 0; i < nebulaParticles.length; i++) {
                nebulaParticles[i].update(); nebulaParticles[i].draw();
                if (nebulaParticles[i].size <= 0.2 ||
                    nebulaParticles[i].x < 0 || nebulaParticles[i].x > canvas.width ||
                    nebulaParticles[i].y < 0 || nebulaParticles[i].y > canvas.height) {
                  nebulaParticles.splice(i, 1); i--;
                }
              }
              if (nebulaParticles.length < 120 && Math.random() < 0.12) nebulaParticles.push(new Particle());
              requestAnimationFrame(animate);
            }
            init(); animate();
            addEventListener('resize', resize);
          })();

/* ===== Estratto da ao1.html ===== */
(function starComets(){
            const canvas = document.getElementById('star-canvas');
            const ctx = canvas.getContext('2d');
            let w, h, stars = [], comets = [];
            function resize(){
              w = canvas.width = innerWidth; h = canvas.height = innerHeight;
              stars = Array.from({length: Math.min(360, Math.floor(w*h/4500))}, () => ({
                x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.4 + 0.2, s: Math.random()*0.6 + 0.1, a: Math.random()*Math.PI*2
              }));
            }
            function spawnComet(){
              const x = -50, y = Math.random()*h*0.8;
              const speed = 2 + Math.random()*2.2;
              const angle = (12 + Math.random()*22) * Math.PI/180;
              const vx = Math.cos(angle)*speed, vy = Math.sin(angle)*speed;
              comets.push({ x, y, vx, vy, life: 0, maxLife: 220 + Math.random()*160, trail: [] });
            }
            function draw(){
              ctx.clearRect(0,0,w,h);
              // stars
              for(const st of stars){
                st.a += 0.02;
                const op = 0.2 + Math.abs(Math.sin(st.a))*0.8;
                st.x += st.s*0.08; if(st.x > w) st.x = 0;
                ctx.globalAlpha = op;
                ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
                ctx.fillStyle = '#ffffff'; ctx.fill();
              }
              // comets
              for(let i=comets.length-1;i>=0;i--){
                const c = comets[i];
                c.x += c.vx; c.y += c.vy; c.life++;
                c.trail.push({x: c.x, y: c.y});
                if (c.trail.length > 24) c.trail.shift();
                for(let t=0; t<c.trail.length; t++){
                  const p = c.trail[t];
                  const alpha = t / c.trail.length;
                  ctx.globalAlpha = alpha*0.6;
                  ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2);
                  ctx.fillStyle = '#cfe8ff'; ctx.fill();
                }
                ctx.globalAlpha = 1;
                ctx.beginPath(); ctx.arc(c.x, c.y, 1.8, 0, Math.PI*2);
                ctx.fillStyle = '#ffffff'; ctx.fill();
                if (c.x > w+60 || c.y > h+60 || c.life > c.maxLife){ comets.splice(i,1); }
              }
              if (Math.random() < 0.02 && comets.length < 3) spawnComet();
              requestAnimationFrame(draw);
            }
            addEventListener('resize', resize);
            resize(); draw();
          })();

/* ===== Estratto da ao1.html ===== */
(function initVerticalSlider(){
            const wrap = document.querySelector('.slider-vertical');
            if(!wrap) return;
            const inner = wrap.querySelector('.slider-inner');
            // Duplica contenuto per loop infinito
            inner.innerHTML = inner.innerHTML + inner.innerHTML;
            let y = 0, paused = false;
            const speed = 0.35; // px/frame
            wrap.addEventListener('mouseenter', ()=> paused = true);
            wrap.addEventListener('mouseleave', ()=> paused = false);
            function step(){
              if(!paused){
                y += speed;
                if(y >= inner.scrollHeight/2) y = 0;
                inner.style.transform = `translateY(-${y}px)`;
              }
              requestAnimationFrame(step);
            }
            step();
          })();

/* ===== Estratto da ao1.html ===== */
(function lightning(){
            const overlay = document.getElementById('lightning');
            const bolt    = document.getElementById('bolt');
            const audio   = document.getElementById('thunder-sound');
          
            // --- stato solo per l'AUDIO ---
            if (typeof window.__thOn === 'undefined') window.__thOn = false;
          const thunderOnRef = () => window.__thOn;
          const setThunderOn = v => (window.__thOn = !!v);
          
            function playThunder(){
              if (!thunderOn || !audio) return;
              try { audio.currentTime = 0; audio.play().catch(()=>{}); } catch(e){}
            }
          
            function stopThunderAudio(){
              if (!audio) return;
              try { audio.pause(); audio.currentTime = 0; } catch(e){}
            }
          
            function flash(){
              // posizione/parametri casuali
              const xPerc = 15 + Math.random()*70;
              const yPerc = 10 + Math.random()*65;
              const angle  = -25 + Math.random()*50;
              const scaleY = 0.8 + Math.random()*1.2;
          
              // overlay
              overlay.style.transition = 'none'; overlay.offsetHeight;
              overlay.style.background = `radial-gradient(circle at ${xPerc}% ${yPerc}%, rgba(255,255,255,.95), rgba(255,255,255,.22) 40%, transparent 65%)`;
              overlay.style.opacity = '1';
              overlay.style.transition = 'opacity 80ms ease-out';
              setTimeout(()=> overlay.style.opacity = '0', 140);
          
              // saetta
              bolt.style.left = xPerc + '%';
              bolt.style.top  = yPerc + '%';
              bolt.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scaleY(${scaleY})`;
              bolt.style.transition = 'transform 90ms ease-out, opacity 280ms ease-out';
              bolt.style.opacity = '1';
              setTimeout(()=> bolt.style.opacity = '0', 180);
          
              // audio (solo se ON)
              setTimeout(playThunder, 120);
            }
          
            // --- loop VISIVO sempre attivo (cambia qui gli intervalli) ---
            const MIN = 30000, MAX = 40000; // 30–40s
            let flashTimer = null;
            (function schedule(){
              const delay = MIN + Math.random()*(MAX-MIN);
              flashTimer = setTimeout(()=>{ flash(); schedule(); }, delay);
            })();
          
            // --- API per il bottone: solo audio ---
            function updateBtn(){
              const btn = document.getElementById('btn-thunder');
              if (!btn) return;
              btn.classList.toggle('active', thunderOn);
              btn.setAttribute('aria-pressed', thunderOn ? 'true' : 'false');
            }
          
            
          
          
          // --- toggle audio tuono (ON/OFF) ---
          
          
          function updateThunderBtn(on){
            const b = document.getElementById('btn-thunder');
            if (b){
              b.textContent = on ? '⚡ Tuono: ON' : '⚡ Tuono';
              b.setAttribute('aria-pressed', on ? 'true' : 'false');
            }
          }
          
          
          
          })();

/* ===== Estratto da ao1.html ===== */
document.getElementById('btn-thunder')
            .addEventListener('click', ()=> window.toggleThunder && window.toggleThunder());
          
          
          
              document.getElementById('btn-explode').addEventListener('click', ()=> window.triggerExplosion && window.triggerExplosion());
              document.getElementById('year').textContent = new Date().getFullYear();

/* ===== Estratto da ao1.html ===== */
(function quotesBar(){
            const QUOTES = [
              { text: "Conosci te stesso e conoscerai l'universo e gli dei.", author: "Socrate" },
              { text: "Il sapere è l'unico bene che aumenta condividendolo.", author: "Pitagora" },
              { text: "La meraviglia è il principio di ogni conoscenza.", author: "Aristotele" },
              { text: "Non è forte colui che non cade mai, ma colui che cadendo si rialza.", author: "Confucio" },
              { text: "Penso, dunque sono.", author: "Cartesio" },
              { text: "L'uomo è condannato ad essere libero.", author: "Jean-Paul Sartre" },
              { text: "La vita senza esame non è degna di essere vissuta.", author: "Socrate" },
              { text: "Il dubbio è il principio della saggezza.", author: "René Descartes" },
              { text: "La felicità è reale solo se condivisa.", author: "Christopher McCandless" },
              { text: "L'essenza della filosofia è la ricerca incessante.", author: "Immanuel Kant" },
              { text: "Non si vede bene che col cuore.", author: "Antoine de Saint-Exupéry" },
              { text: "Il coraggio è sapere che non puoi vincere e provare lo stesso.", author: "Tom Krause" },
              { text: "L'ignoranza è la notte della mente.", author: "Immanuel Kant" },
              { text: "La libertà è la possibilità di essere ciò che siamo.", author: "Jean-Paul Sartre" },
              { text: "La verità è figlia del tempo, non dell'autorità.", author: "Galileo Galilei" },
              { text: "Il tempo è un fiume che mi porta, ma io sono il fiume.", author: "Jorge Luis Borges" },
              { text: "Chi non conosce il passato è condannato a ripeterlo.", author: "George Santayana" },
              { text: "L'uomo è misura di tutte le cose.", author: "Protagora" },
              { text: "La saggezza comincia nella meraviglia.", author: "Platone" },
              { text: "La mente è tutto. Ciò che pensi, diventi.", author: "Buddha" },
              { text: "Tutto scorre, niente permane.", author: "Eraclito" },
              { text: "L'arte di vivere è più simile a combattere che a danzare.", author: "Marco Aurelio" },
              { text: "Non è libero chi non domina se stesso.", author: "Seneca" },
              { text: "Non fare agli altri ciò che non vuoi sia fatto a te.", author: "Confucio" },
              { text: "La semplicità è la più alta sofisticazione.", author: "Leonardo da Vinci" },
              { text: "La conoscenza parla, ma la saggezza ascolta.", author: "Jimi Hendrix" },
              { text: "Il segreto della felicità è la libertà, il segreto della libertà è il coraggio.", author: "Carrie Jones" },
              { text: "Chi ha un perché per vivere può sopportare quasi ogni come.", author: "Friedrich Nietzsche" },
              { text: "L'essere umano è ciò che fa di sé.", author: "Jean-Paul Sartre" },
              { text: "L'uomo è un animale simbolico.", author: "Ernst Cassirer" },
              { text: "La filosofia è il sapere che cerca senza mai trovare.", author: "Karl Jaspers" },
              { text: "Il dubbio è il sale della conoscenza.", author: "Giovanni Papini" },
              { text: "La cultura è la chiave della libertà.", author: "Albert Camus" },
              { text: "L'immaginazione è più importante della conoscenza.", author: "Albert Einstein" },
              { text: "La pace inizia con un sorriso.", author: "Madre Teresa" },
              { text: "Il presente è il punto in cui passato e futuro si incontrano.", author: "Haruki Murakami" },
              { text: "L'uomo è l'unico animale che arrossisce.", author: "Mark Twain" },
              { text: "Vivi come se dovessi morire domani, impara come se dovessi vivere per sempre.", author: "Mahatma Gandhi" },
              { text: "La vera libertà consiste nell'essere padroni di se stessi.", author: "Epitteto" },
              { text: "Chi non ha mai commesso un errore non ha mai provato nulla di nuovo.", author: "Albert Einstein" },
              { text: "Il pensiero è l'ombra dell'essere.", author: "Georg Wilhelm Friedrich Hegel" },
              { text: "Il vero viaggio di scoperta non consiste nel cercare nuove terre, ma nell'avere nuovi occhi.", author: "Marcel Proust" }
            ];
            const tEl = document.getElementById('quotesText');
            const aEl = document.getElementById('quotesAuthor');
            let i = 0;
            function next(){
              const q = QUOTES[i]; i = (i+1) % QUOTES.length;
              tEl.style.opacity = '0'; aEl.style.opacity = '0';
              setTimeout(()=>{
                tEl.textContent = q.text; aEl.textContent = '— ' + q.author;
                tEl.style.opacity = '1'; aEl.style.opacity = '1';
              }, 200);
            }
            next(); setInterval(next, 5000);
          })();

/* ===== Estratto da ao1.html ===== */
(function explodingText(){
            const host = document.getElementById('exploding');
            const text = host.textContent.trim();
            host.textContent = '';
            const chars = [];
            for(const c of text){
              const span = document.createElement('span');
              span.className = 'ch';
              span.textContent = c === ' ' ? '\u00A0' : c;
              host.appendChild(span);
              chars.push(span);
            }
            function burst(){
              chars.forEach((el, i) => {
                const ang = Math.random()*Math.PI*2;
                const dist = 40 + Math.random()*140;
                if (window.gsap){
                  gsap.fromTo(el, {opacity:1, x:0, y:0}, {
                    duration: 0.9 + Math.random()*0.6,
                    x: Math.cos(ang)*dist,
                    y: Math.sin(ang)*dist,
                    opacity: 0,
                    ease: 'power3.out',
                    delay: i * 0.006
                  });
                } else {
                  el.style.opacity=0;
                }
              });
            }
            window.triggerExplosion = function(){
              try{
                const ex = document.getElementById('explosionSound');
                if (ex){ ex.currentTime = 0; ex.play().catch(()=>{}); }
              }catch(e){}
              burst();
            };
            addEventListener('load', burst);
            host.addEventListener('click', () => {
              try{
                const ex = document.getElementById('explosionSound');
                if (ex){ ex.currentTime = 0; ex.play().catch(()=>{}); }
              }catch(e){}
              chars.forEach(el => { el.style.opacity=1; el.style.transform='translate(0,0)'; });
              burst();
            });
          })();

/* ===== Estratto da ao1.html ===== */
document.addEventListener("DOMContentLoaded", function() {
            const el = document.querySelector(".typing-effect");
            const texts = [
              "Φιλοσοφία: l'arte di cercare appigli nel vuoto.",
              "Pensare è camminare senza mappa.",
              "La verità è un equilibrio mobile.",
              "La domanda giusta vale più di mille risposte.",
              "L’inquietudine è il motore della ricerca."
            ];
          function reserveTypingSpace(target, texts){
          try{
          if(!target || !texts || !texts.length) return;
          var wrap = target.closest('.typing-wrap') || target.parentElement || document.body;
          var ghost = document.createElement('div');
          var cs = getComputedStyle(target);
          ghost.style.position = 'absolute';
          ghost.style.visibility = 'hidden';
          ghost.style.whiteSpace = 'normal';
          ghost.style.pointerEvents = 'none';
          ghost.style.fontFamily = cs.fontFamily;
          ghost.style.fontSize   = cs.fontSize;
          ghost.style.fontWeight = cs.fontWeight;
          ghost.style.fontStyle  = cs.fontStyle;
          ghost.style.lineHeight = cs.lineHeight;
          try{
          var w = wrap.getBoundingClientRect().width;
          if(!isNaN(w) && w > 0) ghost.style.maxWidth = w + 'px';
          }catch(e){}
          document.body.appendChild(ghost);
          var maxH = 0;
          for(var i=0;i<texts.length;i++){
          ghost.textContent = texts[i];
          var r = ghost.getBoundingClientRect();
          if(r.height > maxH) maxH = r.height;
          }
          ghost.remove();
          if(maxH > 0) wrap.style.minHeight = Math.ceil(maxH) + 'px';
          }catch(e){}
          }
          reserveTypingSpace(el, texts);
          
            let textIndex = 0, index = 0, forward = true, delay = 0, stepCounter = 0;
            const writeSpeed = 3, deleteSpeed = 2;
            function animate() {
              stepCounter++;
              const speed = forward ? writeSpeed : deleteSpeed;
              if (stepCounter >= speed) {
                stepCounter = 0;
                if (delay > 0) { delay--; }
                else {
                  const currentText = texts[textIndex];
                  if (forward) {
                    index++;
                    if (index > currentText.length) { forward = false; delay = 60; }
                  } else {
                    index--;
                    if (index < 0) { forward = true; textIndex = (textIndex + 1) % texts.length; delay = 20; }
                  }
                  el.textContent = currentText.substring(0, Math.max(0,index));
                }
              }
              requestAnimationFrame(animate);
            }
            animate();
          });

/* ===== Estratto da ao1.html ===== */
window.addEventListener("load", () => {
            if (window.gsap) {
              gsap.from("#russell-box", { x: -150, opacity: 0, duration: 1.2, ease: "power3.out" });
              gsap.from("#russell-hint", { x: -150, opacity: 0, duration: 1.2, delay: 0.35, ease: "power3.out" });
              gsap.to("#russell-btn", { scale: 1.05, duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut" });
            }
          });
          document.addEventListener("click", function (e) {
            const btn = document.getElementById("russell-btn");
            if (!btn) return;
            if (btn.contains(e.target)) {
              const audio = document.getElementById("russell-audio");
              try {
                audio.currentTime = 0;
                audio.play();
              } catch (err) {}
            }
          });

/* ===== Estratto da ao1.html ===== */
window.addEventListener('load', () => {
            if (window.gsap) {
              try {
                gsap.from(".articles-blob li", {
                  x: -40,
                  opacity: 0,
                  duration: 0.6,
                  ease: "power2.out",
                  stagger: 0.09,
                  delay: 0.3
                });
              } catch(e){}
            }
          });

/* ===== Estratto da ao1.html ===== */
(function(){
              const root = document.getElementById('edx-dict');
              if(!root) return;
              const toggle = root.querySelector('#edx-dict-toggle');
              const input = root.querySelector('#edx-dict-input');
              const goBtn = root.querySelector('#edx-dict-go');
              const frame = root.querySelector('#edx-dict-frame');
              const buildURL = q => `https://plato.stanford.edu/search/searcher.py?query=${encodeURIComponent(q)}`; // SEP
            
              function setOpen(open){ root.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); }
              function submit(ev){
                if(ev){ ev.preventDefault && ev.preventDefault(); ev.stopPropagation && ev.stopPropagation(); }
                const q = input.value.trim(); if(!q) return;
                frame.src = buildURL(q);
                if(!root.classList.contains('is-open')) setOpen(true);
              }
              toggle.addEventListener('click', e=>{ e.preventDefault(); setOpen(!root.classList.contains('is-open')); });
              goBtn.addEventListener('click', submit);
              input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ submit(e); } });
            
              // CHIUSO di default
              setOpen(false);
            })();

/* ===== Estratto da ao1.html ===== */
(function(){
              const build = {
                sep:          q => 'https://plato.stanford.edu/search/searcher.py?query=' + encodeURIComponent(q),
                iep:          q => 'https://iep.utm.edu/?s=' + encodeURIComponent(q),
                treccani:     q => 'https://www.treccani.it/enciclopedia/ricerca/' + encodeURIComponent(q) + '/',
                philosophica: q => 'https://www.philosophica.info/?s=' + encodeURIComponent(q),
                'wiki-it':    q => 'https://it.wikipedia.org/w/index.php?search=' + encodeURIComponent(q)
              };
            
              const form  = document.getElementById('edx-dict-form');
              const sel   = document.getElementById('edx-source');
              const input = document.getElementById('edx-q');
              const btn   = document.getElementById('edx-go');
              if(!form || !sel || !input || !btn) return;
            
              (function rememberSource(){
                const KEY = 'edx-dict-source';
                const saved = localStorage.getItem(KEY);
                if(saved && [...sel.options].some(o => o.value === saved)) sel.value = saved;
                sel.addEventListener('change', () => localStorage.setItem(KEY, sel.value));
              })();
            
              (function dynamicPlaceholder(){
                const hints = {
                  'sep':'es. “noumeno”, “Aristotle”',
                  'iep':'es. “virtue ethics”',
                  'treccani':'es. “ermeneutica”, “Leibniz”',
                  'philosophica':'es. “metafisica”',
                  'wiki-it':'es. “positivismo logico”'
                };
                function update(){ input.placeholder = 'Cerca… ' + (hints[sel.value] || ''); }
                sel.addEventListener('change', update);
                update();
              })();
            
              let busy = false;
              function go(){
                if(busy) return;
                busy = true; setTimeout(() => busy = false, 600);
                const q = (input.value || '').trim(); if(!q) return;
                const src = sel.value || 'sep';
                const url = (build[src] || build.sep)(q);
                window.open(url, '_blank', 'noopener');
              }
            
              btn.addEventListener('click', go);
              input.addEventListener('keydown', e => {
                if(e.key === 'Enter'){ e.preventDefault(); e.stopPropagation(); go(); }
              });
            
              try{
                form.removeAttribute('action');
                form.setAttribute('onsubmit','return false;');
                form.addEventListener('submit', e => { e.preventDefault(); e.stopImmediatePropagation(); return false; }, true);
                const obs = new MutationObserver(() => {
                  form.removeAttribute('action');
                  form.setAttribute('onsubmit','return false;');
                });
                obs.observe(form, { attributes:true, attributeFilter:['action','onsubmit'] });
              }catch(_){}
            })();

/* ===== Estratto da ao1.html ===== */
// Inizializzazione mini player
          window.addEventListener('load', () => {
            const box = document.getElementById('audio-player');
            const audio = document.getElementById('myAudio');
            const btn = document.getElementById('playPause');
            const time = document.getElementById('time');
            const vol = document.getElementById('volume');
          
            // Appare con GSAP se disponibile
            try{
              if (window.gsap) {
                gsap.to(box, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 });
              } else {
                box.style.opacity = '1';
                box.style.transform = 'none';
              }
            }catch(e){ box.style.opacity = '1'; box.style.transform = 'none'; }
          
            function fmt(s){
              if (!isFinite(s)) return '0:00';
              const m = Math.floor(s/60);
              const sec = Math.floor(s%60);
              return m + ':' + (sec<10 ? '0'+sec : sec);
            }
            function updateTime(){
              time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
            }
            // Volume di partenza
            vol.value = 0.8;
            audio.volume = parseFloat(vol.value);
          
            // Eventi
            btn.addEventListener('click', () => {
              if (audio.paused){
                audio.play().catch(()=>{});
                btn.textContent = '⏸️';
              } else {
                audio.pause();
                btn.textContent = '▶️';
              }
            });
            vol.addEventListener('input', () => audio.volume = parseFloat(vol.value));
            audio.addEventListener('timeupdate', updateTime);
            audio.addEventListener('loadedmetadata', updateTime);
            audio.addEventListener('ended', () => { btn.textContent = '▶️'; });
          });

/* ===== Estratto da ao1.html ===== */
window.addEventListener('load', () => {
            if (window.gsap){
              try{
                gsap.from("#video-right", { x: 60, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.35 });
              }catch(e){}
            }
          });

/* ===== Estratto da ao1.html ===== */
(() => {
            // --- RIFERIMENTI ---
            const btnThunder = document.getElementById('btn-thunder');   // ⚡ Tuono
            const btnExplode = document.getElementById('explode-btn');   // 💥 Esplodi
            const thunder    = document.getElementById('thunder-sound'); // <audio>
            const explosion  = document.getElementById('explosionSound');// <audio>
          
            // --- 1) UNLOCK al primo gesto (play→pause invisibile) ---
            let unlocked = false;
            async function unlockOnce() {
              if (unlocked) return;
              unlocked = true;
              for (const a of [thunder, explosion]) {
                if (!a) continue;
                try {
                  a.muted = false;
                  await a.play();
                  a.pause(); a.currentTime = 0;
                } catch (_) {}
              }
              window.removeEventListener('pointerdown', unlockOnce, {capture:true});
              window.removeEventListener('keydown', unlockOnce, {capture:true});
            }
            window.addEventListener('pointerdown', unlockOnce, {once:true, capture:true, passive:true});
            window.addEventListener('keydown', unlockOnce, {once:true, capture:true});
          
            // --- 2) PLAY con FALLBACK MULTIPLO ---
            // Chrome a volte non passa automaticamente al <source> successivo:
            // settiamo le sorgenti a mano e proviamo in sequenza.
            async function playWithFallback(audioEl, sources) {
              for (let i = 0; i < sources.length; i++) {
                const src = sources[i];
                try {
                  // riassegna la sorgente "pulita"
                  audioEl.pause();
                  audioEl.removeAttribute('src');               // reset
                  while (audioEl.firstChild) audioEl.removeChild(audioEl.firstChild);
                  const s = document.createElement('source');
                  s.src = src;
                  s.type = 'audio/mpeg';
                  audioEl.appendChild(s);
                  audioEl.load();
          
                  // aspetta che sia caricabile
                  await new Promise((res, rej) => {
                    const onCan = () => { cleanup(); res(); };
                    const onErr = () => { cleanup(); rej(new Error('error')); };
                    const onStl = () => { cleanup(); rej(new Error('stalled')); };
                    const cleanup = () => {
                      audioEl.removeEventListener('canplaythrough', onCan);
                      audioEl.removeEventListener('error', onErr);
                      audioEl.removeEventListener('stalled', onStl);
                    };
                    audioEl.addEventListener('canplaythrough', onCan, {once:true});
                    audioEl.addEventListener('error', onErr, {once:true});
                    audioEl.addEventListener('stalled', onStl, {once:true});
                    // timeout di sicurezza
                    setTimeout(() => { cleanup(); rej(new Error('timeout')); }, 4000);
                  });
          
                  audioEl.currentTime = 0;
                  await audioEl.play();
                  console.log('[AUDIO OK]', src);
                  return true; // riprodotto
                } catch (e) {
                  console.warn('[AUDIO FALLBACK]', src, e.message || e);
                  continue; // prova il prossimo
                }
              }
              console.error('[AUDIO KO] tutte le sorgenti hanno fallito');
              return false;
            }
          
            // --- 3) LISTENER UNICI sui bottoni (evita conflitti) ---
            if (btnThunder && !btnThunder._bound) {
              btnThunder._bound = true;
              btnThunder.addEventListener('click', async (e) => {
                e.preventDefault();
                const ok = await playWithFallback(thunder, [
                  '/suoni/thunder-sound.mp3',
                  'https://casi0048.github.io/suoni/thunder-sound.mp3'
                ]);
                if (!ok) alert('Audio tuono non disponibile.');
              });
            }
          
            if (btnExplode && !btnExplode._bound) {
              btnExplode._bound = true;
              btnExplode.addEventListener('click', async (e) => {
                e.preventDefault();
                const ok = await playWithFallback(explosion, [
                  '/suoni/explosion-1.mp3',
                  'https://casi0048.github.io/suoni/explosion-1.mp3',
                  // fallback ulteriore: RAW GitHub (può servire in locale/file://)
                  'https://raw.githubusercontent.com/Casi0048/casi0048.github.io/main/suoni/explosion-1.mp3'
                ]);
                if (!ok) alert('Audio esplosione non disponibile.');
              });
            }
          
            // --- 4) LOG diagnostico utile in console ---
            [thunder, explosion].forEach((a) => {
              if (!a) return;
              a.addEventListener('error', () => console.warn('[AUDIO error]', a.id));
              a.addEventListener('stalled', () => console.warn('[AUDIO stalled]', a.id));
              a.addEventListener('loadedmetadata', () => console.log('[AUDIO loadedmetadata]', a.id, a.duration));
              a.addEventListener('canplaythrough', () => console.log('[AUDIO canplaythrough]', a.id));
            });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            
          // Global opener: works even if other listeners fail
          window.openCookiePrefs = function(){
          try { if (typeof openModal === 'function') { openModal(); return; } } catch(e){}
          try {
          var m = document.getElementById('cookie-modal');
          if (m){
          m.setAttribute('aria-hidden','false');
          m.style.display = 'flex';
          }
          } catch(_) {}
          };
          // Delegated click for the cookie badge (works even if badge is injected after this script)
          document.addEventListener('click', function(ev){
          var btn = ev.target && ev.target.closest ? ev.target.closest('#cookie-fab') : null;
          if (!btn) return;
          try { openModal(); }
          catch(e){
          try { var m = document.getElementById('cookie-modal'); if (m) m.setAttribute('aria-hidden','false'); } catch(_) {}
          }
          });
          const $banner = document.getElementById('cookie-banner');
            const $modal  = document.getElementById('cookie-modal');
            const $manage = document.getElementById('manage-cookies') || document.getElementById('cookie-manage');
          const $fab = document.getElementById('cookie-fab');
          if ($manage) $manage.hidden = true; // replace text link with floating badge
          
            const $accept = document.getElementById('cookie-accept');
            const $decline = document.getElementById('cookie-decline');
            const $customize = document.getElementById('cookie-customize');
          
            const $save = document.getElementById('cookie-save');
            const $cancel = document.getElementById('cookie-cancel');
            const $close = document.getElementById('cookie-close');
          
            const $an = document.getElementById('consent-analytics');
            const $pr = document.getElementById('consent-preferences');
            const $mk = document.getElementById('consent-marketing');
          
            function getConsent(){
              try{ return JSON.parse(localStorage.getItem(KEY)); }catch(e){ return null; }
            }
            function setConsent(c){
              localStorage.setItem(KEY, JSON.stringify(c));
              applyConsent(c);
            }
            function applyConsent(c){
              // Qui puoi caricare/fermare script in base al consenso.
              // Esempi (da implementare solo se ti servono):
              // if(c.analytics){ loadAnalytics(); } else { disableAnalytics(); }
              // if(c.marketing){ loadMarketing(); } else { disableMarketing(); }
            }
          
            function showBanner(){
          $banner.hidden = false;
          try{
          const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (!reduce && window.gsap){
          gsap.fromTo($banner, {y:24, opacity:0}, {y:0, opacity:1, duration:.55, ease:'power3.out'});
          }
          }catch(e){}
          }
            function hideBanner(){
          try{
          const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (!reduce && window.gsap){
          gsap.to($banner, {y:16, opacity:0, duration:.35, ease:'power2.in', onComplete(){ $banner.hidden = true; }});
          return;
          }
          }catch(e){}
          $banner.hidden = true;
          }
            function openModal(){
          try{
          const c = getConsent() || {};
          if ($an) $an.checked = !!c.analytics;
          if ($pr) $pr.checked = !!c.preferences;
          if ($mk) $mk.checked = !!c.marketing;
          }catch(e){}
          try{
          $modal.removeAttribute('hidden');
          $modal.setAttribute('aria-hidden','false');
          $modal.style.display = 'flex';
          $modal.classList.add('force-open');
          const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const panel = $modal.querySelector ? $modal.querySelector('.cookie-modal__panel') : null;
          if (!reduce && window.gsap && panel){
          gsap.fromTo($modal, {opacity:0}, {opacity:1, duration:.25, ease:'power2.out'});
          gsap.fromTo(panel, {y:20, opacity:0}, {y:0, opacity:1, duration:.4, ease:'power3.out'});
          }
          }catch(e){}
          }
          }catch(_){}
          const c = getConsent() || {};
          $an.checked = !!c.analytics;
          $pr.checked = !!c.preferences;
          $mk.checked = !!c.marketing;
          $modal.setAttribute('aria-hidden','false');
          try{
          const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (!reduce && window.gsap){
          const panel = $modal.querySelector('.cookie-modal__panel');
          gsap.fromTo($modal, {opacity:0}, {opacity:1, duration:.25, ease:'power2.out'});
          gsap.fromTo(panel, {y:20, opacity:0}, {y:0, opacity:1, duration:.4, ease:'power3.out'});
          }
          }catch(e){}
          };
              $an.checked = !!c.analytics;
              $pr.checked = !!c.preferences;
              $mk.checked = !!c.marketing;
              $modal.setAttribute('aria-hidden','false');
            }
            function closeModal(){
          try{
          if ($modal){
          const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const panel = $modal.querySelector ? $modal.querySelector('.cookie-modal__panel') : null;
          if (!reduce && window.gsap && panel){
            gsap.to(panel, {y:10, opacity:0, duration:.22, ease:'power2.in'});
            gsap.to($modal, {opacity:0, duration:.22, ease:'power2.in', onComplete(){
              $modal.setAttribute('aria-hidden','true');
              $modal.classList.remove('force-open');
              $modal.style.display = 'none';
              $modal.setAttribute('hidden','');
            }});
          } else {
            $modal.setAttribute('aria-hidden','true');
            $modal.classList.remove('force-open');
            $modal.style.display = 'none';
            $modal.setAttribute('hidden','');
          }
          }
          }catch(e){}
          }
          }catch(_){}
          try{
          const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (!reduce && window.gsap){
          const panel = $modal.querySelector('.cookie-modal__panel');
          gsap.to(panel, {y:10, opacity:0, duration:.22, ease:'power2.in'});
          gsap.to($modal, {opacity:0, duration:.22, ease:'power2.in', onComplete(){ $modal.setAttribute('aria-hidden','true'); }});
          return;
          }
          }catch(e){}
          $modal.setAttribute('aria-hidden','true');
          }
          
            // Pulsanti banner
            $accept.addEventListener('click', ()=>{
              setConsent({ essential:true, analytics:true, preferences:true, marketing:true, date:Date.now() });
              hideBanner(); if ($manage) if ($manage) $manage.hidden = true; // keep text button hidden (badge replaces it)
            });
            $decline.addEventListener('click', ()=>{
              setConsent({ essential:true, analytics:false, preferences:false, marketing:false, date:Date.now() });
              hideBanner(); if ($manage) if ($manage) $manage.hidden = true; // keep text button hidden (badge replaces it)
            });
            $customize.addEventListener('click', openModal);
          
            // Modal
          document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closeModal(); }});
          $save.addEventListener('click', ()=>{
          setConsent({
          essential:true,
          analytics:$an && $an.checked,
          preferences:$pr && $pr.checked,
          marketing:$mk && $mk.checked,
          date:Date.now()
          });
          closeModal();
          hideBanner();
          if ($manage) $manage.hidden = true;
          });
          closeModal(); hideBanner(); if ($manage) if ($manage) $manage.hidden = true; // keep text button hidden (badge replaces it)
            });
            [$cancel,$close].filter(Boolean).forEach(btn=> btn.addEventListener('click', closeModal));
            if ($modal) $modal.addEventListener('click', (e)=>{ if(e.target === $modal) closeModal(); });
            document.addEventListener('keydown', (e)=>{ try{ if(e.key==='Escape') closeModal(); }catch(_){}});
          
            // Riapertura
            if ($manage) $manage.addEventListener('click', openModal);
          
            // Init
            const consent = getConsent();
            if(consent){ hideBanner(); if ($manage) if ($manage) $manage.hidden = true; // keep text button hidden (badge replaces it) applyConsent(consent); }
            else { showBanner(); }
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            // avoid double-injection
            if (window.__echiThunder) return;
            window.__echiThunder = true;
          
            // ---------- helpers
            function $(sel, ctx){ return (ctx||document).querySelector(sel); }
            function $all(sel, ctx){ return Array.prototype.slice.call((ctx||document).querySelectorAll(sel)); }
            function createEl(tag, attrs, css){
              var el = document.createElement(tag);
              if (attrs) for (var k in attrs){ try{ el.setAttribute(k, attrs[k]); }catch(e){} }
              if (css) el.style.cssText = css;
              return el;
            }
            function containsText(el, words){
              if (!el) return false;
              var t = (el.innerText || el.textContent || '').toLowerCase();
              return words.some(function(w){ return t.indexOf(w) !== -1; });
            }
          
            // ---------- audio
            var audio = document.getElementById('thunder-sound');
            if (!audio){
              audio = createEl('audio', { id:'thunder-sound', preload:'auto', crossorigin:'anonymous' });
              var src = createEl('source', { src:'https://casi0048.github.io/suoni/thunder-sound.mp3', type:'audio/mpeg' });
              audio.appendChild(src);
              audio.style.display = 'none';
              document.body.appendChild(audio);
            }
          
            var thunderOn = false;
            function playThunder(){
              if (!thunderOn || !audio) return;
              try { audio.currentTime = 0; audio.play().catch(function(){}); } catch(e){}
            }
            function stopThunder(){
              if (!audio) return;
              try { audio.pause(); audio.currentTime = 0; } catch(e){}
            }
            function setBtnState(btn, on){
              if (!btn) return;
              btn.classList.toggle('active', on);
              btn.setAttribute('aria-pressed', on ? 'true':'false');
              if (!btn.dataset._label) btn.dataset._label = (btn.innerText||btn.textContent||'⚡ Tuono').trim();
              btn.textContent = on ? '⚡ Tuono: ON' : (btn.dataset._label || '⚡ Tuono');
            }
          
            // Find candidate thunder buttons (various heuristics: id/class/name contains thunder/tuono/fulmine; or text has ⚡/tuono)
            function findThunderButtons(){
              var candidates = $all('button, a, [role="button"], .btn, .button');
              return candidates.filter(function(el){
                var idc = (el.id||'') + ' ' + (el.className||'') + ' ' + (el.getAttribute('name')||'');
                idc = idc.toLowerCase();
                var hitsAttr = /thunder|tuono|fulmine|lightning|saetta/.test(idc);
                var hitsText = containsText(el, ['⚡','tuono']);
                return hitsAttr || hitsText;
              });
            }
          
            // Wire up buttons (and re-run after a delay to catch late DOM)
            function wireButtons(){
              findThunderButtons().forEach(function(btn){
                if (btn._thBound) return;
                btn.addEventListener('click', function(ev){
                  // don't steal clicks meant for navigation if it's an <a> without #
                  if (btn.tagName === 'A' && btn.getAttribute('href') && btn.getAttribute('href').trim().charAt(0) !== '#') return;
                  ev.preventDefault();
                  setThunderOn(!thunderOnRef());
                  if (thunderOn) playThunder(); else stopThunder();
                  setBtnState(btn, thunderOn);
                }, false);
                btn._thBound = true;
                // initial paint
                setBtnState(btn, thunderOn);
              });
            }
            wireButtons();
            setTimeout(wireButtons, 800); // catch late-rendered UI
            setTimeout(wireButtons, 2000);
          
            // Also expose a global toggle for any existing handlers
            
          
            // ---------- lightning (10–15s), always on
            var overlay = document.getElementById('lightning');
            if (!overlay){
              overlay = createEl('div', { id:'lightning' }, 'position:fixed;inset:0;pointer-events:none;opacity:0;z-index:5;background:transparent;');
              document.body.appendChild(overlay);
            }
            var bolt = document.getElementById('bolt');
            if (!bolt){
              bolt = createEl('div', { id:'bolt' }, 'position:fixed;left:50%;top:50%;width:3px;height:56vh;background:linear-gradient(#fff,rgba(255,255,255,0));box-shadow:0 0 16px rgba(255,255,255,.9),0 0 32px rgba(255,255,255,.6);opacity:0;pointer-events:none;z-index:6;transform-origin:top;');
              document.body.appendChild(bolt);
            }
            function flash(){
              var xPerc = 15 + Math.random()*70;
              var yPerc = 10 + Math.random()*65;
              var angle  = -25 + Math.random()*50;
              var scaleY = 0.8 + Math.random()*1.2;
          
              overlay.style.transition = 'none'; overlay.offsetHeight;
              overlay.style.background = 'radial-gradient(circle at '+xPerc+'% '+yPerc+'%, rgba(255,255,255,.95), rgba(255,255,255,.22) 40%, transparent 65%)';
              overlay.style.opacity = '1';
              overlay.style.transition = 'opacity 80ms ease-out';
              setTimeout(function(){ overlay.style.opacity = '0'; }, 140);
          
              bolt.style.left = xPerc + '%';
              bolt.style.top  = yPerc + '%';
              bolt.style.transform = 'translate(-50%,-50%) rotate('+angle+'deg) scaleY('+scaleY+')';
              bolt.style.transition = 'transform 90ms ease-out, opacity 280ms ease-out';
              bolt.style.opacity = '1';
              setTimeout(function(){ bolt.style.opacity = '0'; }, 180);
          
              setTimeout(playThunder, 120);
            }
            (function schedule(){
              var MIN = 10000, MAX = 15000; // 10–15s
              setTimeout(function(){ flash(); schedule(); }, MIN + Math.random()*(MAX-MIN));
            })();
          
            // ---------- cookie banner compatibility
            (function(){
              function hideAll(){
                var b = document.getElementById('cookie-banner'); if (b) b.style.display = 'none';
                var m = document.querySelector('.cookie-modal, #cookie-modal'); if (m) m.style.display = 'none';
              }
              function setConsent(v){ try{ localStorage.setItem('cookieConsent', JSON.stringify({ v:v, at: Date.now() })); }catch(e){} }
              function getConsent(){ try{ return JSON.parse(localStorage.getItem('cookieConsent')||'null'); }catch(e){ return null; } }
              var c = getConsent(); if (c && (c.v==='accepted'||c.v==='rejected')) hideAll();
              function bind(sel, fn){
                document.querySelectorAll(sel).forEach(function(el){
                  if (el._ckBound) return;
                  el.addEventListener('click', function(ev){ ev.preventDefault(); fn(); }, false);
                  el._ckBound = true;
                });
              }
              bind('#cookie-accept, #btn-accept-cookies, [data-consent=\"accepted\"]', function(){ setConsent('accepted'); hideAll(); });
              bind('#cookie-reject, #btn-reject-cookies, [data-consent=\"rejected\"]', function(){ setConsent('rejected'); hideAll(); });
              bind('#cookie-save', function(){ setConsent('accepted'); hideAll(); });
              bind('[data-open=\"cookie-modal\"]', function(){ var m = document.querySelector('.cookie-modal, #cookie-modal'); if (m) m.style.display='block'; });
              bind('[data-close=\"cookie-modal\"]', function(){ var m = document.querySelector('.cookie-modal, #cookie-modal'); if (m) m.style.display='none'; });
            })();
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            // Prendi elementi
            const btn = document.getElementById('btn-thunder');
            const audio = document.getElementById('thunder-sound');
            if (!btn || !audio) return;
          
            // Normalizza audio (alcuni browser sono schizzinosi)
            audio.preload = 'auto';
            audio.muted = false;
            audio.volume = 1.0;
            audio.setAttribute('playsinline',''); // iOS
            audio.setAttribute('type','audio/mpeg');
          
            // Rimuovi eventuali vecchi event listener attaccati al bottone
            const clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);
            const thBtn = document.getElementById('btn-thunder');
          
            // Stato ON/OFF solo per il suono (i lampi restano indipendenti)
            
          
            function updateLabel(){
              thBtn.classList.toggle('active', thunderOn);
              thBtn.setAttribute('aria-pressed', thunderOn ? 'true' : 'false');
              thBtn.textContent = thunderOn ? '⚡ Tuono: ON' : '⚡ Tuono';
            }
          
            async function playOnce(){
              try {
                audio.currentTime = 0;
                await audio.play();      // dentro il click => sbloccato ovunque
              } catch(e) {
                console.warn('Playback bloccato:', e);
              }
            }
          
            function stopNow(){
              try { audio.pause(); audio.currentTime = 0; } catch(e){}
            }
          
            // Toggle ON/OFF al click
            thBtn.addEventListener('click', async function(ev){
              ev.preventDefault();
              setThunderOn(!thunderOnRef());
              if (thunderOn) await playOnce(); else stopNow();
              updateLabel();
            });
          
            // (Opzionale) se hai uno script di lampi che chiama il tuono, usa questo hook globale:
            window.playThunderIfOn = function(){
              if (thunderOn) { try { audio.currentTime = 0; audio.play().catch(()=>{}); } catch(e){} }
            };
          
            updateLabel();
          })();

/* ===== Estratto da ao1.html ===== */
document.getElementById('manage-cookies')?.addEventListener('click', () => {
            const modal  = document.querySelector('.cookie-modal, #cookie-modal');
            const banner = document.getElementById('cookie-banner');
            if (modal) {
              modal.style.display = 'block';      // apre le preferenze
            } else if (banner) {
              localStorage.removeItem('cookieConsent');
              banner.style.display = 'block';     // ripropone il banner
            }
          });

/* ===== Estratto da ao1.html ===== */
function loadGoogleTranslate() {
              new google.translate.TranslateElement({
                  pageLanguage: 'it',
                  includedLanguages: 'en,fr,de,es,pl',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
          }
          
          window.addEventListener('pageshow', function(event) {
              if (event.persisted) { // se viene dalla cache del browser (Back/Forward)
                  loadGoogleTranslate();
              }
          });

/* ===== Estratto da ao1.html ===== */
(function(){
            var CSE_CX = '87b07564ab3cb462a'; // cambia se hai un altro ID
            var input    = document.getElementById('site-search');
            var icon     = document.querySelector('.search-icon');
            var box      = document.getElementById('cse-results');
            var overlay  = document.getElementById('cse-overlay');
            var panel    = document.getElementById('cse-panel');
            var closeBtn = document.getElementById('cse-close');
            var themeBtn = document.getElementById('cse-theme-toggle');
          
            function ensureCSELoaded(cb){
              if (window.google && google.search && google.search.cse && google.search.cse.element){ cb(); return; }
              var done = false;
              window.__gcse = { callback: function(){ if (!done){ done = true; cb(); } } };
              if (!document.querySelector('script[data-cse-loader]')){
                var s = document.createElement('script');
                s.src = 'https://cse.google.com/cse.js?cx=' + encodeURIComponent(CSE_CX);
                s.async = true; s.defer = true; s.setAttribute('data-cse-loader','1');
                document.head.appendChild(s);
              }
            }
          
            function renderInline(){
              try {
                google.search.cse.element.render({
                  div: 'cse-results',
                  tag: 'searchresults-only',
                  gname: 'results'
                });
              } catch(e){}
            }
          
            function getResultsElement(){
              if (!(window.google && google.search && google.search.cse && google.search.cse.element)) return null;
              var el = google.search.cse.element.getElement('results');
              if (!el){ renderInline(); el = google.search.cse.element.getElement('results'); }
              return el;
            }
          
            function openPanel(){
              if (overlay) overlay.style.display = 'block';
              if (panel)   panel.style.display   = 'block';
            }
            function closePanel(){
              if (overlay) overlay.style.display = 'none';
              if (panel)   panel.style.display   = 'none';
            }
            if (overlay) overlay.addEventListener('click', closePanel);
            if (closeBtn) closeBtn.addEventListener('click', closePanel);
          
            if (themeBtn){
              var light = false;
              themeBtn.addEventListener('click', function(){
                light = !light;
                document.body.classList.toggle('cse-light', light);
                themeBtn.textContent = light ? 'Tema: Chiaro' : 'Tema: Scuro';
              });
            }
          
            function executeQuery(q){
            if (!q) return;
            const siteRestrict = '(site:echidisofia.org OR site:casi0048.github.io)';
            ensureCSELoaded(function(){
              var tries = 0;
              (function waitReady(){
                try{
                  var el = (google && google.search && google.search.cse && google.search.cse.element)
                    ? google.search.cse.element.getElement('SEARCH_RESULTS')
                    : (typeof getResultsElement === 'function' ? getResultsElement() : null);
                  if (el && typeof el.execute === 'function'){
                    el.execute(`${q} ${siteRestrict}`);
                    if (typeof openPanel === 'function') openPanel();
                    if (typeof box !== 'undefined' && box) box.style.display = 'block';
                  } else if (tries++ < 100){
                    setTimeout(waitReady, 100);
                  }
                }catch(e){
                  if (tries++ < 100) setTimeout(waitReady, 120);
                }
              })();
            });
          } /* else-if removed (cleanup) */ {
                    setTimeout(waitReady, 100);
                  }
                })();
              });
            }
          
            function submitFromInput(){
            try{
              var term = (input && input.value) ? input.value.trim() : '';
              if (!term) return;
              executeQuery(term);
            }catch(e){}
          }
          
            if (input){
              input.addEventListener('keydown', function(e){
                if (e.key === 'Enter'){
                  e.preventDefault();
                  submitFromInput();
                }
              });
            }
            if (icon){
              icon.addEventListener('click', function(e){
                e.preventDefault();
                submitFromInput();
              });
            }
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function setCookie(name, value){
              var domain = location.hostname.replace(/^www\./,'');
              var exp = "; expires=" + new Date(Date.now()+365*24*60*60*1000).toUTCString();
              document.cookie = name + "=" + value + exp + "; path=/";
              document.cookie = name + "=" + value + exp + "; path=/; domain=." + domain;
            }
            function getCookie(name){
              return (document.cookie.match('(^|;)\s*'+name+'\s*=\s*([^;]+)')||[])[2] || "";
            }
            window.__initGoogleTranslate = function(){
              if (window.google && google.translate && google.translate.TranslateElement) {
                var host = document.getElementById('google_translate_element');
                if (!host) {
                  host = document.createElement('div'); host.id='google_translate_element';
                  host.setAttribute('aria-hidden','true');
                  host.style.cssText="position:absolute;left:-9999px;top:-9999px;height:0;width:0;overflow:hidden";
                  document.body.appendChild(host);
                } else { host.innerHTML = ""; }
                new google.translate.TranslateElement({
                  pageLanguage: 'it',
                  includedLanguages: 'it,en,fr,de,es,pl,pt,ru,ja,zh-CN,ar',
                  autoDisplay: false
                }, 'google_translate_element');
                var c = getCookie("googtrans");
                var lang = (c.split("/")[2] || "it");
                var internal = document.querySelector(".goog-te-combo");
                if (internal && lang) { internal.value = lang; internal.dispatchEvent(new Event('change')); }
              } else {
                setTimeout(window.__initGoogleTranslate, 120);
              }
            };
            (function injectOnce(){
              if (document.querySelector('script[data-gtr]')) return;
              var s = document.createElement('script');
              s.src = "https://translate.google.com/translate_a/element.js?cb=__initGoogleTranslate";
              s.async = true; s.defer = true; s.setAttribute('data-gtr','1');
              document.head.appendChild(s);
            })();
            function applyLang(lang){
              var val = (lang && lang !== 'it') ? ("/it/"+lang) : "/it/it";
              setCookie("googtrans", val);
              var internal = document.querySelector(".goog-te-combo");
              if (internal) { internal.value = lang; internal.dispatchEvent(new Event('change')); }
              else { location.reload(); }
            }
            function syncUI(){
              var sel = document.getElementById('customTranslate');
              if (!sel) return;
              var c = getCookie("googtrans");
              var current = (c.split("/")[2] || "it");
              for (var i=0;i<sel.options.length;i++){ if (sel.options[i].value === current) { sel.selectedIndex = i; break; } }
            }
            document.addEventListener('change', function(e){
              if (e.target && e.target.id === 'customTranslate') {
                applyLang(e.target.value);
              }
            });
            window.addEventListener('pageshow', syncUI);
            document.addEventListener('visibilitychange', function(){ if (!document.hidden) syncUI(); });
            syncUI();
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            try{
              var searchBtn = document.getElementById('cse-search-btn') || document.querySelector('[data-cse-search-btn]');
              if (typeof input !== 'undefined' && input && !input.__cseBound){
                input.addEventListener('keydown', function(e){
                  if (e.key === 'Enter'){ e.preventDefault(); submitFromInput(); }
                });
                input.__cseBound = true;
              }
              if (searchBtn && !searchBtn.__cseBound){
                searchBtn.addEventListener('click', function(e){
                  e.preventDefault(); submitFromInput();
                });
                searchBtn.__cseBound = true;
              }
            }catch(e){}
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function openPrefsHard(){
              try {
                var m = document.getElementById('cookie-modal');
                if (!m) return;
                m.removeAttribute('hidden');
                m.setAttribute('aria-hidden', 'false');
                m.style.display = 'flex';
                m.classList.add('force-open');
                // focus first close or save button for accessibility
                setTimeout(function(){
                  var f = m.querySelector('#cookie-close, #cookie-save, button');
                  if (f && f.focus) try{ f.focus(); }catch(e){}
                }, 30);
              } catch(e){}
            }
            window.openCookiePrefs = function(){
              try { if (typeof openModal === 'function') { openModal(); return; } } catch(e){}
              openPrefsHard();
            };
            function bind(){
              var b = document.getElementById('cookie-fab');
              if (!b) return;
              b.addEventListener('click', function(e){
                e.preventDefault();
                window.openCookiePrefs();
              });
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', bind);
            } else { bind(); }
          })();

/* ===== Estratto da ao1.html ===== */
// === FINAL FAIL-SAFE CLOSER (binds at end, takes precedence) ===
          (function(){
            function closeCookieModalHard(){
              try{
                var m = document.getElementById('cookie-modal');
                if (!m) return;
                m.setAttribute('aria-hidden','true');
                m.classList.remove('force-open');
                m.style.display = 'none';
                m.setAttribute('hidden','');
              }catch(e){}
            }
            // Bind to buttons (capture to pre-empt other handlers if needed)
            ['cookie-close','cookie-cancel'].forEach(function(id){
              var b = document.getElementById(id);
              if (b) b.addEventListener('click', function(ev){ ev.preventDefault(); closeCookieModalHard(); }, {capture:true});
            });
            var saveBtn = document.getElementById('cookie-save');
            if (saveBtn){
              saveBtn.addEventListener('click', function(){ setTimeout(closeCookieModalHard, 10); }, {capture:true});
            }
            // Click outside & ESC
            var modal = document.getElementById('cookie-modal');
            if (modal){
              modal.addEventListener('click', function(e){ if (e.target === modal) closeCookieModalHard(); }, {capture:true});
            }
            document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeCookieModalHard(); }, {capture:true});
            // Expose globally too
            window.closeCookieModalHard = closeCookieModalHard;
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            // Try to locate the main search input conservatively
            var input = document.getElementById('cse-input')
                   || (document.querySelector('header input[type="search"]'))
                   || document.querySelector('input[type="search"]')
                   || document.querySelector('input[name="q"], input[name="s"]');
          
            function normalizeTerm(raw){
              var t = (raw || '').trim();
              if (!t) return '';
              var hasQuote = /["]/.test(t);
              var hasOp = /(site:|intitle:|inurl:|OR|AND|NOT)/i.test(t);
              if (!hasQuote && !hasOp){
                t = '"' + t.replace(/"/g, '') + '"';
              }
              return t;
            }
            function googleUrl(q){
              var site = 'site:echidisofia.org OR site:casi0048.github.io';
              var term = normalizeTerm(q);
              return 'https://www.google.com/search?q=' + encodeURIComponent(term + ' ' + site) + '&hl=it';
            }
            function openGoogleFromInput(){
              var term = (input && input.value) ? input.value.trim() : '';
              if (!term) return;
              var url = googleUrl(term);
              try{
                var w = window.open(url, '_blank', 'noopener');
                if(!w){ location.href = url; }
              }catch(_){ location.href = url; }
            }
          
            // ENTER on the input (capture to beat other listeners)
            document.addEventListener('keydown', function(e){
              if (!input) return;
              var isTarget = (e.target === input) || (input.contains && input.contains(e.target));
              if (isTarget && e.key === 'Enter'){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                openGoogleFromInput();
              }
            }, true);
          
            // Delegated click for search buttons (lens/submit)
            document.addEventListener('click', function(e){
              var sel = '#cse-search-btn, [data-cse-search-btn], .cse-search-btn, button[type=submit], .search button';
              var btn = e.target && e.target.closest ? e.target.closest(sel) : null;
              if (!btn) return;
              // If the button is not part of a search bar, ignore
              var scope = btn.closest && btn.closest('form, header, .search, .searchbar') || document;
              var relatedInput = scope.querySelector && (scope.querySelector('#cse-input') || scope.querySelector('input[type="search"]') || scope.querySelector('input[name="q"], input[name="s"]'));
              if (relatedInput) input = relatedInput;
              e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
              openGoogleFromInput();
            }, true);
          
            // Intercept form submit around the input
            var form = input ? (input.form || (input.closest && input.closest('form'))) : null;
            if (form){
              form.addEventListener('submit', function(e){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                openGoogleFromInput();
              }, true);
            }
          })();

/* ===== Estratto da ao1.html ===== */
const canvas = document.getElementById("shooting-stars");
          const ctx = canvas.getContext("2d");
          
          let w, h;
          function resizeCanvas() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
          }
          window.addEventListener("resize", resizeCanvas);
          resizeCanvas();
          
          class ShootingStar {
            constructor() {
              this.reset();
            }
            reset() {
              this.x = Math.random() * w;
              this.y = Math.random() * h * 0.5;
              this.len = Math.random() * 80 + 10;
              this.speed = Math.random() * 4 + 2;
              this.size = Math.random() * 2 + 1;
              this.opacity = Math.random() * 0.5 + 0.5;
            }
            update() {
              this.x -= this.speed;
          this.y += this.speed * 0.5; // meno discesa
          
              if (this.x < -this.len || this.y > h + this.len) {
                this.reset();
                this.x = Math.random() * w + w;
                this.y = Math.random() * h * 0.7;
              }
            }
            draw() {
              ctx.beginPath();
              const grad = ctx.createLinearGradient(this.x, this.y, this.x + this.len, this.y - this.len);
              grad.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
              grad.addColorStop(1, "rgba(255,255,255,0)");
              ctx.strokeStyle = grad;
              ctx.lineWidth = this.size;
              ctx.moveTo(this.x, this.y);
              ctx.lineTo(this.x + this.len, this.y - this.len);
              ctx.stroke();
            }
          }
          
          let stars = [];
          for (let i = 0; i < 20; i++) {
            stars.push(new ShootingStar());
          }
          
          function animate() {
            ctx.clearRect(0, 0, w, h);
            stars.forEach(star => {
              star.update();
              star.draw();
            });
            requestAnimationFrame(animate);
          }
          animate();
          
          let minSpeed = 4;
          let maxSpeed = 12;
          this.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;

/* ===== Estratto da ao1.html ===== */
(() => {
            const canvas = document.getElementById("shooting-stars");
            const ctx = canvas.getContext("2d");
          
            // HiDPI/Retina fix: scala il canvas in base al devicePixelRatio
            const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
            let W = 0, H = 0;
            function resize() {
              W = canvas.clientWidth  = window.innerWidth;
              H = canvas.clientHeight = window.innerHeight;
              canvas.width  = W * dpr;
              canvas.height = H * dpr;
              ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // disegna in coordinate CSS
            }
            window.addEventListener("resize", resize, { passive: true });
            resize();
          
            // Parametri regolabili
            const COUNT     = 7;     // quante stelle simultanee
          
          
          const MIN_SPEED = 1;
          const MAX_SPEED = 2;
          
           const MIN_LEN   = 30;     // lunghezza scia (min)
            const MAX_LEN   = 110;    // lunghezza scia (max)
            const MIN_SIZE  = 1.2;    // spessore linea (min)
            const MAX_SIZE  = 2.2;    // spessore linea (max)
          
            class ShootingStar {
              constructor() { this.reset(true); }
              rand(min, max) { return Math.random() * (max - min) + min; }
          
              reset(init = false) {
                // punto di partenza: parte alta/destra per traiettoria diagonale ↘
                this.x = init ? this.rand(0, W * 1.2) : W + this.rand(0, 200);
                this.y = this.rand(0, H * 0.5);
          
                this.len   = this.rand(MIN_LEN, MAX_LEN);
                this.speed = this.rand(MIN_SPEED, MAX_SPEED);
                this.size  = this.rand(MIN_SIZE, MAX_SIZE);
                this.opacity = this.rand(0.5, 1);
          
                // Colore casuale per la singola stella (fisso finché non viene resettata)
                this.hue = Math.floor(Math.random() * 360);
                this.startColor = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
                this.endColor   = `hsla(${this.hue}, 100%, 70%, 0)`;
              }
          
              update() {
                // Movimento diagonale: verso sinistra e verso il basso
                this.x -= this.speed;
                this.y += this.speed;
          
                // Se esce dallo schermo, ricomincia da destra/alto
                if (this.x < -this.len || this.y > H + this.len) this.reset();
              }
          
              draw() {
                ctx.beginPath();
                const grad = ctx.createLinearGradient(
                  this.x, this.y,
                  this.x + this.len, this.y - this.len
                );
                grad.addColorStop(0, this.startColor); // testa
                grad.addColorStop(1, this.endColor);   // scia
          
                ctx.strokeStyle = grad;
                ctx.lineWidth = this.size;
                ctx.lineCap = "round";
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.len, this.y - this.len);
                ctx.stroke();
              }
            }
          
            const stars = Array.from({ length: COUNT }, () => new ShootingStar());
          
            // opzionale: scie più morbide usando un velo semitrasparente anziché clearRect pieno
            function fadeBackground() {
              ctx.fillStyle = "rgba(0,0,0,0.2)"; // aumenta opacità se vuoi scie più corte
              ctx.fillRect(0, 0, W, H);
            }
          
            function loop() {
              // Se preferisci niente scie persistenti, usa clearRect.
              // ctx.clearRect(0, 0, W, H);
              fadeBackground();
              for (const s of stars) { s.update(); s.draw(); }
              requestAnimationFrame(loop);
            }
          
            // Imposta un fondo iniziale nero (utile quando si usa fadeBackground)
            ctx.fillStyle = "black"; ctx.fillRect(0, 0, W, H);
            loop();
          })();

/* ===== Estratto da ao1.html ===== */
document.addEventListener('DOMContentLoaded', function(){
            // Container
            let container = document.getElementById('philoParticles');
            if (!container) {
              container = document.createElement('div');
              container.id = 'philoParticles';
              document.body.appendChild(container);
            } else {
              document.body.appendChild(container);
            }
          
            // CSS (una sola volta)
            const STYLE_ID = 'philoParticles-style';
            if (!document.getElementById(STYLE_ID)){
              const st = document.createElement('style'); st.id = STYLE_ID;
              st.textContent = `
                #philoParticles{
                  position: fixed; inset: 0;
                  z-index: 60;
                  pointer-events: none;
                }
                #philoParticles .particle{
                  position: absolute;
                  transform: translate3d(0,0,0);
                  will-change: transform;
                  white-space: nowrap;
                  line-height: 1;
                  text-shadow: 0 0 8px rgba(255,255,255,.45);
                  opacity: .98;
                  /* abilito hover solo se serve: qui resta tutto pass-through */
                  pointer-events: none;
                }
              `;
              document.head.appendChild(st)
            }
          
            // Sorgente simboli/parole
            const symbols = [
              '∞','Φ','Ψ','Λ','Δ','Ω','π','∑','∏','√',
              '≡','≈','∴','∀','∃','∈','∧','∨','⊕','⊗',
              'Σ','Θ','Ξ','ℵ','∂','∇','∫',
              'Sapienza','Verità','Logos','Thanatos','Mito','Essere','Divenire',
              'Idee','Archè','Armonia','Principio','Destino','Libertà','Giustizia',
              'Virtù','Pensiero','Domanda','Risposta','Silenzio','Samsara','Nirvana',
              'Epicuro','Parmenide','Dialogo','Socratico','Platone','Sostanza',
              'Aristotele','Stoà','Eraclito','Nous','Anima','Cosmo',
              'Ipazia','😸Livia','Maria Teresa','Gesù Nazareno','Demetrio Falereo','😺 Polpetta','Casimiro','Guido','Francesco',
              '✨','⚖️','🌎','🛸 ','📚','🪐','🌌','💭','🧠','🗣️','📝','💡','👨‍🚀','🌓','🌕',
              '🌠','☄️','🪐','🌙','🌍 ','🌞','🚀','📗','📙','📕','🔬','☀️',
              '🧭','⌛','🌗','🛸','🌏 ','🌖','🌔','💫 ','🕳️','♾️'
            ];
          
            // Utilità
            const shuffle = a => { for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a; };
            const rand = (a,b)=> Math.random()*(b-a)+a;
            const rndInt = n => Math.floor(Math.random()*n);
            const randHSL = ()=> `hsl(${Math.floor(Math.random()*360)} 100% 70%)`;
          
            // Config
            const cfg = {
              count: 160,          // quante particelle
              minSize: 0.5,        // rem
              maxSize: 1,          // rem
              floatDist: 100,      // raggio di oscillazione
              minSpeed: 0.003,
              maxSpeed: 0.009,
              useRandomHSL: true,
          
          
              // distribuzione
              padding: 16,         // px: margine dai bordi
              jitter: 0.65,        // 0..1: “disordine” dentro la cella
          
              // repulsione
              repelRadius: 120,    // px
              repelStrength: 28    // px
            };
          
            const palette = ['#FFD700','#40E0D0','#FF6347','#9370DB','#00BFFF','#7CFC00','#FF69B4','#FF8C00','#DA70D6','#1E90FF'];
          
            // Stato
            const particles = [];
            let order = [];        // ordine simboli garantito (copertura completa)
            let mx = -1e6, my = -1e6, mouseActive = false;
          
            // Prepara una lista di simboli lunga almeno quanto count e mescolata
            function buildSymbolOrder(){
              order.length = 0;
              // ripeti l’array finché superi count
              while(order.length < cfg.count) order.push(...symbols);
              order = order.slice(0, cfg.count);
              shuffle(order);
            }
          
            // Crea una griglia proporzionata all’aspect-ratio della finestra:
            // celle ~quadrate ⇒ copertura omogenea su tutta la pagina
            function gridLayout(w, h, n){
              const aspect = w / h;
              let cols = Math.max(1, Math.round(Math.sqrt(n * aspect)));
              let rows = Math.max(1, Math.ceil(n / cols));
              // ricalibra per coprire esattamente n
              while(cols*rows < n) rows++;
              return { cols, rows };
            }
          
            function makeParticles(){
              container.innerHTML = "";
              particles.length = 0;
              buildSymbolOrder();
          
              const w = innerWidth  - cfg.padding*2;
              const h = innerHeight - cfg.padding*2;
              const { cols, rows } = gridLayout(w, h, cfg.count);
          
              // Pre-calcola centri cella
              const cells = [];
              for(let r=0; r<rows; r++){
                for(let c=0; c<cols; c++){
                  const cx = cfg.padding + (c + 0.5) * (w / cols);
                  const cy = cfg.padding + (r + 0.5) * (h / rows);
                  cells.push({cx, cy});
                }
              }
              shuffle(cells); // sparpaglia le celle utilizzate
          
              for (let i=0; i<cfg.count; i++){
                const el = document.createElement('div');
                el.className = 'particle';
                el.textContent = order[i];
          
                const size = rand(cfg.minSize, cfg.maxSize);
                el.style.fontSize = size + 'rem';
                el.style.color = cfg.useRandomHSL ? randHSL() : palette[rndInt(palette.length)];
                container.appendChild(el);
          
                const {cx, cy} = cells[i];
          
                // jitter naturale dentro la cella (niente “soldatini”)
                const cellW = w / cols, cellH = h / rows;
                const jx = (Math.random() - 0.5) * cellW * cfg.jitter;
                const jy = (Math.random() - 0.5) * cellH * cfg.jitter;
          
                particles.push({
                  el, size,
                  x: cx + jx,
                  y: cy + jy,
                  ang: Math.random()*Math.PI*2,
                  speed: rand(cfg.minSpeed, cfg.maxSpeed),
                  radius: rand(10, 10 + cfg.floatDist)
                ,
          // rotazione dolce avanti/indietro
          spinAmp:  rand(24, 36),
          spinPhase: Math.random()*Math.PI*2,
          spinFreq:  rand(0.6, 1.4)
          });
              }
            }
          
            // Repulsione (solo mouse/desktop)
            window.addEventListener('pointermove', (e)=>{
              if(e.pointerType && e.pointerType !== 'mouse') return;
              mx = e.clientX; my = e.clientY;
              mouseActive = true;
            }, {passive:true});
            window.addEventListener('pointerleave', ()=>{
              mouseActive = false;
              mx = my = -1e6;
            }, {passive:true});
          
            // Animazione
            function render(){
              for (const p of particles){
                p.ang += p.speed;
                // oscillazione “fluttuante”
                let bx = p.x + Math.cos(p.ang)*p.radius;
                let by = p.y + Math.sin(p.ang*0.7)*p.radius;
                const rot = Math.sin(p.ang * p.spinFreq + p.spinPhase) * p.spinAmp;
          
                // repulsione dolce
                if(mouseActive){
                  const dx = bx - mx, dy = by - my;
                  const d  = Math.hypot(dx, dy);
                  if(d < cfg.repelRadius){
                    const t = 1 - d / cfg.repelRadius;
                    const push = cfg.repelStrength * t * t;
                    const ux = dx / (d || 1), uy = dy / (d || 1);
                    bx += ux * push;
                    by += uy * push;
                  }
                }
          
                p.el.style.transform = `translate3d(${bx}px, ${by}px, 0) translate(-50%, -50%) rotate(${rot}deg)`;
              }
              requestAnimationFrame(render);
            }
          
            // Debounce resize
            let rAF = 0;
            function onResize(){
              if(rAF) cancelAnimationFrame(rAF);
              rAF = requestAnimationFrame(()=>{ makeParticles(); rAF = 0; });
            }
          
            makeParticles();
            render();
            addEventListener('resize', onResize);
          });

/* ===== Estratto da ao1.html ===== */
(function(){
            // Single loader (re-add ours)
            var s = document.createElement('script');
            s.async = true; s.src = "https://cse.google.com/cse.js?cx=87b07564ab3cb462a";
            document.documentElement.appendChild(s);
          
            var panel = document.getElementById('cseCL-panel');
            var backdrop = document.getElementById('cseCL-backdrop');
            var closeBt = document.getElementById('cseCL-close');
            var resultsDiv = document.getElementById('cseCL-results');
            var RENDERED_FLAG = '__cseCL_rendered__';
          
            function openPanel(){ panel.setAttribute('aria-hidden','false'); document.documentElement.style.overflow='hidden'; }
            function closePanel(){ panel.setAttribute('aria-hidden','true'); document.documentElement.style.overflow=''; }
            closeBt.addEventListener('click', closePanel);
            backdrop.addEventListener('click', closePanel);
            document.addEventListener('keydown', function(e){ if(e.key==='Escape') closePanel(); }, true);
          
            function currentQuery(){
              var i = document.getElementById('site-search') ||
                      document.querySelector('.top-bar input[type="search"], header input[type="search"], .search input[type="search"]') ||
                      document.querySelector('.top-bar input[type="text"], header input[type="text"], .search input[type="text"]') ||
                      document.querySelector('input[type="search"]') ||
                      document.querySelector('input[type="text"]');
              return i && i.value ? i.value.trim() : '';
            }
          
            function clearDuplicateGcseInsidePanel(){
              // remove any pre-rendered gcse nodes inside our shell to avoid 30 boxes
              var nodes = resultsDiv.querySelectorAll('.gsc-control-cse, .gcse-search, .gcse-searchresults-only');
              nodes.forEach(function(n){ n.remove(); });
              // also clear the container
              resultsDiv.innerHTML = '<div id="cseCL-root"></div>';
            }
          
            function ensureRendered(){
              if (window[RENDERED_FLAG]) return true;
              try{
                if (!(window.google && google.search && google.search.cse && google.search.cse.element)) return false;
                clearDuplicateGcseInsidePanel();
                google.search.cse.element.render({
                  div: 'cseCL-root',
                  tag: 'searchresults-only',
                  gname: 'results' // use a fixed gname
                });
                window[RENDERED_FLAG] = true;
                return true;
              }catch(e){ console.error(e); return false; }
            }
          
            function execInternal(q){
              q = (q||'').trim(); if(!q) return;
              openPanel();
              var start = Date.now();
              (function tick(){
                try{
                  if (ensureRendered()){
                    var api = google.search.cse.element;
                    var el = api.getElement('results');
                    if (el && typeof el.execute === 'function'){ el.execute(q); return; }
                  }
                }catch(e){ console.error(e); }
                if (Date.now()-start < 8000){ return setTimeout(tick, 60); }
              })();
            }
          
            // Hard-neutralize external openers
            window.googleUrl = function(){ return '#'; };
            window.openGoogleFromInput = function(){ execInternal(currentQuery()); };
            window.submitFromInput = function(){ execInternal(currentQuery()); };
            window.executeQuery = function(q){ execInternal(q); };
          
            // Capture handlers to block external navigation and duplicates
            function isLens(el){
              if (!el) return false;
              if (el.matches && el.matches('.search-icon, .fa-magnifying-glass, [data-cse-search-btn], #cse-search-btn, .cse-search-btn, button[type=submit]')) return true;
              return !!(el.closest && el.closest('.search-icon, .fa-magnifying-glass, [data-cse-search-btn], #cse-search-btn, .cse-search-btn, .search button, button[type=submit]'));
            }
            function isSearchInput(el){ return el && el.tagName==='INPUT' && (el.type==='search' || el.type==='text'); }
          
            document.addEventListener('keydown', function(e){
              if (e.key!=='Enter') return;
              if (isSearchInput(e.target)){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                execInternal(currentQuery());
              }
            }, true);
          
            document.addEventListener('click', function(e){
              if (isLens(e.target)){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                execInternal(currentQuery());
              }
            }, true);
          
            document.addEventListener('submit', function(e){
              if (e && e.target && e.target.querySelector && e.target.querySelector('input[type="search"], input[type="text"]')){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                execInternal(currentQuery());
              }
            }, true);
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            // Single loader (re-add ours)
            var s = document.createElement('script');
            s.async = true; s.src = "https://cse.google.com/cse.js?cx=87b07564ab3cb462a";
            document.documentElement.appendChild(s);
          
            var panel = document.getElementById('cseCL-panel');
            var backdrop = document.getElementById('cseCL-backdrop');
            var closeBt = document.getElementById('cseCL-close');
            var resultsDiv = document.getElementById('cseCL-results');
            var RENDERED_FLAG = '__cseCL_rendered__';
          
            function openPanel(){ panel.setAttribute('aria-hidden','false'); document.documentElement.style.overflow='hidden'; }
            function closePanel(){ panel.setAttribute('aria-hidden','true'); document.documentElement.style.overflow=''; }
            closeBt.addEventListener('click', closePanel);
            backdrop.addEventListener('click', closePanel);
            document.addEventListener('keydown', function(e){ if(e.key==='Escape') closePanel(); }, true);
          
            function currentQuery(){
              var i = document.getElementById('site-search') ||
                      document.querySelector('.top-bar input[type="search"], header input[type="search"], .search input[type="search"]') ||
                      document.querySelector('.top-bar input[type="text"], header input[type="text"], .search input[type="text"]') ||
                      document.querySelector('input[type="search"]') ||
                      document.querySelector('input[type="text"]');
              return i && i.value ? i.value.trim() : '';
            }
          
            function clearDuplicateGcseInsidePanel(){
              // remove any pre-rendered gcse nodes inside our shell to avoid 30 boxes
              var nodes = resultsDiv.querySelectorAll('.gsc-control-cse, .gcse-search, .gcse-searchresults-only');
              nodes.forEach(function(n){ n.remove(); });
              // also clear the container
              resultsDiv.innerHTML = '<div id="cseCL-root"></div>';
            }
          
            function ensureRendered(){
              if (window[RENDERED_FLAG]) return true;
              try{
                if (!(window.google && google.search && google.search.cse && google.search.cse.element)) return false;
                clearDuplicateGcseInsidePanel();
                google.search.cse.element.render({
                  div: 'cseCL-root',
                  tag: 'searchresults-only',
                  gname: 'results' // use a fixed gname
                });
                window[RENDERED_FLAG] = true;
                return true;
              }catch(e){ console.error(e); return false; }
            }
          
            function execInternal(q){
              q = (q||'').trim(); if(!q) return;
              openPanel();
              var start = Date.now();
              (function tick(){
                try{
                  if (ensureRendered()){
                    var api = google.search.cse.element;
                    var el = api.getElement('results');
                    if (el && typeof el.execute === 'function'){ el.execute(q); return; }
                  }
                }catch(e){ console.error(e); }
                if (Date.now()-start < 8000){ return setTimeout(tick, 60); }
              })();
            }
          
            // Hard-neutralize external openers
            window.googleUrl = function(){ return '#'; };
            window.openGoogleFromInput = function(){ execInternal(currentQuery()); };
            window.submitFromInput = function(){ execInternal(currentQuery()); };
            window.executeQuery = function(q){ execInternal(q); };
          
            // Capture handlers to block external navigation and duplicates
            function isLens(el){
              if (!el) return false;
              if (el.matches && el.matches('.search-icon, .fa-magnifying-glass, [data-cse-search-btn], #cse-search-btn, .cse-search-btn, button[type=submit]')) return true;
              return !!(el.closest && el.closest('.search-icon, .fa-magnifying-glass, [data-cse-search-btn], #cse-search-btn, .cse-search-btn, .search button, button[type=submit]'));
            }
            function isSearchInput(el){ return el && el.tagName==='INPUT' && (el.type==='search' || el.type==='text'); }
          
            document.addEventListener('keydown', function(e){
              if (e.key!=='Enter') return;
              if (isSearchInput(e.target)){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                execInternal(currentQuery());
              }
            }, true);
          
            document.addEventListener('click', function(e){
              if (isLens(e.target)){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                execInternal(currentQuery());
              }
            }, true);
          
            document.addEventListener('submit', function(e){
              if (e && e.target && e.target.querySelector && e.target.querySelector('input[type="search"], input[type="text"]')){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                execInternal(currentQuery());
              }
            }, true);
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            // 1) Site data (estratti reali dal sito)
            window.siteData = window.siteData || [
              { url: "Presocratici/talete.html", title: "Talete di Mileto", content: "Talete fu una figura poliedrica del pensiero arcaico: matematico, astronomo e politico; la sua dottrina sull’acqua come principio originario ci è nota soprattutto attraverso Aristotele." },
              { url: "Presocratici/anassimandro.html", title: "Anassimandro di Mileto", content: "Pioniere del pensiero scientifico, discepolo di Talete; introdusse l’ápeiron come principio e sviluppò una visione naturale e razionale del cosmo." },
              { url: "Presocratici/anassimene.html", title: "Anassimene di Mileto", content: "Ultimo dei milesi: identificò nell’aria l’archè di tutte le cose, proseguendo la ricerca dei presocratici sulle cause naturali." },
              { url: "Presocratici/senofane.html", title: "Senofane di Colofone", content: "Poeta‑filosofo viandante: critica radicale alla religione tradizionale e fondazione della scuola eleatica." },
              { url: "articoli/ermarco.html", title: "Ermarco di Mitilene", content: "Successore di Epicuro nel Giardino: preservò e diffuse la dottrina epicurea con fedeltà e innovazione, guidando la scuola dopo il 270 a.C." },
              { url: "articoli/seneca.html", title: "Lucio Anneo Seneca", content: "Figura eminente della filosofia romana: stoico, drammaturgo e statista; i suoi scritti mirano alla tranquillità interiore e alla virtù in un’epoca turbolenta." },
              { url: "articoli/eudemo.html", title: "Eudemo di Rodi", content: "Discepolo fedele di Aristotele e membro di spicco della scuola peripatetica; ponte tra l’insegnamento aristotelico e la tradizione successiva." },
              { url: "pagine/benvenuti.html", title: "Presentazione (Incipit)", content: "Echi di Sofia: uno spazio dedicato alla meraviglia e alla saggezza, dove il pensiero antico e moderno risuona oggi attraverso domande che attraversano il tempo." },
              { url: "articoli/tarski.html", title: "Alfred Tarski", content: "Logico e filosofo del linguaggio: teoria semantica della verità (Convenzione T), contributi a logica, geometria e teoria degli insiemi; influenze su filosofia e informatica teorica." },
              { url: "articoli/frege.html", title: "Gottlob Frege", content: "Padre della logica moderna: dal Begriffsschrift alla distinzione senso/riferimento; ha fondato la logica dei predicati e influenzato l’analitica." },
              { url: "articoli/lyotard.html", title: "Jean‑François Lyotard", content: "Teorico del postmoderno: fine delle grandi narrazioni, giochi linguistici, legittimazione performativa del sapere; opere come La condizione postmoderna e Il dissidio." },
              { url: "pagine/pagina-contatti.html", title: "Contatti", content: "Pagina di contatto per domande, suggerimenti e collaborazioni con Echi di Sofia." }
            ];
          
            // 2) ENTER = click sulla lente (nessun cambio layout/animazioni)
            function triggerSearchFrom(el){
              try{
                var input = el && (el.tagName ? el : null);
                var container = input && input.closest && (input.closest('.search-container') || input.closest('.bar-right') || input.closest('.top-bar') || input.closest('form') || document);
                var btn = container && container.querySelector && (container.querySelector('.search-icon') ||
                          container.querySelector('[data-cse-search-btn]') ||
                          container.querySelector('#cse-search-btn') ||
                          container.querySelector('.cse-search-btn') ||
                          container.querySelector('button[type="submit"]'));
                if (btn && typeof btn.click === 'function'){ btn.click(); return true; }
          
                var q = (input && input.value) ? input.value.trim() : '';
                if (typeof submitFromInput === 'function'){ submitFromInput(); return true; }
                if (typeof openGoogleFromInput === 'function'){ openGoogleFromInput(); return true; }
                if (typeof executeQuery === 'function'){ executeQuery(q); return true; }
                document.dispatchEvent(new CustomEvent('perform-site-search', { detail: { query: q } }));
                return false;
              }catch(e){ console.error(e); return false; }
            }
          
            function onEnter(e){
              if (e.key === 'Enter'){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                triggerSearchFrom(e.target);
              }
            }
          
            function bindEnterHandlers(){
              var nodes = Array.from(document.querySelectorAll('#site-search, input[type="search"]'));
              nodes.forEach(function(inp){
                if (!inp.__enterFixBound){
                  inp.addEventListener('keydown', onEnter, true);
                  inp.__enterFixBound = true;
                }
              });
            }
            bindEnterHandlers();
          
            document.addEventListener('submit', function(e){
              try{
                var target = e.target;
                if (target && target.querySelector && target.querySelector('#site-search, input[type="search"]')){
                  e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                  var inp = target.querySelector('#site-search, input[type="search"]');
                  triggerSearchFrom(inp || document.getElementById('site-search'));
                }
              }catch(_ ){}
            }, true);
          
            var mo = new MutationObserver(function(){ bindEnterHandlers(); });
            mo.observe(document.documentElement, { childList: true, subtree: true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function ensureClearFor(input){
              if (!input) return;
              var wrap = (input.closest && input.closest('.search-container')) || input.parentElement;
              if (!wrap) return;
              // evita duplicati: se esiste già, riusa
              var btn = wrap.querySelector('.clear-icon');
              if (!btn){
                btn = document.createElement('span');
                btn.className = 'clear-icon';
                btn.setAttribute('role','button');
                btn.setAttribute('aria-label','Pulisci ricerca');
                btn.title = 'Pulisci';
                btn.textContent = '✖';
                wrap.appendChild(btn);
              }
              if (!btn.__bound){
                btn.addEventListener('click', function(){
                  input.value = '';
                  input.focus();
                  // notifica eventuali listener
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                });
                btn.__bound = true;
              }
            }
            function initAll(){
              document.querySelectorAll('.search-container input[type="search"], .search-container input[type="text"], #site-search')
                .forEach(ensureClearFor);
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', initAll, { once:true });
            } else {
              initAll();
            }
            new MutationObserver(initAll).observe(document.documentElement, { childList:true, subtree:true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function playExplosion(){
              var boom = document.getElementById('explosionSound');
              if (boom){
                try{ boom.currentTime = 0; }catch(e){}
                var p = boom.play();
                if (p && typeof p.catch === 'function'){
                  p.catch(function(err){ console.warn('Audio esplosione bloccato:', err); });
                }
              }
            }
            function triggerExplodeEffect(){
              var el = document.getElementById('exploding');
              if (!el) return;
              // se esiste il listener GSAP, riusa il click
              var hadGsap = !!window.gsap && el.querySelector('span');
              if (hadGsap){
                el.dispatchEvent(new Event('click', {bubbles:true}));
              } else {
                el.classList.add('explode');
                setTimeout(function(){ el.classList.remove('explode'); }, 1200);
              }
            }
            function bind(){
              var btn = document.getElementById('btn-explode');
              if (!btn) return;
              if (btn.__explosionBound) return;
              btn.addEventListener('click', function(){
                playExplosion();
                triggerExplodeEffect();
              });
              btn.__explosionBound = true;
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', bind);
            } else {
              bind();
            }
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            // 1) Site data (estratti reali dal sito)
            window.siteData = window.siteData || [
              { url: "Presocratici/talete.html", title: "Talete di Mileto", content: "Talete fu una figura poliedrica del pensiero arcaico: matematico, astronomo e politico; la sua dottrina sull’acqua come principio originario ci è nota soprattutto attraverso Aristotele." },
              { url: "Presocratici/anassimandro.html", title: "Anassimandro di Mileto", content: "Pioniere del pensiero scientifico, discepolo di Talete; introdusse l’ápeiron come principio e sviluppò una visione naturale e razionale del cosmo." },
              { url: "Presocratici/anassimene.html", title: "Anassimene di Mileto", content: "Ultimo dei milesi: identificò nell’aria l’archè di tutte le cose, proseguendo la ricerca dei presocratici sulle cause naturali." },
              { url: "Presocratici/senofane.html", title: "Senofane di Colofone", content: "Poeta‑filosofo viandante: critica radicale alla religione tradizionale e fondazione della scuola eleatica." },
              { url: "articoli/ermarco.html", title: "Ermarco di Mitilene", content: "Successore di Epicuro nel Giardino: preservò e diffuse la dottrina epicurea con fedeltà e innovazione, guidando la scuola dopo il 270 a.C." },
              { url: "articoli/seneca.html", title: "Lucio Anneo Seneca", content: "Figura eminente della filosofia romana: stoico, drammaturgo e statista; i suoi scritti mirano alla tranquillità interiore e alla virtù in un’epoca turbolenta." },
              { url: "articoli/eudemo.html", title: "Eudemo di Rodi", content: "Discepolo fedele di Aristotele e membro di spicco della scuola peripatetica; ponte tra l’insegnamento aristotelico e la tradizione successiva." },
              { url: "pagine/benvenuti.html", title: "Presentazione (Incipit)", content: "Echi di Sofia: uno spazio dedicato alla meraviglia e alla saggezza, dove il pensiero antico e moderno risuona oggi attraverso domande che attraversano il tempo." },
              { url: "articoli/tarski.html", title: "Alfred Tarski", content: "Logico e filosofo del linguaggio: teoria semantica della verità (Convenzione T), contributi a logica, geometria e teoria degli insiemi; influenze su filosofia e informatica teorica." },
              { url: "articoli/frege.html", title: "Gottlob Frege", content: "Padre della logica moderna: dal Begriffsschrift alla distinzione senso/riferimento; ha fondato la logica dei predicati e influenzato l’analitica." },
              { url: "articoli/lyotard.html", title: "Jean‑François Lyotard", content: "Teorico del postmoderno: fine delle grandi narrazioni, giochi linguistici, legittimazione performativa del sapere; opere come La condizione postmoderna e Il dissidio." },
              { url: "pagine/pagina-contatti.html", title: "Contatti", content: "Pagina di contatto per domande, suggerimenti e collaborazioni con Echi di Sofia." }
            ];
          
            // 2) ENTER = click sulla lente (nessun cambio layout/animazioni)
            function triggerSearchFrom(el){
              try{
                var input = el && (el.tagName ? el : null);
                var container = input && input.closest && (input.closest('.search-container') || input.closest('.bar-right') || input.closest('.top-bar') || input.closest('form') || document);
                var btn = container && container.querySelector && (container.querySelector('.search-icon') ||
                          container.querySelector('[data-cse-search-btn]') ||
                          container.querySelector('#cse-search-btn') ||
                          container.querySelector('.cse-search-btn') ||
                          container.querySelector('button[type="submit"]'));
                if (btn && typeof btn.click === 'function'){ btn.click(); return true; }
          
                var q = (input && input.value) ? input.value.trim() : '';
                if (typeof submitFromInput === 'function'){ submitFromInput(); return true; }
                if (typeof openGoogleFromInput === 'function'){ openGoogleFromInput(); return true; }
                if (typeof executeQuery === 'function'){ executeQuery(q); return true; }
                document.dispatchEvent(new CustomEvent('perform-site-search', { detail: { query: q } }));
                return false;
              }catch(e){ console.error(e); return false; }
            }
          
            function onEnter(e){
              if (e.key === 'Enter'){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                triggerSearchFrom(e.target);
              }
            }
          
            function bindEnterHandlers(){
              var nodes = Array.from(document.querySelectorAll('#site-search, input[type="search"]'));
              nodes.forEach(function(inp){
                if (!inp.__enterFixBound){
                  inp.addEventListener('keydown', onEnter, true);
                  inp.__enterFixBound = true;
                }
              });
            }
            bindEnterHandlers();
          
            document.addEventListener('submit', function(e){
              try{
                var target = e.target;
                if (target && target.querySelector && target.querySelector('#site-search, input[type="search"]')){
                  e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                  var inp = target.querySelector('#site-search, input[type="search"]');
                  triggerSearchFrom(inp || document.getElementById('site-search'));
                }
              }catch(_ ){}
            }, true);
          
            var mo = new MutationObserver(function(){ bindEnterHandlers(); });
            mo.observe(document.documentElement, { childList: true, subtree: true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function ensureClearFor(input){
              if (!input) return;
              var wrap = (input.closest && input.closest('.search-container')) || input.parentElement;
              if (!wrap) return;
              // evita duplicati: se esiste già, riusa
              var btn = wrap.querySelector('.clear-icon');
              if (!btn){
                btn = document.createElement('span');
                btn.className = 'clear-icon';
                btn.setAttribute('role','button');
                btn.setAttribute('aria-label','Pulisci ricerca');
                btn.title = 'Pulisci';
                btn.textContent = '✖';
                wrap.appendChild(btn);
              }
              if (!btn.__bound){
                btn.addEventListener('click', function(){
                  input.value = '';
                  input.focus();
                  // notifica eventuali listener
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                });
                btn.__bound = true;
              }
            }
            function initAll(){
              document.querySelectorAll('.search-container input[type="search"], .search-container input[type="text"], #site-search')
                .forEach(ensureClearFor);
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', initAll, { once:true });
            } else {
              initAll();
            }
            new MutationObserver(initAll).observe(document.documentElement, { childList:true, subtree:true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function playExplosion(){
              var boom = document.getElementById('explosionSound');
              if (boom){
                try{ boom.currentTime = 0; }catch(e){}
                var p = boom.play();
                if (p && typeof p.catch === 'function'){
                  p.catch(function(err){ console.warn('Audio esplosione bloccato:', err); });
                }
              }
            }
            function triggerExplodeEffect(){
              var el = document.getElementById('exploding');
              if (!el) return;
              // se esiste il listener GSAP, riusa il click
              var hadGsap = !!window.gsap && el.querySelector('span');
              if (hadGsap){
                el.dispatchEvent(new Event('click', {bubbles:true}));
              } else {
                el.classList.add('explode');
                setTimeout(function(){ el.classList.remove('explode'); }, 1200);
              }
            }
            function bind(){
              var btn = document.getElementById('btn-explode');
              if (!btn) return;
              if (btn.__explosionBound) return;
              btn.addEventListener('click', function(){
                playExplosion();
                triggerExplodeEffect();
              });
              btn.__explosionBound = true;
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', bind);
            } else {
              bind();
            }
          })();

/* ===== Estratto da ao1.html ===== */
// Inizializzazione CSE
          function initGoogleCSE() {
            var cx = '87b07564ab3cb462a'; // Sostituisci con il tuo CX
            var gcse = document.createElement('script');
            gcse.type = 'text/javascript';
            gcse.async = true;
            gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gcse, s);
            
            // Cerca input e icona
            var searchInput = document.getElementById('site-search');
            var searchIcon = document.querySelector('.search-icon');
            
            if (searchInput) {
              searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  executeSearch(this.value);
                }
              });
            }
            
            if (searchIcon) {
              searchIcon.addEventListener('click', function(e) {
                e.preventDefault();
                executeSearch(searchInput.value);
              });
            }
          }
          
          // Esegui ricerca
          function executeSearch(query) {
            if (!query.trim()) return;
            
            var container = document.getElementById('cse-results-container');
            container.style.display = 'block';
            
            // Se Google CSE è già caricato
            if (window.google && google.search && google.search.cse) {
              var element = google.search.cse.element.getElement('searchresults-only0');
              if (element) {
                element.execute(query);
              } else {
                // Se l'elemento non esiste, prova a renderizzarlo
                google.search.cse.element.render({
                  div: 'cse-results',
                  tag: 'searchresults-only'
                });
                setTimeout(function() {
                  var el = google.search.cse.element.getElement('searchresults-only0');
                  if (el) el.execute(query);
                }, 500);
              }
            }
          }
          
          // Chiudi risultati
          function closeSearchResults() {
            document.getElementById('cse-results-container').style.display = 'none';
          }
          
          // Carica CSE quando la pagina è pronta
          if (document.readyState === 'complete') {
            initGoogleCSE();
          } else {
            window.addEventListener('load', initGoogleCSE);
          }

/* ===== Estratto da ao1.html ===== */
(function(){
            // 1) Site data (estratti reali dal sito)
            window.siteData = window.siteData || [
              { url: "Presocratici/talete.html", title: "Talete di Mileto", content: "Talete fu una figura poliedrica del pensiero arcaico: matematico, astronomo e politico; la sua dottrina sull’acqua come principio originario ci è nota soprattutto attraverso Aristotele." },
              { url: "Presocratici/anassimandro.html", title: "Anassimandro di Mileto", content: "Pioniere del pensiero scientifico, discepolo di Talete; introdusse l’ápeiron come principio e sviluppò una visione naturale e razionale del cosmo." },
              { url: "Presocratici/anassimene.html", title: "Anassimene di Mileto", content: "Ultimo dei milesi: identificò nell’aria l’archè di tutte le cose, proseguendo la ricerca dei presocratici sulle cause naturali." },
              { url: "Presocratici/senofane.html", title: "Senofane di Colofone", content: "Poeta‑filosofo viandante: critica radicale alla religione tradizionale e fondazione della scuola eleatica." },
              { url: "articoli/ermarco.html", title: "Ermarco di Mitilene", content: "Successore di Epicuro nel Giardino: preservò e diffuse la dottrina epicurea con fedeltà e innovazione, guidando la scuola dopo il 270 a.C." },
              { url: "articoli/seneca.html", title: "Lucio Anneo Seneca", content: "Figura eminente della filosofia romana: stoico, drammaturgo e statista; i suoi scritti mirano alla tranquillità interiore e alla virtù in un’epoca turbolenta." },
              { url: "articoli/eudemo.html", title: "Eudemo di Rodi", content: "Discepolo fedele di Aristotele e membro di spicco della scuola peripatetica; ponte tra l’insegnamento aristotelico e la tradizione successiva." },
              { url: "pagine/benvenuti.html", title: "Presentazione (Incipit)", content: "Echi di Sofia: uno spazio dedicato alla meraviglia e alla saggezza, dove il pensiero antico e moderno risuona oggi attraverso domande che attraversano il tempo." },
              { url: "articoli/tarski.html", title: "Alfred Tarski", content: "Logico e filosofo del linguaggio: teoria semantica della verità (Convenzione T), contributi a logica, geometria e teoria degli insiemi; influenze su filosofia e informatica teorica." },
              { url: "articoli/frege.html", title: "Gottlob Frege", content: "Padre della logica moderna: dal Begriffsschrift alla distinzione senso/riferimento; ha fondato la logica dei predicati e influenzato l’analitica." },
              { url: "articoli/lyotard.html", title: "Jean‑François Lyotard", content: "Teorico del postmoderno: fine delle grandi narrazioni, giochi linguistici, legittimazione performativa del sapere; opere come La condizione postmoderna e Il dissidio." },
              { url: "pagine/pagina-contatti.html", title: "Contatti", content: "Pagina di contatto per domande, suggerimenti e collaborazioni con Echi di Sofia." }
            ];
          
            // 2) ENTER = click sulla lente (nessun cambio layout/animazioni)
            function triggerSearchFrom(el){
              try{
                var input = el && (el.tagName ? el : null);
                var container = input && input.closest && (input.closest('.search-container') || input.closest('.bar-right') || input.closest('.top-bar') || input.closest('form') || document);
                var btn = container && container.querySelector && (container.querySelector('.search-icon') ||
                          container.querySelector('[data-cse-search-btn]') ||
                          container.querySelector('#cse-search-btn') ||
                          container.querySelector('.cse-search-btn') ||
                          container.querySelector('button[type="submit"]'));
                if (btn && typeof btn.click === 'function'){ btn.click(); return true; }
          
                var q = (input && input.value) ? input.value.trim() : '';
                if (typeof submitFromInput === 'function'){ submitFromInput(); return true; }
                if (typeof openGoogleFromInput === 'function'){ openGoogleFromInput(); return true; }
                if (typeof executeQuery === 'function'){ executeQuery(q); return true; }
                document.dispatchEvent(new CustomEvent('perform-site-search', { detail: { query: q } }));
                return false;
              }catch(e){ console.error(e); return false; }
            }
          
            function onEnter(e){
              if (e.key === 'Enter'){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                triggerSearchFrom(e.target);
              }
            }
          
            function bindEnterHandlers(){
              var nodes = Array.from(document.querySelectorAll('#site-search, input[type="search"]'));
              nodes.forEach(function(inp){
                if (!inp.__enterFixBound){
                  inp.addEventListener('keydown', onEnter, true);
                  inp.__enterFixBound = true;
                }
              });
            }
            bindEnterHandlers();
          
            document.addEventListener('submit', function(e){
              try{
                var target = e.target;
                if (target && target.querySelector && target.querySelector('#site-search, input[type="search"]')){
                  e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                  var inp = target.querySelector('#site-search, input[type="search"]');
                  triggerSearchFrom(inp || document.getElementById('site-search'));
                }
              }catch(_ ){}
            }, true);
          
            var mo = new MutationObserver(function(){ bindEnterHandlers(); });
            mo.observe(document.documentElement, { childList: true, subtree: true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function ensureClearFor(input){
              if (!input) return;
              var wrap = (input.closest && input.closest('.search-container')) || input.parentElement;
              if (!wrap) return;
              // evita duplicati: se esiste già, riusa
              var btn = wrap.querySelector('.clear-icon');
              if (!btn){
                btn = document.createElement('span');
                btn.className = 'clear-icon';
                btn.setAttribute('role','button');
                btn.setAttribute('aria-label','Pulisci ricerca');
                btn.title = 'Pulisci';
                btn.textContent = '✖';
                wrap.appendChild(btn);
              }
              if (!btn.__bound){
                btn.addEventListener('click', function(){
                  input.value = '';
                  input.focus();
                  // notifica eventuali listener
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                });
                btn.__bound = true;
              }
            }
            function initAll(){
              document.querySelectorAll('.search-container input[type="search"], .search-container input[type="text"], #site-search')
                .forEach(ensureClearFor);
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', initAll, { once:true });
            } else {
              initAll();
            }
            new MutationObserver(initAll).observe(document.documentElement, { childList:true, subtree:true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function playExplosion(){
              var boom = document.getElementById('explosionSound');
              if (boom){
                try{ boom.currentTime = 0; }catch(e){}
                var p = boom.play();
                if (p && typeof p.catch === 'function'){
                  p.catch(function(err){ console.warn('Audio esplosione bloccato:', err); });
                }
              }
            }
            function triggerExplodeEffect(){
              var el = document.getElementById('exploding');
              if (!el) return;
              // se esiste il listener GSAP, riusa il click
              var hadGsap = !!window.gsap && el.querySelector('span');
              if (hadGsap){
                el.dispatchEvent(new Event('click', {bubbles:true}));
              } else {
                el.classList.add('explode');
                setTimeout(function(){ el.classList.remove('explode'); }, 1200);
              }
            }
            function bind(){
              var btn = document.getElementById('btn-explode');
              if (!btn) return;
              if (btn.__explosionBound) return;
              btn.addEventListener('click', function(){
                playExplosion();
                triggerExplodeEffect();
              });
              btn.__explosionBound = true;
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', bind);
            } else {
              bind();
            }
          })();

/* ===== Estratto da ao1.html ===== */
// Variabile globale per i dati del sito
          var siteData = [];
          
          // Funzione per caricare i dati del sito
          async function loadSiteData(){
          try{
          const r = await fetch('sitemap.json', {cache:'no-store'});
          if(!r.ok) throw new Error('HTTP '+r.status);
          const ct = r.headers.get('content-type')||'';
          if(!/json/i.test(ct)) throw new Error('Not JSON');
          siteData = await r.json();
          }catch(error){
          console.error("Errore nel caricamento dei dati:", error);
          siteData = siteData && siteData.length ? siteData : [
          {url:"articoli/socrate.html", title:"Socrate", content:"Socrate è stato un filosofo greco antico."},
          {url:"articoli/platone.html", title:"Platone", content:"Platone è stato allievo di Socrate."}
          ];
          }
          },
          {url:"articoli/platone.html",  title:"Platone", content:"Platone è stato allievo di Socrate."}
          ];
          }
          }
          ror("Errore nel caricamento dei dati:", error);
              // Fallback manuale se il JSON non è disponibile
              siteData = [
                {url: "articoli/socrate.html", title: "Socrate", content: "Socrate è stato un filosofo greco antico..."},
                {url: "articoli/platone.html", title: "Platone", content: "Platone è stato allievo di Socrate..."},
                // Aggiungi tutte le pagine del tuo sito qui
              ];
            }
          }
          
          // Funzione di ricerca
          function performSearch(query) {
            if (!query.trim()) return;
            
            const resultsContainer = document.getElementById('internal-search-results');
            resultsContainer.innerHTML = '<p style="color:#fff;">Ricerca in corso...</p>';
            
            // Mostra il pannello
            document.getElementById('search-results-panel').style.display = 'block';
            
            // Simuliamo un ritardo per la ricerca
            setTimeout(() => {
              const searchTerm = query.toLowerCase();
              const results = siteData.filter(item => 
                item.title.toLowerCase().includes(searchTerm) || 
                item.content.toLowerCase().includes(searchTerm)
              );
              
              displayResults(results);
            }, 300);
          }
          
          // Mostra i risultati
          function displayResults(results) {
            const resultsContainer = document.getElementById('internal-search-results');
            
            if (results.length === 0) {
              resultsContainer.innerHTML = '<p style="color:#fff;">Nessun risultato trovato.</p>';
              return;
            }
            
            let html = '<div style="display:grid;gap:15px;">';
            results.forEach(result => {
              html += `
                <div style="background:rgba(20,20,40,0.8);padding:15px;border-radius:6px;border-left:3px solid #d4af37;">
                  <h3 style="margin-top:0;margin-bottom:10px;">
                    <a href="${result.url}" style="color:#9ad0ff;text-decoration:none;">${result.title}</a>
                  </h3>
                  <p style="color:#cfe8ff;margin:0;">${result.content.substring(0,150)}...</p>
                  <a href="${result.url}" style="color:#00ccff;display:inline-block;margin-top:10px;">Leggi tutto →</a>
                </div>
              `;
            });
            html += '</div>';
            
            resultsContainer.innerHTML = html;
          }
          
          // Chiudi il pannello
          function closeSearchPanel() {
            document.getElementById('search-results-panel').style.display = 'none';
          }
          
          // Inizializzazione
          document.addEventListener('DOMContentLoaded', function() {
            // Carica i dati del sito
            loadSiteData();
            
            // Configura la barra di ricerca
            const searchInput = document.getElementById('site-search');
            const searchIcon = document.querySelector('.search-icon');
            
            if (searchInput) {
              searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  performSearch(this.value);
                }
              });
            }
            
            if (searchIcon) {
              searchIcon.addEventListener('click', function(e) {
                e.preventDefault();
                performSearch(searchInput.value);
              });
            }
          });

/* ===== Estratto da ao1.html ===== */
(function(){
            // 1) Site data (estratti reali dal sito)
            window.siteData = window.siteData || [
              { url: "Presocratici/talete.html", title: "Talete di Mileto", content: "Talete fu una figura poliedrica del pensiero arcaico: matematico, astronomo e politico; la sua dottrina sull’acqua come principio originario ci è nota soprattutto attraverso Aristotele." },
              { url: "Presocratici/anassimandro.html", title: "Anassimandro di Mileto", content: "Pioniere del pensiero scientifico, discepolo di Talete; introdusse l’ápeiron come principio e sviluppò una visione naturale e razionale del cosmo." },
              { url: "Presocratici/anassimene.html", title: "Anassimene di Mileto", content: "Ultimo dei milesi: identificò nell’aria l’archè di tutte le cose, proseguendo la ricerca dei presocratici sulle cause naturali." },
              { url: "Presocratici/senofane.html", title: "Senofane di Colofone", content: "Poeta‑filosofo viandante: critica radicale alla religione tradizionale e fondazione della scuola eleatica." },
              { url: "articoli/ermarco.html", title: "Ermarco di Mitilene", content: "Successore di Epicuro nel Giardino: preservò e diffuse la dottrina epicurea con fedeltà e innovazione, guidando la scuola dopo il 270 a.C." },
              { url: "articoli/seneca.html", title: "Lucio Anneo Seneca", content: "Figura eminente della filosofia romana: stoico, drammaturgo e statista; i suoi scritti mirano alla tranquillità interiore e alla virtù in un’epoca turbolenta." },
              { url: "articoli/eudemo.html", title: "Eudemo di Rodi", content: "Discepolo fedele di Aristotele e membro di spicco della scuola peripatetica; ponte tra l’insegnamento aristotelico e la tradizione successiva." },
              { url: "pagine/benvenuti.html", title: "Presentazione (Incipit)", content: "Echi di Sofia: uno spazio dedicato alla meraviglia e alla saggezza, dove il pensiero antico e moderno risuona oggi attraverso domande che attraversano il tempo." },
              { url: "articoli/tarski.html", title: "Alfred Tarski", content: "Logico e filosofo del linguaggio: teoria semantica della verità (Convenzione T), contributi a logica, geometria e teoria degli insiemi; influenze su filosofia e informatica teorica." },
              { url: "articoli/frege.html", title: "Gottlob Frege", content: "Padre della logica moderna: dal Begriffsschrift alla distinzione senso/riferimento; ha fondato la logica dei predicati e influenzato l’analitica." },
              { url: "articoli/lyotard.html", title: "Jean‑François Lyotard", content: "Teorico del postmoderno: fine delle grandi narrazioni, giochi linguistici, legittimazione performativa del sapere; opere come La condizione postmoderna e Il dissidio." },
              { url: "pagine/pagina-contatti.html", title: "Contatti", content: "Pagina di contatto per domande, suggerimenti e collaborazioni con Echi di Sofia." }
            ];
          
            // 2) ENTER = click sulla lente (nessun cambio layout/animazioni)
            function triggerSearchFrom(el){
              try{
                var input = el && (el.tagName ? el : null);
                var container = input && input.closest && (input.closest('.search-container') || input.closest('.bar-right') || input.closest('.top-bar') || input.closest('form') || document);
                var btn = container && container.querySelector && (container.querySelector('.search-icon') ||
                          container.querySelector('[data-cse-search-btn]') ||
                          container.querySelector('#cse-search-btn') ||
                          container.querySelector('.cse-search-btn') ||
                          container.querySelector('button[type="submit"]'));
                if (btn && typeof btn.click === 'function'){ btn.click(); return true; }
          
                var q = (input && input.value) ? input.value.trim() : '';
                if (typeof submitFromInput === 'function'){ submitFromInput(); return true; }
                if (typeof openGoogleFromInput === 'function'){ openGoogleFromInput(); return true; }
                if (typeof executeQuery === 'function'){ executeQuery(q); return true; }
                document.dispatchEvent(new CustomEvent('perform-site-search', { detail: { query: q } }));
                return false;
              }catch(e){ console.error(e); return false; }
            }
          
            function onEnter(e){
              if (e.key === 'Enter'){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                triggerSearchFrom(e.target);
              }
            }
          
            function bindEnterHandlers(){
              var nodes = Array.from(document.querySelectorAll('#site-search, input[type="search"]'));
              nodes.forEach(function(inp){
                if (!inp.__enterFixBound){
                  inp.addEventListener('keydown', onEnter, true);
                  inp.__enterFixBound = true;
                }
              });
            }
            bindEnterHandlers();
          
            document.addEventListener('submit', function(e){
              try{
                var target = e.target;
                if (target && target.querySelector && target.querySelector('#site-search, input[type="search"]')){
                  e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                  var inp = target.querySelector('#site-search, input[type="search"]');
                  triggerSearchFrom(inp || document.getElementById('site-search'));
                }
              }catch(_ ){}
            }, true);
          
            var mo = new MutationObserver(function(){ bindEnterHandlers(); });
            mo.observe(document.documentElement, { childList: true, subtree: true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function ensureClearFor(input){
              if (!input) return;
              var wrap = (input.closest && input.closest('.search-container')) || input.parentElement;
              if (!wrap) return;
              // evita duplicati: se esiste già, riusa
              var btn = wrap.querySelector('.clear-icon');
              if (!btn){
                btn = document.createElement('span');
                btn.className = 'clear-icon';
                btn.setAttribute('role','button');
                btn.setAttribute('aria-label','Pulisci ricerca');
                btn.title = 'Pulisci';
                btn.textContent = '✖';
                wrap.appendChild(btn);
              }
              if (!btn.__bound){
                btn.addEventListener('click', function(){
                  input.value = '';
                  input.focus();
                  // notifica eventuali listener
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                });
                btn.__bound = true;
              }
            }
            function initAll(){
              document.querySelectorAll('.search-container input[type="search"], .search-container input[type="text"], #site-search')
                .forEach(ensureClearFor);
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', initAll, { once:true });
            } else {
              initAll();
            }
            new MutationObserver(initAll).observe(document.documentElement, { childList:true, subtree:true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function playExplosion(){
              var boom = document.getElementById('explosionSound');
              if (boom){
                try{ boom.currentTime = 0; }catch(e){}
                var p = boom.play();
                if (p && typeof p.catch === 'function'){
                  p.catch(function(err){ console.warn('Audio esplosione bloccato:', err); });
                }
              }
            }
            function triggerExplodeEffect(){
              var el = document.getElementById('exploding');
              if (!el) return;
              // se esiste il listener GSAP, riusa il click
              var hadGsap = !!window.gsap && el.querySelector('span');
              if (hadGsap){
                el.dispatchEvent(new Event('click', {bubbles:true}));
              } else {
                el.classList.add('explode');
                setTimeout(function(){ el.classList.remove('explode'); }, 1200);
              }
            }
            function bind(){
              var btn = document.getElementById('btn-explode');
              if (!btn) return;
              if (btn.__explosionBound) return;
              btn.addEventListener('click', function(){
                playExplosion();
                triggerExplodeEffect();
              });
              btn.__explosionBound = true;
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', bind);
            } else {
              bind();
            }
          })();

/* ===== Estratto da ao1.html ===== */
// Configurazione
          const SEARCH_DELAY = 300; // ms tra una ricerca e l'altra
          const MAX_RESULTS = 50;   // Numero massimo di risultati
          const MIN_QUERY_LENGTH = 3; // Lunghezza minima della query
          
          // Stato dell'applicazione
          let searchIndex = [];
          let searchTimeout = null;
          
          // Funzione per indicizzare le pagine
          async function buildSearchIndex() {
            console.log("Costruzione indice di ricerca...");
            
            // Ottieni la lista delle pagine dal menu
            const menuLinks = Array.from(document.querySelectorAll('.mega-menu a[href]'));
            const uniqueUrls = [...new Set(menuLinks.map(link => link.href))];
            
            // Per ogni URL, estrai il titolo e il contenuto
            for (const url of uniqueUrls) {
              try {
                // Evita di indicizzare pagine esterne
                if (!url.includes(window.location.hostname) && !url.startsWith('/') && !url.startsWith('.')) {
                  continue;
                }
                
                const response = await fetch(url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                
                const title = doc.querySelector('h1')?.textContent || 
                             doc.querySelector('title')?.textContent || 
                             url.split('/').pop().replace('.html', '');
                
                // Estrai il contenuto principale (escludi menu, footer, etc.)
                let content = '';
                const mainContent = doc.querySelector('main') || 
                                   doc.querySelector('article') || 
                                   doc.querySelector('.content') || 
                                   doc.body;
                
                // Seleziona solo i paragrafi e gli heading
                const textElements = mainContent.querySelectorAll('p, h2, h3, h4');
                textElements.forEach(el => {
                  content += ' ' + el.textContent;
                });
                
                searchIndex.push({
                  url,
                  title: title.trim(),
                  content: content.replace(/\s+/g, ' ').trim()
                });
                
              } catch (error) {
                console.warn(`Errore nell'indicizzazione di ${url}:`, error);
              }
            }
            
            console.log("Indice costruito con", searchIndex.length, "pagine");
          }
          
          // Funzione di ricerca
          function performSearch(query) {
            query = query.trim().toLowerCase();
            
            if (query.length < MIN_QUERY_LENGTH) {
              showMessage(`Inserisci almeno ${MIN_QUERY_LENGTH} caratteri`);
              return;
            }
            
            showMessage("Ricerca in corso...");
            
            // Dividi la query in termini separati
            const terms = query.split(/\s+/).filter(term => term.length >= 2);
            
            if (terms.length === 0) {
              showMessage(`Inserisci almeno ${MIN_QUERY_LENGTH} caratteri validi`);
              return;
            }
            
            // Cerca nei titoli e nel contenuto
            const results = searchIndex.map(page => {
              let score = 0;
              let matches = [];
              
              terms.forEach(term => {
                // Punteggio più alto per le corrispondenze nel titolo
                const titleMatch = page.title.toLowerCase().includes(term);
                if (titleMatch) score += 5;
                
                // Punteggio per corrispondenze nel contenuto
                const contentMatch = page.content.toLowerCase().includes(term);
                if (contentMatch) score += 1;
                
                if (titleMatch || contentMatch) {
                  matches.push(term);
                }
              });
              
              return { ...page, score, matches };
            })
            .filter(page => page.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_RESULTS);
            
            displayResults(results, query);
          }
          
          // Mostra i risultati
          function displayResults(results, query) {
            const resultsContainer = document.getElementById('internal-search-results');
            
            if (results.length === 0) {
              resultsContainer.innerHTML = `
                <div style="text-align:center;padding:40px 0;">
                  <p style="color:#cfe8ff;font-size:1.1rem;">Nessun risultato trovato per "${query}"</p>
                  <p style="color:#9ad0ff;">Prova con termini diversi o più specifici</p>
                </div>
              `;
              return;
            }
            
            let html = `
              <div style="margin-bottom:15px;">
                <p style="color:#9ad0ff;margin:0;">Trovati ${results.length} risultati per "${query}"</p>
              </div>
              <div style="display:grid;gap:20px;">
            `;
            
            results.forEach(result => {
              // Evidenzia i termini corrispondenti nel titolo
              let highlightedTitle = result.title;
              result.matches.forEach(term => {
                const regex = new RegExp(term, 'gi');
                highlightedTitle = highlightedTitle.replace(regex, match => 
                  `<span style="background-color:rgba(255,215,0,0.3);color:#ffd700;">${match}</span>`
                );
              });
              
              // Trova un estratto del contenuto con i termini corrispondenti
              let snippet = '';
              const contentLower = result.content.toLowerCase();
              
              // Cerca la prima occorrenza di qualsiasi termine
              for (const term of result.matches) {
                const pos = contentLower.indexOf(term);
                if (pos > -1) {
                  const start = Math.max(0, pos - 50);
                  const end = Math.min(result.content.length, pos + term.length + 100);
                  snippet = result.content.substring(start, end);
                  
                  // Evidenzia i termini nell'estratto
                  result.matches.forEach(t => {
                    const regex = new RegExp(t, 'gi');
                    snippet = snippet.replace(regex, match => 
                      `<span style="background-color:rgba(255,215,0,0.3);color:#ffd700;">${match}</span>`
                    );
                  });
                  
                  if (start > 0) snippet = '...' + snippet;
                  if (end < result.content.length) snippet += '...';
                  break;
                }
              }
              
              // Se non troviamo corrispondenze nel contenuto, usa l'inizio
              if (!snippet) {
                snippet = result.content.substring(0, 150);
                if (result.content.length > 150) snippet += '...';
              }
              
              html += `
                <div style="background:rgba(20,20,40,0.8);padding:20px;border-radius:8px;border-left:3px solid #d4af37;transition:transform 0.2s, box-shadow 0.2s;" 
                     onmouseover="this.style.transform='translateX(5px)';this.style.boxShadow='0 5px 15px rgba(0,0,0,0.3)'" 
                     onmouseout="this.style.transform='';this.style.boxShadow=''">
                  <h3 style="margin-top:0;margin-bottom:12px;font-size:1.2rem;">
                    <a href="${result.url}" style="color:#9ad0ff;text-decoration:none;">${highlightedTitle}</a>
                  </h3>
                  <p style="color:#cfe8ff;margin:0 0 10px 0;line-height:1.5;">${snippet}</p>
                  <a href="${result.url}" style="color:#00ccff;display:inline-flex;align-items:center;gap:5px;text-decoration:none;">
                    <span>Vai alla pagina</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              `;
            });
            
            html += `</div>`;
            resultsContainer.innerHTML = html;
          }
          
          // Mostra un messaggio nel pannello
          function showMessage(msg) {
            document.getElementById('internal-search-results').innerHTML = `
              <div style="text-align:center;padding:40px 0;color:#cfe8ff;">
                <p>${msg}</p>
              </div>
            `;
          }
          
          // Chiudi il pannello
          function closeSearchPanel() {
            document.getElementById('search-results-panel').style.display = 'none';
          }
          
          // Gestione degli eventi
          function setupSearchEvents() {
            const searchInput = document.getElementById('site-search');
            const searchIcon = document.querySelector('.search-icon');
            
            if (!searchInput) return;
            
            // Ricerca quando si preme Invio
            searchInput.addEventListener('keypress', function(e) {
              if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('search-results-panel').style.display = 'block';
                clearTimeout(searchTimeout);
                performSearch(this.value);
              }
            });
            
            // Ricerca quando si clicca l'icona
            if (searchIcon) {
              searchIcon.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('search-results-panel').style.display = 'block';
                clearTimeout(searchTimeout);
                performSearch(searchInput.value);
              });
            }
            
            // Ricerca durante la digitazione (con debounce)
            searchInput.addEventListener('input', function() {
              clearTimeout(searchTimeout);
              if (this.value.trim().length >= MIN_QUERY_LENGTH) {
                searchTimeout = setTimeout(() => {
                  document.getElementById('search-results-panel').style.display = 'block';
                  performSearch(this.value);
                }, SEARCH_DELAY);
              }
            });
          }
          
          // Inizializzazione
          document.addEventListener('DOMContentLoaded', function() {
            // Costruisci l'indice dopo il caricamento della pagina
            setTimeout(buildSearchIndex, 1000);
            
            // Configura gli eventi di ricerca
            setupSearchEvents();
          });
          
          // Chiudi il pannello quando si clicca all'esterno
          document.getElementById('search-results-panel')?.addEventListener('click', function(e) {
            if (e.target === this) {
              closeSearchPanel();
            }
          });

/* ===== Estratto da ao1.html ===== */
(function(){
            // 1) Site data (estratti reali dal sito)
            window.siteData = window.siteData || [
              { url: "Presocratici/talete.html", title: "Talete di Mileto", content: "Talete fu una figura poliedrica del pensiero arcaico: matematico, astronomo e politico; la sua dottrina sull’acqua come principio originario ci è nota soprattutto attraverso Aristotele." },
              { url: "Presocratici/anassimandro.html", title: "Anassimandro di Mileto", content: "Pioniere del pensiero scientifico, discepolo di Talete; introdusse l’ápeiron come principio e sviluppò una visione naturale e razionale del cosmo." },
              { url: "Presocratici/anassimene.html", title: "Anassimene di Mileto", content: "Ultimo dei milesi: identificò nell’aria l’archè di tutte le cose, proseguendo la ricerca dei presocratici sulle cause naturali." },
              { url: "Presocratici/senofane.html", title: "Senofane di Colofone", content: "Poeta‑filosofo viandante: critica radicale alla religione tradizionale e fondazione della scuola eleatica." },
              { url: "articoli/ermarco.html", title: "Ermarco di Mitilene", content: "Successore di Epicuro nel Giardino: preservò e diffuse la dottrina epicurea con fedeltà e innovazione, guidando la scuola dopo il 270 a.C." },
              { url: "articoli/seneca.html", title: "Lucio Anneo Seneca", content: "Figura eminente della filosofia romana: stoico, drammaturgo e statista; i suoi scritti mirano alla tranquillità interiore e alla virtù in un’epoca turbolenta." },
              { url: "articoli/eudemo.html", title: "Eudemo di Rodi", content: "Discepolo fedele di Aristotele e membro di spicco della scuola peripatetica; ponte tra l’insegnamento aristotelico e la tradizione successiva." },
              { url: "pagine/benvenuti.html", title: "Presentazione (Incipit)", content: "Echi di Sofia: uno spazio dedicato alla meraviglia e alla saggezza, dove il pensiero antico e moderno risuona oggi attraverso domande che attraversano il tempo." },
              { url: "articoli/tarski.html", title: "Alfred Tarski", content: "Logico e filosofo del linguaggio: teoria semantica della verità (Convenzione T), contributi a logica, geometria e teoria degli insiemi; influenze su filosofia e informatica teorica." },
              { url: "articoli/frege.html", title: "Gottlob Frege", content: "Padre della logica moderna: dal Begriffsschrift alla distinzione senso/riferimento; ha fondato la logica dei predicati e influenzato l’analitica." },
              { url: "articoli/lyotard.html", title: "Jean‑François Lyotard", content: "Teorico del postmoderno: fine delle grandi narrazioni, giochi linguistici, legittimazione performativa del sapere; opere come La condizione postmoderna e Il dissidio." },
              { url: "pagine/pagina-contatti.html", title: "Contatti", content: "Pagina di contatto per domande, suggerimenti e collaborazioni con Echi di Sofia." }
            ];
          
            // 2) ENTER = click sulla lente (nessun cambio layout/animazioni)
            function triggerSearchFrom(el){
              try{
                var input = el && (el.tagName ? el : null);
                var container = input && input.closest && (input.closest('.search-container') || input.closest('.bar-right') || input.closest('.top-bar') || input.closest('form') || document);
                var btn = container && container.querySelector && (container.querySelector('.search-icon') ||
                          container.querySelector('[data-cse-search-btn]') ||
                          container.querySelector('#cse-search-btn') ||
                          container.querySelector('.cse-search-btn') ||
                          container.querySelector('button[type="submit"]'));
                if (btn && typeof btn.click === 'function'){ btn.click(); return true; }
          
                var q = (input && input.value) ? input.value.trim() : '';
                if (typeof submitFromInput === 'function'){ submitFromInput(); return true; }
                if (typeof openGoogleFromInput === 'function'){ openGoogleFromInput(); return true; }
                if (typeof executeQuery === 'function'){ executeQuery(q); return true; }
                document.dispatchEvent(new CustomEvent('perform-site-search', { detail: { query: q } }));
                return false;
              }catch(e){ console.error(e); return false; }
            }
          
            function onEnter(e){
              if (e.key === 'Enter'){
                e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                triggerSearchFrom(e.target);
              }
            }
          
            function bindEnterHandlers(){
              var nodes = Array.from(document.querySelectorAll('#site-search, input[type="search"]'));
              nodes.forEach(function(inp){
                if (!inp.__enterFixBound){
                  inp.addEventListener('keydown', onEnter, true);
                  inp.__enterFixBound = true;
                }
              });
            }
            bindEnterHandlers();
          
            document.addEventListener('submit', function(e){
              try{
                var target = e.target;
                if (target && target.querySelector && target.querySelector('#site-search, input[type="search"]')){
                  e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                  var inp = target.querySelector('#site-search, input[type="search"]');
                  triggerSearchFrom(inp || document.getElementById('site-search'));
                }
              }catch(_ ){}
            }, true);
          
            var mo = new MutationObserver(function(){ bindEnterHandlers(); });
            mo.observe(document.documentElement, { childList: true, subtree: true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function ensureClearFor(input){
              if (!input) return;
              var wrap = (input.closest && input.closest('.search-container')) || input.parentElement;
              if (!wrap) return;
              // evita duplicati: se esiste già, riusa
              var btn = wrap.querySelector('.clear-icon');
              if (!btn){
                btn = document.createElement('span');
                btn.className = 'clear-icon';
                btn.setAttribute('role','button');
                btn.setAttribute('aria-label','Pulisci ricerca');
                btn.title = 'Pulisci';
                btn.textContent = '✖';
                wrap.appendChild(btn);
              }
              if (!btn.__bound){
                btn.addEventListener('click', function(){
                  input.value = '';
                  input.focus();
                  // notifica eventuali listener
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                });
                btn.__bound = true;
              }
            }
            function initAll(){
              document.querySelectorAll('.search-container input[type="search"], .search-container input[type="text"], #site-search')
                .forEach(ensureClearFor);
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', initAll, { once:true });
            } else {
              initAll();
            }
            new MutationObserver(initAll).observe(document.documentElement, { childList:true, subtree:true });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            ['btn-thunder','btn-explode'].forEach(id=>{
              const nodes = Array.from(document.querySelectorAll('#'+id));
              nodes.slice(1).forEach(n => n.remove()); // lascia solo il primo
            });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function playExplosion(){
              var boom = document.getElementById('explosionSound');
              if (boom){
                try{ boom.currentTime = 0; }catch(e){}
                var p = boom.play();
                if (p && typeof p.catch === 'function'){
                  p.catch(function(err){ console.warn('Audio esplosione bloccato:', err); });
                }
              }
            }
            function triggerExplodeEffect(){
              var el = document.getElementById('exploding');
              if (!el) return;
              // se esiste il listener GSAP, riusa il click
              var hadGsap = !!window.gsap && el.querySelector('span');
              if (hadGsap){
                el.dispatchEvent(new Event('click', {bubbles:true}));
              } else {
                el.classList.add('explode');
                setTimeout(function(){ el.classList.remove('explode'); }, 1200);
              }
            }
            function bind(){
              var btn = document.getElementById('btn-explode');
              if (!btn) return;
              if (btn.__explosionBound) return;
              btn.addEventListener('click', function(){
                playExplosion();
                triggerExplodeEffect();
              });
              btn.__explosionBound = true;
            }
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', bind);
            } else {
              bind();
            }
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            const $ = (s, r=document) => r.querySelector(s);
            const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
            const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
            const safe = s => String(s||'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
          
            const input = $('#site-search') || $('.search-container input[type="search"], .search-container input[type="text"]');
            if(!input) return;
          
            let box = $('#cse-suggest');
            if(!box){
              box = document.createElement('div');
              box.id = 'cse-suggest';
              document.body.appendChild(box);
            }
          
            function positionBox(){
              const r = input.getBoundingClientRect();
              const left = Math.max(8, Math.min(r.left, window.innerWidth - 8));
              const top  = Math.max(8, r.bottom + 6);
              const width = Math.min(r.width, window.innerWidth - left - 8);
              box.style.left = left + 'px';
              box.style.top = top + 'px';
              box.style.width = width + 'px';
              box.style.maxWidth = Math.min(960, window.innerWidth - 16) + 'px';
            }
            function show(){ positionBox(); box.classList.add('show'); }
            function hide(){ box.classList.remove('show'); }
          
            function collectMenu(){
              const out = [];
              $$('nav.menu-desktop a').forEach(a => {
                const href = a.getAttribute('href') || '';
                const title = (a.getAttribute('data-title') || a.textContent || '').trim();
                if(!href || !title) return;
                if(/^https?:\/\//i.test(href)) return;
                if(!/\.html?(\?|#|$)/i.test(href) && !/^\w+(\/|$)/.test(href)) return;
                out.push({ title, href, key: norm(title) });
              });
              return out;
            }
            function collectBlob(){
              const out = [];
              $$('.articles-blob a').forEach(a => {
                const href = a.getAttribute('href') || '';
                const title = (a.getAttribute('data-title') || a.textContent || '').trim();
                if(href && title) out.push({ title, href, key: norm(title) });
              });
              return out;
            }
          
          // --- ESTENSIONE: consenti di includere link ovunque con data-search="include" ---
          function collectMarked(){
            const out = [];
            document.querySelectorAll('a[data-search="include"], a[data-search="1"], a[data-search="true"]').forEach(a=>{
              const href = a.getAttribute('href') || '';
              const title = (a.getAttribute('data-title') || a.textContent || '').trim();
              if(!href || !title) return;
              if(/^https?:\/\//i.test(href)) return; // solo interni
              if(!/\.html?(\?|#|$)/i.test(href) && !/^\w+(\/|$)/.test(href)) return;
              out.push({ title, href, key: norm(title) });
            });
            return out;
          }
          
          
            let INDEX = [];
            function rebuildIndex(){
              const A = collectBlob();
              const B = collectMenu();
              const C = collectMarked();
              const seen = new Set();
              INDEX = [];
              [...A, ...B, ...C].forEach(it => {
                const k = it.href + '||' + it.title;
                if(seen.has(k)) return; seen.add(k);
                INDEX.push(it);
              });
              window._siteIndex = INDEX;
            }
            rebuildIndex();
            window.addEventListener('load', () => setTimeout(rebuildIndex, 400));
          
            function renderList(list, q){
              if(!list || !list.length){ hide(); return; }
              const qn = norm(q);
              box.innerHTML = '';
              const head = document.createElement('div');
              head.className = 'section';
              head.textContent = 'Risultati rapidi';
              box.appendChild(head);
          
              list.slice(0, 14).forEach((it, i) => {
                const a = document.createElement('a');
                a.className = 'item';
                a.href = it.href;
                a.target = '_self';
                const t = it.title;
                let html = '<i class="fa-solid fa-file-lines" aria-hidden="true"></i>';
                const nt = norm(t); const ix = qn ? nt.indexOf(qn) : -1;
                if(ix >= 0){
                  const a1 = t.slice(0, ix), a2 = t.slice(ix, ix + q.length), a3 = t.slice(ix + q.length);
                  html += '<span>'+ safe(a1) + '<mark>' + safe(a2) + '</mark>' + safe(a3) + '</span>';
                }else{
                  html += '<span>'+ safe(t) + '</span>';
                }
                a.innerHTML = html;
                box.appendChild(a);
              });
              show();
            }
          
            let t = 0;
            input.addEventListener('input', function(){
              const q = input.value || '';
              if(q.trim().length < 2){ hide(); return; }
              clearTimeout(t);
              t = setTimeout(function(){
                const qn = norm(q);
                const list = INDEX.filter(it => it.key.includes(qn));
                renderList(list, q);
              }, 80);
            });
          
            input.addEventListener('keydown', function(e){
              if(e.key === 'Escape'){ hide(); }
            });
          
            document.addEventListener('mousedown', function(e){
              if(e.target.closest('#cse-suggest')) return;
              if(e.target.closest('.search-container')) return;
              hide();
            }, true);
          
            window.addEventListener('scroll', ()=>{ if(box.classList.contains('show')) positionBox(); }, true);
            window.addEventListener('resize', ()=>{ if(box.classList.contains('show')) positionBox(); });
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function guardHeight(el, dur){
              try{
                if(!el) return;
                var r = el.getBoundingClientRect();
                el.style.minHeight = Math.ceil(r.height) + 'px';
                setTimeout(function(){ el.style.minHeight = ''; }, (dur||1200)+120);
              }catch(e){}
            }
            var et = document.querySelector('.exploding-text');
            var btn = document.getElementById('btn-explode') || document.getElementById('explode-btn');
            if(btn && et){
              btn.addEventListener('click', function(){ guardHeight(et, 1200); }, {passive:true});
            }
            if(et){
              et.addEventListener('click', function(){ guardHeight(et, 1200); }, {passive:true});
            }
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            const audio = document.getElementById('thunder-sound');
            if (audio){
              if (typeof window.__thOn === 'undefined') window.__thOn = false;
              window.toggleThunder = function(){
                window.__thOn = !window.__thOn;
                if (window.__thOn){
                  try{ audio.currentTime = 0; audio.play().catch(()=>{});}catch(e){}
                }else{
                  try{ audio.pause(); audio.currentTime = 0; }catch(e){}
                }
                const b=document.getElementById('btn-thunder');
                if (b){
                  b.classList.toggle('active', window.__thOn);
                  b.setAttribute('aria-pressed', window.__thOn ? 'true':'false');
                  b.textContent = window.__thOn ? '⚡ Tuono: ON' : '⚡ Tuono';
                }
              };
            }
          })();

/* ===== Estratto da ao1.html ===== */
document.addEventListener('DOMContentLoaded', function(){
            var b = document.getElementById('btn-thunder');
            if (b && !b.__thunderBound){
              b.addEventListener('click', function(e){
                try { window.toggleThunder && window.toggleThunder(); } catch (err) { console.error('toggleThunder error', err); }
              });
              b.__thunderBound = true;
            }
          });

/* ===== Estratto da ao1.html ===== */
(function(){
            // Costruttori URL per le varie fonti
            const build = {
              sep:          q => 'https://plato.stanford.edu/search/searcher.py?query=' + encodeURIComponent(q),
              iep:          q => 'https://iep.utm.edu/?s=' + encodeURIComponent(q),
              treccani:     q => 'https://www.treccani.it/enciclopedia/ricerca/' + encodeURIComponent(q) + '/',
              philosophica: q => 'https://www.philosophica.info/?s=' + encodeURIComponent(q),
              'wiki-it':    q => 'https://it.wikipedia.org/w/index.php?search=' + encodeURIComponent(q)
            };
          
            function mountWidget(){
              // prova a collocarlo sopra al primo iframe della sidebar/destra
              const root = document.getElementById('edx-dict');
              if(!root) return;
              const candidates = ['aside iframe', '.articles-blob ~ iframe', '.sidebar iframe', '#sidebar iframe', '.col-dx iframe', '.right iframe'];
              for(const sel of candidates){
                const el = document.querySelector(sel);
                if(el && el.parentElement && !el.previousElementSibling?.isSameNode(root)){
                  el.parentElement.insertAdjacentElement('beforebegin', root);
                  break;
                }
              }
              // se per errore è dentro l'header, spostalo subito dopo
              const hdr = document.querySelector('header'); 
              if(hdr && hdr.contains(root)){ hdr.insertAdjacentElement('afterend', root); }
            }
          
            function wireForm(){
              const form = document.getElementById('edx-dict-form');
              const sel  = document.getElementById('edx-source');
              const input= document.getElementById('edx-q');
              if(!form || !sel || !input) return;
              // intercetta prima degli script globali del sito
              form.addEventListener('submit', function(e){
                e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
                const q = (input.value||'').trim(); if(!q) return;
                const src = sel.value || 'sep';
                const url = (build[src] || build.sep)(q);
                window.open(url, '_blank', 'noopener');
                return false;
              }, true);
            }
          
            if(document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', function(){ mountWidget(); wireForm(); });
            }else{
              mountWidget(); wireForm();
            }
          })();

/* ===== Estratto da ao1.html ===== */
// === SLIDER VERTICALE CON CONTROLLI — FIX FOTO VISIBILI (start PAUSA, senza wrap) ===
          (function(){
            const slider = document.querySelector('.slider-vertical');
            const inner  = document.querySelector('.slider-vertical .slider-inner');
            if (!slider || !inner) return;
          
            let pos = 0;          // in alto → foto visibili
            let speed = 20;       // px/sec
            let dir = 1;          // 1 = su, -1 = giù
            let paused = true;    // PARTENZA IN PAUSA (foto ben visibili)
            let last = null;
          
            function loop(ts){
              if(last == null) last = ts;
              const dt = (ts - last)/1000;
              last = ts;
          
              if(!paused){
                const contentH = inner.scrollHeight;
                const viewH    = slider.clientHeight;
                const maxScroll = Math.max(0, contentH - viewH);
          
                // aggiorna posizione
                pos -= dir * speed * dt;
          
                // limiti duri: no wrap, mai fuori
                if(pos < -maxScroll) pos = -maxScroll;
                if(pos > 0) pos = 0;
              }
          
              inner.style.transform = `translateY(${pos}px)`;
              requestAnimationFrame(loop);
            }
            requestAnimationFrame(loop);
          
            // Controlli
            const btnToggle = document.getElementById('slider-toggle');
            const btnInvert = document.getElementById('slider-invert');
            const range     = document.getElementById('slider-speed');
          
            if(btnToggle){
              // Testo iniziale coerente con partenza in pausa
              btnToggle.textContent = '▶️ Avvia';
              btnToggle.addEventListener('click', () => {
                paused = !paused;
                btnToggle.textContent = paused ? '▶️ Avvia' : '⏸️ Ferma';
              });
            }
          
            if(btnInvert){
              btnInvert.addEventListener('click', () => { dir *= -1; });
            }
          
            if(range){
              const mapSpeed = v => {
                const maxSteps = (range && range.max ? Number(range.max) : 20) - 1;
                const t = Math.max(0, Math.min(1, (Number(v) - 1) / Math.max(1, maxSteps)));
                const eased = Math.pow(t, 1.5); // crescita ancora più dolce (1.5)
                return Math.round(12 + (180 - 12) * eased); // 1–max → 12–180 px/s
              };
              // init
              speed = mapSpeed(+range.value || 8);
              speed = Math.min(speed, 180);
              range.addEventListener('input', e => {
                speed = mapSpeed(+e.target.value || 8);
                          speed = Math.min(speed, 180);
          });
            }
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            if (typeof window.thunderOn === 'undefined') window.thunderOn = false;
            if (typeof window.updateLabel !== 'function') {
              window.updateLabel = function(){
                var btn = document.getElementById('btn-thunder');
                if (!btn) return;
                btn.classList.toggle('active', !!window.thunderOn);
                btn.setAttribute('aria-pressed', window.thunderOn ? 'true' : 'false');
                btn.textContent = window.thunderOn ? '⚡ Tuono: ON' : '⚡ Tuono';
              };
            }
            var audio = document.getElementById('thunder-sound');
            if (audio){
              try { audio.preload = 'auto'; audio.setAttribute('playsinline',''); audio.crossOrigin = audio.crossOrigin || 'anonymous'; } catch(e){}
              audio.addEventListener('error', function(){
                console.warn('Thunder audio non disponibile (403/CORS). Disattivo tuono.');
                window.thunderOn = false; window.updateLabel && window.updateLabel();
              });
              window.playThunderIfOn = window.playThunderIfOn || function(){
                if (window.thunderOn && audio) {
                  try { audio.currentTime = 0; audio.play().catch(function(){}); } catch(e){}
                }
              };
            }
            try { window.updateLabel(); } catch(e){}
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            // Trova il controllo velocità: usa l’ID che hai già (#speed-range)
            var r = document.querySelector('#speed-range');
            if(!r) return;
          
            // Se è già wrappato, non fare nulla
            if (r.closest('.range-ui-speed')) return;
          
            // Crea wrapper e “binario” finto
            var wrap  = document.createElement('div');
            wrap.className = 'range-ui-speed';
            // Mantieni la larghezza attuale del tuo input
            var w = getComputedStyle(r).width;
            if (w && w !== 'auto') wrap.style.width = w;
          
            var track = document.createElement('div');
            track.className = 'speed-track';
          
            // Inserisci nel DOM: wrapper → input + track
            r.parentNode.insertBefore(wrap, r);
            wrap.appendChild(r);
            wrap.appendChild(track);
          
            // Aggiorna larghezza al resize (responsive)
            window.addEventListener('resize', function(){
              var ww = getComputedStyle(r).width;
              if (ww && ww !== 'auto') wrap.style.width = ww;
            }, { passive:true });
          })();

/* ===== Estratto da ao1.html ===== */
(function CSEClean(){
            const $panel   = document.getElementById('searchPanel');
            const $results = document.getElementById('cseResults');
            const $input   = document.getElementById('cse-input');
            const $btn     = document.getElementById('cse-btn');
            if (!$results) return;
            function openPanel(){
              if ($panel){ $panel.setAttribute('aria-hidden','false'); $panel.style.display='block'; }
            }
            function closePanel(){
              if ($panel){ $panel.setAttribute('aria-hidden','true'); $panel.style.display='none'; }
            }
            window.execQuery = function(q){
              if (!q) return; openPanel();
              try {
                let tries = 0;
                (function waitCSE(){
                  try {
                    if (window.google && google.search && google.search.cse && google.search.cse.element){
                      const el = google.search.cse.element.getElement('cseResults');
                      if (el && typeof el.execute==='function'){ el.execute(q); return; }
                    }
                  } catch(e){}
                  if (++tries < 100) setTimeout(waitCSE, 80);
                })();
              } catch(e){ console.error('CSE exec error:', e); }
            };
            if ($input){
              $input.addEventListener('keydown',(ev)=>{
                if (ev.key==='Enter'){ ev.preventDefault(); window.execQuery($input.value.trim()); }
              });
            }
            if ($btn){ $btn.addEventListener('click', ()=>{ if ($input) window.execQuery($input.value.trim()); }); }
            document.addEventListener('keydown',(ev)=>{ if (ev.key==='Escape') closePanel(); });
          })();

/* ===== Estratto da ao1.html ===== */
(function AudioManager(){
            const thunderSrc   = '/suoni/thunder-sound.mp3';
            const explosionSrc = '/suoni/explosion-1.mp3';
            function ensureAudio(id, src){
              let el = document.getElementById(id);
              if (!el){
                el = document.createElement('audio');
                el.id = id; el.preload='auto'; el.crossOrigin='anonymous';
                document.body.appendChild(el);
              }
              if (!el.src) el.src = src;
              return el;
            }
            const thunder   = ensureAudio('thunder-audio', thunderSrc);
            const explosion = ensureAudio('explosionSound', explosionSrc);
            (function aliasExplode(){
              if (!document.getElementById('explosionSound')){
                const clone = explosion.cloneNode(); clone.id='explosionSound'; document.body.appendChild(clone);
              }
            })();
            let unlocked=false;
            function unlockOnce(){
              if (unlocked) return; unlocked=true;
              [thunder, explosion].forEach(a=>{ try{ a.play().then(()=>a.pause()).catch(()=>{});}catch(_){}});
              window.removeEventListener('pointerdown', unlockOnce, {passive:true});
              window.removeEventListener('keydown',     unlockOnce);
            }
            window.addEventListener('pointerdown', unlockOnce, {passive:true});
            window.addEventListener('keydown',     unlockOnce);
            window.setThunderOn = function(on){
              try{ if(on){ thunder.currentTime=0; thunder.play(); } else { thunder.pause(); } }catch(e){}
            };
            window.playExplosion = function(){
              try{ explosion.currentTime=0; explosion.play().catch(()=>{});}catch(e){}
            };
          })();

/* ===== Estratto da ao1.html ===== */
document.addEventListener('DOMContentLoaded', function(){
            if (document.documentElement.dataset.lazy !== 'on') return;
            var imgs = document.querySelectorAll('img:not([data-priority])');
            imgs.forEach(function(img){
              if (img.closest('.top-bar')) return;
              if (!img.hasAttribute('loading') || img.getAttribute('loading') === 'auto'){
                img.setAttribute('loading','lazy');
              }
            });
          });

/* ===== Estratto da ao1.html ===== */
(function(){
            if (document.documentElement.dataset.searchSuggest !== 'on') return;
          
            function debounce(fn, wait){
              var t; return function(){ clearTimeout(t); var a=arguments; t=setTimeout(function(){ fn.apply(null,a); }, wait); };
            }
            function ensureContainer(){
              var el = document.getElementById('search-suggest-box');
              if (!el){
                el = document.createElement('div');
                el.id = 'search-suggest-box';
                document.body.appendChild(el);
              }
              return el;
            }
            function showSuggestions(){
              var input = document.getElementById('site-search') || document.querySelector('.search-container input');
              if(!input) return;
              var q = input.value.trim();
              var box = ensureContainer();
              if (!q){ box.classList.remove('show'); box.innerHTML=''; return; }
              // demo locale (sostituibile con endpoint)
              var seed = ['Platone','Aristotele','Kant','Nietzsche','Hegel','Descartes','Fenomenologia','Etica','Metafisica','Logica'];
              var list = seed.filter(function(s){ return s.toLowerCase().includes(q.toLowerCase()); }).slice(0,7);
              if (!list.length){ box.classList.remove('show'); box.innerHTML=''; return; }
              var rect = input.getBoundingClientRect();
              box.style.left = Math.round(rect.left + window.scrollX) + 'px';
              box.style.top  = Math.round(rect.bottom + window.scrollY + 6) + 'px';
              box.style.width= Math.round(rect.width) + 'px';
              box.innerHTML = '<div class="section">Suggerimenti</div>' + list.map(function(s){
                return '<a class="item" href="/cerca?q='+encodeURIComponent(s)+'"><i class="fa-solid fa-magnifying-glass"></i> '+s+'</a>';
              }).join('');
              box.classList.add('show');
            }
            var input = document.getElementById('site-search') || document.querySelector('.search-container input');
            if (input){
              input.addEventListener('input', debounce(showSuggestions, 300));
              input.addEventListener('blur', function(){ setTimeout(function(){ var b=document.getElementById('search-suggest-box'); if(b) b.classList.remove('show'); }, 200); });
            }
          })();

/* ===== Estratto da ao1.html ===== */
// === Echi di Sofia — Append dataset per ricerca interna (articoli) ===
          // Attende che window.siteData esista, poi aggiunge gli articoli e, se presente,
          // richiama buildSearchIndex(siteData) per rigenerare l'indice.
          
          /* ==== Echi di Sofia — integrazione dati ricerca (merge sicuro, no duplicati) ==== */
(function(){
  "use strict";

  // Evita doppi inserimenti se lo script viene incluso due volte
  if (window.__ECHI_NEWINDEX_ADDED__) return;
  window.__ECHI_NEWINDEX_ADDED__ = true;

  /** Elenco nuovi articoli da integrare nella ricerca interna */
  const NEW_ITEMS = [
    {
      url: "articoli/austin.html",
      title: "J.L. Austin",
      content: "John Langshaw Austin (1911-1960), filosofo del linguaggio ordinario. Analisi degli atti linguistici e della teoria del performativo.",
      snippet: "Austin e la filosofia del linguaggio ordinario: atti linguistici e performativi."
    },
    {
      url: "articoli/bacon.html",
      title: "Francis Bacon",
      content: "Francis Bacon (1561-1626), filosofo e politico inglese. Padre del metodo induttivo e promotore della nuova scienza sperimentale.",
      snippet: "Bacon e il metodo induttivo: fondamenti della nuova scienza moderna."
    },
    {
      url: "articoli/dilthey.html",
      title: "Wilhelm Dilthey",
      content: "Wilhelm Dilthey (1833-1911), filosofo tedesco. Fondatore delle scienze dello spirito e teorico della comprensione ermeneutica.",
      snippet: "Dilthey: vita, opere e metodo delle scienze dello spirito."
    },
    {
      url: "articoli/gadamer.html",
      title: "Hans-Georg Gadamer",
      content: "Hans-Georg Gadamer (1900-2002), maestro dell’ermeneutica filosofica. Autore di Verità e metodo, elaborò la teoria della fusione degli orizzonti.",
      snippet: "Gadamer e l’ermeneutica filosofica: Verità e metodo."
    },
    {
      url: "articoli/habermas.html",
      title: "Jürgen Habermas",
      content: "Jürgen Habermas (1929-2023), filosofo tedesco della Scuola di Francoforte. Teoria dell’agire comunicativo e democrazia deliberativa.",
      snippet: "Habermas: teoria dell’agire comunicativo e filosofia politica."
    },
    {
      url: "articoli/lewis.html",
      title: "Clarence I. Lewis",
      content: "Clarence Irving Lewis (1883-1964), filosofo statunitense. Contributi alla logica simbolica, pragmatismo e teoria della conoscenza.",
      snippet: "Lewis: logica simbolica e pragmatismo americano."
    },
    {
      url: "articoli/quine.html",
      title: "W.V.O. Quine",
      content: "Willard Van Orman Quine (1908-2000), filosofo analitico. Critico del positivismo logico, sviluppò l’olismo epistemologico e la critica alla distinzione analitico/sintetico.",
      snippet: "Quine: olismo epistemologico e critica al positivismo logico."
    },
    {
      url: "articoli/schleiermacher.html",
      title: "Friedrich Schleiermacher",
      content: "Friedrich Schleiermacher (1768-1834), teologo e filosofo. Padre della moderna ermeneutica e promotore di un cristianesimo vissuto.",
      snippet: "Schleiermacher: ermeneutica e filosofia della religione."
    },
    {
      url: "articoli/searle.html",
      title: "John Searle",
      content: "John Rogers Searle (1932-2017), filosofo del linguaggio e della mente. Continuatore della filosofia di Austin, autore della teoria degli atti linguistici e della coscienza.",
      snippet: "Searle: atti linguistici e filosofia della mente."
    },
    {
      url: "articoli/circolo_di_vienna.html",
      title: "Circolo di Vienna",
      content: "Il Circolo di Vienna fu un gruppo di filosofi e scienziati del primo Novecento che sviluppò l'empirismo logico e il principio di verificazione.",
      snippet: "Circolo di Vienna: empirismo logico e principio di verificazione nel XX secolo."
    },
    {
      url: "articoli/platone_mito_caverna.html",
      title: "Il Mito della Caverna di Platone",
      content: "Un'analisi approfondita del Mito della Caverna di Platone con interpretazioni filosofiche e significato contemporaneo.",
      snippet: "Platone - Mito della Caverna, filosofia, allegoria, epistemologia, metafisica, Repubblica."
    },
    {
      url: "articoli/wittgenstein.html",
      title: "Ludwig Wittgenstein",
      content: "Ludwig Wittgenstein (1889-1951), filosofo austriaco. Due fasi: Tractatus logico-philosophicus e Ricerche filosofiche. Cruciale per la filosofia del linguaggio.",
      snippet: "Wittgenstein: Tractatus e Ricerche filosofiche."
    },
    {
      url: "articoli/democrito1.html",
      title: "Democrito",
      content: "Democrito di Abdera (ca. 460-370 a.C.), filosofo presocratico. Teoria atomistica della realtà, conoscenza come convenzione, etica dell’equilibrio interiore.",
      snippet: "Democrito: atomi e vuoto, filosofia presocratica."
    },
    {
      url: "articoli/althusser.html",
      title: "Louis Althusser",
      content: "Louis Althusser (1918-1990), filosofo marxista francese. Lettura strutturalista di Marx, concetto di apparati ideologici di Stato.",
      snippet: "Althusser: marxismo strutturalista e apparati ideologici di Stato."
    },
    {
      url: "articoli/bergson1.html",
      title: "Henri Bergson",
      content: "Henri Bergson (1859-1941), filosofo francese. Slancio vitale, intuizione e critica al meccanicismo scientifico.",
      snippet: "Bergson: intuizione, tempo e slancio vitale."
    },
    {
      url: "articoli/dreyfus.html",
      title: "Hubert Dreyfus",
      content: "Hubert Dreyfus (1929-2017), filosofo statunitense. Critico dell’IA forte, interprete di Heidegger, fenomenologia applicata.",
      snippet: "Dreyfus: fenomenologia e critica all’IA forte."
    },
    {
      url: "articoli/l%C3%A9vi-strauss.html",
      title: "Claude Lévi-Strauss",
      content: "Claude Lévi-Strauss (1908-2009), antropologo e pensatore strutturalista. Analisi dei miti, parentela, strutture culturali.",
      snippet: "Lévi-Strauss: antropologia strutturalista e studio dei miti."
    },
    {
      url: "articoli/malinowski.html",
      title: "Bronisław Malinowski",
      content: "Bronisław Malinowski (1884-1942), antropologo polacco. Pioniere dell’etnografia sul campo e del funzionalismo culturale.",
      snippet: "Malinowski: etnografia e funzionalismo culturale."
    },
    {
      url: "articoli/marco%20aurelio.html",
      title: "Marco Aurelio",
      content: "Esplorazione della vita, della filosofia e dell’eredità di Marco Aurelio, autore delle Meditazioni e figura chiave dello stoicismo romano.",
      snippet: "Marco Aurelio, Stoicismo, Meditazioni."
    },
    {
      url: "articoli/battaglio_maratona.html",
      title: "La Battaglia di Maratona",
      content: "Lo scontro del 490 a.C. tra Atene e l’Impero persiano: contesto, strategia, conseguenze storiche.",
      snippet: "Battaglia di Maratona: Grecia antica, Persiani, Ateniesi, Milziade, Dario I."
    },
    {
      url: "articoli/ricoeur.html",
      title: "Paul Ricoeur",
      content: "Paul Ricoeur (1913-2005), filosofo francese. Ermeneutica, identità narrativa, memoria e tempo.",
      snippet: "Ricoeur: ermeneutica, identità e narrazione."
    }
  ];

  /* ---------- utilità ---------- */

  // Normalizza URL per confronto (minuscole + decode se possibile)
  function normUrl(u){
    try { return decodeURI(String(u).trim()).toLowerCase(); }
    catch { return String(u).trim().toLowerCase(); }
  }

  // Pulisce i campi testo
  function cleanText(s){ return (s == null ? "" : String(s)).replace(/\s+/g,' ').trim(); }

  // Normalizza un item
  function normalizeItem(it){
    return {
      url: cleanText(it.url),
      title: cleanText(it.title),
      content: cleanText(it.content),
      snippet: cleanText(it.snippet)
    };
  }

  // Merge senza duplicati (preferenza: elementi esistenti, poi NEW_ITEMS)
  function mergeNoDupes(existingArr, toAddArr){
    const out = [];
    const seen = new Map(); // key: urlNorm  value: true
    // prima gli esistenti
    for (const raw of existingArr || []){
      const it = normalizeItem(raw);
      const key = normUrl(it.url) || it.title.toLowerCase();
      if (!seen.has(key)){
        seen.set(key, true);
        out.push(it);
      }
    }
    // poi i nuovi
    for (const raw of toAddArr || []){
      const it = normalizeItem(raw);
      const key = normUrl(it.url) || it.title.toLowerCase();
      if (!seen.has(key)){
        seen.set(key, true);
        out.push(it);
      }
    }
    return out;
  }

  // Applica merge a window.siteData (crea l’array se assente)
  function applyMerge(){
    if (!Array.isArray(window.siteData)) window.siteData = [];
    window.siteData = mergeNoDupes(window.siteData, NEW_ITEMS);

    // Hook opzionale: notifica eventuale motore di ricerca interno
    try {
      if (window.EchiSearch && typeof window.EchiSearch.refreshIndex === 'function'){
        window.EchiSearch.refreshIndex(window.siteData);
      }
    } catch(_) {}
  }

  /* ---------- poll semplice: attende siteData o lo crea ---------- */
  (function waitAndMerge(maxMs){
    const start = performance.now();
    const timer = setInterval(() => {
      const ready = Array.isArray(window.siteData);
      const timedOut = (performance.now() - start) > maxMs;
      if (ready || timedOut){
        clearInterval(timer);
        applyMerge();
      }
    }, 120);
  })(3000);

})();

            let tries = 0;
            const MAX_TRIES = 30;
            const iv = setInterval(() => {
              tries++;
              if (Array.isArray(window.siteData)) {
                // Evita duplicati: controlla per URL
                const existing = new Set(window.siteData.map(i => i.url));
                const toAdd = NEW_ITEMS.filter(i => !existing.has(i.url));
                if (toAdd.length) window.siteData.push(...toAdd);
          
                // Se c'è un builder d'indice, rigeneralo
                if (typeof window.buildSearchIndex === "function") {
                  try { window.buildSearchIndex(window.siteData); } catch(e) { console.warn(e); }
                }
                clearInterval(iv);
                console.log("[Ricerca interna] Aggiunti articoli:", toAdd.length);
              } else if (tries >= MAX_TRIES) {
                // Fallback: crea siteData se proprio non esiste
                window.siteData = NEW_ITEMS.slice();
                if (typeof window.buildSearchIndex === "function") {
                  try { window.buildSearchIndex(window.siteData); } catch(e) { console.warn(e); }
                }
                clearInterval(iv);
                console.warn("[Ricerca interna] siteData non trovato: creato dataset con soli articoli.");
              }
            }, 100);
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            var btn = document.getElementById('btn-thunder') ||
                      Array.from(document.querySelectorAll('button,[role="button"]')).find(function(b){ return /tuono|⚡/i.test(b.textContent||''); });
            var audio = document.getElementById('thunder-sound');
            if (!btn) return;
          
            // Remove previous listeners by cloning (safe, non-destructive)
            var clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);
            btn = document.getElementById('btn-thunder') || clone;
          
            // Simple WebAudio fallback for Safari if webAudioThunder is not defined
            function synthThunder(){
              try{
                var AC = window.AudioContext || window.webkitAudioContext;
                var ctx = new AC();
                var sr = ctx.sampleRate, dur = 1.8, n = (sr*dur)|0;
                var buf = ctx.createBuffer(1, n, sr), ch = buf.getChannelData(0);
                var last = 0;
                for (var i=0;i<n;i++){
                  var t = i/sr, white = Math.random()*2-1;
                  var brown = (last + 0.02*white)/1.02; last = brown;
                  var env = Math.exp(-2.2*t);
                  ch[i] = Math.max(-1, Math.min(1, (brown*0.8 + white*0.2) * env));
                }
                var src = ctx.createBufferSource(); src.buffer = buf;
                var g = ctx.createGain(); g.gain.value = 0.9;
                src.connect(g).connect(ctx.destination);
                src.start();
              }catch(e){}
            }
          
            function playSafari(){
              if (typeof window.webAudioThunder === "function") return window.webAudioThunder();
              return Promise.resolve().then(synthThunder);
            }
          
            var isSafari = /Safari\//.test(navigator.userAgent) && !/Chrome|Chromium|Edg\//.test(navigator.userAgent);
          
            btn.addEventListener('click', function(ev){
              ev.preventDefault();
              if (isSafari) { playSafari(); return; }
              if (!audio) return;
              try { audio.currentTime = 0; var p = audio.play(); if (p && p.catch) p.catch(function(e){}); } catch(e){}
            }, {passive:false});
          })();

/* ===== Estratto da ao1.html ===== */
(() => {
            // --- TROVA ELEMENTI ---
            const baseEl = document.getElementById('explosionSound');
            if (!baseEl) { console.warn('[ExplodePool] <audio id="explosionSound"> non trovato'); return; }
          
            // Bottone: prima prova per id, poi per testo (Esplodi/💥)
            let btn = document.getElementById('explode-btn');
            if (!btn) {
              btn = Array.from(document.querySelectorAll('button, [role="button"], .btn')).find(b =>
                /esplod|💥/i.test((b.textContent||'') + ' ' + (b.getAttribute('aria-label')||''))
              ) || null;
            }
            if (!btn) { console.warn('[ExplodePool] bottone "Esplodi" non trovato'); return; }
          
            // --- RICAVA LA SORGENTE DELL’AUDIO ESISTENTE ---
            const sources = Array.from(baseEl.querySelectorAll('source')).map(s => s.src).filter(Boolean);
            const primarySrc = baseEl.currentSrc || sources[0] || baseEl.src;
            if (!primarySrc) { console.warn('[ExplodePool] nessuna src per l’esplosione'); return; }
          
            // --- CREA UN POOL DI AUDIO PER CONSENTIRE CLICK RIPETUTI ---
            const POOL_SIZE = 4;
            const pool = [];
            for (let i=0; i<POOL_SIZE; i++){
              const a = new Audio(primarySrc);
              a.preload = 'auto';
              try { a.playsInline = true; } catch(_) {}
              pool.push(a);
            }
          
            // --- SBLOCCO AUDIO AL PRIMO GESTO (Safari) ---
            let unlocked = false;
            const unlock = async () => {
              if (unlocked) return;
              unlocked = true;
              // “tocca” anche il baseEl per compatibilità
              const all = [baseEl, ...pool];
              for (const a of all) {
                try { a.muted = false; await a.play(); a.pause(); a.currentTime = 0; } catch(_) {}
              }
            };
            window.addEventListener('pointerdown', unlock, {once:true, capture:true, passive:true});
            window.addEventListener('keydown', unlock, {once:true, capture:true});
          
            // --- SCEGLI UN’ISTANZA LIBERA E SUONA ---
            function playExplosion(){
              // trova un player pronto (pausato o terminato)
              let a = pool.find(x => x.paused || x.ended);
              if (!a) {
                // se tutti occupati, clona al volo (caso di spam click)
                a = new Audio(primarySrc);
                try { a.playsInline = true; } catch(_) {}
                a.preload = 'auto';
                pool.push(a);
              }
              try {
                a.currentTime = 0;
                const p = a.play();
                if (p && p.catch) p.catch(()=>{ /* Safari può rifiutare promesse se non “unlocked” */ });
              } catch(_){}
            }
          
            // --- EVITA LISTENER DUPLICATI (sostituisci il bottone con un clone) ---
            const clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);
            const safeBtn = document.getElementById('explode-btn') || clone;
          
            safeBtn.addEventListener('click', (ev) => {
              ev.preventDefault();
              playExplosion();
            });
          
            // --- LOG MINIMO (aiuta debug senza sporcare) ---
            baseEl.addEventListener('canplaythrough', () => console.log('[ExplodePool] base pronto'));
          })();

/* ===== Estratto da ao1.html ===== */
(function(){
            function getLayer(){
              const p = document.querySelector('.particle');
              if (p && p.parentNode) return p.parentNode;
              return document.getElementById('philoParticles') || document.body;
            }
          
            function addFloatingPerson(src, opts){
              opts = opts || {};
              const sizeRem = opts.sizeRem || 6;
              const alt = opts.alt || 'Foto';
              const layer = getLayer();
          
              const img = new Image();
              img.decoding = 'async';
              img.loading = 'lazy';
              img.src = src;
              img.alt = alt;
              img.className = 'particle float-person';
              img.style.width  = sizeRem + 'rem';
              img.style.height = sizeRem + 'rem';
          
              layer.appendChild(img);
          
              // posizionamento iniziale visibile (centro)
              img.style.transform = 'translate(' + Math.round(window.innerWidth/2) + 'px,' + Math.round(window.innerHeight/2) + 'px)';
          
              const speedBase = (window.cfg && typeof cfg.minSpeed==='number' && typeof cfg.maxSpeed==='number')
                ? (Math.random() * (cfg.maxSpeed - cfg.minSpeed) + cfg.minSpeed)
                : 0.004;
          
              const p = {
                el: img,
                x0: Math.random() * window.innerWidth,
                y0: Math.random() * window.innerHeight,
                phase: Math.random() * Math.PI * 2,
                speed: speedBase,
                type: 'person'
              };
          
              // Se esiste un array globale usato dal tuo loop, inserisci lì
              if (Array.isArray(window.particles)) {
                window.particles.push(p);
              } else if (Array.isArray(window.symbols)) {
                window.symbols.push(p);
              } else {
                // Fallback: movimento autonomo (non tocca il tuo loop)
                let last = performance.now();
                (function selfMove(now){
                  const dt = Math.min(0.05, ((now||performance.now()) - last)/1000);
                  last = (now||performance.now());
                  p.phase += p.speed * dt * 60;
                  const fd = (window.cfg && cfg.floatDist) ? cfg.floatDist : 90;
                  const dx = Math.cos(p.phase) * fd;
                  const dy = Math.sin(p.phase) * fd;
                  p.el.style.transform = 'translate(' + (p.x0 + dx) + 'px,' + (p.y0 + dy) + 'px)';
                  requestAnimationFrame(selfMove);
                })();
              }
              return p;
            }
          
            // Inserisci entrambe le foto
            function initPhotos(){
              addFloatingPerson('https://raw.githubusercontent.com/Casi0048/casi0048.github.io/main/immagini%20per%20sito/maria_teresa.jpg',
                { sizeRem: 2, alt: 'Maria Teresa' });
              addFloatingPerson('https://raw.githubusercontent.com/Casi0048/casi0048.github.io/main/immagini%20per%20sito/krk.jpg',
                { sizeRem: 1.5, alt: 'KRK' });
            }
          
            if (document.readyState === 'loading'){
              document.addEventListener('DOMContentLoaded', initPhotos);
            } else {
              setTimeout(initPhotos, 0);
            }
          
            // Esporta utility per eventuali aggiunte future
            window.addFloatingPerson = addFloatingPerson;
          })();

/* ===== Estratto da ao1.html ===== */
// 3) Gestione errori JS: Thunder controller guard
try {
  window.__echiThunder = true;
} catch (error) {
  console.error('Errore inizializzazione thunder:', error);
}

// 5) Cookie consent fallback
try {
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.style.display = 'block';
    }, 2000);
  }
} catch(e){ console.warn('Cookie fallback non applicato:', e); }

// 6) Debounce per ricerca (senza rompere funzioni esistenti)
(function(){
  let __searchTimeout;
  // Se esiste window.executeQuery, lo wrappo con debounce; altrimenti espongo un helper
  const _orig = window.executeQuery;
  window.debouncedExecuteQuery = function(q){
    clearTimeout(__searchTimeout);
    __searchTimeout = setTimeout(() => {
      try {
        if (typeof _orig === 'function') _orig(q);
      } catch(e){ console.error('Errore executeQuery:', e); }
    }, 300);
  };
})();

// 7) Fallback audio generico
window.playAudioFallback = function(audioElement, sources){
  let i = 0;
  function tryPlay(){
    if (!audioElement || !sources || i >= sources.length) return;
    audioElement.src = sources[i];
    const p = audioElement.play();
    if (p && typeof p.catch === 'function'){
      p.catch(() => { i++; tryPlay(); });
    }
  }
  tryPlay();
};

// 4) Ottimizzazione immagini slider (aggiunge attributi se mancano)
(function(){
  try {
    const imgs = document.querySelectorAll('.slide-vertical img');
    imgs.forEach(img => {
      if (!img.getAttribute('loading')) img.setAttribute('loading','lazy');
      if (!img.getAttribute('decoding')) img.setAttribute('decoding','async');
      if (!img.getAttribute('width')) img.setAttribute('width','260');
      if (!img.getAttribute('height')) img.setAttribute('height','140');
    });
  } catch(e){ console.warn('Ottimizzazione immagini slider non applicata:', e); }
})();

// 8) Ottimizza animazione slider (usa transform) SE non già gestito altrove
(function(){
  try {
    const inner = document.querySelector('.slider-vertical .slider-inner');
    if(!inner) return;
    if (getComputedStyle(inner).transform !== 'none') return; // già gestito da CSS/JS esistente
    let y = 0, paused = false, speed = 0.35;
    function step(){
      if (!paused){
        y += speed;
        if (y >= inner.scrollHeight/2) y = 0;
        inner.style.transform = 'translate3d(0, -'+y+'px, 0)';
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // Esponi API non invasive
    window.__sliderEnh = {
      pause(){ paused = true; },
      play(){ paused = false; },
      setSpeed(v){ speed = Math.max(0, Number(v)||speed); }
    };
  } catch(e){ console.warn('Ottimizzazione slider non attiva:', e); }
})();

// 10) Fallback Google Translate (solo warning)
setTimeout(() => {
  try {
    if (!document.querySelector('.goog-te-menu-frame')) {
      console.warn('Google Translate non caricato, attivando fallback (solo avviso)');
      // Qui potresti mostrare un messaggio o un selettore alternativo.
    }
  } catch(e){}
}, 5000);

/* ===== Estratto da ao1.html ===== */
window.loadAudio = function(src){
  return new Promise(function(resolve){
    try{
      var audio = new Audio();
      audio.preload = 'auto';
      audio.src = src;
      function done(){
        audio.removeEventListener('canplaythrough', done);
        resolve(audio);
      }
      audio.addEventListener('canplaythrough', done, {once:true});
      audio.addEventListener('loadeddata', done, {once:true});
    }catch(e){ resolve(null); }
  });
};

(function(){
  try{
    var imgs = document.querySelectorAll('.slide-vertical img');
    imgs.forEach(function(img){
      if(!img.getAttribute('loading')) img.setAttribute('loading','lazy');
      if(!img.getAttribute('decoding')) img.setAttribute('decoding','async');
      if(!img.getAttribute('width')) img.setAttribute('width','260');
      if(!img.getAttribute('height')) img.setAttribute('height','340');
    });
  }catch(e){}
})();

document.body.addEventListener('click', function(e){
  var el = e.target;
  var btnThunder = el.closest && (el.closest('#btn-thunder') || el.closest('#play-thunder'));
  var btnExplode = el.closest && (el.closest('#btn-explode') || el.closest('#explode-btn'));
  try{
    if(btnThunder){
      if(typeof window.handleThunder === 'function') window.handleThunder();
      else if(typeof window.playThunder === 'function') window.playThunder();
    }
    if(btnExplode){
      if(typeof window.handleExplosion === 'function') window.handleExplosion();
      else if(typeof window.explodeNow === 'function') window.explodeNow();
    }
  }catch(err){}
}, {passive:true});

(function(){
  try{
    var style = document.createElement('style');
    style.textContent = ".mega-menu{transition:opacity .2s ease,visibility .2s ease;will-change:opacity,transform}";
    document.head.appendChild(style);
  }catch(e){}
})();

setInterval(function(){
  try{
    document.querySelectorAll('canvas').forEach(function(c){
      var ctx = c.getContext && (c.getContext('2d') || c.getContext('webgl') || c.getContext('webgl2'));
      if(!ctx) return;
      if(ctx.clearRect){
        ctx.clearRect(0,0,c.width,c.height);
      }else if(ctx instanceof WebGLRenderingContext || ctx instanceof WebGL2RenderingContext){
        var gl = ctx;
        var buf = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT;
        gl.clear(buf);
      }
    });
  }catch(e){}
}, 1000);

window.loadGoogleTranslate = function(){
  try{
    if(document.querySelector('.goog-te-banner') || document.getElementById('google-translate-script')) return;
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.id = 'google-translate-script';
    document.head.appendChild(s);
  }catch(e){}
};

/* ===== Estratto da ao1.html ===== */
(function(){
  "use strict";
  if (window.__ECHI_MOBILE_DRAWER__) return;
  window.__ECHI_MOBILE_DRAWER__ = true;

  function setTopbarHeight(){
    var candidates = [
      '.topbar','.top-bar','#topbar','#site-topbar','.header-top','.site-header','header'
    ];
    var h = 64;
    for(var i=0;i<candidates.length;i++){
      var el = document.querySelector(candidates[i]);
      if(el){
        var r = el.getBoundingClientRect();
        if(r && r.height){ h = Math.max(h, Math.round(r.height)); break; }
      }
    }
    document.documentElement.style.setProperty('--topbar-height', h + 'px');
  }

  function toggleDrawerOpen(open){
    if(window.innerWidth > 980) return;
    document.body.classList.toggle('drawer-open', !!open);
  }

  function attachSuggestObservers(){
    var box = document.getElementById('cse-suggest');
    if(!box) return;
    // MutationObserver per aggiungere/rimuovere classe drawer-open quando la tendina si apre/chiude
    var obs = new MutationObserver(function(){
      var isOpen = box.classList.contains('show') && box.innerHTML.trim().length > 0;
      toggleDrawerOpen(isOpen);
    });
    obs.observe(box, { attributes:true, childList:true, subtree:false });
  }

  // Opzione "soft" automatica se schermo stretto
  function maybeEnableCosmoSoft(){
    var prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce || window.innerWidth < 480){
      document.body.classList.add('cosmo-soft');
    }
  }

  window.addEventListener('resize', setTopbarHeight, {passive:true});
  window.addEventListener('orientationchange', setTopbarHeight, {passive:true});
  document.addEventListener('DOMContentLoaded', function(){
    setTopbarHeight();
    attachSuggestObservers();
    maybeEnableCosmoSoft();
  });
})();

/* ===== Estratto da ao1.html ===== */
(function(){
  "use strict";
  if (window.__A11Y_PERF_CONSERVATIVE__) return;
  window.__A11Y_PERF_CONSERVATIVE__ = true;

  window.safeCall = function(name, fn){
    try { if (typeof fn === 'function') return fn(); }
    catch (err) { console.warn(name + " failed:", err); }
  };
  window.createManagedListener = function(el, ev, handler, opts){
    if(!el || !el.addEventListener) return function(){};
    el.addEventListener(ev, handler, opts||false);
    return function(){ try{ el.removeEventListener(ev, handler, opts||false); }catch(_){ } };
  };

  document.addEventListener('visibilitychange', function(){
    const reduce = document.visibilityState === 'hidden';
    document.documentElement.classList.toggle('reduce-motion', reduce);
  }, { passive: true });

  function ensureId(el, prefix){
    if(!el) return null;
    if(el.id) return el.id;
    const id = (prefix||'id') + '-' + Math.random().toString(36).slice(2,9);
    el.id = id;
    return id;
  }

  function setupAriaMenus(){
    const dropdowns = document.querySelectorAll('nav.menu-desktop li.dropdown');
    dropdowns.forEach(function(li){
      const trigger = li.querySelector('a, .menu-btn');
      const panel = li.querySelector('.mega-menu');
      if(!trigger || !panel) return;
      const pid = ensureId(panel, 'mega-menu');
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-controls', pid);
      trigger.setAttribute('aria-expanded', 'false');

      function setExpanded(v){ trigger.setAttribute('aria-expanded', v ? 'true' : 'false'); }
      li.addEventListener('mouseenter', function(){ setExpanded(true); }, {passive:true});
      li.addEventListener('mouseleave', function(){ setExpanded(false); }, {passive:true});
      li.addEventListener('focusin',  function(){ setExpanded(true); });
      li.addEventListener('focusout', function(e){
        if(!li.contains(e.relatedTarget)) setExpanded(false);
      });
    });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupAriaMenus);
  } else {
    setupAriaMenus();
  }
})();

/* ===== Estratto da ao1.html ===== */
(function(){
  const box = document.querySelector('.typing-wrap');
  if(!box) return;
  requestAnimationFrame(()=> {
    const h = box.getBoundingClientRect().height || box.offsetHeight;
    if(h > 0){
      box.style.minHeight = h + 'px';
      box.style.maxHeight = h + 'px';
    }
  });
})();

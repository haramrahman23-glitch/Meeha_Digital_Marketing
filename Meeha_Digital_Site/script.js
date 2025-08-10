// js/main.js
document.addEventListener('DOMContentLoaded', function(){

  // config (one place to update if needed)
  const SUPPORT_EMAIL = 'Maleehahameed29@gmail.com';
  const PHONE_DISPLAY = '+923180923546'; // for copy
  const PHONE_TEL = '+923180923546';

  // set year in all pages
  document.querySelectorAll('[id^="year"]').forEach(e => e.textContent = new Date().getFullYear());

  // hamburger toggle for mobile
  const hamburgerButtons = document.querySelectorAll('.hamburger');
  hamburgerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = document.querySelector('.main-nav');
      if (nav) nav.classList.toggle('open');
    });
  });

  // counters
  const counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window && counters.length) {
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.target || 0;
          const duration = 1200;
          const start = performance.now();
          function step(now){
            const progress = Math.min((now - start)/duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
          obs.unobserve(el);
        }
      });
    }, {threshold:0.3});
    counters.forEach(c => obs.observe(c));
  }

  // testimonials slider
  (function(){
    const wrap = document.getElementById('testimonials');
    if (!wrap) return;
    const slides = wrap.querySelectorAll('.testimonial');
    let idx = 0;
    function show(i){ slides.forEach((s,si) => s.classList.toggle('active', si===i)); }
    show(0);
    setInterval(()=> { idx = (idx+1) % slides.length; show(idx); }, 4500);
  })();

  // portfolio filter
  (function(){
    const filters = document.querySelectorAll('.filter-btn');
    const grid = document.getElementById('portfolioGridAll') || document.getElementById('portfolioGrid');
    if (!grid || !filters.length) return;
    const items = Array.from(grid.querySelectorAll('.project-card'));
    filters.forEach(btn=>{
      btn.addEventListener('click', ()=> {
        filters.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        items.forEach(it=>{
          const type = it.dataset.type;
          it.style.display = (f === '*' || f === undefined) ? '' : (type === f ? '' : 'none');
        });
      });
    });
  })();

  // typing effect (small)
  (function(){
    const el = document.getElementById('typing');
    if (!el) return;
    const words = ['Islamabad','Dubai','Riyadh','local neighbourhoods','your target audience'];
    let i = 0, j = 0, forward = true;
    function step(){
      el.textContent = words[i].slice(0,j);
      if (forward) {
        if (j++ === words[i].length) { forward = false; setTimeout(step, 1200); return; }
      } else {
        if (j-- === 0) { forward = true; i = (i+1)%words.length; }
      }
      setTimeout(step, forward ? 120 : 60);
    }
    step();
  })();

  // booking modal
  const bookModal = document.getElementById('bookModal');
  const openBookBtns = document.querySelectorAll('.btn-primary, .btn-ghost');
  // We only attach to particular buttons by id if needed; also allow header "Contact" click to open contact page instead.
  document.querySelectorAll('#bookNowBtn, #bookNowBtn2, #bookNowBtn3, #bookNowBtn4').forEach(b => { if (b) b.addEventListener('click', openBookModal); });
  // open modal when clicking any "Hire Meeha" or "Request Call" with data-open-modal attribute (optional)
  document.body.addEventListener('click', (e)=>{
    if (e.target.closest('[data-open-modal]')) openBookModal();
  });

  function openBookModal(){
    if (!bookModal) return;
    bookModal.setAttribute('aria-hidden','false');
  }
  function closeBookModal(){
    if (!bookModal) return;
    bookModal.setAttribute('aria-hidden','true');
  }
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  if (modalClose) modalClose.addEventListener('click', closeBookModal);
  if (modalCancel) modalCancel.addEventListener('click', closeBookModal);
  if (bookModal) bookModal.addEventListener('click', (e)=> { if (e.target === bookModal) closeBookModal(); });

  // booking form - mailto fallback
  const bookForm = document.getElementById('bookForm');
  if (bookForm) {
    bookForm.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(bookForm);
      const name = fd.get('name'), email = fd.get('email'), city = fd.get('city'), message = fd.get('message');
      const subject = encodeURIComponent('Meeha_Digital_Marketing — Booking Request');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCity: ${city}\n\n${message}`);
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
      closeBookModal();
    });
  }

  // contact form - mailto fallback
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = fd.get('name'), email = fd.get('email'), service = fd.get('service'), message = fd.get('message');
      const subject = encodeURIComponent(`Meeha_Digital_Marketing — Contact (${service})`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`);
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    });
    const clearBtn = document.getElementById('clearContact');
    if (clearBtn) clearBtn.addEventListener('click', ()=> contactForm.reset());
  }

  // copy-to-clipboard
  document.querySelectorAll('.copy-btn').forEach(btn=>{
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const old = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(()=> btn.textContent = old, 1400);
      } catch(e) {
        alert('Copy failed — please copy manually.');
      }
    });
  });

  // accessibility: ESC to close modal
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal[aria-hidden="false"]');
      if (open) open.setAttribute('aria-hidden','true');
    }
  });

});

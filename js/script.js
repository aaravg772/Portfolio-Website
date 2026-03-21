(function () {
  const saved = localStorage.getItem('ag-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', () => {

  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ag-theme', next);
    });
  }


  const navHeader = document.getElementById('nav-header');
  if (navHeader) {
    const onScroll = () => navHeader.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const ham     = document.getElementById('hamburger');
  const overlay = document.getElementById('mobile-overlay');
  const closeOv = document.getElementById('overlay-close');

  if (ham && overlay) {
    ham.addEventListener('click', () => overlay.classList.add('open'));
    if (closeOv) closeOv.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  }

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  const shaft = document.getElementById('suspense-shaft');
  if (shaft) {
    shaft.addEventListener('animationend', e => {
      if (e.animationName === 'shaft-grow') {
        shaft.classList.add('grown');
      }
    });
  }

  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const tgt = parseInt(el.dataset.target, 10);
      const sfx = el.dataset.suffix || '';
      let start = null;
      const dur = 1200;

      const step = ts => {
        if (!start) start = ts;
        const pct   = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - pct, 3);
        el.textContent = Math.floor(eased * tgt) + sfx;
        if (pct < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => countObs.observe(el));

  document.querySelectorAll('.bc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  initHorizontalTimeline();

  function initHorizontalTimeline() {
    const wrapper = document.getElementById('htl-wrapper');
    const section = document.getElementById('htl-section');
    const outer   = document.getElementById('htl-outer');
    const track   = document.getElementById('htl-track');
    if (!wrapper || !section || !outer || !track) return;

    if (window.matchMedia('(max-width: 900px)').matches) return;

    const NAV_H = 68;

    function getScrollDist() {
      const items = track.querySelectorAll('.htl-item');
      if (!items.length) return Math.max(0, track.scrollWidth - outer.clientWidth);
      const trackRect = track.getBoundingClientRect();
      const lastItem  = items[items.length - 1];
      const lastRect  = lastItem.getBoundingClientRect();
      const fullWidth = (lastRect.right - trackRect.left) + 80;
      return Math.max(0, fullWidth - outer.clientWidth);
    }

    function setWrapperHeight() {
      const dist = getScrollDist();
      wrapper.style.height = (window.innerHeight - NAV_H + dist) + 'px';
    }

    setTimeout(() => { setWrapperHeight(); drive(); }, 150);
    setTimeout(() => { setWrapperHeight(); drive(); }, 600);

    if (document.fonts) document.fonts.ready.then(() => { setWrapperHeight(); drive(); });
    window.addEventListener('resize', () => { setWrapperHeight(); drive(); }, { passive: true });

    function drive() {
      const wrapperRect = wrapper.getBoundingClientRect();
      const progress = NAV_H - wrapperRect.top;  
      const dist     = getScrollDist();
      const x        = Math.max(0, Math.min(dist, progress));
      track.style.transform = `translateX(-${x}px)`;
    }

    window.addEventListener('scroll', drive, { passive: true });
    drive();

    let dragging = false, dragStartX = 0, dragStartScrollY = 0;

    section.addEventListener('mousedown', e => {
      dragging       = true;
      dragStartX     = e.clientX;
      dragStartScrollY = window.scrollY;
      outer.classList.add('is-grabbing');
      e.preventDefault();
    });
    window.addEventListener('mouseup', () => {
      dragging = false;
      outer.classList.remove('is-grabbing');
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      const dx = dragStartX - e.clientX;
      window.scrollTo({ top: dragStartScrollY + dx, behavior: 'instant' });
    });
  }


  const artModal  = document.getElementById('artModal');
  const imgFull   = document.getElementById('imgFull');
  const modalCap  = document.getElementById('modalCaption');
  const modalSer  = document.getElementById('modalSeries');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  if (artModal) {
    const panels = Array.from(document.querySelectorAll('.manga-panel'));
    let currentIdx = 0;

    window.openModal = function (element) {
      currentIdx = panels.indexOf(element);
      showPanel(currentIdx);
      artModal.style.display = 'flex';
      document.body.classList.add('modal-open');
    };

    function showPanel(idx) {
      const el   = panels[idx];
      const img  = el.querySelector('img');

      const name = el.dataset.name || '';
      const desc = el.dataset.desc || '';

      imgFull.src = img.src;
      imgFull.style.transform = el.classList.contains('rotate-fix') ? 'rotate(90deg)' : '';

      if (modalCap)  modalCap.textContent  = name;
      if (modalSer)  modalSer.textContent  = img.alt || '';

      if (modalDesc) {
        modalDesc.textContent   = desc;
        modalDesc.style.display = desc ? 'block' : 'none';
      }
    }

    function closeModal() {
      artModal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }

    function prev() { currentIdx = (currentIdx - 1 + panels.length) % panels.length; showPanel(currentIdx); }
    function next() { currentIdx = (currentIdx + 1) % panels.length; showPanel(currentIdx); }

    if (modalPrev) modalPrev.addEventListener('click', e => { e.stopPropagation(); prev(); });
    if (modalNext) modalNext.addEventListener('click', e => { e.stopPropagation(); next(); });

    document.addEventListener('click', e => {
      if (e.target === artModal || e.target.classList.contains('close-modal')) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape')     closeModal();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    });

    let touchStartX = 0;
    artModal.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    artModal.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });
  }

  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-tags]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          if (filter === 'all') {
            card.classList.remove('hidden');
          } else {
            const tags = (card.dataset.tags || '').split(',');
            card.classList.toggle('hidden', !tags.includes(filter));
          }
        });
      });
    });
  }

});
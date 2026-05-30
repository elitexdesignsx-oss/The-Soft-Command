document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Logic
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  let currentTheme = localStorage.getItem('sc-theme') || 'noir';
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('.theme-icon');
    const marbleVeins = document.getElementById('marble-veins');
    if (themeIcon) {
      themeIcon.textContent = theme === 'noir' ? '◑' : '◐';
    }
    localStorage.setItem('sc-theme', theme);
    if (theme === 'marble') {
      document.body.classList.add('marble-bg');
      if (marbleVeins) marbleVeins.style.display = 'block';
    } else {
      document.body.classList.remove('marble-bg');
      if (marbleVeins) marbleVeins.style.display = 'none';
    }
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'noir' ? 'marble' : 'noir';
      applyTheme(currentTheme);
    });
  }
  applyTheme(currentTheme);

  // 2. Internationalization (i18n)
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  let currentLang = localStorage.getItem('sc-lang') || 'en';

  function applyTranslations(lang) {
    if (!TRANSLATIONS[lang]) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = TRANSLATIONS[lang][key];
        } else {
          el.textContent = TRANSLATIONS[lang][key];
        }
      }
    });
    if (langToggleBtn) {
      langToggleBtn.textContent = lang.toUpperCase() + ' ▾';
    }
    localStorage.setItem('sc-lang', lang);
  }

  if (langToggleBtn && langDropdown) {
    langToggleBtn.addEventListener('click', () => {
      langDropdown.hidden = !langDropdown.hidden;
    });
    langDropdown.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentLang = e.target.getAttribute('data-lang');
        applyTranslations(currentLang);
        langDropdown.hidden = true;
      });
    });
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!langDropdown.contains(e.target) && e.target !== langToggleBtn) {
        langDropdown.hidden = true;
      }
    });
  }
  applyTranslations(currentLang);

  // 3. Navigation Scroll and Mobile Menu
  const mainNav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('?')[0] === currentPage) {
      link.classList.add('is-active');
    }
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainNav?.classList.add('scrolled');
    } else {
      mainNav?.classList.remove('scrolled');
    }
  });

  if (hamburger && mobileMenu && mobileClose) {
    const openMenu = () => {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };

    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', openMenu);
    mobileClose.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
  }

  // 4. Scroll Reveal & Stats Counter Observers
  const revealElements = document.querySelectorAll('.reveal, .stagger-children');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  const statElements = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10);
        animateValue(entry.target, 0, target, 2000);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statElements.forEach(el => statObserver.observe(el));

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      obj.innerHTML = Math.floor(easeOutQuart * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // 5. Daily Quote
  const dailyQuoteText = document.getElementById('daily-quote-text');
  if (dailyQuoteText) {
    const quotes = [
      "Softness is not weakness. It is the silk that binds.",
      "I don't demand obedience. I inspire it.",
      "The quietest voice in the room often owns it.",
      "Patience is power. I have both.",
      "Control is not taken. It is surrendered — willingly.",
      "My attention is a gift, not a guarantee.",
      "Obey gently. Or don't obey at all."
    ];
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    dailyQuoteText.textContent = quotes[dayOfYear % quotes.length];
  }

  // 6. Hero Canvas Particles
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = '#D4AF37'; // Gold for both themes
      particles.forEach(p => {
        p.pulse += 0.02;
        p.opacity = 0.3 + Math.sin(p.pulse) * 0.25;
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (!document.hidden) animId = requestAnimationFrame(draw);
    }

    const heroObserver = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { draw(); } 
      else { cancelAnimationFrame(animId); }
    });
    heroObserver.observe(document.getElementById('hero'));

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw();
    }
  }

  // 7. Rules Carousel
  const wrapper = document.getElementById('slides-wrapper');
  if (wrapper) {
    const slides = wrapper.querySelectorAll('.rule-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('rules-prev');
    const nextBtn = document.getElementById('rules-next');
    const currentDisplay = document.getElementById('slide-current');
    const viewport = wrapper.closest('.slides-viewport');
    let current = 0;

    function syncCarouselHeight() {
      if (!viewport || !slides[current]) return;
      viewport.style.height = `${slides[current].offsetHeight}px`;
    }

    function goTo(index) {
      slides[current].classList.remove('active');
      if(dots[current]) dots[current].classList.remove('dot--active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if(dots[current]) dots[current].classList.add('dot--active');
      if (currentDisplay) currentDisplay.textContent = current + 1;
      wrapper.style.transform = `translateX(${-current * 100}%)`;
      syncCarouselHeight();
    }

    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    if(prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if(nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    window.addEventListener('resize', syncCarouselHeight);
    
    goTo(0);
  }

  // 8. Contact form gate and success state
  initCustomSelects();

  const rulesGate = document.getElementById('rules-gate');
  const formSection = document.getElementById('contact-form-section');
  const confirmRulesBtn = document.getElementById('confirm-rules-read');
  const applicationForm = document.getElementById('application-form');
  const formSuccess = document.getElementById('form-success');

  function revealApplicationForm() {
    if (rulesGate) rulesGate.hidden = true;
    if (formSection) formSection.hidden = false;
  }

  if (localStorage.getItem('sc-rules-acknowledged') === 'true') {
    revealApplicationForm();
  }

  confirmRulesBtn?.addEventListener('click', () => {
    localStorage.setItem('sc-rules-acknowledged', 'true');
    revealApplicationForm();
  });

  const params = new URLSearchParams(window.location.search);
  const tribute = params.get('tribute');
  const tributeSelect = document.getElementById('field-tribute');
  if (tribute && tributeSelect?.querySelector(`option[value="${tribute}"]`)) {
    tributeSelect.value = tribute;
    tributeSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }

  applicationForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!applicationForm.checkValidity()) {
      applicationForm.reportValidity();
      return;
    }

    localStorage.setItem('sc-rules-acknowledged', 'true');
    applicationForm.hidden = true;
    formSuccess?.removeAttribute('hidden');
  });
});

function initCustomSelects() {
  const selects = document.querySelectorAll('select.form-select');
  const closeAll = (except) => {
    document.querySelectorAll('.custom-select.open').forEach(select => {
      if (select !== except) {
        select.classList.remove('open');
        select.querySelector('.custom-select__button')?.setAttribute('aria-expanded', 'false');
      }
    });
  };

  selects.forEach((select) => {
    if (select.dataset.enhanced === 'true') return;

    select.dataset.enhanced = 'true';
    select.classList.add('form-select--native');

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'custom-select__button cinzel';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');

    const list = document.createElement('div');
    list.className = 'custom-select__list';
    list.setAttribute('role', 'listbox');

    const selectedText = () => select.options[select.selectedIndex]?.textContent || select.options[0]?.textContent || 'Select';

    function syncButton() {
      button.textContent = selectedText();
      list.querySelectorAll('.custom-select__option').forEach(option => {
        option.classList.toggle('is-selected', option.dataset.value === select.value);
      });
    }

    Array.from(select.options).forEach((option) => {
      if (option.disabled && !option.value) return;

      const optionButton = document.createElement('button');
      optionButton.type = 'button';
      optionButton.className = 'custom-select__option cinzel';
      optionButton.setAttribute('role', 'option');
      optionButton.dataset.value = option.value;
      optionButton.textContent = option.textContent;
      optionButton.addEventListener('click', () => {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        wrapper.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        syncButton();
        button.focus();
      });
      list.appendChild(optionButton);
    });

    button.addEventListener('click', () => {
      const willOpen = !wrapper.classList.contains('open');
      closeAll(wrapper);
      wrapper.classList.toggle('open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });

    button.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        wrapper.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      }
    });

    select.addEventListener('change', syncButton);
    select.parentNode.insertBefore(wrapper, select.nextSibling);
    wrapper.appendChild(button);
    wrapper.appendChild(list);
    syncButton();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.custom-select')) closeAll();
  });
}

/* ============================================================
   GROVE HERITAGE ACADEMY — SHARED JAVASCRIPT
   script.js
   ============================================================ */

'use strict';

/* ── Page Load Overlay ────────────────────────────────────── */
(function () {
  const overlay = document.getElementById('page-overlay');
  if (!overlay) return;
  window.addEventListener('load', function () {
    overlay.classList.add('done');
  });
}());

/* ── Seasonal Banner ──────────────────────────────────────── */
(function () {
  const bar = document.querySelector('.season-bar');
  if (bar) {
    const closeBtn = bar.querySelector('.season-bar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        bar.style.display = 'none';
        document.body.classList.remove('has-season-bar');
      });
    }
    bar.addEventListener('click', function (e) {
      if (e.target === closeBtn || closeBtn && closeBtn.contains(e.target)) return;
    });
  }

  const el = document.getElementById('seasonal-msg');
  if (!el) return;
  const month = new Date().getMonth(); // 0-indexed
  const messages = {
    0:  'Spring semester is underway — welcome back!',
    1:  'Spring enrollment is open for new students.',
    2:  'Spring Break is just around the corner!',
    3:  'Spring semester in full swing — have you checked the calendar?',
    4:  'Graduation season is here! Congratulations, seniors!',
    5:  'Summer break starts soon — enrollment for fall is open.',
    6:  'Fall enrollment closes soon — apply before it\'s too late.',
    7:  'Fall semester begins this month — get ready!',
    8:  'Fall semester is underway — welcome to a new year!',
    9:  'Midterm season — stay on track with our academic calendar.',
    10: 'Thanksgiving Break is coming — review the holiday schedule.',
    11: 'Winter Break is almost here — enjoy time with family.',
  };
  el.textContent = messages[month] || 'Welcome to Grove Heritage Academy!';
}());

/* ── Navbar: Scroll + Hero Mode + Split Nav ───────────────── */
(function () {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function updateNav() {
    if (!navbar) return;
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('hero-mode');
    } else {
      navbar.classList.remove('scrolled');
      if (navbar.dataset.heroMode === 'true') {
        navbar.classList.add('hero-mode');
      }
    }
  }

  if (navbar && navbar.dataset.heroMode === 'true') {
    navbar.classList.add('hero-mode');
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  function openMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) hamburger.addEventListener('click', function () {
    mobileMenu && mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  document.addEventListener('click', function (e) {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mobileMenu.contains(e.target) && hamburger && !hamburger.contains(e.target)) closeMenu();
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
}());

/* ── Active Nav Link ──────────────────────────────────────── */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu nav a').forEach(function (a) {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}());

/* ── Scroll Reveal Animations ─────────────────────────────── */
(function () {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function (el) { observer.observe(el); });
}());

/* ── Scripture Banner Reveal ─────────────────────────────── */
(function () {
  const banner = document.querySelector('.scripture-banner');
  if (!banner) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        banner.classList.add('visible');
        observer.unobserve(banner);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(banner);
}());

/* ── Stats Counter ────────────────────────────────────────── */
(function () {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (!stats.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateStat(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = target * easeOut(progress);
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(function (el) { observer.observe(el); });
}());

/* ── Testimonial Rotator ──────────────────────────────────── */
(function () {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsWrap = document.getElementById('testimonial-dots');
  if (!slides.length || !dotsWrap) return;

  let current = 0;
  let timer;

  const dots = Array.from(slides).map(function (_, i) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    d.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(d);
    return d;
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    // no-op — kept for symmetry
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 6000);
  }

  slides[0].classList.add('active');
  resetTimer();

  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });
}());

/* ── Highlights Horizontal Scroll Arrows ─────────────────── */
(function () {
  const track = document.getElementById('highlights-track');
  const prevBtn = document.getElementById('hl-prev');
  const nextBtn = document.getElementById('hl-next');
  if (!track || !prevBtn || !nextBtn) return;

  const STEP = 360;

  prevBtn.addEventListener('click', function () {
    track.scrollBy({ left: -STEP, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', function () {
    track.scrollBy({ left: STEP, behavior: 'smooth' });
  });

  function updateArrows() {
    prevBtn.disabled = track.scrollLeft < 10;
    nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
  }

  track.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();
}());


/* ── FAQ Accordion ────────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      items.forEach(function (other) { other.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
}());

/* ── Calendar ─────────────────────────────────────────────── */
(function () {
  if (!document.getElementById('calendar-grid')) return;

  const EVENTS = {
    '2026-08-12': { text: 'First Day of School — Fall Semester', type: 'academic', desc: 'Welcome back! The Fall Semester begins today. Students should log in to their course portals and review syllabi.' },
    '2026-09-01': { text: 'Labor Day — No School', type: 'holiday', desc: 'Office and classes are closed in observance of Labor Day. Enjoy time with your family!' },
    '2026-09-15': { text: 'Fall Enrollment Deadline', type: 'deadline', desc: 'Final deadline for enrollment applications for the Fall semester. Contact admissions if you have questions.' },
    '2026-10-15': { text: 'Midterm Progress Reports Due', type: 'academic', desc: 'Midterm progress reports are issued to all students. Review with your student and contact their instructor with any concerns.' },
    '2026-11-11': { text: 'Veterans Day — No School', type: 'holiday', desc: 'Office and classes are closed in honor of Veterans Day. We are grateful for those who served.' },
    '2026-11-25': { text: 'Thanksgiving Break Begins', type: 'holiday', desc: 'Thanksgiving Break begins. Classes resume Monday, December 1.' },
    '2026-11-26': { text: 'Thanksgiving Break', type: 'holiday', desc: 'Thanksgiving Day. We are grateful for the many blessings God has given our families.' },
    '2026-11-27': { text: 'Thanksgiving Break', type: 'holiday', desc: 'Thanksgiving Break continues.' },
    '2026-12-13': { text: 'Fall Semester Ends', type: 'academic', desc: 'The Fall Semester concludes. Final grades will be submitted within 5 business days.' },
    '2026-12-16': { text: 'Winter Break Begins', type: 'holiday', desc: 'Winter Break begins. The office will be closed December 16 through January 2.' },
    '2027-01-06': { text: 'Spring Semester Begins', type: 'academic', desc: 'Welcome back! The Spring Semester begins today. Students should review new course materials in their portals.' },
    '2027-01-15': { text: 'Spring Enrollment Open', type: 'deadline', desc: 'Spring semester enrollment is now open for new students. Visit the Admissions page to apply.' },
    '2027-01-19': { text: 'MLK Day — No School', type: 'holiday', desc: 'Office and classes are closed in observance of Martin Luther King Jr. Day.' },
    '2027-02-12': { text: 'Midyear Academic Check-In', type: 'academic', desc: 'Families will receive a midyear academic progress update. Contact your student\'s advisor with questions.' },
    '2027-03-10': { text: 'Spring Break Begins', type: 'holiday', desc: 'Spring Break begins. Classes resume Monday, March 17. Have a wonderful, restful week!' },
    '2027-04-15': { text: 'Enrollment Opens for 2027–2028', type: 'deadline', desc: 'Enrollment for the 2027–2028 school year is now open! Visit the Admissions page to apply.' },
    '2027-04-30': { text: 'Spring Progress Reports Due', type: 'academic', desc: 'Spring semester progress reports are issued to all students.' },
    '2027-05-16': { text: 'Spring Semester Ends', type: 'academic', desc: 'The Spring Semester concludes. Congratulations to all students on completing another successful year.' },
    '2027-05-23': { text: 'Graduation Ceremony', type: 'graduation', desc: 'Join us as we celebrate our graduating seniors! Details about location and time will be sent to families via email. Congratulations to the Class of 2027.' },
    '2027-06-01': { text: 'Summer Break Begins', type: 'holiday', desc: 'Summer Break begins. The office will have reduced hours through August. Have a wonderful summer!' },
  };

  let currentYear  = new Date().getFullYear();
  let currentMonth = new Date().getMonth();

  const gridEl      = document.getElementById('calendar-grid');
  const monthTitle  = document.getElementById('cal-month-title');
  const prevBtn     = document.getElementById('cal-prev');
  const nextBtn     = document.getElementById('cal-next');
  const upcomingEl  = document.getElementById('upcoming-list');
  const eventPopup  = document.getElementById('event-popup');
  const popupClose  = document.getElementById('popup-close');
  const popupDate   = document.getElementById('popup-date');
  const popupTitle  = document.getElementById('popup-title');
  const popupDesc   = document.getElementById('popup-desc');

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function pad(n) { return String(n).padStart(2, '0'); }
  function dateKey(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }

  function renderCalendar(year, month) {
    if (!gridEl) return;
    const today      = new Date();
    const firstDay   = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    if (monthTitle) monthTitle.textContent = MONTH_NAMES[month] + ' ' + year;

    let html = '';
    DAY_NAMES.forEach(function (d) { html += '<div class="cal-day-header">' + d + '</div>'; });
    for (let i = 0; i < firstDay; i++) { html += '<div class="cal-day empty"></div>'; }

    for (let d = 1; d <= daysInMonth; d++) {
      const key   = dateKey(year, month, d);
      const event = EVENTS[key];
      const isToday = (d === today.getDate() && month === today.getMonth() && year === today.getFullYear());
      const classes = ['cal-day'];
      if (isToday) classes.push('today');
      if (event) classes.push('has-event', event.type);

      html += '<div class="' + classes.join(' ') + '"' +
        (event ? ' data-date="' + key + '"' : '') + '>';
      html += '<div class="cal-day-num">' + d + '</div>';
      if (event) html += '<div class="cal-event-dot ' + event.type + '"></div>';
      html += '</div>';
    }

    gridEl.innerHTML = html;

    gridEl.querySelectorAll('.cal-day.has-event').forEach(function (cell) {
      cell.addEventListener('click', function () {
        const ev = EVENTS[cell.dataset.date];
        if (!ev || !eventPopup) return;
        const parts = cell.dataset.date.split('-');
        const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (popupDate)  popupDate.textContent  = dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (popupTitle) popupTitle.textContent = ev.text;
        if (popupDesc)  popupDesc.textContent  = ev.desc;
        eventPopup.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function renderUpcoming() {
    if (!upcomingEl) return;
    const today = new Date(); today.setHours(0,0,0,0);
    const upcoming = Object.entries(EVENTS)
      .filter(function ([key]) { return new Date(key) >= today; })
      .sort(function ([a],[b]) { return new Date(a) - new Date(b); })
      .slice(0, 8);

    if (!upcoming.length) {
      upcomingEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--gray);font-size:.875rem">No upcoming events.</div>';
      return;
    }
    upcomingEl.innerHTML = upcoming.map(function ([dateStr, ev]) {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return '<div class="upcoming-item upcoming-item--' + ev.type + '">' +
        '<div class="upcoming-date">' + label + '</div>' +
        '<div class="upcoming-event-title">' + ev.text + '</div>' +
        '</div>';
    }).join('');
  }

  if (prevBtn) prevBtn.addEventListener('click', function () {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentYear, currentMonth);
  });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentYear, currentMonth);
  });

  function closePopup() {
    if (eventPopup) eventPopup.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (popupClose) popupClose.addEventListener('click', closePopup);
  if (eventPopup) eventPopup.addEventListener('click', function (e) { if (e.target === eventPopup) closePopup(); });

  renderCalendar(currentYear, currentMonth);
  renderUpcoming();
}());

/* ── Form Success Messages ────────────────────────────────── */
(function () {
  document.querySelectorAll('form[data-netlify]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const successEl = form.querySelector('.form-success');
      if (!successEl) return;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
        setTimeout(function () {
          form.querySelectorAll('input, select, textarea').forEach(function (el) { el.value = ''; if (el.type === 'checkbox') el.checked = false; });
          successEl.style.display = 'block';
          if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-original') || 'Submit'; }
        }, 900);
      }
    });
  });
}());

/* ── Newsletter Form ──────────────────────────────────────── */
(function () {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn   = form.querySelector('button');
    if (btn) { btn.textContent = '✓ Subscribed'; btn.style.background = 'var(--sage)'; }
    if (input) input.value = '';
    setTimeout(function () {
      if (btn) { btn.textContent = 'Subscribe'; btn.style.background = ''; }
    }, 3000);
  });
}());

/* ── Smooth Scroll ────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});

/* ── Contact Form Character Counter ──────────────────────── */
(function () {
  const textarea = document.getElementById('contact-message');
  const counter  = document.getElementById('char-count');
  if (!textarea || !counter) return;
  textarea.addEventListener('input', function () {
    counter.textContent = this.value.length + '/1000';
  });
}());

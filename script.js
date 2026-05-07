/* ============================================================
   HERITAGE CHRISTIAN ACADEMY — SHARED JAVASCRIPT
   script.js
   ============================================================ */

'use strict';

/* ── Navbar: Scroll + Mobile Menu ─────────────────────────── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener('scroll', function () {
    const y = window.scrollY;
    if (navbar) {
      if (y > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    lastScroll = y;
  }, { passive: true });

  // Mobile menu toggle
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

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      mobileMenu && mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
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

/* ── FAQ Accordion ────────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      // Close all others
      items.forEach(function (other) { other.classList.remove('open'); });
      // Toggle this one
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
  let currentMonth = new Date().getMonth(); // 0-indexed

  const gridEl        = document.getElementById('calendar-grid');
  const monthTitle    = document.getElementById('cal-month-title');
  const prevBtn       = document.getElementById('cal-prev');
  const nextBtn       = document.getElementById('cal-next');
  const upcomingEl    = document.getElementById('upcoming-list');
  const eventPopup    = document.getElementById('event-popup');
  const popupClose    = document.getElementById('popup-close');
  const popupDate     = document.getElementById('popup-date');
  const popupTitle    = document.getElementById('popup-title');
  const popupDesc     = document.getElementById('popup-desc');

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function pad(n) { return String(n).padStart(2, '0'); }
  function dateKey(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }

  function renderCalendar(year, month) {
    if (!gridEl) return;
    const today     = new Date();
    const firstDay  = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    if (monthTitle) monthTitle.textContent = MONTH_NAMES[month] + ' ' + year;

    let html = '';
    // Day headers
    DAY_NAMES.forEach(function (d) {
      html += '<div class="cal-day-header">' + d + '</div>';
    });

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      html += '<div class="cal-day empty"></div>';
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const key   = dateKey(year, month, d);
      const event = EVENTS[key];
      const isToday = (d === today.getDate() && month === today.getMonth() && year === today.getFullYear());
      const classes = ['cal-day'];
      if (isToday) classes.push('today');
      if (event) classes.push('has-event');

      html += '<div class="' + classes.join(' ') + '"' +
        (event ? ' data-date="' + key + '" data-event="' + encodeURIComponent(JSON.stringify(event)) + '"' : '') +
        '>';
      html += '<div class="cal-day-num">' + d + '</div>';
      if (event) {
        html += '<div class="cal-events"><div class="cal-event-dot ' + event.type + '">' + event.text + '</div></div>';
      }
      html += '</div>';
    }

    gridEl.innerHTML = html;

    // Click handlers
    gridEl.querySelectorAll('.cal-day.has-event').forEach(function (cell) {
      cell.addEventListener('click', function () {
        const dateStr = cell.dataset.date;
        const ev = EVENTS[dateStr];
        if (!ev || !eventPopup) return;

        const parts = dateStr.split('-');
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const formattedDate = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        if (popupDate)  popupDate.textContent  = formattedDate;
        if (popupTitle) popupTitle.textContent = ev.text;
        if (popupDesc)  popupDesc.textContent  = ev.desc;
        eventPopup.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function renderUpcoming() {
    if (!upcomingEl) return;
    const today = new Date();
    today.setHours(0,0,0,0);

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
      return '<div class="upcoming-item">' +
        '<div class="upcoming-date">' + label + '</div>' +
        '<div class="upcoming-title">' + ev.text + '</div>' +
        '</div>';
    }).join('');
  }

  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar(currentYear, currentMonth);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar(currentYear, currentMonth);
    });
  }

  // Event popup close
  if (popupClose) {
    popupClose.addEventListener('click', function () {
      eventPopup.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (eventPopup) {
    eventPopup.addEventListener('click', function (e) {
      if (e.target === eventPopup) {
        eventPopup.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  renderCalendar(currentYear, currentMonth);
  renderUpcoming();
}());

/* ── Form Success Messages ────────────────────────────────── */
(function () {
  document.querySelectorAll('form[data-netlify]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      // In real Netlify deployment, the form will redirect.
      // This shows a success message for demo/local preview only.
      const successEl = form.querySelector('.form-success');
      if (!successEl) return;
      // Let Netlify handle real submissions. Only intercept on localhost.
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

/* ── Smooth Scroll for Anchor Links ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 88;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
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

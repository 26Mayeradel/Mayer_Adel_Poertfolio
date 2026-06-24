/* ============================================================
   SAYED ADEL — PORTFOLIO SCRIPT
   Animations · Interactions · Form Validation
   ============================================================ */

'use strict';
/* ══════════════════════════════════════════
   MOBILE MENU ISOLATED FIX
══════════════════════════════════════════ */
window.addEventListener('load', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navLinks');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // يمنع أي تداخل مع أكواد تانية
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });
    }
});

/* ── UTILITY: wait for DOM ── */
document.addEventListener('DOMContentLoaded', () => {
  /* ============================================================
     0. SCROLL REVEAL (وضعناه في البداية لتفادي أي أخطاء أخرى)
  ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ══════════════════════════════════════════
     1. CUSTOM CURSOR
  ══════════════════════════════════════════ */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left  = mouseX + 'px';
      cursorDot.style.top   = mouseY + 'px';
    });

    /* Smooth ring follow */
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* Scale ring on hover of interactive elements */
    document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform  = 'translate(-50%, -50%) scale(1.5)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1.4)';
        cursorRing.style.borderColor = 'var(--cyan)';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform  = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.borderColor = 'var(--violet)';
      });
    });
  }


  /* ══════════════════════════════════════════
     2. NAVBAR — blur on scroll + active links
  ══════════════════════════════════════════ */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  function onScroll() {
    /* Blur effect */
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* Active link highlight */
    let currentSection = '';
    sections.forEach(section => {
      const sTop = section.offsetTop - 120;
      if (window.scrollY >= sTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });

    /* Back to top */
    const btt = document.getElementById('backToTop');
    if (btt) {
      if (window.scrollY > 400) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }

    /* Reveal animations */
    revealOnScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call


  /* ══════════════════════════════════════════
     3. HAMBURGER MENU
  ══════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  /* Close menu on link click */
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger?.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ══════════════════════════════════════════
     4. HERO CANVAS — particle field
  ══════════════════════════════════════════ */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.05;
        this.hue = Math.random() > 0.5 ? 260 : 190; // violet or cyan
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      const count = Math.min(Math.floor(W * H / 8000), 120);
      particles = Array.from({ length: count }, () => new Particle());
    }

    /* Draw lines between nearby particles */
    function drawConnections() {
      const maxDist = 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${(1 - dist / maxDist) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateCanvas);
    }

    resize();
    initParticles();
    animateCanvas();

    const resizeObs = new ResizeObserver(() => {
      resize();
      initParticles();
    });
    resizeObs.observe(canvas.parentElement);
  }


  /* ══════════════════════════════════════════
     5. TYPING EFFECT
  ══════════════════════════════════════════ */
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'Software Engineer',
      'Frontend Developer',
      'Problem Solver',
      'DEPI Graduate',
      'C++ Enthusiast',
      'UI/UX Craftsman',
    ];
    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;
    let pauseTimer = null;

    function typeLoop() {
      const current = phrases[phraseIdx];

      if (!deleting) {
        typingEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          pauseTimer = setTimeout(typeLoop, 1800);
          return;
        }
        setTimeout(typeLoop, 90);
      } else {
        typingEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typeLoop, 400);
          return;
        }
        setTimeout(typeLoop, 45);
      }
    }

    setTimeout(typeLoop, 800);
  }


  /* ══════════════════════════════════════════
     6. SCROLL REVEAL
  ══════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  function revealOnScroll() {
    const windowH = window.innerHeight;
    revealEls.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowH - 60) {
        /* Stagger based on index within parent */
        const siblings = [...el.parentElement.children].filter(c =>
          c.classList.contains('reveal-up') ||
          c.classList.contains('reveal-left') ||
          c.classList.contains('reveal-right')
        );
        const sibIdx = siblings.indexOf(el);
        const delay  = sibIdx * 80;
        setTimeout(() => el.classList.add('revealed'), delay);
      }
    });
  }


  /* ══════════════════════════════════════════
     7. ANIMATED COUNTERS
  ══════════════════════════════════════════ */
  const statNums = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      countersStarted = true;
      statNums.forEach(el => {
        const target = +el.getAttribute('data-target');
        let current  = 0;
        const step   = target / 50;
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 40);
      });
    }
  }

  window.addEventListener('scroll', startCounters, { passive: true });
  startCounters();


  /* ══════════════════════════════════════════
     8. SKILL BAR ANIMATION
  ══════════════════════════════════════════ */
  const skillFills = document.querySelectorAll('.skill-fill');
  let skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      skillsAnimated = true;
      skillFills.forEach((fill, i) => {
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = width + '%';
        }, i * 60);
      });
    }
  }

  window.addEventListener('scroll', animateSkills, { passive: true });
  animateSkills();


  /* ══════════════════════════════════════════
     9. BUTTON RIPPLE EFFECT
  ══════════════════════════════════════════ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });


  /* ══════════════════════════════════════════
     10. SMOOTH SCROLL FOR ANCHOR LINKS
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


/* ══════════════════════════════════════════
     11. BACK TO TOP (CLEAN FIX)
  ══════════════════════════════════════════ */
  const btt = document.getElementById('backToTop');
  
  if (btt) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    });
  }


  /* ══════════════════════════════════════════
     12. PARALLAX BACKGROUND SHAPES
  ══════════════════════════════════════════ */
  const shapes = document.querySelectorAll('.shape');

  function parallax() {
    const scrollY = window.scrollY;
    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 0.06;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  window.addEventListener('scroll', parallax, { passive: true });


  /* ══════════════════════════════════════════
     13. SKILL CARD TILT EFFECT
  ══════════════════════════════════════════ */
  document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-4px)
        rotateX(${-y * 6}deg)
        rotateY(${x * 6}deg)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });


  /* ══════════════════════════════════════════
     14. CONTACT FORM VALIDATION
  ══════════════════════════════════════════ */
  window.submitForm = function() {
    const fields = {
      name:    { el: document.getElementById('name'),    errEl: document.getElementById('nameError')    },
      email:   { el: document.getElementById('email'),   errEl: document.getElementById('emailError')   },
      subject: { el: document.getElementById('subject'), errEl: document.getElementById('subjectError') },
      message: { el: document.getElementById('message'), errEl: document.getElementById('messageError') },
    };

    const statusEl = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const btnText  = document.getElementById('btnText');
    const btnIcon  = document.getElementById('btnIcon');

    let isValid = true;

    /* Clear previous errors */
    Object.values(fields).forEach(({ el, errEl }) => {
      errEl.textContent = '';
      el?.classList.remove('input-error');
    });
    statusEl.className = 'form-status';
    statusEl.textContent = '';

    /* Validate name */
    const name = fields.name.el.value.trim();
    if (!name) {
      showError(fields.name, 'Full name is required.');
      isValid = false;
    } else if (name.length < 2) {
      showError(fields.name, 'Name must be at least 2 characters.');
      isValid = false;
    }

    /* Validate email */
    const email = fields.email.el.value.trim();
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError(fields.email, 'Email address is required.');
      isValid = false;
    } else if (!emailReg.test(email)) {
      showError(fields.email, 'Please enter a valid email address.');
      isValid = false;
    }

    /* Validate subject */
    const subject = fields.subject.el.value.trim();
    if (!subject) {
      showError(fields.subject, 'Subject is required.');
      isValid = false;
    } else if (subject.length < 3) {
      showError(fields.subject, 'Subject must be at least 3 characters.');
      isValid = false;
    }

    /* Validate message */
    const message = fields.message.el.value.trim();
    if (!message) {
      showError(fields.message, 'Message cannot be empty.');
      isValid = false;
    } else if (message.length < 10) {
      showError(fields.message, 'Message must be at least 10 characters.');
      isValid = false;
    }

    if (!isValid) return;

    /* Simulate submission */
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.className   = 'fas fa-spinner fa-spin';

    setTimeout(() => {
      /* Reset button */
      submitBtn.disabled  = false;
      btnText.textContent = 'Send Message';
      btnIcon.className   = 'fas fa-paper-plane';

      /* Show success */
      statusEl.className   = 'form-status success';
      statusEl.innerHTML   = '<i class="fas fa-check-circle"></i> &nbsp;Message sent! I\'ll get back to you soon.';

      /* Clear form */
      Object.values(fields).forEach(({ el }) => { if (el) el.value = ''; });

      /* Hide status after 5s */
      setTimeout(() => {
        statusEl.className   = 'form-status';
        statusEl.textContent = '';
      }, 5000);
    }, 1600);
  };

  function showError(field, msg) {
    field.errEl.textContent = msg;
    field.el.classList.add('input-error');
    field.el.focus();
  }

  /* Live validation — clear error on input */
  ['name', 'email', 'subject', 'message'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', function() {
      this.classList.remove('input-error');
      document.getElementById(id + 'Error').textContent = '';
    });
  });


  /* ══════════════════════════════════════════
     15. INTERSECTION OBSERVER FOR INITIAL LOAD
  ══════════════════════════════════════════ */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));


  /* ══════════════════════════════════════════
     16. PROJECT CARD ENTER / LEAVE ANIMATION
  ══════════════════════════════════════════ */
  document.querySelectorAll('.project-card').forEach(card => {
    const overlay = card.querySelector('.project-overlay');
    const btns    = card.querySelectorAll('.proj-link-btn');

    card.addEventListener('mouseenter', () => {
      btns.forEach((btn, i) => {
        btn.style.transitionDelay = `${i * 50}ms`;
        btn.style.transform = 'translateY(0)';
      });
    });

    card.addEventListener('mouseleave', () => {
      btns.forEach((btn, i) => {
        btn.style.transitionDelay = '0ms';
        btn.style.transform = 'translateY(10px)';
      });
    });
  });


  /* ══════════════════════════════════════════
     17. NAVBAR HIDE ON MOBILE SCROLL DOWN
  ══════════════════════════════════════════ */
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (window.innerWidth < 768) {
      if (current > lastScrollY && current > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    }
    lastScrollY = current;
  }, { passive: true });


  /* ══════════════════════════════════════════
     18. GLOWING HOVER ON CERT / ABOUT CARDS
  ══════════════════════════════════════════ */
  document.querySelectorAll('.cert-card, .about-card, .contact-info-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--glow-x', x + '%');
      card.style.setProperty('--glow-y', y + '%');
      card.style.background = `
        radial-gradient(
          circle at ${x}% ${y}%,
          rgba(124,58,237,0.08) 0%,
          rgba(255,255,255,0.04) 60%
        )
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });


  /* ══════════════════════════════════════════
     19. ACTIVE NAV ON LOAD (run once)
  ══════════════════════════════════════════ */
  onScroll();
  revealOnScroll();
  startCounters();
  animateSkills();


  /* ══════════════════════════════════════════
     20. PERFORMANCE: requestIdleCallback for
         non-critical enhancements
  ══════════════════════════════════════════ */
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));

  idle(() => {
    /* Add subtle text scramble to section labels */
    document.querySelectorAll('.label-mono').forEach(el => {
      const original = el.textContent;
      el.addEventListener('mouseenter', () => {
        let i = 0;
        const chars = '0123456789/';
        const interval = setInterval(() => {
          el.textContent = original.split('').map((c, idx) => {
            if (idx < i) return original[idx];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          i++;
          if (i > original.length) {
            clearInterval(interval);
            el.textContent = original;
          }
        }, 40);
      });
    });
  });



  /* ══════════════════════════════════════════
     SCROLL REVEAL ANIMATIONS (FINAL FIX)
  ══════════════════════════════════════════ */
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  
  // 1. إخفاء العناصر بالجافاسكريبت
  elements.forEach(el => el.classList.add('js-hidden'));

  // 2. تشغيل المراقب (Intersection Observer)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('js-hidden');
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: "0px 0px -50px 0px" 
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => {
      el.classList.remove('js-hidden');
      el.classList.add('revealed');
    });
  }

  
}); /* END DOMContentLoaded */

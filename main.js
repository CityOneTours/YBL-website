// ========================
// YUTI BREWERIIES — MAIN.JS
// ========================

// AGE GATE
function verifyAge() {
  const day = parseInt(document.getElementById('dob-day')?.value);
  const month = parseInt(document.getElementById('dob-month')?.value);
  const year = parseInt(document.getElementById('dob-year')?.value);

  if (!day || !month || !year) {
    // Allow entry if fields are empty (just clicked yes)
    dismissAgeGate();
    return;
  }

  const dob = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  if (age >= 18) {
    dismissAgeGate();
  } else {
    alert('Sorry, you must be 18 or older to enter this site.');
  }
}

function dismissAgeGate() {
  const gate = document.getElementById('age-gate');
  if (gate) {
    gate.style.opacity = '0';
    gate.style.transition = 'opacity 0.8s ease';
    setTimeout(() => {
      gate.style.display = 'none';
      document.body.style.overflow = '';
    }, 800);
  }
  sessionStorage.setItem('ageVerified', 'true');
}

function denyEntry() {
  const gate = document.getElementById('age-gate');
  if (gate) gate.style.display = 'none';
  const denied = document.getElementById('denied-page');
  if (denied) denied.style.display = 'flex';
}

// Check if age already verified
window.addEventListener('DOMContentLoaded', () => {
  const gate = document.getElementById('age-gate');
  if (!gate) return;

  if (sessionStorage.getItem('ageVerified')) {
    gate.style.display = 'none';
  } else {
    document.body.style.overflow = 'hidden';
  }
});

// NAVBAR SCROLL
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (navbar) {
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide on scroll down, show on scroll up (only for non-inner pages)
    if (currentScroll > lastScroll && currentScroll > 200 && !navbar.classList.contains('always-visible')) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  }
});

// Inner pages always show navbar
if (navbar && navbar.classList.contains('scrolled')) {
  navbar.classList.add('always-visible');
  navbar.style.transition = 'background 0.4s, padding 0.4s, transform 0.4s';
}

// HAMBURGER MENU
function toggleMenu() {
  const links = document.getElementById('nav-links');
  const ham = document.getElementById('hamburger');
  if (links) {
    links.classList.toggle('open');
    ham.classList.toggle('open');
  }
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const links = document.getElementById('nav-links');
    if (links) links.classList.remove('open');
  });
});

// SCROLL REVEAL ANIMATION
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// PARALLAX EFFECT
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  
  // Hero parallax
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
  }
  
  // Page hero parallax
  const pageHeroBg = document.querySelector('.page-hero-bg img');
  if (pageHeroBg) {
    pageHeroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.2}px)`;
  }
});

// BRAND NAV ACTIVE STATE
const brandNavItems = document.querySelectorAll('.brand-nav-item');
const brandSections = document.querySelectorAll('.brand-section[id]');

if (brandSections.length > 0) {
  const brandObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        brandNavItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  brandSections.forEach(section => brandObserver.observe(section));
}

// SMOOTH ANCHOR LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 100;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  });
});

// CONTACT FORM SUBMIT
function submitForm() {
  const success = document.getElementById('form-success');
  if (success) {
    success.style.display = 'block';
    // Scroll to success message
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// HERO VIDEO FALLBACK
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.addEventListener('error', () => {
    heroVideo.style.display = 'none';
  });
  
  // Try to play the video
  heroVideo.play().catch(() => {
    console.log('Video autoplay prevented');
  });
}

// COUNTER ANIMATION
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

// Animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const num = entry.target.querySelector('.stat-num, .capacity-num');
      if (num && !num.dataset.animated) {
        num.dataset.animated = 'true';
        const text = num.textContent;
        const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (!isNaN(numericValue) && numericValue > 0) {
          animateCounter(num, numericValue);
        }
      }
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats .stat, .big-capacity').forEach(el => {
  statsObserver.observe(el);
});

// CURSOR GLOW EFFECT
document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  
  // Subtle cursor tracking for brand cards
  document.querySelectorAll('.brand-card, .ingr-card, .spirit-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardX = x - rect.left;
    const cardY = y - rect.top;
    if (cardX >= 0 && cardX <= rect.width && cardY >= 0 && cardY <= rect.height) {
      const rotX = (cardY / rect.height - 0.5) * 8;
      const rotY = (cardX / rect.width - 0.5) * -8;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    } else {
      card.style.transform = '';
    }
  });
});

// PAGE LOAD ANIMATION
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.3s ease';
});

// TICKER SPEED CONTROL
const strip = document.querySelector('.strip-inner');
if (strip) {
  strip.addEventListener('mouseenter', () => {
    strip.style.animationPlayState = 'paused';
  });
  strip.addEventListener('mouseleave', () => {
    strip.style.animationPlayState = 'running';
  });
}

console.log('%c YUTI BREWERIIES LTD ', 
  'background: #8B1A1A; color: #C9A84C; font-size: 20px; font-weight: bold; padding: 10px 20px;');
console.log('%c Our People. Our Taste. ', 
  'color: #C9A84C; font-size: 12px; letter-spacing: 5px;');
/* ==========================================
   H4 FITNESS STUDIO - PREMIUM LANDING PAGE
   INTERACTIVE LOGIC & ANIMATIONS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-quad'
  });

  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  /* --- 1. PRELOADER & LOADING PROGRESS --- */
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('loader-progress');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Animate loader fade-out
      setTimeout(() => {
        gsap.to(preloader, {
          opacity: 0,
          visibility: 'hidden',
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            // Trigger Hero animations after preloader disappears
            animateHero();
          }
        });
      }, 300);
    }
    progressBar.style.width = `${progress}%`;
  }, 100);

  /* --- 2. CUSTOM CURSOR GLOW --- */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
    });

    // Make glow expand on hoverable elements
    const hoverables = document.querySelectorAll('a, button, .gallery-item, .pricing-card, .feature-card, .program-card');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(cursorGlow, {
          width: '400px',
          height: '400px',
          backgroundColor: 'rgba(255, 215, 0, 0.12)',
          duration: 0.3
        });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(cursorGlow, {
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(255, 215, 0, 0.08)',
          duration: 0.3
        });
      });
    });
  }

  /* --- 3. SCROLL PROGRESS BAR --- */
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressIndicator = document.getElementById('scroll-progress');
    if (progressIndicator) {
      progressIndicator.style.width = scrolled + '%';
    }

    // Toggle Back-To-Top Button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (winScroll > 500) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }

    // Toggle Sticky Navbar
    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
      if (winScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Update active nav-link based on scroll position
    updateActiveNavLink();
  });

  /* --- 4. HERO SECTION CANVAS PARTICLES --- */
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 50;

    // Set canvas dimensions
    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.5 - 0.2; // Move upwards
        this.color = 'rgba(255, 215, 0, ' + (Math.random() * 0.4 + 0.1) + ')';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset if out of screen
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* --- 5. GSAP HERO REVEAL ANIMATIONS --- */
  function animateHero() {
    const tl = gsap.timeline();

    tl.to('.hero-title', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out'
    })
    .to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.8')
    .to('.hero-buttons', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.8');
  }

  /* --- 6. ANIMATED COUNTERS --- */
  const counters = document.querySelectorAll('.counter-num');
  const countSpeed = 200; // The lower the slower

  const runCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / countSpeed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target + '+';
        }
      };
      
      // Trigger counter animation using GSAP ScrollTrigger
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        onEnter: () => {
          updateCount();
        },
        once: true
      });
    });
  };
  runCounters();

  /* --- 7. ACTIVE NAVIGATION LINK ON SCROLL --- */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link-custom');

  function updateActiveNavLink() {
    let current = '';
    const scrollPos = window.scrollY + 150; // offset for nav height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  /* --- 8. SWIPER TESTIMONIALS --- */
  const testimonialSwiper = new Swiper('.testimonials-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      }
    }
  });

  /* --- 9. GALLERY FILTER & LIGHTBOX --- */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          gsap.to(item, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            display: 'block'
          });
        } else {
          gsap.to(item, {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            display: 'none'
          });
        }
      });
    });
  });

  // Lightbox implementation
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentGalleryIndex = 0;
  let activeGalleryImages = [];

  // Gather active visible images based on current filter
  function updateActiveImages() {
    activeGalleryImages = [];
    galleryItems.forEach(item => {
      if (item.style.display !== 'none') {
        const img = item.querySelector('.gallery-img');
        activeGalleryImages.push({
          src: img.getAttribute('src'),
          title: item.querySelector('.gallery-hover-text').innerText
        });
      }
    });
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateActiveImages();
      
      const clickedSrc = item.querySelector('.gallery-img').getAttribute('src');
      currentGalleryIndex = activeGalleryImages.findIndex(img => img.src === clickedSrc);
      
      openLightbox();
    });
  });

  function openLightbox() {
    if (activeGalleryImages.length === 0) return;
    const currentImg = activeGalleryImages[currentGalleryIndex];
    lightboxImg.setAttribute('src', currentImg.src);
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; // Disable page scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = ''; // Re-enable scroll
  }

  function showNextImage() {
    if (activeGalleryImages.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryImages.length;
    
    // Animate image switch
    gsap.fromTo(lightboxImg, { opacity: 0.5, scale: 0.95 }, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      onStart: () => {
        lightboxImg.setAttribute('src', activeGalleryImages[currentGalleryIndex].src);
      }
    });
  }

  function showPrevImage() {
    if (activeGalleryImages.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryImages.length) % activeGalleryImages.length;
    
    // Animate image switch
    gsap.fromTo(lightboxImg, { opacity: 0.5, scale: 0.95 }, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      onStart: () => {
        lightboxImg.setAttribute('src', activeGalleryImages[currentGalleryIndex].src);
      }
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Close on outer modal click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  /* --- 10. BACK TO TOP CLICK --- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --- 11. PREMIUM CONTACT FORM MOCKUP --- */
  const contactForm = document.getElementById('gym-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather input data
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      // Premium success feedback
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

      setTimeout(() => {
        submitBtn.classList.remove('btn-accent');
        submitBtn.style.backgroundColor = '#28a745';
        submitBtn.style.borderColor = '#28a745';
        submitBtn.style.color = '#fff';
        submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';

        // Create a floating notification toast
        createToast('Success', 'Thank you! H4 Fitness Studio will call you back shortly.');

        // Reset Form
        contactForm.reset();
        document.querySelectorAll('.form-control-custom').forEach(input => {
          input.dispatchEvent(new Event('placeholder-shown'));
        });

        // Reset button after 3s
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.classList.add('btn-accent');
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
          submitBtn.innerHTML = originalText;
        }, 3000);
      }, 1500);
    });
  }

  // Toast builder
  function createToast(title, message) {
    const toast = document.createElement('div');
    toast.className = 'glass-panel position-fixed p-3';
    toast.style.bottom = '30px';
    toast.style.left = '30px';
    toast.style.zIndex = '9999';
    toast.style.borderLeft = '4px solid var(--accent-color)';
    toast.style.width = '300px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    toast.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="m-0 text-accent" style="font-size: 1rem; font-family: var(--font-body); font-weight:600;">
          <i class="fas fa-info-circle me-2"></i>${title}
        </h5>
        <button class="btn-close btn-close-white" style="font-size: 0.7rem; filter: invert(1); cursor: pointer;" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
      <p class="m-0 text-white-50" style="font-size: 0.85rem;">${message}</p>
    `;

    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 100);

    // Fade out after 4 seconds
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  }
});

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initMouseParallax();
  initHorizontalScrollSliders();
  initScrollReveals();
  initInteractiveMarquees();
});

// Refresh triggers once all mockups and style dimensions are fully loaded
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

/* --- HERO INTRO STAGGER --- */
function initHeroAnimations() {
  const tl = gsap.timeline();
  
  // Set initial states
  gsap.set('.hero .letter-block', { y: 100, rotation: -20, opacity: 0 });
  gsap.set('.hero-badge-wrap .badge', { scale: 0, opacity: 0 });
  gsap.set('.hero p, .hero .btn-brutal', { y: 30, opacity: 0 });
  gsap.set('.sticker', { scale: 0, opacity: 0 });

  // 1. Reveal badges
  tl.to('.hero-badge-wrap .badge', {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    stagger: 0.15,
    ease: "elastic.out(1.2, 0.5)"
  });

  // 2. Stagger letters
  tl.to('.hero .letter-block', {
    y: 0,
    rotation: (i) => (i % 2 === 0 ? -3 : 3),
    opacity: 1,
    duration: 0.8,
    stagger: 0.08,
    ease: "back.out(1.7)",
    onComplete: () => {
      document.querySelectorAll('.hero .letter-block').forEach(el => el.classList.add('ready-hover'));
    }
  }, "-=0.3");

  // 3. Float in stickers
  tl.to('.sticker', {
    scale: 1,
    opacity: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: "back.out(1.5)"
  }, "-=0.5");

  // 4. Reveal text description and CTA Button
  tl.to('.hero p, .hero .btn-brutal', {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.12,
    ease: "power2.out"
  }, "-=0.4");
}

/* --- MOUSE HOVER PARALLAX FOR STICKERS --- */
function initMouseParallax() {
  const heroSection = document.querySelector('.hero');
  const stickers = document.querySelectorAll('.sticker');

  if (!heroSection) return;

  heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = heroSection.getBoundingClientRect();
    
    // Calculate normalized coordinates (-0.5 to 0.5)
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    stickers.forEach((sticker) => {
      const speed = parseFloat(sticker.getAttribute('data-speed')) || 1;
      
      // Move stickers offset in response to mouse movement
      gsap.to(sticker, {
        x: x * 60 * speed,
        y: y * 60 * speed,
        duration: 0.6,
        ease: "power2.out"
      });
    });
  });

  // Smooth reset on mouse leave
  heroSection.addEventListener('mouseleave', () => {
    stickers.forEach((sticker) => {
      gsap.to(sticker, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  });
}

/* --- HORIZONTAL PINNED CAROUSELS --- */
function initHorizontalScrollSliders() {
  let mm = gsap.matchMedia();

  // Only run pinning horizontal scroll animations on screens wider than 767px (Desktop/Tablet landscape)
  mm.add("(min-width: 768px)", () => {
    // Slider 1 (Wireframe cards)
    const track1 = document.getElementById('carousel-track-1');
    if (track1) {
      const parentSection = track1.closest('.carousel-section');
      const scrollWidth = track1.scrollWidth;
      
      gsap.to(track1, {
        x: () => -(scrollWidth - window.innerWidth + 80), // offset padding
        ease: "none",
        scrollTrigger: {
          trigger: parentSection,
          pin: true,
          start: "top top",
          end: () => `+=${scrollWidth - window.innerWidth + 120}`,
          scrub: 1,
          invalidateOnRefresh: true,
          // Add dynamic tilt/rotation to wireframe cards during horizontal movement
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const rotateAmount = gsap.utils.clamp(-3, 3, velocity / 150);
            gsap.to('.wireframe-card', {
              rotation: rotateAmount,
              skewX: rotateAmount * 0.5,
              duration: 0.2,
              overwrite: "auto"
            });
          },
          onLeave: () => {
            gsap.to('.wireframe-card', { rotation: 0, skewX: 0, duration: 0.3 });
          },
          onLeaveBack: () => {
            gsap.to('.wireframe-card', { rotation: 0, skewX: 0, duration: 0.3 });
          }
        }
      });
    }

    // Slider 2 (Live Web Screens)
    const track2 = document.getElementById('carousel-track-2');
    if (track2) {
      const parentSection2 = track2.closest('.carousel-section');
      const scrollWidth2 = track2.scrollWidth;

      gsap.to(track2, {
        x: () => -(scrollWidth2 - window.innerWidth + 80),
        ease: "none",
        scrollTrigger: {
          trigger: parentSection2,
          pin: true,
          start: "top top",
          end: () => `+=${scrollWidth2 - window.innerWidth + 120}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const rotateAmount = gsap.utils.clamp(-3, 3, velocity / 150);
            gsap.to(track2.querySelectorAll('.wireframe-card'), {
              rotation: -rotateAmount,
              skewX: -rotateAmount * 0.5,
              duration: 0.2,
              overwrite: "auto"
            });
          },
          onLeave: () => {
            gsap.to(track2.querySelectorAll('.wireframe-card'), { rotation: 0, skewX: 0, duration: 0.3 });
          },
          onLeaveBack: () => {
            gsap.to(track2.querySelectorAll('.wireframe-card'), { rotation: 0, skewX: 0, duration: 0.3 });
          }
        }
      });
    }
  });
}

/* --- SCROLL REVEAL STAGGER ANIMATIONS --- */
function initScrollReveals() {
  // 1. About section card pop-up
  if (document.querySelector('.about')) {
    gsap.from('.about-text-card', {
      y: 80,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about',
        start: "top 75%",
      }
    });

    // 2. About section photo frame entry
    gsap.from('.about-avatar-frame', {
      scale: 0.5,
      rotation: -15,
      opacity: 0,
      duration: 1,
      ease: "elastic.out(1, 0.6)",
      scrollTrigger: {
        trigger: '.about',
        start: "top 70%",
      }
    });
  }

  // 3. About section QR cards stagger reveal
  if (document.querySelector('.about-qr-row')) {
    gsap.from('.about-qr-row .qr-card', {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: '.about-qr-row',
        start: "top 90%",
      }
    });
  }

  // 4. Timeline cards reveal
  const timelineSections = document.querySelectorAll('.experience-section');
  timelineSections.forEach((section) => {
    gsap.from(section.querySelectorAll('.timeline-card'), {
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
      }
    });
  });

  // 5. Skills cards elastic trigger
  const skillsSections = document.querySelectorAll('.skills-section');
  skillsSections.forEach((section) => {
    gsap.from(section.querySelectorAll('.skill-box-card'), {
      scale: 0.7,
      rotation: (i) => (i % 2 === 0 ? -5 : 5),
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "elastic.out(1.1, 0.55)",
      scrollTrigger: {
        trigger: section,
        start: "top 65%",
      }
    });

    // Animate custom arrow path drawing effect
    const arrowPath = section.querySelector('.arrow-path');
    if (arrowPath) {
      const length = arrowPath.getTotalLength();
      gsap.set(arrowPath, { strokeDasharray: length, strokeDashoffset: length });
      
      gsap.to(arrowPath, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        }
      });
    }
  });

  // 6. Portfolio Cards Grid reveal
  const gallerySections = document.querySelectorAll('.gallery-section');
  gallerySections.forEach((section) => {
    gsap.from(section.querySelectorAll('.portfolio-card, .phone-mockup-wrapper'), {
      y: 80,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 65%",
      }
    });
  });

  // 7. Desktop Showcase reveal
  if (document.querySelector('.desktop-showcase')) {
    gsap.from('.desktop-device-brutal', {
      scale: 0.8,
      rotationY: 0,
      rotationX: 0,
      opacity: 0,
      stagger: 0.25,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.desktop-showcase',
        start: "top 60%",
      }
    });
  }

  // 8. Footer custom block reveal
  if (document.querySelector('.thank-you-title')) {
    gsap.fromTo('.thank-you-title .letter-block',
      {
        y: 60,
        rotation: -15,
        opacity: 0
      },
      {
        y: 0,
        rotation: (i) => (i % 2 === 0 ? -1.5 : 1.5),
        opacity: 1,
        stagger: 0.06,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '.thank-you-title',
          start: "top 95%",
          once: true,
        },
        onComplete: () => {
          document.querySelectorAll('.thank-you-title .letter-block').forEach(el => el.classList.add('ready-hover'));
        }
      }
    );
  }
}

/* --- DYNAMIC SCROLL LINK FOR TICKER MARQUEES --- */
function initInteractiveMarquees() {
  const tracks = document.querySelectorAll('.ticker-track');
  const smileys = document.querySelectorAll('.ticker-smiley');
  
  // Set up continuous rotation on smileys
  gsap.to(smileys, {
    rotation: 360,
    duration: 8,
    repeat: -1,
    ease: "none"
  });

  // Link scrolling velocity to marquee speed and smiley rotation rate
  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity();
      const speedMultiplier = gsap.utils.clamp(0.5, 4, Math.abs(velocity / 400));
      
      // Speed up infinite track transitions
      tracks.forEach(track => {
        gsap.to(track, {
          timeScale: speedMultiplier,
          duration: 0.4,
          overwrite: "auto"
        });
      });

      // Speed up smiley rotating speeds
      gsap.to(smileys, {
        timeScale: speedMultiplier * 1.5,
        duration: 0.4,
        overwrite: "auto"
      });
    }
  });
}

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initMouseParallax();
  initHorizontalScrollSliders();
  initScrollReveals();
  initInteractiveMarquees();
  initProjectModal();
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

/* --- NEOBRUTALIST PROJECT DETAILS MODAL --- */
const projectData = {
  laundry: {
    title: "Laundry Service App",
    category: "SaaS User Interface",
    desc: "A premium, modular SaaS application built for modern laundry and dry cleaning businesses. Designed to streamline order tracking, scheduling, pickup/delivery route management, and secure digital payments. This interface breaks traditional utility web designs with vibrant, high-contrast typography, thick brutalist borders, and custom interactive feedback systems.",
    features: [
      "Real-time order tracking with SMS notifications",
      "Dynamic drag-and-drop scheduler for pickup and delivery slots",
      "Interactive driver routing and status dashboard",
      "Seamless Stripe billing integration with instant receipts"
    ],
    images: [
      "assets/Laundry Home Screen.png",
      "assets/mobile_mockup_1.png",
      "assets/packaging_mockup_1.png"
    ],
    link: "https://www.figma.com/design/18E8dPL2LAAGOzsT5hfTb4/Untitled--Copy-?t=KV964t3sFKFIxr14-1"
  },
  expense: {
    title: "AI Expense Advisor",
    category: "AI Financial Assistant",
    desc: "An intelligent personal finance dashboard that leverages AI models to categorize expenditures, detect subscription leaks, predict monthly burn rates, and offer personalized budgeting advice. Built with an emphasis on rich data visualizations, micro-interactions, and bold card hierarchies.",
    features: [
      "Automatic receipt OCR parsing and transaction mapping",
      "Interactive finance charts detail monthly spending trends",
      "Predictive AI forecasting for bills and subscription dates",
      "Dynamic chat assistance for smart cost-cutting recommendations"
    ],
    images: [
      "assets/Expence Advisor.png",
      "assets/web_mockup_1.png",
      "assets/mobile_mockup_2.png"
    ],
    link: "https://www.figma.com/design/VLY1dU2IbkFGDC3jWBjpBE/Advanced-Figma?t=KV964t3sFKFIxr14-1"
  },
  sehat: {
    title: "Healthcare Portal (MeriSehat)",
    category: "Digital Healthcare Hub",
    desc: "A comprehensive health and wellness portal designed to connect patients directly with primary care doctors, manage medical reports, track daily vitals, and coordinate telemedicine appointments. Features a bold retro aesthetic for enhanced legibility and warm visual approachability.",
    features: [
      "Virtual video consultation scheduler and manager",
      "Secure encrypted medical records and prescription vault",
      "Real-time vital tracking dashboard with high contrast metrics",
      "AI-driven symptom checker and wellness guidance"
    ],
    images: [
      "assets/MeriSehat Desktop.png",
      "assets/MeriSehat.png",
      "assets/web_mockup_2.png"
    ],
    link: "https://www.figma.com/design/90PuO8yOyHFkmi5It3bU7Q/Site-Map--Community-?node-id=0-1&t=KV964t3sFKFIxr14-1"
  },
  garlicmart: {
    title: "GarlicMart E-Commerce",
    category: "Organic Grocery Store",
    desc: "A high-fidelity mockup and user journey for an organic, farm-to-table grocery shopping application. Focuses on frictionless cart addition, clean filtering systems, accessibility compliance, and vibrant product presentation using custom vector stickers.",
    features: [
      "Farm-to-table tracking with organic producer profiles",
      "Ultra-fast multi-category filtering and instant search",
      "Subtle cart micro-animations and micro-rewards",
      "100% WCAG 2.1 AA accessible contrast layout"
    ],
    images: [
      "assets/GarlicMart.png",
      "assets/packaging_mockup_2.png"
    ],
    link: "https://www.figma.com/design/18E8dPL2LAAGOzsT5hfTb4/Untitled--Copy-?t=KV964t3sFKFIxr14-1"
  }
};

let modalTimeline = null;

function openProjectModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  const modal = document.getElementById('project-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCard = document.getElementById('modal-card');
  const mCategory = document.getElementById('modal-project-category');
  const mTitle = document.getElementById('modal-title');
  const mDesc = document.getElementById('modal-desc');
  const mFeatures = document.getElementById('modal-features');
  const mLink = document.getElementById('modal-project-link');
  const mMainImg = document.getElementById('modal-main-img');
  const mThumbnails = document.getElementById('modal-thumbnails');

  if (!modal || !modalOverlay || !modalCard) return;

  // Populate textual content
  if (mCategory) mCategory.textContent = data.category;
  if (mTitle) mTitle.textContent = data.title;
  if (mDesc) mDesc.textContent = data.desc;
  
  // Populate features list
  if (mFeatures) {
    mFeatures.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      mFeatures.appendChild(li);
    });
  }

  // Populate link
  if (mLink) mLink.href = data.link;

  // Populate image gallery
  if (mThumbnails && mMainImg) {
    mThumbnails.innerHTML = '';
    if (data.images && data.images.length > 0) {
      mMainImg.src = data.images[0];
      mMainImg.alt = data.title;

      data.images.forEach((imgSrc, idx) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.alt = `${data.title} thumbnail ${idx + 1}`;
        thumb.classList.add('modal-thumb');
        if (idx === 0) thumb.classList.add('active');

        // Thumbnail Click Listener
        thumb.addEventListener('click', () => {
          if (thumb.classList.contains('active')) return;

          // Swap image with GSAP fade transition
          gsap.to(mMainImg, {
            opacity: 0,
            scale: 0.96,
            duration: 0.15,
            onComplete: () => {
              mMainImg.src = imgSrc;
              gsap.to(mMainImg, {
                opacity: 1,
                scale: 1,
                duration: 0.25,
                ease: "power2.out"
              });
            }
          });

          // Toggle active class
          const thumbs = mThumbnails.querySelectorAll('.modal-thumb');
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });

        mThumbnails.appendChild(thumb);
      });
    }
  }

  // Display Modal and lock scroll
  modal.classList.add('active');
  document.body.classList.add('modal-open');

  // GSAP modal entry animation
  if (modalTimeline) modalTimeline.kill();
  modalTimeline = gsap.timeline();

  gsap.set(modalOverlay, { opacity: 0 });
  gsap.set(modalCard, { scale: 0.85, rotation: -3, opacity: 0 });

  modalTimeline
    .to(modalOverlay, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    })
    .to(modalCard, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.4)"
    }, "-=0.15");
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCard = document.getElementById('modal-card');

  if (!modal || !modal.classList.contains('active')) return;

  if (modalTimeline) modalTimeline.kill();
  modalTimeline = gsap.timeline({
    onComplete: () => {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  });

  modalTimeline
    .to(modalCard, {
      scale: 0.85,
      rotation: -2,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in"
    })
    .to(modalOverlay, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    }, "-=0.15");
}

function initProjectModal() {
  // Select all interactive project triggers
  const triggers = document.querySelectorAll('[data-project]');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = trigger.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  // Attach Close Event Listeners
  const closeBtn = document.getElementById('modal-close');
  const overlay = document.getElementById('modal-overlay');

  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
  if (overlay) overlay.addEventListener('click', closeProjectModal);

  // Esc keyboard key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
    }
  });
}

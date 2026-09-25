/**
 * LinuxOnVita - Interactive Scripts & Terminal Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initGalleryShowcase();
  initFaqAccordion();
  initMatrixFilter();
  initCopyButtons();
});

/* --------------------------------------------------------------------------
   Navbar & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile drawer toggle
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   Screenshot Gallery Showcase & Lightbox
   -------------------------------------------------------------------------- */
function initGalleryShowcase() {
  const displayImg = document.getElementById('screen-display-img');
  const captionTitle = document.getElementById('caption-title');
  const captionDesc = document.getElementById('caption-desc');
  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  const zoomBtn = document.getElementById('screen-zoom-btn');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  const galleryData = [
    {
      src: 'assets/images/screenshot.png',
      title: 'Interactive Welcome Screen & On-Screen Touch Keyboard',
      desc: 'Native virtual touch keyboard (fbkeyboard) with dual ABC and ?123 symbol layers for instant standalone typing without cables or external peripherals.'
    },
    {
      src: 'assets/images/screenshot2.png',
      title: 'Native Framebuffer DOOM (Full Screen 960x544)',
      desc: 'Pure-C fbdoom engine rendering at native 960x544 console resolution with twin-stick analog controls and deadzone tuning mapped via /dev/uinput.'
    },
    {
      src: 'assets/images/screenshot3.png',
      title: 'Fastfetch & Package Management in Alpine Linux',
      desc: 'System info and apk package manager running inside an isolated persistent Alpine Linux chroot atop the Linux 6.12 SMP kernel.'
    },
    {
      src: 'assets/images/screenshot4.png',
      title: 'Interactive On-Device Wi-Fi Manager (vita-wifi)',
      desc: 'Scan wireless networks, view live ASCII signal strength, and connect directly on the handheld console. Credentials automatically persist across reboots.'
    }
  ];

  function setActiveSlide(index) {
    if (!displayImg || !galleryData[index]) return;

    // Fade effect
    displayImg.style.opacity = '0.4';
    displayImg.style.transform = 'scale(0.98)';

    setTimeout(() => {
      displayImg.src = galleryData[index].src;
      displayImg.alt = galleryData[index].title;
      if (captionTitle) captionTitle.textContent = galleryData[index].title;
      if (captionDesc) captionDesc.textContent = galleryData[index].desc;

      displayImg.style.opacity = '1';
      displayImg.style.transform = 'scale(1)';
    }, 150);

    tabBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
      setActiveSlide(idx);
    });
  });

  // Lightbox handlers
  function openLightbox(triggerType = 'zoom_button') {
    if (!lightboxModal || !lightboxImg || !displayImg) return;
    lightboxImg.src = displayImg.src;
    lightboxImg.alt = displayImg.alt;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (triggerType === 'image_click') {
      trackUmamiEvent('Gallery Zoom', { trigger: 'image_click' });
    }
  }

  function closeLightbox(method = 'button') {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    if (method !== 'button') {
      trackUmamiEvent('Lightbox Close', { method });
    }
  }

  if (zoomBtn) zoomBtn.addEventListener('click', () => openLightbox('zoom_button'));
  if (displayImg) displayImg.addEventListener('click', () => openLightbox('image_click'));
  if (lightboxClose) lightboxClose.addEventListener('click', () => closeLightbox('button'));
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox('backdrop');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox('escape_key');
    }
  });
}



/* --------------------------------------------------------------------------
   Hardware Support Matrix Filters
   -------------------------------------------------------------------------- */
function initMatrixFilter() {
  const filterBtns = document.querySelectorAll('.matrix-filter-btn');
  const rows = document.querySelectorAll('.matrix-row');

  if (!filterBtns.length || !rows.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter') || 'all';

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      rows.forEach(row => {
        const rowCat = row.getAttribute('data-category');
        if (category === 'all' || rowCat === category) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close other accordions
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   Copy-to-Clipboard Code Snippets
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetText = btn.getAttribute('data-copy');
      if (!targetText) return;

      try {
        await navigator.clipboard.writeText(targetText);
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        btn.classList.add('copied');

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Clipboard copy error:', err);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Umami Event Tracking Helper
   -------------------------------------------------------------------------- */
export function trackUmamiEvent(eventName, eventData = {}) {
  try {
    if (typeof window !== 'undefined' && window.umami && typeof window.umami.track === 'function') {
      window.umami.track(eventName, eventData);
    }
  } catch (err) {
    // Fail silently to prevent any disruption if ad-blockers or network errors occur
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.trackUmamiEvent = trackUmamiEvent;
}


/**
 * LinuxOnVita - Interactive Scripts & Terminal Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initGalleryShowcase();
  initTerminalSimulator();
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
  function openLightbox() {
    if (!lightboxModal || !lightboxImg || !displayImg) return;
    lightboxImg.src = displayImg.src;
    lightboxImg.alt = displayImg.alt;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (zoomBtn) zoomBtn.addEventListener('click', openLightbox);
  if (displayImg) displayImg.addEventListener('click', openLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   Terminal Simulator Playground
   -------------------------------------------------------------------------- */
function initTerminalSimulator() {
  const terminalBody = document.getElementById('terminal-body');
  const termTabs = document.querySelectorAll('.terminal-tab-btn');

  const terminalOutputs = {
    fastfetch: `<span class="term-comment"># Displaying system architecture and active kernel</span>
<span class="term-prompt">vita:~# </span><span class="term-cmd">fastfetch</span>

<span class="term-cyan">       _.-;;-._        </span><span class="term-cyan">root</span>@<span class="term-cyan">vita</span>
<span class="term-cyan">'-..-'|   ||   |       </span>------------
<span class="term-cyan">'-..-'|_.-;;-._|       </span><span class="term-white">OS: </span>Alpine Linux v3.20 (armv7l)
<span class="term-cyan">'-..-'|   ||   |       </span><span class="term-white">Host: </span>Sony PlayStation Vita (PCH-1000/2000)
<span class="term-cyan">'-..-'|_.-''-._|       </span><span class="term-white">Kernel: </span>Linux 6.12.0-vita-smp
<span class="term-cyan">                       </span><span class="term-white">Uptime: </span>42 mins, 18 secs
<span class="term-cyan">                       </span><span class="term-white">Shell: </span>ash
<span class="term-cyan">                       </span><span class="term-white">Display: </span>960x544 @ 60Hz (simplefb)
<span class="term-cyan">                       </span><span class="term-white">CPU: </span>ARM Cortex-A9 MPCore r2p2 (4 cores active SMP)
<span class="term-cyan">                       </span><span class="term-white">Memory: </span>148MB / 498MB (RAM) + 256MB (ZRAM LZ4)
<span class="term-cyan">                       </span><span class="term-white">Storage: </span>/mnt/ux0 (SD2Vita) 119.2G / 238.5G

<span class="term-prompt">vita:~# </span><span class="term-cmd blink">_</span>`,

    'vita-wifi': `<span class="term-comment"># Interactive wireless manager with live ASCII signal scanner</span>
<span class="term-prompt">vita:~# </span><span class="term-cmd">vita-wifi</span>

<span class="term-cyan">[vita-wifi] Scanning wireless networks on wlan0 (Marvell SD8787)...</span>
<span class="term-white">+----+------------------------+----------+---------+----------+</span>
<span class="term-white">| ID | SSID                   | SIGNAL   | BARS    | SECURITY |</span>
<span class="term-white">+----+------------------------+----------+---------+----------+</span>
<span class="term-green">|  1 | Studio_5G_HighSpeed    | -48 dBm  | [#####] | WPA2-PSK |</span>
<span class="term-white">|  2 | Home_Network_2.4G      | -62 dBm  | [#### ] | WPA2-PSK |</span>
<span class="term-white">|  3 | CoffeeShop_Guest       | -79 dBm  | [##   ] | OPEN     |</span>
<span class="term-white">+----+------------------------+----------+---------+----------+</span>

Select network ID to connect: <span class="term-yellow">1</span>
Associating with 'Studio_5G_HighSpeed'...
<span class="term-green">[OK] Authenticated via WPA2.</span>
<span class="term-green">[OK] Assigned IP address: 192.168.1.145/24 (DHCP)</span>
<span class="term-green">[OK] Gateway: 192.168.1.1 | DNS: 1.1.1.1</span>
<span class="term-blue">[INFO] Configuration saved to /mnt/ux0/linux/wifi.conf</span>
<span class="term-blue">[INFO] OpenSSH server reachable at ssh root@vita.local</span>

<span class="term-prompt">vita:~# </span><span class="term-cmd blink">_</span>`,

    'alpine-chroot': `<span class="term-comment"># Entering persistent Alpine Linux container & installing packages</span>
<span class="term-prompt">vita:~# </span><span class="term-cmd">alpine-chroot</span>
Entering Alpine Linux userland...
Mounted /dev, /proc, /sys, /mnt/ux0

<span class="term-prompt">alpine:/# </span><span class="term-cmd">apk add python3 py3-pip neovim htop</span>
fetch https://dl-cdn.alpinelinux.org/alpine/v3.20/main/armv7/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.20/community/armv7/APKINDEX.tar.gz
(1/8) Installing libbz2 (1.0.8-r6)
(2/8) Installing libffi (3.4.6-r0)
(3/8) Installing python3 (3.12.3-r1)
(4/8) Installing py3-pip (24.0-r2)
(5/8) Installing libtermkey (0.22-r3)
(6/8) Installing neovim (0.9.5-r0)
(7/8) Installing htop (3.3.0-r0)
Executing busybox-1.36.1-r29.trigger
<span class="term-green">OK: 82 MiB in 24 packages</span>

<span class="term-prompt">alpine:/# </span><span class="term-cmd">python3 -c "import os; print('Running Python on PS Vita ARM Cortex-A9! CPUs:', os.cpu_count())"</span>
<span class="term-yellow">Running Python on PS Vita ARM Cortex-A9! CPUs: 4</span>

<span class="term-prompt">alpine:/# </span><span class="term-cmd blink">_</span>`,

    'vita-doom': `<span class="term-comment"># Native Framebuffer DOOM (fbdoom) with twin-stick gamepad mapping</span>
<span class="term-prompt">vita:~# </span><span class="term-cmd">vita-doom</span>

<span class="term-cyan">========================================</span>
<span class="term-white">       LinuxOnVita fbdoom Launcher       </span>
<span class="term-cyan">========================================</span>
[fbdoom] Initializing direct Linux Framebuffer (/dev/fb0)...
[fbdoom] Resolution: 960x544 32bpp, Pitch: 3840 bytes.
[input] Capturing Syscon analog sticks (L/R) & Vita D-Pad via /dev/uinput...
[input] Deadzone calibrated: 18% center deadband.
[game] WAD file detected: /mnt/ux0/linux/doom1.wad (Shareware DOOM)
[game] Launching DOOM Episode 1: Knee-Deep in the Dead...
<span class="term-green">[fbdoom] Running at stable 35 FPS full native framebuffer.</span>
<span class="term-comment">Press SELECT + START to exit to terminal shell.</span>

<span class="term-prompt">vita:~# </span><span class="term-cmd blink">_</span>`,

    'vita-swap': `<span class="term-comment"># Dynamic LZ4 ZRAM memory expansion</span>
<span class="term-prompt">vita:~# </span><span class="term-cmd">vita-swap status</span>

<span class="term-cyan">=== LinuxOnVita Memory & Swap Health ===</span>
<span class="term-white">Physical RAM:</span>     512 MB (usable ~498 MB)
<span class="term-white">ZRAM Swap Device:</span> /dev/zram0 (256 MB LZ4)
<span class="term-white">ZRAM Comp Ratio:</span>  <span class="term-green">3.12x</span> (Compressed 78 MB into 25 MB RAM)
<span class="term-white">SD Card Swapfile:</span> /mnt/ux0/swapfile (512 MB active)

<span class="term-prompt">vita:~# </span><span class="term-cmd">free -h</span>
               total        used        free      shared  buff/cache   available
Mem:           498Mi       142Mi       230Mi       4.0Mi       126Mi       348Mi
Swap:          768Mi        25Mi       743Mi

<span class="term-green">[OK] Memory headroom verified: OOM-killer protection active.</span>

<span class="term-prompt">vita:~# </span><span class="term-cmd blink">_</span>`
  };

  termTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-cmd');
      if (!target || !terminalOutputs[target]) return;

      termTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (terminalBody) {
        terminalBody.innerHTML = terminalOutputs[target];
      }
    });
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

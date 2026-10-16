/**
 * Jana Magdy / Coach Mego — Interactive Website Engine
 * Vanilla JavaScript (HTML5 / CSS3 / ES6+)
 */

// ==========================================
// 1. BRAND CONFIGURATION & VERIFIED DESTINATIONS
// ==========================================
const BRAND_CONFIG = {
  // Official Social Media Destinations
  instagramUrl: 'https://www.instagram.com/janna_magdy_?dlrf=YTZjcWw3Y3Npdmxw',
  teamInstagramUrl: 'https://www.instagram.com/team.mego?vrfl=MW9qeHMycDVwM2FqcQ==',
  tiktokUrl: 'https://www.tiktok.com/@jannamagdykhalil?_r=1&_t=ZS-9ASrdMo9JI8',
  
  // Official Business Contact Channel
  phoneNumber: '+201037695962',
  phoneDisplay: '+20 10 3769 5962',
  whatsappUrl: 'https://wa.me/201037695962',
  
  // Official Subscription Portal Destinations
  planAMonthlyUrl: '',                       // Subscription portal URL for Monthly Plan (156.99 EGP)
  planBOneMonthPassUrl: ''                   // Subscription portal URL for 1-Month Pass (185 EGP)
};

// ==========================================
// 2. DOM CONTENT LOADED & INITIALIZATION
// ==========================================
// ==========================================
// 0. PAGE LOAD / REFRESH BEHAVIOUR
// ==========================================
// A refresh (or a return via the back-forward cache) could restore a stale
// mid-page scroll offset and a scroll-locked <body>, which left the page
// feeling stuck below the fold with the hero off screen. Opting out of scroll
// restoration and resetting both on every (re)load guarantees the page opens
// at the very top on the hero, ready to play its entrance animation.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const resetToTop = () => {
  document.body.style.overflow = '';
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
};

// Run on the initial load and again whenever the page is shown from cache.
resetToTop();
window.addEventListener('pageshow', resetToTop);

document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  initHeaderScroll();
  initMobileDrawer();
  initHeroHeadlineSequence();
  initVideoPlayer();
  initReviewsCarousel();
  initPlanButtons();
  initSocialLinks();
  initSmoothScroll();
});

/**
 * Initialize Lucide Icons
 */
function initLucideIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Toast Notification System
 */
function showToast(message, iconName = 'sparkles') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  initLucideIcons();

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 400);
  }, 3800);
}

// ==========================================
// 3. HEADER & NAVIGATION SCROLL
// ==========================================
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const navLinks = document.querySelectorAll('.drawer-nav-link, .js-close-drawer');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

// ==========================================
// 4. HERO ANIMATED HEADLINE SEQUENCE
// ==========================================
function initHeroHeadlineSequence() {
  const container = document.getElementById('heroHeadlineCarousel');
  if (!container) return;

  const slides = container.querySelectorAll('.headline-slide');
  if (!slides || slides.length <= 1) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let currentIdx = 0;
  const totalSlides = slides.length;
  const displayDuration = 3400; // time each phrase stays visible

  setInterval(() => {
    // Current slide exits
    slides[currentIdx].classList.remove('active');

    // Next slide
    currentIdx = (currentIdx + 1) % totalSlides;

    // Next slide enters smoothly
    slides[currentIdx].classList.add('active');
  }, displayDuration);
}

// ==========================================
// 5. CUSTOM VIDEO PLAYER SYSTEM
// ==========================================
function initVideoPlayer() {
  const video = document.getElementById('brandVideo');
  const videoWrapper = document.getElementById('videoWrapper');
  const overlay = document.getElementById('videoOverlay');
  const playTrigger = document.getElementById('videoPlayTrigger');
  const ctrlPlayPause = document.getElementById('ctrlPlayPause');
  const ctrlPlayIcon = document.getElementById('ctrlPlayIcon');
  const ctrlProgressContainer = document.getElementById('ctrlProgressContainer');
  const ctrlProgressFill = document.getElementById('ctrlProgressFill');
  const ctrlTimeDisplay = document.getElementById('ctrlTimeDisplay');
  const ctrlMute = document.getElementById('ctrlMute');
  const ctrlMuteIcon = document.getElementById('ctrlMuteIcon');
  const ctrlFullscreen = document.getElementById('ctrlFullscreen');

  if (!video || !overlay) return;

  const togglePlayback = () => {
    if (video.paused || video.ended) {
      video.play().then(() => {
        overlay.classList.add('hidden');
        videoWrapper.classList.add('playing');
        updatePlayPauseUI(true);
      }).catch(err => {
        // A quick second tap interrupts play() with AbortError — that is normal
        // toggling, not a failure. Anything else is worth reporting.
        if (err && err.name === 'AbortError') return;
        console.error('Video playback was refused:', err);
        showToast('Playback could not start — please tap play once more.');
      });
    } else {
      video.pause();
      overlay.classList.remove('hidden');
      videoWrapper.classList.remove('playing');
      updatePlayPauseUI(false);
    }
  };

  const updatePlayPauseUI = (isPlaying) => {
    if (!ctrlPlayIcon) return;
    ctrlPlayIcon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    initLucideIcons();
  };

  // The play button lives inside the overlay, so its click bubbles up to the
  // overlay as well. Listening on both elements fired togglePlayback twice for
  // one click — video.play() followed immediately by video.pause() — which is
  // why tapping the button did nothing. The button now stops the event at
  // itself; the overlay still handles clicks on its backdrop and caption.
  if (playTrigger) playTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayback();
  });
  if (overlay) overlay.addEventListener('click', togglePlayback);
  if (ctrlPlayPause) ctrlPlayPause.addEventListener('click', togglePlayback);
  video.addEventListener('click', togglePlayback);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // While the pointer is dragging, the bar belongs to the drag — skip the
  // periodic repaint so timeupdate can't snap it back mid-scrub.
  let isScrubbing = false;

  video.addEventListener('timeupdate', () => {
    if (isScrubbing) return;
    if (video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      if (ctrlProgressFill) ctrlProgressFill.style.width = `${percent}%`;
      if (ctrlProgressContainer) ctrlProgressContainer.setAttribute('aria-valuenow', Math.round(percent));
      if (ctrlTimeDisplay) {
        ctrlTimeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    }
  });

  video.addEventListener('loadedmetadata', () => {
    if (ctrlTimeDisplay && video.duration) {
      ctrlTimeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
    }
  });

  // A failed media element reports its reason here; log it and tell the visitor
  // rather than leaving the button silently dead.
  video.addEventListener('error', () => {
    const reason = video.error ? video.error.message : 'unknown media error';
    console.error('Video failed to load:', reason);
    showToast('The training video could not be loaded. Please refresh the page.');
  });

  video.addEventListener('ended', () => {
    overlay.classList.remove('hidden');
    videoWrapper.classList.remove('playing');
    updatePlayPauseUI(false);
    // Reloading resets the element to its initial state, which brings the
    // poster (cover image) back instead of freezing the final frame on screen;
    // the next press starts fresh from 0:00.
    video.load();
  });

  if (ctrlProgressContainer) {
    // Drag-to-seek. pointerdown starts the scrub and captures the pointer, so
    // the drag keeps tracking even once the cursor leaves the thin bar; the
    // fill and time readout follow the pointer live, and pointerup/cancel end
    // the scrub. (A plain click still works: pointerdown seeks immediately.)
    const seekToClientX = (clientX) => {
      if (!video.duration) return;
      const rect = ctrlProgressContainer.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      video.currentTime = pos * video.duration;
      if (ctrlProgressFill) ctrlProgressFill.style.width = `${pos * 100}%`;
      ctrlProgressContainer.setAttribute('aria-valuenow', Math.round(pos * 100));
      if (ctrlTimeDisplay) {
        ctrlTimeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    };

    ctrlProgressContainer.addEventListener('pointerdown', (e) => {
      if (!video.duration) return;
      isScrubbing = true;
      try {
        ctrlProgressContainer.setPointerCapture(e.pointerId);
      } catch (_) { /* capture is a bonus, not a requirement */ }
      seekToClientX(e.clientX);
      e.preventDefault();
    });

    ctrlProgressContainer.addEventListener('pointermove', (e) => {
      if (!isScrubbing) return;
      seekToClientX(e.clientX);
    });

    const endScrub = (e) => {
      if (!isScrubbing) return;
      isScrubbing = false;
      try {
        ctrlProgressContainer.releasePointerCapture(e.pointerId);
      } catch (_) { /* already released */ }
    };

    ctrlProgressContainer.addEventListener('pointerup', endScrub);
    ctrlProgressContainer.addEventListener('pointercancel', endScrub);
  }

  if (ctrlMute) {
    // Rebuild the icon markup on every toggle rather than patching the node
    // captured at init: Lucide swaps <i data-lucide> for an <svg> when it
    // renders, so that reference goes stale and the glyph stops changing.
    // volume-off = speaker with a slash (muted); volume-2 = speaker with waves.
    const renderMuteIcon = () => {
      ctrlMute.innerHTML = `<i data-lucide="${video.muted ? 'volume-off' : 'volume-2'}" id="ctrlMuteIcon"></i>`;
      ctrlMute.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
      initLucideIcons();
    };

    ctrlMute.addEventListener('click', () => {
      video.muted = !video.muted;
      renderMuteIcon();
    });
  }

  if (ctrlFullscreen) {
    ctrlFullscreen.addEventListener('click', () => {
      const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

      if (!isFullscreen) {
        // Always fullscreen the frame (the wrapper) — never the bare <video>.
        // A full-screen <video> fills the screen with object-fit: cover and
        // crops the clip down to a narrow slice.
        if (videoWrapper.requestFullscreen) {
          videoWrapper.requestFullscreen();
        } else if (videoWrapper.webkitRequestFullscreen) {
          videoWrapper.webkitRequestFullscreen();
        }
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    });
  }
}

// ==========================================
// 6. VIDEO FEATURE (playback handled in initVideoPlayer)
// ==========================================

// ==========================================
// 7. CLIENT REVIEWS CAROUSEL (ONE IMAGE AT A TIME)
// ==========================================
function initReviewsCarousel() {
  const stage = document.getElementById('reviewStage');
  const prevBtn = document.getElementById('reviewPrevBtn');
  const nextBtn = document.getElementById('reviewNextBtn');
  const currentNum = document.getElementById('reviewCurrentNum');
  const totalNum = document.getElementById('reviewTotalNum');

  if (!stage) return;

  const slides = Array.from(stage.querySelectorAll('.review-slide'));
  const images = Array.from(stage.querySelectorAll('.review-stage-img'));
  const total = slides.length || images.length;
  if (!total) return;

  let index = 0;
  let isProgrammaticScroll = false;
  let programmaticScrollTimer = null;

  if (totalNum) totalNum.textContent = total;

  const dotsContainer = document.getElementById('reviewDots');

  // Build pagination dots for mobile
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = `review-dot ${i === 0 ? 'is-active' : ''}`;
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => showReview(i, true));
      dotsContainer.appendChild(dot);
    }
  }

  const updateUI = () => {
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    images.forEach((img, i) => img.classList.toggle('is-active', i === index));

    if (currentNum) currentNum.textContent = index + 1;

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.review-dot');
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    }
  };

  const showReview = (newIndex, scrollStage = true) => {
    // Wrap continuously: past 11 returns to 1, before 1 jumps to 11
    index = ((newIndex % total) + total) % total;
    updateUI();

    // On mobile where stage is horizontally scrollable, align stage position directly
    if (scrollStage && stage.scrollWidth > stage.clientWidth + 5) {
      const targetLeft = index * stage.clientWidth;
      if (Math.abs(stage.scrollLeft - targetLeft) > 2) {
        isProgrammaticScroll = true;
        stage.scrollTo({
          left: targetLeft,
          behavior: 'auto'
        });
        clearTimeout(programmaticScrollTimer);
        programmaticScrollTimer = setTimeout(() => {
          isProgrammaticScroll = false;
        }, 60);
      }
    }
  };

  // Sync scroll position with active index and pagination dots in real time on mobile swipe
  stage.addEventListener('scroll', () => {
    if (isProgrammaticScroll) return;
    const slideWidth = stage.clientWidth;
    if (!slideWidth) return;
    const scrolledIndex = Math.round(stage.scrollLeft / slideWidth);
    if (scrolledIndex >= 0 && scrolledIndex < total && scrolledIndex !== index) {
      index = scrolledIndex;
      updateUI();
    }
  }, { passive: true });

  // Keep scroll aligned on window resize / orientation change
  window.addEventListener('resize', () => {
    if (stage.scrollWidth > stage.clientWidth + 5) {
      stage.scrollLeft = index * stage.clientWidth;
    }
  });

  // Mouse drag support for testing swipe on mobile viewport
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let hasDragged = false;

  stage.addEventListener('mousedown', (e) => {
    if (stage.scrollWidth <= stage.clientWidth + 5) return;
    if (e.button !== 0) return;
    isDown = true;
    hasDragged = false;
    startX = e.pageX;
    scrollStart = stage.scrollLeft;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const diff = e.pageX - startX;
    if (Math.abs(diff) > 4) {
      hasDragged = true;
      e.preventDefault();
      stage.scrollLeft = scrollStart - diff;
    }
  });

  const finishMouseDrag = () => {
    if (!isDown) return;
    isDown = false;
    if (hasDragged) {
      const slideWidth = stage.clientWidth;
      if (slideWidth) {
        const nearestIndex = Math.round(stage.scrollLeft / slideWidth);
        showReview(nearestIndex, true);
      }
    }
  };

  window.addEventListener('mouseup', finishMouseDrag);

  // Desktop arrow navigation
  if (prevBtn) prevBtn.addEventListener('click', () => showReview(index - 1, true));
  if (nextBtn) nextBtn.addEventListener('click', () => showReview(index + 1, true));

  // Keyboard navigation when stage has focus
  stage.setAttribute('tabindex', '0');
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showReview(index - 1, true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showReview(index + 1, true);
    }
  });

  showReview(0, false);
}

// ==========================================
// 8. SUBSCRIPTION BUTTON HANDLERS
// ==========================================
function initPlanButtons() {
  const planButtons = document.querySelectorAll('.js-plan-btn');

  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planType = btn.getAttribute('data-plan');

      let targetUrl = '';
      let planName = '';

      if (planType === 'monthly') {
        targetUrl = BRAND_CONFIG.planAMonthlyUrl;
        planName = 'Monthly Subscription (156.99 EGP)';
      } else if (planType === 'pass') {
        targetUrl = BRAND_CONFIG.planBOneMonthPassUrl;
        planName = 'One-Month Pass (185 EGP)';
      }

      if (targetUrl && targetUrl !== '#' && targetUrl.startsWith('http')) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        showToast(`Official checkout for ${planName} will open once official portal link is active.`, 'sparkles');
      }
    });
  });
}

// ==========================================
// 9. SOCIAL LINKS CONFIGURATION
// ==========================================
function initSocialLinks() {
  // Pre-configured in HTML with verified destinations
  const whatsappLinks = document.querySelectorAll('.js-social-whatsapp');
  whatsappLinks.forEach(link => {
    link.href = BRAND_CONFIG.whatsappUrl;
  });
}

// ==========================================
// 10. SMOOTH ANCHOR SCROLL
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

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

  const images = Array.from(stage.querySelectorAll('.review-stage-img'));
  const total = images.length;
  if (!total) return;

  let index = 0;

  if (totalNum) totalNum.textContent = total;

  const dotsContainer = document.getElementById('reviewDots');

  // Build pagination dots for mobile
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    images.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `review-dot ${i === 0 ? 'is-active' : ''}`;
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => showReview(i));
      dotsContainer.appendChild(dot);
    });
  }

  const showReview = (newIndex) => {
    // Wrap continuously in both directions: past 11 returns to 1, and before 1
    // jumps to 11, so neither arrow can ever reach a dead end.
    index = ((newIndex % total) + total) % total;

    images.forEach((img, i) => img.classList.toggle('is-active', i === index));

    if (currentNum) currentNum.textContent = index + 1;

    // Update pagination dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.review-dot');
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    }
  };

  if (prevBtn) prevBtn.addEventListener('click', () => showReview(index - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showReview(index + 1));

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  stage.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }
  }, { passive: true });

  const handleSwipe = () => {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    // Horizontal swipe threshold: 35px, and horizontal travel exceeds vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX < 0) {
        showReview(index + 1); // Swipe left -> next
      } else {
        showReview(index - 1); // Swipe right -> previous
      }
    }
  };

  // Keyboard support when the carousel itself has focus.
  stage.setAttribute('tabindex', '0');
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showReview(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showReview(index + 1);
    }
  });

  showReview(0);
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

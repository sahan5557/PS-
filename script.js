document.addEventListener('DOMContentLoaded', () => {
  // Clear any old avatar cache so index.html HTML text always shows directly
  localStorage.removeItem('ps_slot_hero_avatar');

  initThemeSystem();
  initScrollNavSpy();
  initJohariTabs();
  initStarTabs();
  initImageUploadSlots();
  initMeetingChecklist();
  initLightbox();
  initUtilityActions();
  initLessonCatalogSystem();
});

/* ============================================================
   1. THEME SYSTEM (Permanent Dark Mode)
   ============================================================ */
function initThemeSystem() {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('ps_creative_theme', 'dark');
}

/* ============================================================
   2. FLOATING PILL NAV & SCROLL SPY
   ============================================================ */
function initScrollNavSpy() {
  const navItems = document.querySelectorAll('.pill-nav-item');
  const sections = document.querySelectorAll('section[id], article[id]');
  const backToTop = document.getElementById('backToTopBtn');
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');

  // Smooth scroll to top of page when Home is clicked
  const homeLinks = document.querySelectorAll('a[href="#portfolio-intro"]');
  homeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      if (history.replaceState) {
        history.replaceState(null, null, ' ');
      }
    });
  });

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;

    if (backToTop) {
      if (winScroll > 400) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }

    // Scroll spy for active pill
    let currentId = '';
    if (winScroll < 200) {
      currentId = 'portfolio-intro';
    } else {
      sections.forEach(sec => {
        const top = sec.offsetTop - 200;
        if (winScroll >= top) {
          currentId = sec.getAttribute('id');
        }
      });
    }

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (
        href === `#${currentId}` ||
        (href === '#coursework-modules' && (currentId === 'coursework-modules' || (currentId && currentId.startsWith('ch-'))))
      ) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }
}

/* ============================================================
   3. JOHARI TABS (Pure HTML Display Switching - No Text in JS)
   ============================================================ */
function initJohariTabs() {
  const tiles = document.querySelectorAll('.johari-tile');
  const panels = document.querySelectorAll('.johari-panel');
  if (tiles.length === 0 || panels.length === 0) return;

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      tiles.forEach(t => t.classList.remove('active'));
      tile.classList.add('active');

      const quadrant = tile.getAttribute('data-quadrant');
      panels.forEach(panel => {
        if (panel.id === `johari-${quadrant}`) {
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================================
   4. STAR STEPPER TABS (Pure HTML Display Switching - No Text in JS)
   ============================================================ */
function initStarTabs() {
  const buttons = document.querySelectorAll('.star-btn-step');
  const panels = document.querySelectorAll('.star-stage-panel');
  if (buttons.length === 0 || panels.length === 0) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const stage = btn.getAttribute('data-star-stage');
      panels.forEach(panel => {
        if (panel.id === `star-${stage}`) {
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================================
   5. IMAGE UPLOAD & PREVIEW SYSTEM
   - Allows choosing photo directly from computer
   - Also respects files located in the images/ directory
   ============================================================ */
function initImageUploadSlots() {
  // 1. Hero Avatar Upload
  const avatarInput = document.getElementById('heroAvatarInput');
  const avatarBtn = document.getElementById('heroAvatarBtn');
  const avatarImg = document.getElementById('heroAvatarImg');
  const avatarFallback = document.getElementById('heroAvatarPlaceholder');

  if (avatarBtn && avatarInput) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      avatarInput.click();
    });

    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (avatarImg) {
          avatarImg.src = event.target.result;
          avatarImg.style.display = 'block';
        }
        if (avatarFallback) {
          avatarFallback.style.display = 'none';
        }
        showToast('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    });
  }

  // 1B. Academic Mentor Photo Upload
  const mentorInput = document.getElementById('mentorPhotoInput');
  const mentorBtn = document.getElementById('mentorPhotoBtn');
  const mentorImg = document.querySelector('.mentor-avatar-img');

  if (mentorBtn && mentorInput) {
    mentorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mentorInput.click();
    });

    mentorInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (mentorImg) {
          mentorImg.src = event.target.result;
        }
        showToast('Lecturer photo updated!');
      };
      reader.readAsDataURL(file);
    });
  }

  // 2. Lesson Cards Image Slots
  const uploadCards = document.querySelectorAll('.image-upload-card');
  uploadCards.forEach(card => {
    const img = card.querySelector('img.slot-preview-img');
    const uploadBtn = card.querySelector('.btn-slot-upload');
    const fileInput = card.querySelector('input.hidden-file-input');
    const emptyState = card.querySelector('.slot-empty-state');

    if (!img || !fileInput) return;

    // Check if initial image loads from images/ folder
    img.addEventListener('load', () => {
      card.classList.add('has-photo');
      img.style.display = 'block';
      if (emptyState) emptyState.style.display = 'none';
    });

    img.addEventListener('error', () => {
      card.classList.remove('has-photo');
      img.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
    });

    // Trigger file picker
    if (uploadBtn) {
      uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    card.addEventListener('click', () => {
      if (!card.classList.contains('has-photo')) {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target.result;
        card.classList.add('has-photo');
        img.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
        showToast('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    });

    // Click on loaded image opens Lightbox
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      if (card.classList.contains('has-photo') && img.src) {
        openLightbox(img.src, img.alt || 'Lesson Artifact');
      }
    });
  });
}

/* ============================================================
   6. FULLSCREEN LIGHTBOX MODAL
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById('fullscreenLightbox');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  if (lightbox && closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // Allow clicking on workshop landscape photos and lecture photos to enlarge in lightbox
  document.querySelectorAll('.workshop-landscape-img, .lecture-photo-img').forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt || 'Visual Artifact Evidence');
    });
  });
}

function openLightbox(src, caption) {
  const lightbox = document.getElementById('fullscreenLightbox');
  const img = document.getElementById('lightboxImgRender');
  const captionEl = document.getElementById('lightboxCaptionText');
  if (!lightbox || !img) return;

  img.src = src;
  if (captionEl) captionEl.textContent = caption || 'Visual Evidence Artifact';
  lightbox.classList.add('open');
}

function closeLightbox() {
  const lightbox = document.getElementById('fullscreenLightbox');
  if (lightbox) lightbox.classList.remove('open');
}

/* ============================================================
   7. INTERACTIVE MEETING CHECKLIST
   ============================================================ */
function initMeetingChecklist() {
  const checkboxes = document.querySelectorAll('.meeting-check-label input[type="checkbox"]');
  const countEl = document.getElementById('meetingCheckCount');
  if (checkboxes.length === 0) return;

  const update = () => {
    let c = 0;
    checkboxes.forEach(cb => { if (cb.checked) c++; });
    if (countEl) countEl.textContent = `${c} / ${checkboxes.length} Checked`;
  };

  checkboxes.forEach(cb => cb.addEventListener('change', update));
  update();
}

/* ============================================================
   8. UTILITY ACTIONS (Copy ID dynamically from HTML, Print PDF)
   ============================================================ */
function initUtilityActions() {
  // Read whatever ID is written in the HTML!
  const copyBtn = document.getElementById('copyIdPillBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const idEl = document.getElementById('studentIdBadge') || document.querySelector('.social-pill-badge');
      const studentId = idEl ? idEl.textContent.trim() : 'SA25610207';
      navigator.clipboard.writeText(studentId).then(() => {
        showToast(`Copied Student ID (${studentId}) to clipboard!`);
      }).catch(() => {
        showToast(`Student ID: ${studentId}`);
      });
    });
  }

  // Print / Save PDF
  const printBtn = document.getElementById('printPdfBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
}

/* Toast Bubble Helper */
function showToast(msg) {
  let toast = document.getElementById('globalToastBubble');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToastBubble';
    toast.className = 'toast-bubble';
    document.body.appendChild(toast);
  }

  toast.innerHTML = '<span>&#10003;</span> <span>' + msg + '</span>';
  toast.classList.add('show');

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

/* Open all lecture-note sections when printing / saving as PDF */
window.addEventListener('beforeprint', function () {
  document.querySelectorAll('details.lecture-notes').forEach(function (d) { d.setAttribute('open', ''); });
});

/* ============================================================
   9. LESSON PRODUCT CARDS CATALOG & DETAIL VIEW SYSTEM
   ============================================================ */
function initLessonCatalogSystem() {
  const gridContainer = document.getElementById('lessonsProductGrid');
  const detailsContainer = document.getElementById('lessonsDetailsContainer');
  const topbar = document.getElementById('lessonDetailTopbar');
  const bottombar = document.getElementById('lessonDetailBottombar');
  const btnBackGrid = document.getElementById('btnBackToGrid');
  const btnBottomBackGrid = document.getElementById('btnBottomBackToGrid');
  const filterBtns = document.querySelectorAll('.filter-pill-btn');
  const productCards = document.querySelectorAll('.lesson-product-card');
  const detailSelect = document.getElementById('detailLectureSelect');
  const topbarBadge = document.getElementById('detailTopbarBadge');
  const btnDetailPrev = document.getElementById('btnDetailPrev');
  const btnDetailNext = document.getElementById('btnDetailNext');
  const btnBottomPrev = document.getElementById('btnBottomPrev');
  const btnBottomNext = document.getElementById('btnBottomNext');
  const btnBottomPrevTitle = document.getElementById('btnBottomPrevTitle');
  const btnBottomNextTitle = document.getElementById('btnBottomNextTitle');
  const mainNavLinks = document.querySelectorAll('.pill-nav-item, .mobile-drawer-link');

  if (!gridContainer || !detailsContainer) return;

  const MODULES = [
    { id: 'ch-01', num: 'Module 01 \u00B7 Lecture 01', title: 'Intro to Professional Skills' },
    { id: 'ch-02', num: 'Module 02 \u00B7 Lecture 02', title: 'Portfolio Management' },
    { id: 'ch-03', num: 'Module 03 \u00B7 Lecture 03', title: 'Interview & STAR' },
    { id: 'ch-04', num: 'Module 04 \u00B7 Lecture 04', title: 'CV Writing' },
    { id: 'ch-05', num: 'Module 05 \u00B7 Lecture 05', title: 'Speaking Skills & Meetings' },
    { id: 'ch-06', num: 'Module 06 \u00B7 Lecture 06', title: 'Email & Online Etiquette' },
    { id: 'ch-07', num: 'Module 07 \u00B7 Lecture 07', title: 'Telephone Etiquette & Customer Service' },
    { id: 'ch-08', num: 'Module 08 \u00B7 Lecture 08', title: 'Emotional Intelligence' },
    { id: 'ch-09', num: 'Module 09 \u00B7 Lecture 09', title: 'Dining Etiquette & Table Manners' }
  ];

  const lessonCards = detailsContainer.querySelectorAll('.lesson-bento-card');
  let currentMode = 'grid'; // 'grid' | 'detail'
  let activeId = null;

  function showGridMode() {
    currentMode = 'grid';
    activeId = null;
    document.body.classList.remove('lesson-view-active');

    gridContainer.style.display = 'grid';
    if (topbar) topbar.style.display = 'none';
    if (bottombar) bottombar.style.display = 'none';

    lessonCards.forEach(card => {
      card.style.display = 'none';
      card.classList.remove('active-lecture-fade');
    });
  }

  function showDetailMode(lectureId, shouldScroll = true) {
    const modIdx = MODULES.findIndex(m => m.id === lectureId);
    if (modIdx === -1) return;

    currentMode = 'detail';
    activeId = lectureId;
    document.body.classList.add('lesson-view-active');

    gridContainer.style.display = 'none';
    if (topbar) topbar.style.display = 'flex';
    if (bottombar) bottombar.style.display = 'flex';

    lessonCards.forEach(card => {
      if (card.id === lectureId) {
        card.style.display = 'block';
        card.classList.remove('active-lecture-fade');
        void card.offsetWidth; // trigger reflow
        card.classList.add('active-lecture-fade');
      } else {
        card.style.display = 'none';
        card.classList.remove('active-lecture-fade');
      }
    });

    const currentMod = MODULES[modIdx];
    const prevMod = MODULES[(modIdx - 1 + MODULES.length) % MODULES.length];
    const nextMod = MODULES[(modIdx + 1) % MODULES.length];

    if (topbarBadge) topbarBadge.textContent = currentMod.num;
    if (detailSelect) detailSelect.value = lectureId;

    if (btnDetailPrev) btnDetailPrev.setAttribute('data-target', prevMod.id);
    if (btnDetailNext) btnDetailNext.setAttribute('data-target', nextMod.id);

    if (btnBottomPrev) btnBottomPrev.setAttribute('data-target', prevMod.id);
    if (btnBottomNext) btnBottomNext.setAttribute('data-target', nextMod.id);

    if (btnBottomPrevTitle) btnBottomPrevTitle.textContent = prevMod.num;
    if (btnBottomNextTitle) btnBottomNextTitle.textContent = nextMod.num;

    // Update URL hash smoothly
    if (history.replaceState) {
      history.replaceState(null, null, `#${lectureId}`);
    } else {
      window.location.hash = lectureId;
    }

    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Attach card click handlers
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      const lectureId = card.getAttribute('data-lecture-id');
      if (lectureId) {
        showDetailMode(lectureId, true);
      }
    });
  });

  // Back to Grid buttons (Top & Bottom)
  const returnToCatalog = () => {
    showGridMode();
    if (history.replaceState) {
      history.replaceState(null, null, '#coursework-modules');
    }
    const targetSec = document.getElementById('coursework-modules');
    if (targetSec) {
      const top = targetSec.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  };

  if (btnBackGrid) btnBackGrid.addEventListener('click', returnToCatalog);
  if (btnBottomBackGrid) btnBottomBackGrid.addEventListener('click', returnToCatalog);

  // When clicking any main navigation links while in lesson-view-active
  mainNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#ch-')) {
        // Direct link to a lesson
        const targetId = href.replace('#', '');
        if (MODULES.some(m => m.id === targetId)) {
          e.preventDefault();
          showDetailMode(targetId, true);
        }
      } else if (document.body.classList.contains('lesson-view-active')) {
        // Clicking general section link while viewing a lesson -> exit lesson view!
        showGridMode();
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
      }
    });
  });

  // Prev / Next button actions
  const handleNavClick = (btn) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = btn.getAttribute('data-target');
      if (target) showDetailMode(target, true);
    });
  };

  handleNavClick(btnDetailPrev);
  handleNavClick(btnDetailNext);
  handleNavClick(btnBottomPrev);
  handleNavClick(btnBottomNext);

  // Dropdown selector jump
  if (detailSelect) {
    detailSelect.addEventListener('change', () => {
      if (detailSelect.value) showDetailMode(detailSelect.value, true);
    });
  }

  // Filter Pills
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';
      if (currentMode !== 'grid') {
        showGridMode();
      }

      productCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Keyboard navigation in detail mode
  window.addEventListener('keydown', (e) => {
    if (currentMode !== 'detail') return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowLeft' && btnDetailPrev) {
      const target = btnDetailPrev.getAttribute('data-target');
      if (target) showDetailMode(target, true);
    } else if (e.key === 'ArrowRight' && btnDetailNext) {
      const target = btnDetailNext.getAttribute('data-target');
      if (target) showDetailMode(target, true);
    } else if (e.key === 'Escape') {
      returnToCatalog();
    }
  });

  // Check initial hash on page load
  const hash = window.location.hash.replace('#', '');
  if (MODULES.some(m => m.id === hash)) {
    showDetailMode(hash, false);
  } else {
    showGridMode();
  }
}

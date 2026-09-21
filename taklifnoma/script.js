/**
 * Obidjon & Diloromoy hamda Ibrohimxonning Sunnat To'yi Veb-Taklifnomasi
 * Full-Screen Cinematic Story Presentation (Mobile-Optimized)
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Sozlamalar
  // =========================================================================
  // 2026-yil 25-sentyabr, 18:00 (Oylar 0-indekslangan: 8 = Sentyabr)
  const WEDDING_DATE = new Date(2026, 8, 25, 18, 0, 0);
  const SCENE_DURATION = 8000; // Har bir sahna davomiyligi (8 soniya)
  const TOTAL_SCENES = 5;

  let currentSceneIndex = 0;
  let isPlaying = false;
  let sceneTimer = null;
  let progressTimer = null;
  let progressStartTime = 0;
  let progressElapsed = 0;

  // =========================================================================
  // 2. Elementlar
  // =========================================================================
  const bgAudio = document.getElementById('wedding-audio');
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const openInvitationBtn = document.getElementById('open-invitation-btn');
  const sealIconBtn = document.getElementById('seal-icon-btn');
  const musicToggle = document.getElementById('music-toggle');
  const pausePlayBtn = document.getElementById('pause-play-btn');
  const pauseIcon = document.getElementById('pause-icon');

  const bgSlides = document.querySelectorAll('.bg-slide');
  const sceneCards = document.querySelectorAll('.scene-card');
  const progressFills = document.querySelectorAll('.progress-bar-fill');

  const slidePrevBtn = document.getElementById('slide-prev-btn');
  const slideNextBtn = document.getElementById('slide-next-btn');
  const presentationStage = document.getElementById('presentation-stage');

  // =========================================================================
  // 3. Audio Tizimi (Mobil va Desktop uchun ishonchli)
  // =========================================================================
  let isMusicPlaying = false;

  function playMusic() {
    if (bgAudio) {
      bgAudio.volume = 0.65;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicPlaying = true;
          if (musicToggle) musicToggle.classList.add('playing');
        }).catch(err => {
          console.log('Autoplay audio cheklovi (oddiy holat):', err);
        });
      }
    }
  }

  function toggleMusic() {
    if (!bgAudio) return;
    if (isMusicPlaying) {
      bgAudio.pause();
      isMusicPlaying = false;
      if (musicToggle) musicToggle.classList.remove('playing');
    } else {
      bgAudio.play().then(() => {
        isMusicPlaying = true;
        if (musicToggle) musicToggle.classList.add('playing');
      }).catch(err => console.log('Audio xatosi:', err));
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // =========================================================================
  // 4. Kinematik Prezentatsiya (Stories Presentation Engine)
  // =========================================================================
  function goToScene(index) {
    currentSceneIndex = (index + TOTAL_SCENES) % TOTAL_SCENES;

    // Fon rasmlarini almashtirish
    bgSlides.forEach((slide, i) => {
      if (i === currentSceneIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Sahna kartochkalarini almashtirish
    sceneCards.forEach((card, i) => {
      if (i === currentSceneIndex) {
        card.classList.add('active');
        card.scrollTop = 0; // Kartochkani tepasiga qaytarish
      } else {
        card.classList.remove('active');
      }
    });

    // Progress chiziqlarini yangilash
    progressFills.forEach((fill, i) => {
      if (i < currentSceneIndex) {
        fill.style.width = '100%';
      } else if (i > currentSceneIndex) {
        fill.style.width = '0%';
      }
    });

    // Taymerni yangilash
    startSceneTimer();
  }

  function startSceneTimer() {
    clearTimeout(sceneTimer);
    clearInterval(progressTimer);

    progressStartTime = Date.now();
    progressElapsed = 0;

    const currentFill = progressFills[currentSceneIndex];
    if (currentFill) currentFill.style.width = '0%';

    progressTimer = setInterval(() => {
      if (!isPlaying) return;

      progressElapsed = Date.now() - progressStartTime;
      const percentage = Math.min((progressElapsed / SCENE_DURATION) * 100, 100);

      if (currentFill) {
        currentFill.style.width = percentage + '%';
      }

      if (progressElapsed >= SCENE_DURATION) {
        clearInterval(progressTimer);
        goToScene(currentSceneIndex + 1);
      }
    }, 50);
  }

  function pausePresentation() {
    isPlaying = false;
    if (pauseIcon) {
      pauseIcon.classList.remove('fa-pause');
      pauseIcon.classList.add('fa-play');
    }
  }

  function resumePresentation() {
    isPlaying = true;
    progressStartTime = Date.now() - progressElapsed;
    if (pauseIcon) {
      pauseIcon.classList.remove('fa-play');
      pauseIcon.classList.add('fa-pause');
    }
  }

  function togglePlayPause() {
    if (isPlaying) {
      pausePresentation();
    } else {
      resumePresentation();
    }
  }

  if (pausePlayBtn) {
    pausePlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlayPause();
    });
  }

  // =========================================================================
  // 5. Mobil Boshqaruv: Tugmalar & Swipe (Surish) Harakati
  // =========================================================================
  if (slidePrevBtn) {
    slidePrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToScene(currentSceneIndex - 1);
    });
  }

  if (slideNextBtn) {
    slideNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToScene(currentSceneIndex + 1);
    });
  }

  // Mobil Swipe harakatini aniqlash (Touch Gestures)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  if (presentationStage) {
    presentationStage.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    presentationStage.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
      }
    }, { passive: true });
  }

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Gorizontal surish masofasi kamida 45px va vertikal siljishdan katta bo'lishi lozim
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
      if (diffX < 0) {
        // Chapga surish -> Keyingi sahifa
        goToScene(currentSceneIndex + 1);
      } else {
        // O'ngga surish -> Oldingi sahifa
        goToScene(currentSceneIndex - 1);
      }
    }
  }

  // Desktop / Noutbuklar uchun klaviatura boshqaruvi
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      goToScene(currentSceneIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      goToScene(currentSceneIndex - 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      togglePlayPause();
    }
  });

  // Konvertni ochish
  function startInvitation() {
    envelopeOverlay.classList.add('opened');
    playMusic();
    isPlaying = true;
    goToScene(0);
  }

  if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', startInvitation);
  }
  if (sealIconBtn) {
    sealIconBtn.addEventListener('click', startInvitation);
  }

  // =========================================================================
  // 6. Orqaga Hisoblash Taymeri (25-Sentyabr 2026, 18:00)
  // =========================================================================
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE.getTime() - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
    if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    if (minutesEl) minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    if (secondsEl) secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // =========================================================================
  // 7. To'y Dasturi Tablari (25.09 va 26.09)
  // =========================================================================
  const dayTabBtns = document.querySelectorAll('.day-tab-btn');
  const paneDay1 = document.getElementById('pane-day1');
  const paneDay2 = document.getElementById('pane-day2');

  dayTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dayTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedDay = btn.dataset.day;
      if (selectedDay === 'day1') {
        if (paneDay1) paneDay1.classList.add('active');
        if (paneDay2) paneDay2.classList.remove('active');
      } else {
        if (paneDay1) paneDay1.classList.remove('active');
        if (paneDay2) paneDay2.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 8. RSVP (Tashrifni Tasdiqlash)
  // =========================================================================
  const rsvpMiniBtns = document.querySelectorAll('.rsvp-mini-btn');
  const rsvpSubmitBtn = document.getElementById('rsvp-submit-btn');
  const rsvpStatusMsg = document.getElementById('rsvp-status-msg');
  let selectedChoice = 'kelaman';

  rsvpMiniBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      rsvpMiniBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedChoice = btn.dataset.choice;
    });
  });

  if (rsvpSubmitBtn) {
    rsvpSubmitBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (rsvpStatusMsg) {
        rsvpStatusMsg.style.display = 'block';
        if (selectedChoice === 'kelaman') {
          rsvpStatusMsg.textContent = "Tashakkur! Sizni qo'shaloq to'yimizda ko'rishdan behad mamnun bo'lamiz!";
          rsvpStatusMsg.style.color = '#81c784';
        } else {
          rsvpStatusMsg.textContent = "E'tiboringiz va samimiy tilaklaringiz uchun chin dildan minnatdormiz!";
          rsvpStatusMsg.style.color = '#dfba73';
        }
      }

      rsvpSubmitBtn.textContent = 'Qabul qilindi ✓';
      rsvpSubmitBtn.disabled = true;
    });
  }

  // =========================================================================
  // 9. Oltin Zarralar va Gul Barglari Kanvasi
  // =========================================================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = window.innerWidth < 600 ? 22 : 38;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 1,
        speedY: Math.random() * 0.6 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.55 + 0.2,
        isPetal: Math.random() > 0.65,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.angle) * 0.3;
        p.angle += p.angularSpeed;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.isPetal) {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 2.2, p.radius * 1.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230, 185, 185, ${p.opacity * 0.65})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(223, 186, 115, ${p.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(223, 186, 115, 0.5)';
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }
});

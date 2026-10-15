/**
 * PLOT X // UNDERGROUND POOL PARTY
 * Neo-Brutalist Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initCountdown();
  init3DCardTilt();
  initSynthesizerVibePlayer();
  initTimelineInteractions();
  initBouncerGateForm();
});

/* ==========================================================================
   1. CUSTOM NEON CURSOR & GLOW EFFECT
   ========================================================================== */
function initCustomCursor() {
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  
  if (!cursorGlow || !cursorDot) return;
  
  // Disable on mobile/touch
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursorGlow.style.display = 'none';
    cursorDot.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth lerp for glow halo
  function renderGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderGlow);
  }
  renderGlow();

  // Hover states for links and buttons
  const interactives = document.querySelectorAll('a, button, input, .vibe-card, .timeline-item');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform += ' scale(2.2)';
      cursorDot.style.backgroundColor = '#00F0FF';
      cursorGlow.style.width = '420px';
      cursorGlow.style.height = '420px';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.backgroundColor = '#CCFF00';
      cursorGlow.style.width = '320px';
      cursorGlow.style.height = '320px';
    });
  });
}

/* ==========================================================================
   2. LIVE COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  if (!cdDays) return;

  // Set target date: 4 days from now at 16:00 IST
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  targetDate.setHours(16, 0, 0, 0);

  function updateTimer() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   3. 3D TILT PHYSICS FOR VIBE CARDS
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   4. WEB AUDIO SYNTHESIZER: UNDERGROUND ACID TECH-HOUSE GENERATOR
   ========================================================================== */
function initSynthesizerVibePlayer() {
  const toggleBtn = document.getElementById('vibe-toggle-btn');
  const vibeStatus = document.getElementById('vibe-status');
  if (!toggleBtn || !vibeStatus) return;

  let audioCtx = null;
  let isPlaying = false;
  let beatTimer = null;
  let currentStep = 0;
  const bpm = 128;
  const stepTime = (60 / bpm) / 4; // 16th notes

  // Acid bass notes pattern (frequencies in Hz: F1, G#1, C2, D#2)
  const bassPattern = [
    55, 0, 55, 110, 0, 55, 0, 82.4,
    55, 0, 65.4, 0, 110, 0, 98, 55
  ];

  function playKick(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);

    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.35);
  }

  function playHiHat(time, open = false) {
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = audioCtx.createGain();
    const duration = open ? 0.18 : 0.04;
    gain.gain.setValueAtTime(open ? 0.4 : 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(time);
    noise.stop(time + duration);
  }

  function playAcidBass(freq, time) {
    if (!freq) return;

    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 14; // Resonant acid bite
    filter.frequency.setValueAtTime(300, time);
    filter.frequency.exponentialRampToValueAtTime(2200, time + 0.05);
    filter.frequency.exponentialRampToValueAtTime(400, time + 0.18);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.22);
  }

  function scheduleBeats() {
    if (!isPlaying) return;

    const now = audioCtx.currentTime;

    // Four-on-the-floor Kick
    if (currentStep % 4 === 0) {
      playKick(now);
    }

    // Offbeat Hi-hat
    if (currentStep % 4 === 2) {
      playHiHat(now, true);
    } else if (currentStep % 2 === 0) {
      playHiHat(now, false);
    }

    // Acid Bass
    const bassNote = bassPattern[currentStep % bassPattern.length];
    if (bassNote > 0) {
      playAcidBass(bassNote, now);
    }

    currentStep = (currentStep + 1) % 16;
    beatTimer = setTimeout(scheduleBeats, stepTime * 1000);
  }

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      toggleBtn.classList.add('active');
      vibeStatus.textContent = 'ON // 128BPM';
      scheduleBeats();
    } else {
      toggleBtn.classList.remove('active');
      vibeStatus.textContent = 'OFF';
      clearTimeout(beatTimer);
    }
  });
}

/* ==========================================================================
   5. INTERACTIVE TIMELINE STAGES
   ========================================================================== */
function initTimelineInteractions() {
  const items = document.querySelectorAll('.timeline-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => {
        const card = i.querySelector('.timeline-card');
        if (card) card.classList.remove('active-card');
      });
      const card = item.querySelector('.timeline-card');
      if (card) {
        card.classList.add('active-card');
      }
    });
  });
}

/* ==========================================================================
   6. BOUNCER GATE TERMINAL FORM & VIP PASS GENERATOR
   ========================================================================== */
function initBouncerGateForm() {
  const form = document.getElementById('bouncer-form');
  const scanningTerminal = document.getElementById('scanning-terminal');
  const scanProgress = document.getElementById('scan-progress');
  const scanLog = document.getElementById('scan-log');
  const vipTicketResult = document.getElementById('vip-ticket-result');
  const submitBtn = document.getElementById('submit-btn');

  // Input fields
  const fullName = document.getElementById('fullName');
  const instaHandle = document.getElementById('instaHandle');
  const partyAnthem = document.getElementById('partyAnthem');
  const secretCode = document.getElementById('secretCode');
  const referralStatus = document.getElementById('referral-status');

  // Display elements on generated ticket
  const ticketIdDisplay = document.getElementById('ticket-id-display');
  const ticketNameDisplay = document.getElementById('ticket-name-display');
  const ticketInstaDisplay = document.getElementById('ticket-insta-display');
  const ticketAnthemDisplay = document.getElementById('ticket-anthem-display');

  // Preset song buttons
  const presetBtns = document.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      partyAnthem.value = btn.dataset.song;
      partyAnthem.focus();
    });
  });

  // Secret Referral Code Live Validator
  if (secretCode) {
    secretCode.addEventListener('input', () => {
      const val = secretCode.value.trim().toUpperCase();
      if (val === 'ACIDPOOL' || val === 'PLOTX26' || val === 'VIP30') {
        referralStatus.textContent = '✓ PASSCODE VALIDATED: +1 PRIORITY CLEARANCE & DRINK TOKEN';
        referralStatus.style.color = 'var(--neon-lime)';
      } else if (val.length > 3) {
        referralStatus.textContent = 'REFERRAL CODE RECORDED FOR BOUNCER REVIEW.';
        referralStatus.style.color = '#888';
      } else {
        referralStatus.textContent = '';
      }
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      let isValid = true;

      // Name check
      if (!fullName.value.trim()) {
        document.getElementById('name-error').textContent = '! Required for gate check.';
        isValid = false;
      } else {
        document.getElementById('name-error').textContent = '';
      }

      // Insta check
      if (!instaHandle.value.trim()) {
        document.getElementById('insta-error').textContent = '! Required for guestlist curation.';
        isValid = false;
      } else {
        document.getElementById('insta-error').textContent = '';
      }

      // Anthem check
      if (!partyAnthem.value.trim()) {
        document.getElementById('anthem-error').textContent = '! Vibe test requires a track.';
        isValid = false;
      } else {
        document.getElementById('anthem-error').textContent = '';
      }

      if (!isValid) return;

      // Disable submit button during scan
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';

      // Hide form and show scanning terminal
      form.classList.add('hidden');
      scanningTerminal.classList.remove('hidden');

      // Terminal log simulation steps
      const steps = [
        { progress: 20, text: `> HANDSHAKE ESTABLISHED WITH PROTOCOL_PX26...` },
        { progress: 45, text: `> VERIFYING INSTAGRAM IDENTITY [@${instaHandle.value.replace('@', '')}]...` },
        { progress: 70, text: `> CALCULATING CHAOS INDEX FOR TRACK: "${partyAnthem.value}"... [98.9% MATCH]` },
        { progress: 90, text: `> RESERVING 1 OF 30 SLOTS // ALLOCATING GATE ENCRYPTION KEY...` },
        { progress: 100, text: `> CLEARANCE ACCEPTED. WELCOME TO PLOT X.` }
      ];

      let stepIndex = 0;

      function runScanStep() {
        if (stepIndex < steps.length) {
          const step = steps[stepIndex];
          scanProgress.style.width = `${step.progress}%`;
          
          const logEntry = document.createElement('p');
          logEntry.textContent = step.text;
          scanLog.appendChild(logEntry);
          scanLog.scrollTop = scanLog.scrollHeight;

          stepIndex++;
          setTimeout(runScanStep, 450);
        } else {
          // Completed scan
          setTimeout(showTicket, 600);
        }
      }

      runScanStep();
    });
  }

  function showTicket() {
    scanningTerminal.classList.add('hidden');
    vipTicketResult.classList.remove('hidden');

    // Generate random Pass ID
    const randomPassNum = Math.floor(1000 + Math.random() * 9000);
    const passCode = `PX-${randomPassNum}`;

    // Populate Boarding Pass
    ticketIdDisplay.textContent = passCode;
    ticketNameDisplay.textContent = fullName.value.trim().toUpperCase();
    ticketInstaDisplay.textContent = instaHandle.value.trim().startsWith('@') 
      ? instaHandle.value.trim() 
      : `@${instaHandle.value.trim()}`;
    ticketAnthemDisplay.textContent = partyAnthem.value.trim();

    // Trigger Canvas Neon Confetti
    triggerNeonConfetti();

    // Increment slot count visually
    const slotsEl = document.getElementById('slots-taken');
    if (slotsEl) {
      slotsEl.textContent = '25';
    }
  }

  function triggerNeonConfetti() {
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#CCFF00', '#00F0FF', '#FF0055', '#FFFFFF', '#A3A3A3']
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#CCFF00', '#00F0FF']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#CCFF00', '#FF0055']
        });
      }, 300);
    }
  }

  // Save / Screenshot button
  const screenshotBtn = document.getElementById('screenshot-btn');
  if (screenshotBtn) {
    screenshotBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Reset form button
  const resetBtn = document.getElementById('reset-form-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      vipTicketResult.classList.add('hidden');
      form.classList.remove('hidden');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      scanLog.innerHTML = '<p>> INITIATING BIOMETRIC & VIBE HANDSHAKE...</p>';
      scanProgress.style.width = '0%';
    });
  }
}

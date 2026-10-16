/**
 * PLOT X // THE ULTIMATE FARMHOUSE POOL BASH
 * High-Energy House Party Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initCountdown();
  init3DCardTilt();
  initHousePartySynth();
  initTimelineInteractions();
  initWristbandForm();
});

/* ==========================================================================
   1. CUSTOM CURSOR & PARTY GLOW
   ========================================================================== */
function initCustomCursor() {
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  
  if (!cursorGlow || !cursorDot) return;
  
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

  function renderGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderGlow);
  }
  renderGlow();

  const interactives = document.querySelectorAll('a, button, input, .perk-card, .timeline-row');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform += ' scale(2.2)';
      cursorDot.style.backgroundColor = '#FFE600';
      cursorGlow.style.width = '380px';
      cursorGlow.style.height = '380px';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.backgroundColor = '#FF1493';
      cursorGlow.style.width = '280px';
      cursorGlow.style.height = '280px';
    });
  });
}

/* ==========================================================================
   2. LIVE PARTY COUNTDOWN
   ========================================================================== */
function initCountdown() {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  if (!cdDays) return;

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
   3. 3D TILT FOR PARTY CARDS
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

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   4. FUN HOUSE PARTY AUDIO SYNTHESIZER (UPBEAT GROOVY HOUSE BEATS)
   ========================================================================== */
function initHousePartySynth() {
  const toggleBtn = document.getElementById('vibe-toggle-btn');
  const vibeStatus = document.getElementById('vibe-status');
  if (!toggleBtn || !vibeStatus) return;

  let audioCtx = null;
  let isPlaying = false;
  let beatTimer = null;
  let currentStep = 0;
  const bpm = 124; // Upbeat bouncy house tempo
  const stepTime = (60 / bpm) / 4; // 16th note steps

  // Bouncy funk house bass notes (A minor groove: A1, C2, D2, E2, G1)
  const bassNotes = [
    55, 0, 55, 0,  65.4, 0, 73.4, 0,
    82.4, 0, 55, 55, 0, 49, 0, 55
  ];

  // Warm house chord frequencies (Am7 and Fmaj7 stabs)
  const chordAm7 = [220, 261.63, 329.63, 392.00]; // A3, C4, E4, G4
  const chordFmaj = [174.61, 220, 261.63, 329.63]; // F3, A3, C4, E4

  function playKick(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.32);

    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.32);
  }

  function playClap(time) {
    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.03));
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(time);
    noise.stop(time + 0.15);
  }

  function playHiHat(time, open = false) {
    const bufferSize = audioCtx.sampleRate * (open ? 0.18 : 0.04);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 8500;

    const gain = audioCtx.createGain();
    const duration = open ? 0.14 : 0.035;
    gain.gain.setValueAtTime(open ? 0.3 : 0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(time);
    noise.stop(time + duration);
  }

  function playHouseBass(freq, time) {
    if (!freq) return;

    const osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(150, time + 0.2);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.22);
  }

  function playChordStab(notes, time) {
    notes.forEach(freq => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, time);
      filter.frequency.exponentialRampToValueAtTime(600, time + 0.16);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(time);
      osc.stop(time + 0.18);
    });
  }

  function scheduleBeats() {
    if (!isPlaying) return;

    const now = audioCtx.currentTime;

    // Four-on-the-floor House Kick
    if (currentStep % 4 === 0) {
      playKick(now);
    }

    // Handclap on beats 2 & 4
    if (currentStep === 4 || currentStep === 12) {
      playClap(now);
    }

    // Offbeat Hi-hat
    if (currentStep % 4 === 2) {
      playHiHat(now, true);
    } else if (currentStep % 2 === 0) {
      playHiHat(now, false);
    }

    // Rhythmic House Chords on upbeat 3 & 11
    if (currentStep === 3 || currentStep === 7) {
      playChordStab(chordAm7, now);
    } else if (currentStep === 11 || currentStep === 15) {
      playChordStab(chordFmaj, now);
    }

    // Bouncy funk bass
    const bassFreq = bassNotes[currentStep % bassNotes.length];
    if (bassFreq > 0) {
      playHouseBass(bassFreq, now);
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
      vibeStatus.textContent = 'PARTY AUX: ON 🔥';
      scheduleBeats();
    } else {
      toggleBtn.classList.remove('active');
      vibeStatus.textContent = 'PARTY BEATS: OFF';
      clearTimeout(beatTimer);
    }
  });
}

/* ==========================================================================
   5. TIMELINE STAGES INTERACTION
   ========================================================================== */
function initTimelineInteractions() {
  const rows = document.querySelectorAll('.timeline-row');
  rows.forEach(row => {
    row.addEventListener('click', () => {
      rows.forEach(r => r.classList.remove('active-row'));
      row.classList.add('active-row');
    });
  });
}

/* ==========================================================================
   6. VIP WRISTBAND REGISTRATION & PASS GENERATOR
   ========================================================================== */
function initWristbandForm() {
  const form = document.getElementById('bouncer-form');
  const scanningTerminal = document.getElementById('scanning-terminal');
  const scanProgress = document.getElementById('scan-progress');
  const scanLog = document.getElementById('scan-log');
  const vipTicketResult = document.getElementById('vip-ticket-result');
  const submitBtn = document.getElementById('submit-btn');

  const fullName = document.getElementById('fullName');
  const instaHandle = document.getElementById('instaHandle');
  const partyAnthem = document.getElementById('partyAnthem');
  const secretCode = document.getElementById('secretCode');
  const referralStatus = document.getElementById('referral-status');

  const ticketIdDisplay = document.getElementById('ticket-id-display');
  const ticketNameDisplay = document.getElementById('ticket-name-display');
  const ticketInstaDisplay = document.getElementById('ticket-insta-display');
  const ticketAnthemDisplay = document.getElementById('ticket-anthem-display');

  // Song quick select pills
  const presetBtns = document.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      partyAnthem.value = btn.dataset.song;
      partyAnthem.focus();
    });
  });

  // Secret Referral / Passcode Check
  if (secretCode) {
    secretCode.addEventListener('input', () => {
      const val = secretCode.value.trim().toUpperCase();
      if (val === 'PROJECTX' || val === 'PLOTX' || val === 'FRIEND_OF_DJ' || val === 'VIP30') {
        referralStatus.textContent = '⭐ VIP REFERRAL DETECTED: +1 COMPLIMENTARY COCKTAIL TOKEN';
        referralStatus.style.color = 'var(--party-gold)';
      } else if (val.length > 3) {
        referralStatus.textContent = 'Referral noted for host review.';
        referralStatus.style.color = 'var(--text-muted)';
      } else {
        referralStatus.textContent = '';
      }
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      if (!fullName.value.trim()) {
        document.getElementById('name-error').textContent = 'Please enter your name or nickname!';
        isValid = false;
      } else {
        document.getElementById('name-error').textContent = '';
      }

      if (!instaHandle.value.trim()) {
        document.getElementById('insta-error').textContent = 'Instagram handle needed for the guestlist check!';
        isValid = false;
      } else {
        document.getElementById('insta-error').textContent = '';
      }

      if (!partyAnthem.value.trim()) {
        document.getElementById('anthem-error').textContent = 'Tell us your anthem track!';
        isValid = false;
      } else {
        document.getElementById('anthem-error').textContent = '';
      }

      if (!isValid) return;

      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';

      form.classList.add('hidden');
      scanningTerminal.classList.remove('hidden');

      const steps = [
        { progress: 25, text: `✨ Reviewing vibe check for @${instaHandle.value.replace('@', '')}...` },
        { progress: 55, text: `🪩 Adding "${partyAnthem.value}" to the DJ deck queue...` },
        { progress: 85, text: `🏊 Checking poolside capacity & ratio... [PERFECT MATCH]` },
        { progress: 100, text: `🎉 WRISTBAND ISSUED! WELCOME TO PLOT X.` }
      ];

      let stepIndex = 0;

      function runScanStep() {
        if (stepIndex < steps.length) {
          const step = steps[stepIndex];
          scanProgress.style.width = `${step.progress}%`;
          
          const logEntry = document.createElement('p');
          logEntry.textContent = step.text;
          scanLog.appendChild(logEntry);

          stepIndex++;
          setTimeout(runScanStep, 450);
        } else {
          setTimeout(showWristband, 500);
        }
      }

      runScanStep();
    });
  }

  function showWristband() {
    scanningTerminal.classList.add('hidden');
    vipTicketResult.classList.remove('hidden');

    const randomPassNum = Math.floor(1000 + Math.random() * 9000);
    const passCode = `PASS #PX-${randomPassNum}`;

    ticketIdDisplay.textContent = passCode;
    ticketNameDisplay.textContent = fullName.value.trim().toUpperCase();
    ticketInstaDisplay.textContent = instaHandle.value.trim().startsWith('@') 
      ? instaHandle.value.trim() 
      : `@${instaHandle.value.trim()}`;
    ticketAnthemDisplay.textContent = partyAnthem.value.trim();

    // Trigger Party Confetti
    triggerPartyConfetti();

    const slotsEl = document.getElementById('slots-taken');
    if (slotsEl) {
      slotsEl.textContent = '25';
    }
  }

  function triggerPartyConfetti() {
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 130,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF1493', '#00F2FE', '#FFE600', '#FF5E36', '#FFFFFF']
      });

      setTimeout(() => {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: ['#FF1493', '#FFE600']
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: ['#00F2FE', '#FF1493']
        });
      }, 250);
    }
  }

  const screenshotBtn = document.getElementById('screenshot-btn');
  if (screenshotBtn) {
    screenshotBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const resetBtn = document.getElementById('reset-form-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      vipTicketResult.classList.add('hidden');
      form.classList.remove('hidden');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      scanLog.innerHTML = '<p>✨ Curating guestlist vibe balance...</p>';
      scanProgress.style.width = '0%';
    });
  }
}

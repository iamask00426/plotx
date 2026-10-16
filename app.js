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

  let mouseX = -100;
  let mouseY = -100;
  let glowX = -100;
  let glowY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function renderGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderGlow);
  }
  renderGlow();

  // Use event delegation for hover: toggle class without modifying transform style
  document.addEventListener('mouseover', (e) => {
    const isInteractive = e.target.closest('a, button, input, label, .perk-card, .timeline-row, .party-sticker, .preset-btn');
    if (isInteractive) {
      cursorDot.classList.add('cursor-hover');
      cursorGlow.classList.add('cursor-hover');
    } else {
      cursorDot.classList.remove('cursor-hover');
      cursorGlow.classList.remove('cursor-hover');
    }
  });

  // Ensure continuous scrolling doesn't leave cursor stuck in hover state
  window.addEventListener('scroll', () => {
    if (mouseX >= 0 && mouseY >= 0) {
      const elUnderCursor = document.elementFromPoint(mouseX, mouseY);
      if (!elUnderCursor || !elUnderCursor.closest('a, button, input, label, .perk-card, .timeline-row, .party-sticker, .preset-btn')) {
        cursorDot.classList.remove('cursor-hover');
        cursorGlow.classList.remove('cursor-hover');
      }
    }
  }, { passive: true });
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
   4. YO YO HONEY SINGH - "PARTY ALL NIGHT" (BOLLYWOOD PARTY SYNTH ENGINE)
   ========================================================================== */
function initHousePartySynth() {
  const toggleBtn = document.getElementById('vibe-toggle-btn');
  const vibeStatus = document.getElementById('vibe-status');
  if (!toggleBtn || !vibeStatus) return;

  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let beatTimer = null;
  let currentStep = 0;
  let currentVolumeLevel = 0.18; // Default low background volume (18-20%)
  
  const bpm = 128; // Party All Night original tempo
  const stepTime = (60 / bpm) / 4; // 16th note steps

  // Melody note frequencies (Hz) for "Party All Night" hook
  const N_E4 = 329.63;
  const N_G4 = 392.00;
  const N_A4 = 440.00;
  const N_B4 = 493.88;
  const N_D4 = 293.66;
  const N_FS4 = 369.99;
  const N_E5 = 659.25;

  // 64-step pattern (4 bars of 16th notes) of Yo Yo Honey Singh's "Party All Night"
  // Bar 1 & 2: "Party all night, party all night, we do party all night"
  // Bar 3 & 4: "Party all night, party all night, we do party all night" (D major variation)
  const leadMelody = [
    // Bar 1: "Par-ty all night... par-ty all night"
    N_E4, 0, N_E4, 0, N_G4, 0, N_E4, 0,
    N_E4, 0, N_E4, 0, N_G4, 0, N_E4, 0,

    // Bar 2: "Par-ty all night... we do par-ty all night!"
    N_E4, 0, N_E4, 0, N_G4, 0, N_E4, 0,
    N_E4, 0, N_G4, 0, N_A4, 0, N_B4, N_A4,

    // Bar 3: "Par-ty all night... par-ty all night" (D maj cadence)
    N_D4, 0, N_D4, 0, N_FS4, 0, N_D4, 0,
    N_D4, 0, N_D4, 0, N_FS4, 0, N_D4, 0,

    // Bar 4: "Ghar pe karke scene... we do par-ty all night!"
    N_D4, 0, N_FS4, 0, N_G4, 0, N_A4, 0,
    N_G4, 0, N_FS4, 0, N_D4, 0, N_E4, 0
  ];

  // Heavy electro sub bassline notes (E1, E1, D1, D1)
  const bassNotes = [
    // Bar 1: E1
    41.2, 0, 41.2, 0, 41.2, 0, 82.4, 0,
    41.2, 0, 41.2, 0, 41.2, 0, 82.4, 0,
    // Bar 2: E1 -> G1
    41.2, 0, 41.2, 0, 41.2, 0, 82.4, 0,
    41.2, 0, 49.0, 0, 41.2, 0, 41.2, 0,
    // Bar 3: D1
    36.7, 0, 36.7, 0, 36.7, 0, 73.4, 0,
    36.7, 0, 36.7, 0, 36.7, 0, 73.4, 0,
    // Bar 4: D1 -> E1
    36.7, 0, 36.7, 0, 36.7, 0, 73.4, 0,
    36.7, 0, 41.2, 0, 41.2, 0, 41.2, 0
  ];

  function ensureAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(currentVolumeLevel, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }

  // Punchy electro four-on-the-floor kick
  function playKick(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.28);

    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.28);
  }

  // Snappy electro clap on 2 and 4
  function playClap(time) {
    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.025));
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 2.5;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start(time);
    noise.stop(time + 0.14);
  }

  // Shimmering hi-hats
  function playHiHat(time, open = false) {
    const bufferSize = audioCtx.sampleRate * (open ? 0.15 : 0.035);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 9000;

    const gain = audioCtx.createGain();
    const duration = open ? 0.12 : 0.03;
    gain.gain.setValueAtTime(open ? 0.35 : 0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start(time);
    noise.stop(time + duration);
  }

  // Honey Singh signature bright saw lead
  function playHoneySinghLead(freq, time) {
    if (!freq) return;

    // Dual detuned saw oscillators for that wide Bollywood EDM lead sound
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.008, time); // detune +8 cents

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, time);
    filter.frequency.exponentialRampToValueAtTime(1100, time + 0.14);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.16);
    osc2.stop(time + 0.16);
  }

  // Pumping party sub-bass
  function playBass(freq, time) {
    if (!freq) return;

    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, time);
    filter.frequency.exponentialRampToValueAtTime(110, time + 0.18);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.19);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.19);
  }

  function schedulePartyBeats() {
    if (!isPlaying) return;

    const now = audioCtx.currentTime;

    // Four-on-the-floor electro kick
    if (currentStep % 4 === 0) {
      playKick(now);
    }

    // Handclap on beats 2 & 4
    if (currentStep % 8 === 4) {
      playClap(now);
    }

    // Upbeat hi-hat
    if (currentStep % 4 === 2) {
      playHiHat(now, true);
    } else if (currentStep % 2 === 0) {
      playHiHat(now, false);
    }

    // Honey Singh "Party All Night" Lead Hook
    const leadNote = leadMelody[currentStep % leadMelody.length];
    if (leadNote > 0) {
      playHoneySinghLead(leadNote, now);
    }

    // Bassline
    const bassNote = bassNotes[currentStep % bassNotes.length];
    if (bassNote > 0) {
      playBass(bassNote, now);
    }

    currentStep = (currentStep + 1) % 64;
    beatTimer = setTimeout(schedulePartyBeats, stepTime * 1000);
  }

  function startPartyAudio(volume = 0.18) {
    ensureAudioContext();

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    currentVolumeLevel = volume;
    masterGain.gain.setValueAtTime(currentVolumeLevel, audioCtx.currentTime);

    if (!isPlaying) {
      isPlaying = true;
      toggleBtn.classList.add('active');
      vibeStatus.textContent = currentVolumeLevel < 0.3 
        ? 'PARTY ALL NIGHT: ON (20%) 🎧' 
        : 'PARTY ALL NIGHT: BOOSTED (75%) 🔥';
      schedulePartyBeats();
    }
  }

  function stopPartyAudio() {
    isPlaying = false;
    toggleBtn.classList.remove('active');
    vibeStatus.textContent = 'PARTY ALL NIGHT: OFF 🔇';
    clearTimeout(beatTimer);
  }

  // Nav button toggle behavior: Low (20%) -> Boosted (75%) -> Muted -> Low (20%)
  toggleBtn.addEventListener('click', () => {
    ensureAudioContext();

    if (!isPlaying) {
      startPartyAudio(0.18);
    } else if (currentVolumeLevel < 0.3) {
      // Boost volume to party mode
      currentVolumeLevel = 0.70;
      masterGain.gain.linearRampToValueAtTime(0.70, audioCtx.currentTime + 0.3);
      vibeStatus.textContent = 'PARTY ALL NIGHT: BOOSTED (75%) 🔥';
    } else {
      // Turn off
      stopPartyAudio();
    }
  });

  // AUTO-PLAY IN LOW BACKGROUND VOLUME ON ENTRY
  // Attempt immediate playback; if browser requires user interaction first,
  // seamlessly trigger it on the very first touch, click, or scroll!
  function attemptAutoPlay() {
    try {
      ensureAudioContext();
      if (audioCtx.state === 'running') {
        startPartyAudio(0.18);
      } else {
        audioCtx.resume().then(() => {
          startPartyAudio(0.18);
        }).catch(() => {
          // Autoplay blocked by browser policy: register one-shot gesture listener
          armInteractionListener();
        });
      }
    } catch (e) {
      armInteractionListener();
    }
  }

  function armInteractionListener() {
    const startOnGesture = () => {
      startPartyAudio(0.18);
      ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, startOnGesture);
      });
    };

    ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'].forEach(evt => {
      window.addEventListener(evt, startOnGesture, { once: true, passive: true });
    });
  }

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
        referralStatus.textContent = '⭐ VIP RIZZ CONFIRMED: +10,000 AURA & VIP BAR WRISTBAND';
        referralStatus.style.color = 'var(--party-gold)';
      } else if (val.length > 3) {
        referralStatus.textContent = 'Passcode noted for host review. We see you.';
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
        document.getElementById('insta-error').textContent = 'Instagram handle needed for the vibe check!';
        isValid = false;
      } else {
        document.getElementById('insta-error').textContent = '';
      }

      if (!partyAnthem.value.trim()) {
        document.getElementById('anthem-error').textContent = 'Drop an anthem track! No sad songs allowed.';
        isValid = false;
      } else {
        document.getElementById('anthem-error').textContent = '';
      }

      const ageConsent = document.getElementById('ageConsent');
      if (ageConsent && !ageConsent.checked) {
        alert('You must confirm you are 18+ and will carry a Government ID to enter! (No ID = massive L)');
        return;
      }

      if (!isValid) return;

      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';

      form.classList.add('hidden');
      scanningTerminal.classList.remove('hidden');

      const steps = [
        { progress: 20, text: `🔞 Checking 18+ age & Govt ID status... [NO CAP: PASSED]` },
        { progress: 45, text: `🍸 Unlimited Bar unlocked: Curated Cocktails & Cold Brews loaded (let us cook)...` },
        { progress: 70, text: `🪩 NPC detection score: 0.00% | Adding "${partyAnthem.value}" to DJ deck queue...` },
        { progress: 90, text: `✨ Aura points credited: +10,000 | Main Character status confirmed...` },
        { progress: 100, text: `🎉 WRISTBAND UNLOCKED! Welcome to PLOT X. Don't fumble the screenshot.` }
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

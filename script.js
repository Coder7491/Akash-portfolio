/**
 * AKASH KUMAR - MODERN BENTO IT & CYBER PORTFOLIO
 * Interactive Controller & Dynamic Visualizations
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initAmbientMeshCanvas();
  initRoleRotator();
  initBentoCard3D();
  initGestureSimulation();
  initCodeModal();
  initContactForm();
  initCopyActions();
  initMobileNav();
  initScrollNavSpy();
  initDownloadResume();
});

/* ===================================================================
   01. THEME SWITCHER (DARK / LIGHT MODE)
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  if (!toggleBtn || !themeIcon) return;

  // Check saved preference or default to dark
  const savedTheme = localStorage.getItem('akash_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeIcon.className = 'fa-solid fa-moon';
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    if (isLight) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      themeIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('akash_theme', 'dark');
      showToast('Switched to Dark Mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      themeIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('akash_theme', 'light');
      showToast('Switched to Light Mode');
    }
  });
}

/* ===================================================================
   02. VIBRANT INTERACTIVE CYBER BACKGROUND ANIMATION
   =================================================================== */
function initAmbientMeshCanvas() {
  const canvas = document.getElementById('ambientMeshCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = [
    { r: 0, g: 245, b: 212 },   // Neon Cyan (#00f5d4)
    { r: 56, g: 189, b: 248 },  // Sky Blue (#38bdf8)
    { r: 99, g: 102, b: 241 },  // Electric Indigo (#6366f1)
    { r: 168, g: 85, b: 247 },  // Neon Violet (#a855f7)
    { r: 16, g: 185, b: 129 }   // Emerald (#10b981)
  ];

  const nodes = [];
  const count = Math.min(Math.floor((width * height) / 11000), 110);

  for (let i = 0; i < count; i++) {
    const col = colors[Math.floor(Math.random() * colors.length)];
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.85,
      vy: (Math.random() - 0.5) * 0.85,
      baseRadius: Math.random() * 2.5 + 2.0,
      pulseOffset: Math.random() * Math.PI * 2,
      color: col,
      alpha: Math.random() * 0.35 + 0.65
    });
  }

  // Energy pulses traveling along lines
  const pulses = [];

  // Shooting meteors
  const meteors = [];
  function spawnMeteor() {
    if (meteors.length < 3 && Math.random() < 0.025) {
      meteors.push({
        x: Math.random() * (width * 0.8) + (width * 0.2),
        y: Math.random() * (height * 0.35),
        vx: -(Math.random() * 5 + 4),
        vy: Math.random() * 3 + 2,
        length: Math.random() * 90 + 60,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // Shockwaves on click
  const shockwaves = [];
  window.addEventListener('click', (e) => {
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 5,
      maxRadius: 220,
      alpha: 0.95
    });
  });

  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let frame = 0;
  function render() {
    frame++;
    ctx.clearRect(0, 0, width, height);

    const isLight = document.body.classList.contains('light-mode');

    // 1. Draw Connecting Laser Neural Lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160) {
          const strength = (1 - dist / 160);
          const alpha = isLight ? strength * 0.3 : strength * 0.55;
          
          ctx.strokeStyle = `rgba(${nodes[i].color.r}, ${nodes[i].color.g}, ${nodes[i].color.b}, ${alpha})`;
          ctx.lineWidth = strength * 2.2;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();

          // Occasionally spawn a travel pulse along active line
          if (frame % 90 === 0 && Math.random() < 0.12 && pulses.length < 18) {
            pulses.push({
              x1: nodes[i].x,
              y1: nodes[i].y,
              x2: nodes[j].x,
              y2: nodes[j].y,
              progress: 0,
              speed: 0.025 + Math.random() * 0.025,
              color: nodes[i].color
            });
          }
        }
      }

      // 2. Connect to mouse with bright neon beam
      const mDx = nodes[i].x - mouseX;
      const mDy = nodes[i].y - mouseY;
      const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
      if (mDist < 220) {
        const mStrength = (1 - mDist / 220);
        ctx.strokeStyle = `rgba(0, 245, 212, ${mStrength * 0.8})`;
        ctx.lineWidth = mStrength * 2.8;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();

        // Subtle gravitational pull towards mouse
        nodes[i].x -= (mDx / mDist) * 0.6;
        nodes[i].y -= (mDy / mDist) * 0.6;
      }
    }

    // 3. Render Travel Pulses
    for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
      const p = pulses[pIdx];
      p.progress += p.speed;
      if (p.progress >= 1) {
        pulses.splice(pIdx, 1);
        continue;
      }
      const px = p.x1 + (p.x2 - p.x1) * p.progress;
      const py = p.y1 + (p.y2 - p.y1) * p.progress;

      ctx.fillStyle = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 4. Render Click Shockwaves
    for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
      const s = shockwaves[sIdx];
      s.radius += 5;
      s.alpha *= 0.94;
      if (s.alpha <= 0.02 || s.radius >= s.maxRadius) {
        shockwaves.splice(sIdx, 1);
        continue;
      }

      ctx.strokeStyle = `rgba(0, 245, 212, ${s.alpha})`;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(0, 245, 212, 0.9)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 5. Render Shooting Meteors
    spawnMeteor();
    for (let mIdx = meteors.length - 1; mIdx >= 0; mIdx--) {
      const m = meteors[mIdx];
      m.x += m.vx;
      m.y += m.vy;
      m.alpha -= 0.016;
      if (m.alpha <= 0 || m.x < -120 || m.y > height + 120) {
        meteors.splice(mIdx, 1);
        continue;
      }
      const tailX = m.x - m.vx * (m.length / 6);
      const tailY = m.y - m.vy * (m.length / 6);
      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
      grad.addColorStop(0.3, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${m.alpha * 0.9})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    }

    // 6. Draw Glowing Star Nodes
    for (let n of nodes) {
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0) n.x = width;
      if (n.x > width) n.x = 0;
      if (n.y < 0) n.y = height;
      if (n.y > height) n.y = 0;

      const dynamicRadius = n.baseRadius + Math.sin(frame * 0.06 + n.pulseOffset) * 1.0;
      
      ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${n.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, 0.85)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, Math.max(dynamicRadius, 1.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ===================================================================
   03. HERO ROLE ROTATOR (TYPEWRITER)
   =================================================================== */
function initRoleRotator() {
  const rotatorEl = document.getElementById('roleRotator');
  if (!rotatorEl) return;

  const roles = [
    'CCTV Surveillance Operations',
    'Cyber Security & Server Management',
    'OpenCV Computer Vision Pipelines',
    'Network & Hardware Infrastructure',
    'Python & Systems Programming'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 70;

  function tick() {
    const current = roles[roleIdx];

    if (isDeleting) {
      rotatorEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 35;
    } else {
      rotatorEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 75;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      speed = 2200; // Hold full text
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 350;
    }

    setTimeout(tick, speed);
  }

  tick();
}

/* ===================================================================
   04. 3D BENTO CARD TILT (HERO)
   =================================================================== */
function initBentoCard3D() {
  const card = document.getElementById('bentoCard3D');
  if (!card) return;

  const parent = card.parentElement;

  parent.addEventListener('mousemove', (e) => {
    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  });

  parent.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

/* ===================================================================
   05. INTERACTIVE GESTURE RECOGNITION SIMULATION (OPENCV)
   =================================================================== */
const gesturePresets = [
  {
    name: 'OPEN PALM',
    tag: 'OPEN PALM [PASS]',
    conf: '96.2%',
    icon: 'fa-hand',
    fingers: 5,
    joints: [
      { x: 0, y: 55 },   // wrist
      { x: -35, y: 15 }, // thumb
      { x: -22, y: -45 },// index
      { x: 0, y: -60 },  // middle
      { x: 22, y: -45 }, // ring
      { x: 38, y: -25 }  // pinky
    ]
  },
  {
    name: 'FIST',
    tag: 'FIST [HOLD]',
    conf: '93.5%',
    icon: 'fa-hand-back-fist',
    fingers: 0,
    joints: [
      { x: 0, y: 45 },
      { x: -20, y: 10 },
      { x: -10, y: -10 },
      { x: 5, y: -10 },
      { x: 18, y: -5 },
      { x: 22, y: 10 }
    ]
  },
  {
    name: 'VICTORY / PEACE',
    tag: 'VICTORY [CLEAR]',
    conf: '97.8%',
    icon: 'fa-hand-peace',
    fingers: 2,
    joints: [
      { x: 0, y: 50 },
      { x: -25, y: 15 },
      { x: -18, y: -50 },// index extended
      { x: 12, y: -50 }, // middle extended
      { x: 18, y: 0 },
      { x: 25, y: 15 }
    ]
  },
  {
    name: 'ALERT POINT',
    tag: 'ALERT [FLAGGED]',
    conf: '98.1%',
    icon: 'fa-hand-point-up',
    fingers: 1,
    joints: [
      { x: 0, y: 50 },
      { x: -25, y: 15 },
      { x: 0, y: -55 },  // index extended
      { x: 12, y: 0 },
      { x: 18, y: 10 },
      { x: 24, y: 20 }
    ]
  }
];

let activeGestureIdx = 0;

function initGestureSimulation() {
  const canvas = document.getElementById('interactiveGestureCanvas');
  const cycleBtn = document.getElementById('cycleDemoBtn');
  const openDemoBtn = document.getElementById('openDemoBtn');
  const liveTag = document.getElementById('liveGestureTag');
  const miniIcon = document.getElementById('miniGestureIcon');
  const miniLabel = document.getElementById('miniGestureLabel');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function cycleNextGesture() {
    activeGestureIdx = (activeGestureIdx + 1) % gesturePresets.length;
    const g = gesturePresets[activeGestureIdx];

    if (liveTag) {
      liveTag.innerHTML = `<span class="g-name">${g.name}</span><span class="g-score">CONF: ${g.conf}</span>`;
    }
    if (miniIcon) {
      miniIcon.className = `fa-solid ${g.icon}`;
    }
    if (miniLabel) {
      miniLabel.textContent = `Gesture: ${g.name} Detected`;
    }
    showToast(`Inference updated: ${g.name} (${g.conf})`);
  }

  if (cycleBtn) cycleBtn.addEventListener('click', cycleNextGesture);
  if (openDemoBtn) {
    openDemoBtn.addEventListener('click', () => {
      cycleNextGesture();
      document.querySelector('.project-visual-side')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Draw loop
  let frame = 0;
  function draw() {
    frame++;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2 + Math.sin(frame * 0.04) * 4;

    ctx.fillStyle = '#02050b';
    ctx.fillRect(0, 0, w, h);

    // Subtle video grid
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const g = gesturePresets[activeGestureIdx];

    // Bounding Box
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(cx - 75, cy - 85, 150, 170);
    ctx.setLineDash([]);

    // Bounding Box Label
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(cx - 75, cy - 105, 150, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`${g.tag}`, cx - 70, cy - 91);

    // Draw skeleton bones
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx + g.joints[0].x, cy + g.joints[0].y);
    for (let i = 1; i < g.joints.length; i++) {
      ctx.lineTo(cx + g.joints[i].x, cy + g.joints[i].y);
    }
    ctx.stroke();

    // Draw joints
    g.joints.forEach((j, idx) => {
      ctx.fillStyle = idx === 0 ? '#38bdf8' : '#10b981';
      ctx.beginPath();
      ctx.arc(cx + j.x, cy + j.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '8px monospace';
      ctx.fillText(`P${idx}`, cx + j.x + 7, cy + j.y + 3);
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* ===================================================================
   06. CODE MODAL
   =================================================================== */
function initCodeModal() {
  const modal = document.getElementById('codeModal');
  const openBtn = document.getElementById('openCodeSnippetBtn');
  const closeBtn = document.getElementById('closeModalBtn');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => modal.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

/* ===================================================================
   07. CONTACT FORM HANDLER
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitFormBtn');

  if (!form || !status || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
      status.className = 'form-status success';
      status.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your inquiry has been routed to akash7491800@gmail.com.`;
      form.reset();
      showToast('Message sent successfully!');
    }, 1200);
  });
}

/* ===================================================================
   08. COPY TO CLIPBOARD
   =================================================================== */
function initCopyActions() {
  const copyBtns = document.querySelectorAll('.copy-action-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-check';
          setTimeout(() => {
            icon.className = 'fa-regular fa-copy';
          }, 1800);
        }
      });
    });
  });
}

function showToast(msg) {
  const container = document.getElementById('toastArea');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${msg}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ===================================================================
   09. MOBILE NAVIGATION TOGGLE
   =================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('menuToggleBtn');
  const menu = document.getElementById('navLinks');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

/* ===================================================================
   10. SCROLL NAV SPY (ACTIVE LINK HIGHLIGHTING)
   =================================================================== */
function initScrollNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ===================================================================
   11. EXECUTIVE RESUME MODAL & DUAL PDF EXPORT (DIRECT & BROWSER PRINT)
   =================================================================== */
function initDownloadResume() {
  const cvBtn = document.getElementById('downloadCvBtn');
  const modal = document.getElementById('resumeModal');
  const closeBtn = document.getElementById('closeResumeModalBtn');
  const printBtn = document.getElementById('printResumeNowBtn');
  const directDownloadBtn = document.getElementById('downloadPdfDirectBtn');
  const resumeDoc = document.getElementById('resumePrintDoc');

  if (!modal) return;

  function openResumeModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    showToast('Executive Resume preview opened');
  }

  function closeResumeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open modal on hero "Save Resume (PDF)" click
  if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }

  // Close modal on close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeResumeModal);
  }

  // Close modal when clicking dark backdrop outside the window
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeResumeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeResumeModal();
    }
  });

  // Action 1: Native High-Res Browser Print / Save as PDF
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      showToast('Opening print dialog for A4 executive resume...');
      setTimeout(() => {
        window.print();
      }, 250);
    });
  }

  // Action 2: Direct 1-Click PDF Download to device
  if (directDownloadBtn && resumeDoc) {
    directDownloadBtn.addEventListener('click', () => {
      const originalHtml = directDownloadBtn.innerHTML;
      directDownloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Creating PDF...</span>';
      directDownloadBtn.disabled = true;

      const opt = {
        margin: [6, 8, 6, 8],
        filename: 'Akash_Kumar_Executive_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if (window.html2pdf) {
        window.html2pdf()
          .set(opt)
          .from(resumeDoc)
          .save()
          .then(() => {
            directDownloadBtn.innerHTML = originalHtml;
            directDownloadBtn.disabled = false;
            showToast('Executive Resume PDF downloaded successfully!');
          })
          .catch((err) => {
            console.error('html2pdf generation error:', err);
            directDownloadBtn.innerHTML = originalHtml;
            directDownloadBtn.disabled = false;
            // Fallback to native print
            window.print();
          });
      } else {
        // Fallback if CDN blocked
        window.print();
        directDownloadBtn.innerHTML = originalHtml;
        directDownloadBtn.disabled = false;
      }
    });
  }
}


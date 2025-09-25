/* Canvas neural background with interaction + reveal on scroll for blocks */

/* Canvas setup */
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');

function fitCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
fitCanvas();
window.addEventListener('resize', fitCanvas);

let neurons = [];
const BASE_NEURONS = Math.max(40, Math.floor(window.innerWidth / 30));
const MAX_NEURONS = 120;

function initNeurons() {
  neurons = [];
  for (let i = 0; i < BASE_NEURONS; i++) {
    neurons.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1.6 + Math.random() * 1.8
    });
  }
}
initNeurons();

/* draw loop */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < neurons.length; i++) {
    const a = neurons[i];
    a.x += a.vx;
    a.y += a.vy;

    // bounce
    if (a.x <= 0 || a.x >= canvas.width) a.vx *= -1;
    if (a.y <= 0 || a.y >= canvas.height) a.vy *= -1;

    // soft glow behind nodes (subtle)
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r + 1.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,255,231,0.06)';
    ctx.fill();

    // node
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,255,231,0.95)';
    ctx.fill();

    // links
    for (let j = i + 1; j < neurons.length; j++) {
      const b = neurons[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      const maxD = 120;
      if (dist < maxD) {
        const alpha = 1 - dist / maxD;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,255,231,${0.06 + alpha * 0.28})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

/* Interaction: add occasional nodes on mousemove, bursts on click */
let lastMoveTime = 0;
canvas.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastMoveTime > 120) {
    neurons.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: 1.4 + Math.random() * 1.8
    });
    if (neurons.length > MAX_NEURONS) neurons.splice(0, neurons.length - MAX_NEURONS);
    lastMoveTime = now;
  }
});

canvas.addEventListener('click', (e) => {
  for (let i = 0; i < 12; i++) {
    neurons.push({
      x: e.clientX + (Math.random() - 0.5) * 24,
      y: e.clientY + (Math.random() - 0.5) * 24,
      vx: (Math.random() - 0.5) * 2.4,
      vy: (Math.random() - 0.5) * 2.4,
      r: 1.6 + Math.random() * 2.2
    });
  }
  if (neurons.length > MAX_NEURONS) neurons.splice(0, neurons.length - MAX_NEURONS);
});

/* Subtle parallax on scroll */
window.addEventListener('scroll', () => {
  const s = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const shift = (s - 0.5) * 16;
  for (let i = 0; i < neurons.length; i++) {
    neurons[i].y += shift * (i % 3 === 0 ? 0.03 : 0.015);
  }
});

/* Reveal on scroll for elements with class .reveal */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* Contact form placeholder behaviour (no backend) */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Отправлено';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Отправить';
      contactForm.reset();
    }, 1400);
  });
}

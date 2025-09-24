const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let neurons = [];

for (let i = 0; i < 60; i++) {
  neurons.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < neurons.length; i++) {
    let n = neurons[i];
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#00ffe7';
    ctx.fill();

    for (let j = i + 1; j < neurons.length; j++) {
      let n2 = neurons[j];
      let dx = n.x - n2.x;
      let dy = n.y - n2.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = `rgba(0,255,231,${1 - dist / 100})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', e => {
  if (Math.random() < 0.05) {
    neurons.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
    if (neurons.length > 100) neurons.shift();
  }
});

canvas.addEventListener('click', e => {
  for (let i = 0; i < 10; i++) {
    neurons.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    });
  }
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

draw();

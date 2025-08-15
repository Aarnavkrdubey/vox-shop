const canvas = document.createElement('canvas');
canvas.id = 'starfield';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.5;
    this.speedX = -0.15 * Math.random();
    this.speedY = 0.15 * Math.random();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.y > height) {
      this.reset();
      this.x = width;
      this.y = Math.random() * height * 0.5;
    }
  }

  draw(ctx) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ShootingStar {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = width + Math.random() * width * 0.5;
    this.y = Math.random() * height * 0.5;
    this.len = 200 + Math.random() * 300;
    this.speed = 10 + Math.random() * 10;
    this.size = 2;
    this.waitTime = 0;
    this.isActive = true;
  }

  update() {
    if (this.isActive) {
      this.x -= this.speed;
      this.y += this.speed * 0.5;
      if (this.x < -this.len || this.y > height + this.len) {
        this.isActive = false;
        this.waitTime = 100 + Math.random() * 200;
      }
    } else {
      this.waitTime--;
      if (this.waitTime <= 0) {
        this.reset();
        this.isActive = true;
      }
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = this.size;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.len, this.y - this.len * 0.5);
    ctx.stroke();
  }
}

const stars = [];
const shootingStars = [];

for (let i = 0; i < 150; i++) {
  stars.push(new Star());
}

for (let i = 0; i < 3; i++) {
  shootingStars.push(new ShootingStar());
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  stars.forEach(star => {
    star.update();
    star.draw(ctx);
  });

  shootingStars.forEach(ss => {
    ss.update();
    ss.draw(ctx);
  });

  requestAnimationFrame(animate);
}

animate();

// Counter Animation
function animateValue(id, start, end, duration) {
  let obj = document.getElementById(id);
  let range = end - start;
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    let progress = Math.min((timestamp - startTime) / duration, 1);
    obj.textContent = Math.floor(progress * range + start);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
animateValue("items-sold", 0, 150, 2000);
animateValue("happy-customers", 0, 120, 2000);
animateValue("reviews-count", 0, 35, 2000);

// Review Rotator
let reviewIndex = 0;
const reviews = document.querySelectorAll(".review");
setInterval(() => {
  reviews[reviewIndex].classList.remove("active");
  reviewIndex = (reviewIndex + 1) % reviews.length;
  reviews[reviewIndex].classList.add("active");
}, 3000);

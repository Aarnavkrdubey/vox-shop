// ================= STARFIELD ================
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
for (let i = 0; i < 150; i++) stars.push(new Star());
for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());

function animate() {
  ctx.clearRect(0, 0, width, height);
  stars.forEach(star => { star.update(); star.draw(ctx); });
  shootingStars.forEach(ss => { ss.update(); ss.draw(ctx); });
  requestAnimationFrame(animate);
}
animate();


// ================== COUNTERS =================
function animateValue(id, start, end, duration) {
  let obj = document.getElementById(id);
  if (!obj) return;
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

// ================ REVIEW ROTATOR ================
let reviewIndex = 0;
const reviews = document.querySelectorAll(".review");
if (reviews.length > 0) {
  setInterval(() => {
    reviews[reviewIndex].classList.remove("active");
    reviewIndex = (reviewIndex + 1) % reviews.length;
    reviews[reviewIndex].classList.add("active");
  }, 3000);
}


// ============== LOADER SEQUENCE =================
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('svg-loader');
  if (!loader) return;
  const turb = document.getElementById('turb');
  const dispm = document.getElementById('dispm');
  const polygon = document.getElementById('morph-poly');

  const morph1 = '64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96';
  const morph2 = '64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100';

  anime({
    targets: polygon,
    points: [
      { value: morph2, duration: 500, easing: 'easeInOutSine' },
      { value: morph1, duration: 500, easing: 'easeInOutSine' }
    ],
    direction: 'alternate',
    loop: true
  });

  anime({
    targets: turb,
    baseFrequency: [
      { value: 0.09, duration: 900, easing: 'easeInOutSine' },
      { value: 0.04, duration: 900, easing: 'easeInOutSine' }
    ],
    direction: 'alternate',
    loop: true,
    update: anim => {
      turb.setAttribute('baseFrequency', anim.animations[0].currentValue);
    }
  });

  anime({
    targets: dispm,
    scale: [
      { value: 35, duration: 800, easing: 'easeInOutSine' },
      { value: 15, duration: 800, easing: 'easeInOutSine' }
    ],
    direction: 'alternate',
    loop: true,
    update: anim => {
      dispm.setAttribute('scale', anim.animations.currentValue);
    }
  });

  setTimeout(() => {
    loader.style.transition = 'opacity 1s';
    loader.style.opacity = 0;
    setTimeout(() => loader.style.display = 'none', 950);
    document.body.style.transition = 'opacity 1s';
    document.body.style.opacity = 1;
  }, 1000);
});


// ========== EXPANDING / CLOSING CATEGORY BOXES ==========
const overlay = document.getElementById("overlay");
const categories = document.querySelectorAll(".category");

categories.forEach(category => {
  category.addEventListener("click", function () {
    if (this.classList.contains("expanded")) {
      this.classList.remove("expanded");
      this.classList.add("collapsing");
      overlay.classList.remove("active");
      setTimeout(() => {
        this.classList.remove("collapsing");
        this.querySelector(".items").innerHTML = "";
      }, 300);
      return;
    }

    // Close others
    document.querySelectorAll(".category.expanded").forEach(open => {
      open.classList.remove("expanded");
      open.classList.add("collapsing");
      setTimeout(() => {
        open.classList.remove("collapsing");
        open.querySelector(".items").innerHTML = "";
      }, 300);
    });

    // Expand this
    this.classList.add("expanded");
    overlay.classList.add("active");

    // Render products from data-items
    let data = this.dataset.items.split(";");
    let itemsHTML = "<div class='product-grid'>";

    data.forEach((d, i) => {
      d = d.trim();
      if (!d) return;

      if (d.startsWith("[") && d.endsWith("]")) {
        let heading = d.replace(/\[|\]/g, "");
        itemsHTML += `<h3 class="section-heading">${heading}</h3>`;
      } else {
        let parts = d.split("->");
        if (parts.length === 2) {
          let left = parts[0].trim();
          let right = parts[1].trim();
          let name = "", oldP = "";

          if (left.includes("|")) {
            let [n, o] = left.split("|");
            name = n.trim(); oldP = o.trim();
          } else {
            name = left;
          }

          itemsHTML += `
            <div class="product-card fade-in" style="animation-delay:${i * 0.08}s">
              <div class="product-name">${name}</div>
              <div class="product-prices">
                ${oldP ? `<span class="old-price">${oldP}</span>` : ""}
                <span class="new-price">${right}</span>
              </div>
            </div>`;
        }
      }
    });

    itemsHTML += "</div>";
    this.querySelector(".items").innerHTML = itemsHTML;
  });
});

overlay.addEventListener("click", () => {
  document.querySelectorAll(".category.expanded").forEach(box => {
    box.classList.remove("expanded");
    box.classList.add("collapsing");
    setTimeout(() => {
      box.classList.remove("collapsing");
      box.querySelector(".items").innerHTML = "";
    }, 300);
  });
  overlay.classList.remove("active");
});

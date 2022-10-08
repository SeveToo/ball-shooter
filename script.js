// FIXME:
// 47:00  https://www.youtube.com/watch?v=eI9idPTT0c4

const cnavas = document.querySelector("#cnavas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const speed = 5;

let rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 30, "#393939");
const projectiles = [];
const enemies = [];
player.draw();

function spawnEnemies() {
  setInterval(() => {
    const radius = rand(10, 30);
    let xx, yy;

    if (rand(1, 2) == 1) {
      xx = rand(1, 2) == 1 ? 0 - radius : x * 2 + radius;
      yy = rand(0, canvas.height);
    } else {
      xx = rand(0, canvas.width);
      yy = rand(1, 2) == 1 ? 0 - radius : y * 2 + radius;
    }

    // const color = RandColor(1);
    const color = `hsl(${rand(0, 360)},50%,50%)`;

    const angle = Math.atan2(y - yy, x - xx);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(xx, yy, radius, color, velocity));
  }, 1000);
}

let animationId;

function animate() {
  ctx.fillStyle = "rgba(0,0,0,.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  animationId = requestAnimationFrame(animate);

  projectiles.forEach((projectile, index) => {
    projectile.update();

    // remove from edges of screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });
  player.draw();

  enemies.forEach((enemy, index) => {
    enemy.update();
    const distance = Math.hypot(
      player.x - enemy.x,
      player.y - enemy.y
    );

    // END GAME
    if (distance - enemy.radius - player.radius < 1) {
      setTimeout(() => {
        cancelAnimationFrame(animationId);
      }, 100);
    }

    projectiles.forEach((projectile) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );

      // colision projectile && enemy
      setTimeout(() => {
        if (enemy) {
        }

        if (distance - enemy.radius - projectile.radius < 1) {
          enemies.splice(index, 1);
          projectiles.splice(projectile, 1);
        }
      }, 0);
    });
  });
}

addEventListener("click", (event) => {
  console.log(projectiles);
  const angle = Math.atan2(event.clientY - y, event.clientX - x);
  const velocity = {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
  const color = `hsl(${rand(0, 360)},50%,50%)`;

  projectiles.push(new Projectile(x, y, 5, color, velocity));
});

animate();
spawnEnemies();

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#score");
const messageEl = document.querySelector("#message");
const startButton = document.querySelector("#startButton");
const speedSlider = document.querySelector("#speedSlider");
const difficultySlider = document.querySelector("#difficultySlider");
const speedValue = document.querySelector("#speedValue");
const difficultyValue = document.querySelector("#difficultyValue");

const groundY = 286;
const gravity = 0.74;

const rabbit = {
  x: 210,
  y: groundY - 28,
  radius: 22,
  velocityY: 0,
  jumpsLeft: 1
};

const tiger = {
  x: 78,
  y: groundY - 30,
  radius: 30
};

let obstacles = [];
let clouds = [];
let animationId = 0;
let lastTime = 0;
let obstacleTimer = 0;
let score = 0;
let running = false;
let gameOver = false;

function sliderNumber(slider) {
  return Number(slider.value);
}

function updateSliderLabels() {
  speedValue.textContent = speedSlider.value;
  difficultyValue.textContent = difficultySlider.value;
}

function resetGame() {
  rabbit.y = groundY - rabbit.radius;
  rabbit.velocityY = 0;
  rabbit.jumpsLeft = 1;
  tiger.x = 78;
  obstacles = [];
  clouds = [
    { x: 120, y: 78, speed: 0.18 },
    { x: 420, y: 46, speed: 0.12 },
    { x: 760, y: 92, speed: 0.16 }
  ];
  obstacleTimer = 0;
  score = 0;
  scoreEl.textContent = "0";
  gameOver = false;
}

function startGame() {
  resetGame();
  running = true;
  lastTime = performance.now();
  messageEl.classList.add("hidden");
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(loop);
}

function endGame() {
  running = false;
  gameOver = true;
  messageEl.classList.remove("hidden");
  messageEl.querySelector("h2").textContent = "Тигр догнал зайца";
  messageEl.querySelector("p").textContent = `Счет: ${Math.floor(score)}. Нажми пробел, чтобы попробовать еще раз.`;
  startButton.textContent = "Играть снова";
}

function jump() {
  if (!running) {
    startGame();
    return;
  }

  if (rabbit.jumpsLeft > 0) {
    rabbit.velocityY = -14.5;
    rabbit.jumpsLeft -= 1;
  }
}

function spawnObstacle() {
  const difficulty = sliderNumber(difficultySlider);
  const width = 18 + Math.random() * (18 + difficulty * 3);
  const height = 30 + Math.random() * (30 + difficulty * 6);

  obstacles.push({
    x: canvas.width + width,
    y: groundY - height,
    width,
    height,
    passed: false
  });
}

function update(delta) {
  const speed = 5 + sliderNumber(speedSlider) * 0.9;
  const difficulty = sliderNumber(difficultySlider);
  const obstacleDelay = Math.max(520, 1550 - difficulty * 95);

  score += delta * 0.012 * (1 + sliderNumber(speedSlider) * 0.08);
  scoreEl.textContent = String(Math.floor(score));

  rabbit.velocityY += gravity;
  rabbit.y += rabbit.velocityY;

  if (rabbit.y >= groundY - rabbit.radius) {
    rabbit.y = groundY - rabbit.radius;
    rabbit.velocityY = 0;
    rabbit.jumpsLeft = 1;
  }

  const targetTigerX = Math.max(46, rabbit.x - 145 + difficulty * 3 + score * 0.015);
  tiger.x += (targetTigerX - tiger.x) * 0.018;

  obstacleTimer += delta;
  if (obstacleTimer > obstacleDelay) {
    spawnObstacle();
    obstacleTimer = Math.random() * 240;
  }

  for (const obstacle of obstacles) {
    obstacle.x -= speed;
  }

  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > -40);

  for (const cloud of clouds) {
    cloud.x -= cloud.speed * speed;
    if (cloud.x < -120) {
      cloud.x = canvas.width + 80;
      cloud.y = 42 + Math.random() * 65;
    }
  }

  if (isRabbitHit() || tiger.x + tiger.radius > rabbit.x - rabbit.radius * 0.8) {
    endGame();
  }
}

function isRabbitHit() {
  for (const obstacle of obstacles) {
    const nearestX = Math.max(obstacle.x, Math.min(rabbit.x, obstacle.x + obstacle.width));
    const nearestY = Math.max(obstacle.y, Math.min(rabbit.y, obstacle.y + obstacle.height));
    const dx = rabbit.x - nearestX;
    const dy = rabbit.y - nearestY;

    if (dx * dx + dy * dy < rabbit.radius * rabbit.radius) {
      return true;
    }
  }

  return false;
}

function drawCloud(x, y) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.arc(x + 22, y - 9, 24, 0, Math.PI * 2);
  ctx.arc(x + 50, y, 18, 0, Math.PI * 2);
  ctx.rect(x, y - 2, 52, 20);
  ctx.fill();
}

function drawRabbit() {
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#c8d0dc";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(rabbit.x, rabbit.y, rabbit.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#c8d0dc";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(rabbit.x - 7, rabbit.y - 28, 6, 18, -0.35, 0, Math.PI * 2);
  ctx.ellipse(rabbit.x + 9, rabbit.y - 28, 6, 18, 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(rabbit.x + 8, rabbit.y - 6, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawTiger() {
  ctx.fillStyle = "#f48b29";
  ctx.strokeStyle = "#b65314";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(tiger.x, tiger.y, tiger.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111827";
  for (let i = -1; i <= 1; i += 1) {
    ctx.fillRect(tiger.x - 10 + i * 15, tiger.y - 27, 5, 18);
  }
}

function drawObstacle(obstacle) {
  ctx.fillStyle = "#52606d";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  ctx.fillStyle = "#3d4752";
  ctx.fillRect(obstacle.x + 3, obstacle.y + 4, Math.max(4, obstacle.width - 6), 7);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#dff0ff");
  sky.addColorStop(1, "#f7fbff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const cloud of clouds) {
    drawCloud(cloud.x, cloud.y);
  }

  ctx.fillStyle = "#d8f1ce";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  ctx.strokeStyle = "#6fb96f";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.stroke();

  for (const obstacle of obstacles) {
    drawObstacle(obstacle);
  }

  drawTiger();
  drawRabbit();

  if (gameOver) {
    ctx.fillStyle = "rgba(29, 36, 51, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function loop(time) {
  if (!running) {
    draw();
    return;
  }

  const delta = Math.min(32, time - lastTime);
  lastTime = time;
  update(delta);
  draw();
  animationId = requestAnimationFrame(loop);
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    jump();
  }
});

canvas.addEventListener("pointerdown", jump);
startButton.addEventListener("click", startGame);
speedSlider.addEventListener("input", updateSliderLabels);
difficultySlider.addEventListener("input", updateSliderLabels);

updateSliderLabels();
resetGame();
draw();

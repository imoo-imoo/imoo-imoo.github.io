const W = 1080;
const H = 1920;
const ROUND_SECONDS = 30;
const STORAGE_KEY = "feed-the-fox-leaderboard-v1";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const els = {
  home: document.getElementById("home"),
  leaderboard: document.getElementById("leaderboard"),
  gameOver: document.getElementById("gameOver"),
  hud: document.getElementById("gameHud"),
  controls: document.getElementById("controls"),
  scoreText: document.getElementById("scoreText"),
  timeText: document.getElementById("timeText"),
  finalScore: document.getElementById("finalScore"),
  nameInput: document.getElementById("nameInput"),
  leaderList: document.getElementById("leaderList"),
  startButton: document.getElementById("startButton"),
  leaderButton: document.getElementById("leaderButton"),
  leftButton: document.getElementById("leftButton"),
  rightButton: document.getElementById("rightButton"),
  saveScoreButton: document.getElementById("saveScoreButton"),
  playAgainButton: document.getElementById("playAgainButton"),
  bgm: document.getElementById("bgm"),
};

const assets = {
  bg: image("assets/background.jpg"),
  foxIdle: image("assets/fox-new/fox-idle.png"),
  foxLeft: image("assets/fox-new/fox-run-left.png"),
  foxRight: image("assets/fox-new/fox-run-right.png"),
  foxHappy: image("assets/fox-new/fox-happy.png"),
  foxSad: image("assets/fox-new/fox-sad.png"),
  fruits: Array.from({ length: 13 }, (_, i) => image(`assets/fruits/fruit-${String(i + 1).padStart(2, "0")}.png`)),
};

const COLLECTIBLE_CONFIGS = [
  { name: "calculator", baseSize: 132, sourceWidth: 176, sourceHeight: 159, points: 15, color: "#ff574a" },
  { name: "lightbulb", baseSize: 112, sourceWidth: 148, sourceHeight: 135, points: 10, color: "#ffb330" },
  { name: "laptop-screen", baseSize: 158, sourceWidth: 146, sourceHeight: 131, points: 10, color: "#91d94d" },
  { name: "keyboard", baseSize: 174, sourceWidth: 144, sourceHeight: 178, points: 10, color: "#7b54ff", collisionScaleX: 0.82 },
  { name: "mouse", baseSize: 132, sourceWidth: 142, sourceHeight: 163, points: 15, color: "#ff73a6" },
  { name: "cd", baseSize: 110, sourceWidth: 174, sourceHeight: 169, points: 10, color: "#ff574a", collisionScaleX: 0.9, collisionScaleY: 0.9 },
  { name: "smartphone", baseSize: 128, sourceWidth: 121, sourceHeight: 173, points: 10, color: "#ffb330", collisionScaleX: 0.86 },
  { name: "small-battery", baseSize: 98, sourceWidth: 121, sourceHeight: 119, points: 10, color: "#91d94d" },
  { name: "large-battery", baseSize: 114, sourceWidth: 138, sourceHeight: 186, points: 15, color: "#7b54ff", collisionScaleX: 0.86 },
  { name: "broken-laptop", baseSize: 166, sourceWidth: 159, sourceHeight: 148, points: 10, color: "#ff73a6" },
  { name: "electric-kettle", baseSize: 150, sourceWidth: 144, sourceHeight: 146, points: 10, color: "#ff574a" },
  { name: "damaged-phone", baseSize: 130, sourceWidth: 123, sourceHeight: 186, points: 10, color: "#ffb330", collisionScaleX: 0.86 },
  { name: "hair-dryer", baseSize: 150, sourceWidth: 152, sourceHeight: 157, points: 15, color: "#91d94d" },
];

let state = "home";
let last = 0;
let score = 0;
let timeLeft = ROUND_SECONDS;
let elapsed = 0;
let spawnTimer = 0;
let foxX = W / 2;
let foxVX = 0;
let moveDir = 0;
let facingDir = -1;
let catchDir = -1;
let catchSmile = 0;
let missSad = 0;
let shake = 0;
let audioCtx;
const fruits = [];
const pops = [];
const petals = Array.from({ length: 18 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  r: 5 + Math.random() * 10,
  s: 6 + Math.random() * 16,
  a: Math.random() * Math.PI,
}));

function image(src) {
  const img = new Image();
  img.src = src;
  return img;
}

function setScreen(next) {
  state = next;
  [els.home, els.leaderboard, els.gameOver].forEach((el) => el.classList.remove("screen--active"));
  els.hud.classList.toggle("hud--active", next === "playing");
  els.controls.classList.toggle("controls--active", next === "playing");
  if (next === "home") els.home.classList.add("screen--active");
  if (next === "leaderboard") {
    renderLeaderboard();
    els.leaderboard.classList.add("screen--active");
  }
  if (next === "gameOver") els.gameOver.classList.add("screen--active");
}

function startGame() {
  unlockAudio();
  playBGM();
  score = 0;
  timeLeft = ROUND_SECONDS;
  elapsed = 0;
  spawnTimer = 0;
  foxX = W / 2;
  moveDir = 0;
  facingDir = -1;
  catchDir = -1;
  catchSmile = 0;
  missSad = 0;
  fruits.length = 0;
  pops.length = 0;
  updateHud();
  setScreen("playing");
  sound("start");
}

function endGame() {
  setScreen("gameOver");
  els.finalScore.textContent = `Score ${score}`;
  els.nameInput.focus({ preventScroll: true });
  sound("end");
}

function updateHud() {
  els.scoreText.textContent = String(score).padStart(3, "0");
  els.timeText.textContent = String(Math.ceil(timeLeft)).padStart(2, "0");
}

function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000 || 0);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function update(dt) {
  elapsed += dt;
  updatePetals(dt);
  if (state !== "playing") return;

  timeLeft -= dt;
  spawnTimer -= dt;
  catchSmile = Math.max(0, catchSmile - dt);
  missSad = Math.max(0, missSad - dt);
  shake = Math.max(0, shake - dt);

  if (spawnTimer <= 0) {
    spawnFruit();
    spawnTimer = Math.max(0.26, 0.78 - elapsed * 0.012) + Math.random() * 0.22;
  }

  const targetVX = moveDir * 760;
  if (moveDir) facingDir = moveDir;
  foxVX += (targetVX - foxVX) * Math.min(1, dt * 12);
  foxX = clamp(foxX + foxVX * dt, 150, W - 150);

  const basketCenterX = foxX + (moveDir > 0 ? 145 : moveDir < 0 ? -145 : -118);
  const bowl = { x: basketCenterX - 145, y: 1450, w: 290, h: 118 };
  const catchZone = {
    x: bowl.x - 34,
    y: bowl.y - 70,
    w: bowl.w + 68,
    h: bowl.h * 0.72,
  };
  for (let i = fruits.length - 1; i >= 0; i--) {
    const f = fruits[i];
    f.y += f.vy * dt;
    f.x += Math.sin(elapsed * f.wobble + f.phase) * f.drift * dt;
    f.rot += f.spin * dt;
    if (isCaught(f, catchZone)) {
      fruits.splice(i, 1);
      score += f.points;
      catchDir = moveDir || facingDir;
      catchSmile = 0.55;
      missSad = 0;
      pops.push({ x: f.x, y: f.y, text: `+${f.points}`, age: 0, color: f.color });
      burst(f.x, f.y, f.color);
      updateHud();
      sound("catch");
    } else if (f.y - f.drawHeight / 2 > H + 80) {
      fruits.splice(i, 1);
      pops.push({ x: f.x, y: H - 240, text: "miss", age: 0, color: "#7c4551" });
      missSad = 0.6;
      shake = 0.16;
      sound("miss");
    }
  }

  for (let i = pops.length - 1; i >= 0; i--) {
    pops[i].age += dt;
    if (pops[i].age > 0.9) pops.splice(i, 1);
  }

  if (timeLeft <= 0) {
    timeLeft = 0;
    updateHud();
    endGame();
  } else {
    updateHud();
  }
}

function spawnFruit() {
  const idx = Math.floor(Math.random() * assets.fruits.length);
  const img = assets.fruits[idx];
  const config = COLLECTIBLE_CONFIGS[idx];
  const metrics = getCollectibleMetrics(img, config);
  const halfWidth = metrics.drawWidth / 2;
  fruits.push({
    img,
    config,
    x: chooseSpawnX(halfWidth),
    y: -metrics.drawHeight * 0.7,
    ...metrics,
    vy: 330 + Math.random() * 330 + elapsed * 4,
    drift: 55 + Math.random() * 95,
    wobble: 2 + Math.random() * 4,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI,
    spin: -2.4 + Math.random() * 4.8,
    points: config.points,
    color: config.color,
  });
}

function getCollectibleMetrics(img, config) {
  const sourceWidth = img.naturalWidth || config.sourceWidth;
  const sourceHeight = img.naturalHeight || config.sourceHeight;
  const ratio = sourceWidth / sourceHeight;
  const scale = 0.9 + Math.random() * 0.2;
  const longestSide = config.baseSize * scale;
  const drawWidth = ratio >= 1 ? longestSide : longestSide * ratio;
  const drawHeight = ratio >= 1 ? longestSide / ratio : longestSide;
  return {
    scale,
    drawWidth,
    drawHeight,
    collisionWidth: drawWidth * (config.collisionScaleX || 0.9),
    collisionHeight: drawHeight * (config.collisionScaleY || 0.86),
  };
}

function chooseSpawnX(halfWidth) {
  const margin = halfWidth + 28;
  const minX = margin;
  const maxX = W - margin;
  let x = minX + Math.random() * (maxX - minX);

  for (let attempt = 0; attempt < 8; attempt++) {
    const tooClose = fruits.some((f) => f.y < 260 && Math.abs(f.x - x) < halfWidth + f.drawWidth / 2 + 76);
    if (!tooClose) return x;
    x = minX + Math.random() * (maxX - minX);
  }

  return x;
}

function isCaught(f, catchZone) {
  const item = {
    x: f.x - f.collisionWidth / 2,
    y: f.y + f.drawHeight * 0.06,
    w: f.collisionWidth,
    h: f.collisionHeight * 0.54,
  };

  return rectsOverlap(item, catchZone);
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function draw() {
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * 10, 0);
  drawBackground();
  drawPetals();
  if (state === "home") drawHomeFox();
  if (state === "playing" || state === "gameOver") {
    drawFruits();
    drawFox();
    drawPops();
  }
  if (state === "leaderboard") drawHomeFox(0.45);
  ctx.restore();
}

function drawBackground() {
  ctx.drawImage(assets.bg, 0, 0, W, H);
  const pulse = Math.sin(elapsed * 1.4) * 0.035 + 0.08;
  ctx.fillStyle = `rgba(255,255,255,${pulse})`;
  ctx.fillRect(0, 0, W, H);
}

function drawPetals() {
  for (const p of petals) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.a);
    ctx.fillStyle = "rgba(255,126,76,0.52)";
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r * 0.58, p.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawHomeFox(alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const bob = Math.sin(elapsed * 2.6) * 14;
  const breathe = 1 + Math.sin(elapsed * 3.2) * 0.026;
  const sway = Math.sin(elapsed * 1.9) * 0.035;
  drawShadow(W / 2, 1788, 360 + Math.sin(elapsed * 3.2) * 16, 48);
  ctx.translate(W / 2, 1790 + bob * 0.35);
  ctx.rotate(sway);
  drawSprite(assets.foxIdle, 0, 0, 570 * breathe, true, 1 - (breathe - 1) * 0.55, breathe);
  ctx.restore();
}

function drawFruits() {
  for (const f of fruits) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot);
    ctx.shadowColor = "rgba(17,88,95,0.45)";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 16;
    ctx.shadowOffsetY = 18;
    ctx.drawImage(f.img, -f.drawWidth / 2, -f.drawHeight / 2, f.drawWidth, f.drawHeight);
    ctx.restore();
  }
}

function drawFox() {
  const lean = foxVX / 900;
  const runCycle = Math.sin(elapsed * 18);
  const happyCycle = Math.sin(elapsed * 15);
  const idleCycle = Math.sin(elapsed * 4);
  const sadCycle = Math.sin(elapsed * 5);
  const bob =
    missSad > 0 ? Math.abs(sadCycle) * 4 : catchSmile > 0 ? -Math.abs(happyCycle) * 18 : moveDir ? Math.abs(runCycle) * -24 : idleCycle * 8;
  const img =
    missSad > 0 ? assets.foxSad : catchSmile > 0 ? assets.foxHappy : moveDir < 0 ? assets.foxLeft : moveDir > 0 ? assets.foxRight : assets.foxIdle;
  const spriteH = missSad > 0 ? 545 : catchSmile > 0 ? 535 : moveDir ? 500 : 530;
  const bottomY = missSad > 0 ? 1802 : catchSmile > 0 ? 1805 : moveDir ? 1810 : 1800;
  const squash = moveDir ? Math.abs(runCycle) : catchSmile > 0 ? Math.abs(happyCycle) : missSad > 0 ? 0.18 : Math.abs(idleCycle) * 0.05;
  const scaleX = 1 + squash * (moveDir ? 0.05 : catchSmile > 0 ? 0.07 : missSad > 0 ? 0.035 : 0.015);
  const scaleY = 1 - squash * (moveDir ? 0.045 : catchSmile > 0 ? 0.06 : missSad > 0 ? 0.05 : 0.012);
  const extraLean = moveDir ? runCycle * 0.035 : catchSmile > 0 ? happyCycle * 0.04 : missSad > 0 ? -0.035 : idleCycle * 0.018;
  drawShadow(foxX, 1810, 350 + Math.abs(lean) * 120 + squash * 28, 44 - squash * 5);
  ctx.save();
  ctx.translate(foxX, bottomY + bob);
  ctx.rotate(lean * 0.13 + extraLean);
  if (catchSmile > 0 && catchDir > 0) ctx.scale(-1, 1);
  drawSprite(img, 0, 0, spriteH, true, scaleX, scaleY);
  ctx.restore();
}

function drawSprite(img, centerX, bottomY, height, local = false, scaleX = 1, scaleY = 1) {
  const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
  const width = height * ratio;
  const drawW = width * scaleX;
  const drawH = height * scaleY;
  const x = centerX - drawW / 2;
  const y = local ? -drawH : bottomY - drawH;
  ctx.drawImage(img, x, y, drawW, drawH);
}

function drawShadow(x, y, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(32,95,82,0.28)";
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPops() {
  for (const p of pops) {
    const t = p.age / 0.9;
    ctx.save();
    ctx.globalAlpha = 1 - t;
    ctx.translate(p.x, p.y - t * 120);
    ctx.scale(1 + Math.sin(t * Math.PI) * 0.28, 1 + Math.sin(t * Math.PI) * 0.28);
    ctx.font = "900 54px Trebuchet MS, Arial";
    ctx.textAlign = "center";
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#6a3845";
    ctx.fillStyle = p.color;
    ctx.strokeText(p.text, 0, 0);
    ctx.fillText(p.text, 0, 0);
    ctx.restore();
  }
}

function burst(x, y, color) {
  for (let i = 0; i < 6; i++) {
    pops.push({
      x: x + (Math.random() - 0.5) * 72,
      y: y + (Math.random() - 0.5) * 38,
      text: "★",
      age: Math.random() * 0.18,
      color,
    });
  }
}

function updatePetals(dt) {
  for (const p of petals) {
    p.y += p.s * dt;
    p.x += Math.sin(elapsed + p.a) * 10 * dt;
    p.a += dt;
    if (p.y > H + 20) {
      p.y = -20;
      p.x = Math.random() * W;
    }
  }
}

function renderLeaderboard() {
  const rows = getScores();
  els.leaderList.innerHTML = "";
  if (!rows.length) {
    const li = document.createElement("li");
    li.innerHTML = "<span>1</span><strong>FOX</strong><em>000</em>";
    els.leaderList.append(li);
    return;
  }
  rows.forEach((row, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${i + 1}</span><strong>${row.name}</strong><em>${String(row.score).padStart(3, "0")}</em>`;
    els.leaderList.append(li);
  });
}

function saveScore() {
  const name = (els.nameInput.value || "FOX").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5) || "FOX";
  els.nameInput.value = name;
  const rows = getScores();
  rows.push({ name, score, date: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.sort((a, b) => b.score - a.score).slice(0, 10)));
  sound("save");
  setScreen("leaderboard");
}

function getScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function unlockAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}
async function playBGM() {
  if (!els.bgm) return;

  els.bgm.volume = 0.45;
  els.bgm.loop = true;

  try {
    await els.bgm.play();
  } catch (err) {
    console.log("BGM needs user interaction to play.");
  }
}

function sound(type) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const out = audioCtx.createGain();
  out.gain.setValueAtTime(0.0001, now);
  out.gain.exponentialRampToValueAtTime(type === "miss" ? 0.08 : 0.18, now + 0.012);
  out.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  out.connect(audioCtx.destination);

  const osc = audioCtx.createOscillator();
  osc.type = type === "miss" ? "triangle" : "sine";
  const f = type === "catch" ? 720 : type === "start" ? 440 : type === "save" ? 620 : type === "end" ? 260 : 160;
  osc.frequency.setValueAtTime(f, now);
  osc.frequency.exponentialRampToValueAtTime(type === "miss" ? 90 : f * 1.65, now + 0.18);
  osc.connect(out);
  osc.start(now);
  osc.stop(now + 0.24);
}

function bindHold(button, dir) {
  const start = (event) => {
    event.preventDefault();
    event.stopPropagation();
    moveDir = dir;
    unlockAudio();
  };

  const stop = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (moveDir === dir) moveDir = 0;
  };

  button.addEventListener("pointerdown", start, { passive: false });
  button.addEventListener("pointerup", stop, { passive: false });
  button.addEventListener("pointercancel", stop, { passive: false });
  button.addEventListener("pointerleave", stop, { passive: false });

  button.addEventListener("touchstart", start, { passive: false });
  button.addEventListener("touchend", stop, { passive: false });
  button.addEventListener("touchcancel", stop, { passive: false });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

els.startButton.addEventListener("click", startGame);
els.leaderButton.addEventListener("click", () => setScreen("leaderboard"));
els.playAgainButton.addEventListener("click", startGame);
els.saveScoreButton.addEventListener("click", saveScore);
document.querySelectorAll("[data-home]").forEach((button) => button.addEventListener("click", () => setScreen("home")));
els.nameInput.addEventListener("input", () => {
  els.nameInput.value = els.nameInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
});
bindHold(els.leftButton, -1);
bindHold(els.rightButton, 1);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") moveDir = -1;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") moveDir = 1;
  if (event.key === "Enter" && state === "home") startGame();
});
window.addEventListener("keyup", (event) => {
  if ((event.key === "ArrowLeft" || event.key.toLowerCase() === "a") && moveDir === -1) moveDir = 0;
  if ((event.key === "ArrowRight" || event.key.toLowerCase() === "d") && moveDir === 1) moveDir = 0;
});
window.addEventListener("pointerdown", unlockAudio, { once: true });

["contextmenu", "selectstart", "dragstart"].forEach((type) => {
  document.addEventListener(type, (event) => {
    event.preventDefault();
  });
});

requestAnimationFrame(loop);

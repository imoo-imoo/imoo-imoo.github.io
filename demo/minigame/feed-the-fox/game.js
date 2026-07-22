const W = 1080;
const H = 1920;
const ROUND_SECONDS = 30;
const STORAGE_KEY = "feed-the-fox-leaderboard-v1";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  { name: "calculator", baseSize: 132, sourceWidth: 176, sourceHeight: 159, points: 15, color: "#ff574a", fallWeight: 1, spinMultiplier: 0.9, swayAmount: 64, swaySpeed: 2.6 },
  { name: "lightbulb", baseSize: 112, sourceWidth: 148, sourceHeight: 135, points: 10, color: "#ffb330", fallWeight: 0.88, spinMultiplier: 0.55, swayAmount: 92, swaySpeed: 1.8, flutterAmount: 18 },
  { name: "laptop-screen", baseSize: 158, sourceWidth: 146, sourceHeight: 131, points: 10, color: "#91d94d", fallWeight: 1.14, spinMultiplier: 0.35, swayAmount: 36, swaySpeed: 1.5 },
  { name: "keyboard", baseSize: 174, sourceWidth: 144, sourceHeight: 178, points: 10, color: "#7b54ff", collisionScaleX: 0.82, fallWeight: 1.08, spinMultiplier: 0.42, swayAmount: 42, swaySpeed: 1.65 },
  { name: "mouse", baseSize: 132, sourceWidth: 142, sourceHeight: 163, points: 15, color: "#ff73a6", fallWeight: 0.98, spinMultiplier: 0.95, swayAmount: 70, swaySpeed: 2.25 },
  { name: "cd", baseSize: 110, sourceWidth: 174, sourceHeight: 169, points: 10, color: "#ff574a", collisionScaleX: 0.9, collisionScaleY: 0.9, fallWeight: 0.96, spinMultiplier: 1.65, swayAmount: 76, swaySpeed: 2.9 },
  { name: "smartphone", baseSize: 128, sourceWidth: 121, sourceHeight: 173, points: 10, color: "#ffb330", collisionScaleX: 0.86, fallWeight: 1, spinMultiplier: 0.6, swayAmount: 58, swaySpeed: 1.35 },
  { name: "small-battery", baseSize: 98, sourceWidth: 121, sourceHeight: 119, points: 10, color: "#91d94d", fallWeight: 1.18, spinMultiplier: 1.55, swayAmount: 48, swaySpeed: 2.8 },
  { name: "large-battery", baseSize: 114, sourceWidth: 138, sourceHeight: 186, points: 15, color: "#7b54ff", collisionScaleX: 0.86, fallWeight: 1.2, spinMultiplier: 1.35, swayAmount: 44, swaySpeed: 2.6 },
  { name: "broken-laptop", baseSize: 166, sourceWidth: 159, sourceHeight: 148, points: 10, color: "#ff73a6", fallWeight: 1.16, spinMultiplier: 0.32, swayAmount: 34, swaySpeed: 1.45 },
  { name: "electric-kettle", baseSize: 150, sourceWidth: 144, sourceHeight: 146, points: 10, color: "#ff574a", fallWeight: 1.1, spinMultiplier: 0.65, swayAmount: 46, swaySpeed: 1.9 },
  { name: "damaged-phone", baseSize: 130, sourceWidth: 123, sourceHeight: 186, points: 10, color: "#ffb330", collisionScaleX: 0.86, fallWeight: 1.02, spinMultiplier: 0.62, swayAmount: 56, swaySpeed: 1.4 },
  { name: "hair-dryer", baseSize: 150, sourceWidth: 152, sourceHeight: 157, points: 15, color: "#91d94d", fallWeight: 1.03, spinMultiplier: 1.05, swayAmount: 86, swaySpeed: 2.15, flutterAmount: 10 },
];

let state = "home";
let last = 0;
let score = 0;
let timeLeft = ROUND_SECONDS;
let elapsed = 0;
let roundElapsed = 0;
let spawnTimer = 0;
let foxX = W / 2;
let foxVX = 0;
let moveDir = 0;
let facingDir = -1;
let catchDir = -1;
let catchSmile = 0;
let missSad = 0;
let shake = 0;
let cameraBump = 0;
let foxReaction = 0;
let binBounce = 0;
let combo = 0;
let comboTimer = 0;
let comboPulse = 0;
let readyTimer = 0;
let endDelay = 0;
let phaseBanner = null;
let nextGoldenAt = 0;
let slowMoTimer = 0;
let lastCountdownNumber = 0;
let audioCtx;
const fruits = [];
const pops = [];
const particles = [];
const motes = Array.from({ length: prefersReducedMotion ? 8 : 18 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  r: 2 + Math.random() * 5,
  s: 4 + Math.random() * 9,
  a: Math.random() * Math.PI * 2,
}));
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
  roundElapsed = 0;
  spawnTimer = 0;
  foxX = W / 2;
  moveDir = 0;
  facingDir = -1;
  catchDir = -1;
  catchSmile = 0;
  missSad = 0;
  shake = 0;
  cameraBump = 0;
  foxReaction = 0;
  binBounce = 0;
  combo = 0;
  comboTimer = 0;
  comboPulse = 0;
  readyTimer = prefersReducedMotion ? 0.25 : 1.15;
  endDelay = 0;
  phaseBanner = null;
  nextGoldenAt = 8 + Math.random() * 4;
  slowMoTimer = 0;
  lastCountdownNumber = 0;
  fruits.length = 0;
  pops.length = 0;
  particles.length = 0;
  updateHud();
  setScreen("playing");
  sound("ready");
}

function endGame() {
  moveDir = 0;
  foxVX = 0;
  setScreen("gameOver");
  els.finalScore.textContent = `Score ${score}`;
  els.nameInput.focus({ preventScroll: true });
  sound("end");
}

function updateHud() {
  els.scoreText.textContent = String(score).padStart(3, "0");
  els.timeText.textContent = String(Math.ceil(timeLeft)).padStart(2, "0");
  const urgent = state === "playing" && readyTimer <= 0 && timeLeft > 0 && timeLeft <= 5;
  const pulse = urgent && !prefersReducedMotion ? 1 + Math.sin(elapsed * 18) * 0.055 : 1;
  els.timeText.parentElement.style.transform = urgent ? `rotate(2deg) scale(${pulse.toFixed(3)})` : "";
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
  updateParticles(dt);
  updatePops(dt);
  if (state !== "playing") return;

  const activeDt = slowMoTimer > 0 ? dt * 0.45 : dt;
  slowMoTimer = Math.max(0, slowMoTimer - dt);
  catchSmile = Math.max(0, catchSmile - dt);
  missSad = Math.max(0, missSad - dt);
  shake = Math.max(0, shake - dt);
  cameraBump = Math.max(0, cameraBump - dt);
  foxReaction = Math.max(0, foxReaction - dt);
  binBounce = Math.max(0, binBounce - dt);
  comboPulse = Math.max(0, comboPulse - dt);
  comboTimer = Math.max(0, comboTimer - dt);
  if (comboTimer <= 0 && combo > 0) combo = 0;
  if (phaseBanner) {
    phaseBanner.age += dt;
    if (phaseBanner.age > phaseBanner.duration) phaseBanner = null;
  }

  if (readyTimer > 0) {
    readyTimer = Math.max(0, readyTimer - dt);
    if (readyTimer === 0) {
      showCenterText("GO!", W / 2, 760, "#fff7d5", 1.0, 94);
      sound("go");
    }
    return;
  }

  if (endDelay > 0) {
    endDelay -= dt;
    updateFruits(activeDt, getCatchZone());
    if (endDelay <= 0) endGame();
    return;
  }

  timeLeft -= dt;
  roundElapsed += dt;
  spawnTimer -= dt;
  updatePhaseBanners();
  updateCountdown();

  if (spawnTimer <= 0) {
    spawnFruit();
    spawnTimer = getSpawnDelay();
  }

  const targetVX = moveDir * 760;
  if (moveDir) facingDir = moveDir;
  foxVX += (targetVX - foxVX) * Math.min(1, dt * 12);
  foxX = clamp(foxX + foxVX * dt, 150, W - 150);

  updateFruits(activeDt, getCatchZone());

  if (timeLeft <= 0) {
    timeLeft = 0;
    updateHud();
    endDelay = prefersReducedMotion ? 0.12 : 0.42;
    sound("timeup");
  } else {
    updateHud();
  }
}

function updateFruits(dt, catchZone) {
  for (let i = fruits.length - 1; i >= 0; i--) {
    const f = fruits[i];
    if (f.caught) {
      f.catchAge += dt;
      const t = clamp(f.catchAge / f.catchDuration, 0, 1);
      const eased = easeOutBack(t, 0.8);
      f.x = lerp(f.startX, f.targetX, eased);
      f.y = lerp(f.startY, f.targetY, easeInOut(t));
      f.rot = f.startRot + f.spin * dt * 4.5 + t * (f.golden ? 2.1 : 1.2);
      f.catchScale = 1 - easeInOut(t) * 0.78;
      f.alpha = t > 0.58 ? 1 - (t - 0.58) / 0.42 : 1;
      if (t >= 1) fruits.splice(i, 1);
      continue;
    }

    const flutter = f.flutterAmount ? Math.sin(roundElapsed * f.swaySpeed * 1.7 + f.phase) * f.flutterAmount : 0;
    f.y += (f.vy + flutter) * dt;
    f.x += Math.sin(roundElapsed * f.wobble + f.phase) * f.drift * dt;
    f.rot += f.spin * dt;
    if (isCaught(f, catchZone)) {
      beginCatch(f, catchZone);
    } else if (f.y - f.drawHeight / 2 > H + 80) {
      fruits.splice(i, 1);
      combo = 0;
      comboTimer = 0;
      showScoreText("miss", f.x, H - 240, "#7c4551", 0.75, 42);
      missBurst(f.x, H - 220);
      missSad = 0.6;
      shake = 0.16;
      cameraBump = Math.max(cameraBump, 0.08);
      sound("miss");
    }
  }
}

function spawnFruit() {
  const idx = Math.floor(Math.random() * assets.fruits.length);
  const img = assets.fruits[idx];
  const config = COLLECTIBLE_CONFIGS[idx];
  const metrics = getCollectibleMetrics(img, config);
  const halfWidth = metrics.drawWidth / 2;
  const phase = getPhase();
  const golden = shouldSpawnGolden();
  const speed = (300 + Math.random() * 285 + roundElapsed * 3.2) * config.fallWeight * phase.speedMultiplier;
  fruits.push({
    img,
    config,
    x: chooseSpawnX(halfWidth),
    y: -metrics.drawHeight * 0.7,
    ...metrics,
    vy: speed,
    drift: (config.swayAmount + Math.random() * 34) * phase.swayMultiplier,
    wobble: config.swaySpeed + Math.random() * 1.2,
    flutterAmount: config.flutterAmount || 0,
    swaySpeed: config.swaySpeed,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI,
    spin: (-1.75 + Math.random() * 3.5) * config.spinMultiplier * phase.spinMultiplier,
    points: golden ? 30 : config.points,
    color: config.color,
    golden,
    caught: false,
    catchAge: 0,
    catchDuration: 0.16 + Math.random() * 0.06,
    catchScale: 1,
    alpha: 1,
  });
}

function shouldSpawnGolden() {
  if (roundElapsed < nextGoldenAt || fruits.some((f) => f.golden && !f.caught)) return false;
  nextGoldenAt = roundElapsed + 8 + Math.random() * 4;
  return true;
}

function getPhase() {
  if (roundElapsed >= 22) {
    return { name: "final", spawnBase: 0.42, spawnJitter: 0.12, speedMultiplier: 1.18, swayMultiplier: 1.22, spinMultiplier: 1.15, petalBoost: 1.55 };
  }
  if (roundElapsed >= 10) {
    return { name: "rush", spawnBase: 0.54, spawnJitter: 0.16, speedMultiplier: 1.08, swayMultiplier: 1.12, spinMultiplier: 1.06, petalBoost: 1.2 };
  }
  return { name: "warm", spawnBase: 0.72, spawnJitter: 0.18, speedMultiplier: 0.98, swayMultiplier: 1, spinMultiplier: 1, petalBoost: 1 };
}

function getSpawnDelay() {
  const phase = getPhase();
  return Math.max(0.26, phase.spawnBase + Math.random() * phase.spawnJitter);
}

function updatePhaseBanners() {
  if (!phaseBanner && roundElapsed >= 10 && roundElapsed < 10.12) showBanner("FASTER!", "#fff7d5");
  if (!phaseBanner && roundElapsed >= 22 && roundElapsed < 22.12) showBanner("FINAL RUSH!", "#ffd35c");
}

function updateCountdown() {
  const n = Math.ceil(timeLeft);
  if (n <= 5 && n >= 1 && n !== lastCountdownNumber) {
    lastCountdownNumber = n;
    showCenterText(String(n), W / 2, 720, n === 1 ? "#ffd35c" : "#fff7d5", 0.58, 138);
    sound(n === 1 ? "countFinal" : "count");
  }
}

function getBowl() {
  const bounce = getBinBounce();
  const basketCenterX = foxX + (moveDir > 0 ? 145 : moveDir < 0 ? -145 : -118);
  return { x: basketCenterX - 145, y: 1450 + bounce, w: 290, h: 118, centerX: basketCenterX, centerY: 1496 + bounce };
}

function getCatchZone() {
  const bowl = getBowl();
  return {
    x: bowl.x - 34,
    y: bowl.y - 70,
    w: bowl.w + 68,
    h: bowl.h * 0.72,
    centerX: bowl.centerX,
    centerY: bowl.centerY,
  };
}

function beginCatch(f, catchZone) {
  f.caught = true;
  f.catchAge = 0;
  f.startX = f.x;
  f.startY = f.y;
  f.targetX = catchZone.centerX;
  f.targetY = catchZone.centerY + 38;
  f.startRot = f.rot;
  f.alpha = 1;

  combo += 1;
  comboTimer = 1.5;
  comboPulse = 0.72;
  const comboBonus = combo >= 10 ? 8 : combo >= 5 ? 5 : combo >= 2 ? 2 : 0;
  const gained = f.points + comboBonus;
  score += gained;
  catchDir = moveDir || facingDir;
  catchSmile = 0.58;
  missSad = 0;
  foxReaction = f.golden ? 0.34 : combo >= 5 ? 0.28 : 0.22;
  binBounce = f.golden ? 0.32 : combo >= 5 ? 0.26 : 0.2;
  cameraBump = Math.max(cameraBump, f.golden ? 0.16 : 0.08);
  if (f.golden) slowMoTimer = prefersReducedMotion ? 0 : 0.1;

  const label = f.golden ? "RARE FIND!" : `+${gained}`;
  showScoreText(label, f.x, f.y, f.golden ? "#ffd35c" : f.color, f.golden ? 1.15 : f.points >= 15 ? 0.95 : 0.85, f.golden ? 62 : 54);
  if (combo >= 2) showComboText();
  catchBurst(f.x, f.y, f.color, f.golden ? 2.2 : f.points >= 15 ? 1.45 : 1);
  if (combo === 5) milestone("GREAT!");
  if (combo === 10) milestone("AMAZING!");
  if (combo === 15) milestone("E-WASTE HERO!");
  updateHud();
  sound(f.golden ? "gold" : combo >= 5 ? "combo" : "catch");
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
  const bump = getCameraBump();
  if (shake > 0 || bump) ctx.translate((Math.random() - 0.5) * (shake > 0 ? 8 : 0) + bump.x, bump.y);
  drawBackground();
  drawMotes();
  drawPetals();
  if (state === "home") drawHomeFox();
  if (state === "playing" || state === "gameOver") {
    drawFruits();
    drawParticles();
    drawFox();
    drawPops();
    drawCombo();
    drawPhaseBanner();
    drawReady();
  }
  if (state === "leaderboard") drawHomeFox(0.45);
  ctx.restore();
}

function drawBackground() {
  ctx.drawImage(assets.bg, 0, 0, W, H);
  const phase = getPhase();
  const finalEnergy = state === "playing" && phase.name === "final" ? 0.035 : 0;
  const pulse = Math.sin(elapsed * (1.4 + finalEnergy * 8)) * (0.035 + finalEnergy) + 0.08;
  ctx.fillStyle = `rgba(255,255,255,${pulse})`;
  ctx.fillRect(0, 0, W, H);
}

function drawMotes() {
  ctx.save();
  ctx.globalAlpha = 0.34;
  for (const m of motes) {
    ctx.fillStyle = "rgba(255,244,190,0.58)";
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
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
    const pulse = f.golden && !f.caught ? 1 + Math.sin(elapsed * 8 + f.phase) * 0.04 : 1;
    const scale = (f.catchScale || 1) * pulse;
    const alpha = f.alpha == null ? 1 : f.alpha;
    ctx.globalAlpha = alpha;
    if (f.golden) drawGoldenAura(f);
    ctx.shadowColor = f.golden ? "rgba(255,194,60,0.58)" : "rgba(17,88,95,0.45)";
    ctx.shadowBlur = f.golden ? 18 : 0;
    ctx.shadowOffsetX = 16;
    ctx.shadowOffsetY = 18;
    ctx.drawImage(f.img, (-f.drawWidth * scale) / 2, (-f.drawHeight * scale) / 2, f.drawWidth * scale, f.drawHeight * scale);
    if (f.golden && !f.caught) drawGoldenSparkles(f);
    ctx.restore();
  }
}

function drawGoldenAura(f) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const r = Math.max(f.drawWidth, f.drawHeight) * 0.72;
  const gradient = ctx.createRadialGradient(0, 0, 8, 0, 0, r);
  gradient.addColorStop(0, "rgba(255,235,126,0.5)");
  gradient.addColorStop(1, "rgba(255,183,52,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGoldenSparkles(f) {
  ctx.save();
  ctx.fillStyle = "rgba(255,247,180,0.95)";
  for (let i = 0; i < 3; i++) {
    const a = elapsed * (1.8 + i * 0.35) + f.phase + (Math.PI * 2 * i) / 3;
    const r = Math.max(f.drawWidth, f.drawHeight) * (0.54 + i * 0.05);
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * 0.72;
    drawStar(x, y, 7 + i * 2, "#fff6a5", 0.9);
  }
  ctx.restore();
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
  const bottomY = (missSad > 0 ? 1802 : catchSmile > 0 ? 1805 : moveDir ? 1810 : 1800) - getFoxHop();
  const squash = moveDir ? Math.abs(runCycle) : catchSmile > 0 ? Math.abs(happyCycle) : missSad > 0 ? 0.18 : Math.abs(idleCycle) * 0.05;
  const reaction = getReactionSquash();
  const scaleX = 1 + squash * (moveDir ? 0.05 : catchSmile > 0 ? 0.07 : missSad > 0 ? 0.035 : 0.015) + reaction.x;
  const scaleY = 1 - squash * (moveDir ? 0.045 : catchSmile > 0 ? 0.06 : missSad > 0 ? 0.05 : 0.012) + reaction.y;
  const extraLean = moveDir ? runCycle * 0.035 : catchSmile > 0 ? happyCycle * 0.04 : missSad > 0 ? -0.035 : idleCycle * 0.018;
  drawShadow(foxX, 1810, 350 + Math.abs(lean) * 120 + squash * 28, 44 - squash * 5);
  ctx.save();
  ctx.translate(foxX, bottomY + bob + getBinBounce() * 0.25);
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
    const t = p.age / p.duration;
    const pop = Math.sin(Math.min(1, t) * Math.PI);
    ctx.save();
    ctx.globalAlpha = clamp(1 - Math.max(0, t - 0.55) / 0.45, 0, 1);
    ctx.translate(p.x, p.y - t * p.rise);
    ctx.scale(p.scale * (1.18 + pop * 0.32 - t * 0.16), p.scale * (1.18 + pop * 0.32 - t * 0.16));
    ctx.font = `900 ${p.fontSize}px Trebuchet MS, Arial`;
    ctx.textAlign = "center";
    ctx.lineWidth = p.stroke || 12;
    ctx.strokeStyle = "#6a3845";
    ctx.fillStyle = p.color;
    ctx.strokeText(p.text, 0, 0);
    ctx.fillText(p.text, 0, 0);
    ctx.restore();
  }
}

function drawCombo() {
  if (combo < 2 || comboTimer <= 0) return;
  const t = clamp(comboPulse / 0.72, 0, 1);
  const scale = 1 + Math.sin(t * Math.PI) * 0.28;
  ctx.save();
  ctx.globalAlpha = clamp(comboTimer / 0.45, 0, 1);
  ctx.translate(W / 2, 330);
  ctx.scale(scale, scale);
  ctx.font = "900 56px Trebuchet MS, Arial";
  ctx.textAlign = "center";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#6a3845";
  ctx.fillStyle = "#ffd35c";
  ctx.strokeText(`COMBO ×${combo}`, 0, 0);
  ctx.fillText(`COMBO ×${combo}`, 0, 0);
  ctx.restore();
}

function drawPhaseBanner() {
  if (!phaseBanner) return;
  const t = phaseBanner.age / phaseBanner.duration;
  const alpha = t < 0.15 ? t / 0.15 : t > 0.68 ? 1 - (t - 0.68) / 0.32 : 1;
  const scale = 0.8 + Math.sin(Math.min(1, t) * Math.PI) * 0.22 + t * 0.08;
  ctx.save();
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.translate(W / 2, 520);
  ctx.scale(scale, scale);
  ctx.font = "900 88px Trebuchet MS, Arial";
  ctx.textAlign = "center";
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#6a3845";
  ctx.fillStyle = phaseBanner.color;
  ctx.strokeText(phaseBanner.text, 0, 0);
  ctx.fillText(phaseBanner.text, 0, 0);
  ctx.restore();
}

function drawReady() {
  if (readyTimer <= 0) return;
  const showingReady = readyTimer > 0.52;
  const local = showingReady ? (1.15 - readyTimer) / 0.63 : (0.52 - readyTimer) / 0.52;
  const text = showingReady ? "READY" : "GO!";
  const color = showingReady ? "#fff7d5" : "#ffd35c";
  const scale = 0.78 + Math.sin(clamp(local, 0, 1) * Math.PI) * 0.34;
  ctx.save();
  ctx.globalAlpha = showingReady ? 1 : clamp(readyTimer / 0.28, 0, 1);
  ctx.translate(W / 2, 740);
  ctx.scale(scale, scale);
  ctx.font = "900 116px Trebuchet MS, Arial";
  ctx.textAlign = "center";
  ctx.lineWidth = 18;
  ctx.strokeStyle = "#6a3845";
  ctx.fillStyle = color;
  ctx.strokeText(text, 0, 0);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    const t = p.age / p.life;
    ctx.save();
    ctx.globalAlpha = (1 - t) * p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    if (p.type === "star") {
      drawStar(0, 0, p.size, p.color, 1);
    } else if (p.type === "leaf") {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawStar(x, y, r, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
    const rr = i % 2 ? r * 0.42 : r;
    const px = Math.cos(a) * rr;
    const py = Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function updatePetals(dt) {
  const phase = state === "playing" ? getPhase() : { petalBoost: 1 };
  for (const m of motes) {
    m.y += m.s * dt * phase.petalBoost;
    m.x += Math.sin(elapsed * 0.65 + m.a) * 4 * dt;
    if (m.y > H + 20) {
      m.y = -20;
      m.x = Math.random() * W;
    }
  }
  for (const p of petals) {
    p.y += p.s * dt * phase.petalBoost;
    p.x += Math.sin(elapsed + p.a) * 10 * dt * phase.petalBoost;
    p.a += dt;
    if (p.y > H + 20) {
      p.y = -20;
      p.x = Math.random() * W;
    }
  }
}

function updatePops(dt) {
  for (let i = pops.length - 1; i >= 0; i--) {
    pops[i].age += dt;
    if (pops[i].age > pops[i].duration) pops.splice(i, 1);
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.age += dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += p.gravity * dt;
    p.rot += p.spin * dt;
    if (p.age > p.life) particles.splice(i, 1);
  }
}

function showScoreText(text, x, y, color, scale = 1, fontSize = 54) {
  if (pops.length > 12) pops.shift();
  pops.push({
    x,
    y,
    text,
    age: 0,
    duration: 0.82,
    rise: 126,
    scale,
    fontSize,
    stroke: fontSize > 58 ? 15 : 12,
    color,
  });
}

function showCenterText(text, x, y, color, duration = 0.78, fontSize = 104) {
  pops.push({
    x,
    y,
    text,
    age: 0,
    duration,
    rise: 36,
    scale: 1.1,
    fontSize,
    stroke: 18,
    color,
  });
}

function showComboText() {
  const special = combo >= 15 ? "E-WASTE HERO!" : combo >= 10 ? "AMAZING!" : combo >= 5 ? "GREAT!" : `COMBO ×${combo}`;
  showCenterText(special, W / 2, combo >= 5 ? 430 : 360, combo >= 5 ? "#ffd35c" : "#fff7d5", 0.72, combo >= 15 ? 74 : 66);
}

function milestone(text) {
  showBanner(text, "#ffd35c", 1.05);
  catchBurst(W / 2, 520, "#ffd35c", 2);
  sound("milestone");
}

function showBanner(text, color, duration = 0.95) {
  phaseBanner = { text, color, age: 0, duration };
}

function catchBurst(x, y, color, strength = 1) {
  const count = prefersReducedMotion ? Math.ceil(5 * strength) : Math.ceil(10 * strength);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const speed = (90 + Math.random() * 230) * strength;
    addParticle({
      type: Math.random() > 0.55 ? "star" : "dot",
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed - 55,
      gravity: 210,
      size: 5 + Math.random() * 8 * strength,
      color: Math.random() > 0.35 ? color : "#fff7b8",
      alpha: 0.85,
      life: 0.42 + Math.random() * 0.24,
      rot: Math.random() * Math.PI,
      spin: -5 + Math.random() * 10,
    });
  }
}

function missBurst(x, y) {
  const count = prefersReducedMotion ? 3 : 7;
  for (let i = 0; i < count; i++) {
    addParticle({
      type: "leaf",
      x: x + (Math.random() - 0.5) * 64,
      y,
      vx: (Math.random() - 0.5) * 110,
      vy: -80 - Math.random() * 80,
      gravity: 240,
      size: 8 + Math.random() * 7,
      color: "rgba(171,102,82,0.72)",
      alpha: 0.7,
      life: 0.5 + Math.random() * 0.2,
      rot: Math.random() * Math.PI,
      spin: -4 + Math.random() * 8,
    });
  }
}

function addParticle(p) {
  particles.push(p);
  while (particles.length > 90) particles.shift();
}

function getReactionSquash() {
  if (foxReaction <= 0) return { x: 0, y: 0 };
  const t = foxReaction / 0.34;
  const pulse = Math.sin(clamp(t, 0, 1) * Math.PI);
  return { x: pulse * 0.045, y: -pulse * 0.04 };
}

function getFoxHop() {
  if (foxReaction <= 0) return 0;
  const t = 1 - foxReaction / 0.34;
  return Math.sin(clamp(t, 0, 1) * Math.PI) * 18;
}

function getBinBounce() {
  if (binBounce <= 0) return 0;
  const t = 1 - binBounce / 0.32;
  return Math.sin(clamp(t, 0, 1) * Math.PI) * 24;
}

function getCameraBump() {
  if (cameraBump <= 0 || prefersReducedMotion) return { x: 0, y: 0 };
  const t = cameraBump / 0.16;
  return { x: 0, y: Math.sin(t * Math.PI) * 5 };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOut(t) {
  return t * t * (3 - 2 * t);
}

function easeOutBack(t, amount = 1.1) {
  const n = t - 1;
  return 1 + n * n * ((amount + 1) * n + amount);
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
  if (type === "catch") {
    tone(520 + combo * 18, 0.1, "sine", 0.1, 0);
    tone(940 + combo * 20, 0.16, "triangle", 0.055, 0.045);
  } else if (type === "combo") {
    tone(620 + combo * 14, 0.1, "sine", 0.1, 0);
    tone(820 + combo * 18, 0.12, "sine", 0.09, 0.06);
    tone(1080 + combo * 20, 0.16, "triangle", 0.07, 0.12);
  } else if (type === "milestone") {
    [660, 880, 1180].forEach((f, i) => tone(f, 0.16, "sine", 0.095, i * 0.07));
  } else if (type === "gold") {
    [740, 930, 1180, 1480].forEach((f, i) => tone(f, 0.14, "sine", 0.085, i * 0.045));
    tone(1860, 0.28, "triangle", 0.045, 0.12);
  } else if (type === "miss") {
    tone(190, 0.22, "triangle", 0.065, 0, 110);
  } else if (type === "count" || type === "countFinal") {
    tone(type === "countFinal" ? 620 : 480, 0.08, "square", type === "countFinal" ? 0.09 : 0.06, 0);
  } else if (type === "ready") {
    tone(410, 0.16, "sine", 0.08, 0);
  } else if (type === "go") {
    tone(520, 0.1, "sine", 0.08, 0);
    tone(880, 0.18, "sine", 0.1, 0.07);
  } else if (type === "save") {
    tone(620, 0.18, "sine", 0.1, 0);
    tone(880, 0.18, "sine", 0.08, 0.08);
  } else if (type === "timeup" || type === "end") {
    [520, 390, 300].forEach((f, i) => tone(f, 0.2, "sine", 0.08, i * 0.1));
  }

  function tone(freq, dur, wave, volume, delay = 0, endFreq = freq * 1.22) {
    const t = now + delay;
    const out = audioCtx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(volume, t + 0.012);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    out.connect(audioCtx.destination);

    const osc = audioCtx.createOscillator();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), t + dur);
    osc.connect(out);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }
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

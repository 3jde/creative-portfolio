const VIEW_W = 1280;
const VIEW_H = 720;
const WORLD_W = 3420;
const WORLD_H = 720;
const GRAVITY = 0.78;
const MAX_FALL = 18;

const ui = {
  start: document.getElementById("start-screen"),
  pause: document.getElementById("pause-screen"),
  end: document.getElementById("end-screen"),
  startButton: document.getElementById("btn-start"),
  resumeButton: document.getElementById("btn-resume"),
  resetButton: document.getElementById("btn-reset"),
  retryButton: document.getElementById("btn-retry"),
  hearts: document.getElementById("hud-hearts"),
  coins: document.getElementById("hud-coins"),
  shards: document.getElementById("hud-shards"),
  key: document.getElementById("hud-key"),
  level: document.getElementById("hud-level"),
  mission: document.getElementById("mission-text"),
  status: document.getElementById("status-line"),
  endKicker: document.getElementById("end-kicker"),
  endTitle: document.getElementById("end-title"),
  endCopy: document.getElementById("end-copy")
};

const keys = new Set();
const pressed = new Set();
const touchHold = {
  left: false,
  right: false
};
const touchTap = {
  jump: false,
  dash: false
};

let state = "start";
let player;
let platforms = [];
let coins = [];
let shards = [];
let enemies = [];
let spikes = [];
let lasers = [];
let crushers = [];
let drones = [];
let springs = [];
let switches = [];
let checkpoints = [];
let keyItem;
let gate;
let stars = [];
let buildings = [];
let ships = [];
let particles = [];
let camX = 0;
let gameTime = 0;
let messageTimer = 0;
let bridgePlatform;

function setup() {
  const canvas = createCanvas(VIEW_W, VIEW_H);
  canvas.parent("game-container");
  pixelDensity(1);
  noSmooth();
  textFont("monospace");
  buildDecor();
  resetGame();
  updateHud();
}

function draw() {
  const dt = Math.min(deltaTime / 16.666, 2);

  if (state === "playing") {
    updateGame(dt);
  }

  renderGame();
  pressed.clear();
  touchTap.jump = false;
  touchTap.dash = false;
}

function resetGame() {
  state = "start";
  gameTime = 0;
  camX = 0;
  particles = [];
  player = {
    x: 88,
    y: 564,
    prevX: 88,
    prevY: 564,
    w: 32,
    h: 46,
    vx: 0,
    vy: 0,
    facing: 1,
    health: 7,
    maxHealth: 7,
    coins: 0,
    shards: 0,
    hasKey: false,
    onGround: false,
    groundPlatform: null,
    coyote: 0,
    jumpBuffer: 0,
    dashTime: 0,
    dashCooldown: 0,
    invuln: 0,
    checkpoint: { x: 88, y: 564 }
  };
  buildWorld();
  setLog("Sector booted. Press START RUN, then use A/D, W, SHIFT, DOWN, and E.", 999);
}

function startRun() {
  resetGame();
  state = "playing";
  ui.start.classList.add("hidden");
  ui.pause.classList.add("hidden");
  ui.end.classList.add("hidden");
  setLog("Run live. Follow the cyan platforms and watch the moving edges.");
}

function buildWorld() {
  platforms = [];
  coins = [];
  shards = [];
  enemies = [];
  spikes = [];
  lasers = [];
  crushers = [];
  drones = [];
  springs = [];
  switches = [];
  checkpoints = [];

  addPlatform({ id: "start-deck", x: -40, y: 610, w: 560, h: 88 });
  addPlatform({ x: 276, y: 432, w: 170, h: 26 });
  addPlatform({ id: "secret-wall", type: "breakable", x: 418, y: 546, w: 42, h: 64 });
  addPlatform({ type: "moving", x: 612, y: 555, w: 154, h: 24, rangeX: 170, speed: 0.024, phase: 0.2 });
  addPlatform({ x: 810, y: 470, w: 210, h: 28 });
  addPlatform({ type: "crumble", x: 1085, y: 488, w: 126, h: 24 });
  addPlatform({ x: 1220, y: 610, w: 312, h: 88 });
  addPlatform({ type: "moving", x: 1412, y: 452, w: 136, h: 24, rangeY: 132, speed: 0.026, phase: 1.6 });
  addPlatform({ x: 1578, y: 520, w: 186, h: 26 });
  addPlatform({ type: "moving", x: 1710, y: 444, w: 156, h: 24, rangeX: 230, speed: 0.02, phase: 2.8 });
  addPlatform({ x: 1908, y: 610, w: 272, h: 88 });
  addPlatform({ type: "crumble", x: 2026, y: 430, w: 124, h: 24 });
  addPlatform({ x: 2182, y: 530, w: 194, h: 26 });
  bridgePlatform = addPlatform({ id: "switch-bridge", active: false, x: 2314, y: 610, w: 256, h: 28 });
  addPlatform({ type: "moving", x: 2388, y: 552, w: 144, h: 24, rangeY: 104, speed: 0.029, phase: 0.7 });
  addPlatform({ x: 2568, y: 460, w: 252, h: 28 });
  addPlatform({ type: "crumble", x: 2712, y: 382, w: 118, h: 24 });
  addPlatform({ type: "moving", x: 2788, y: 536, w: 156, h: 24, rangeX: 168, speed: 0.022, phase: 4.1 });
  addPlatform({ x: 2914, y: 610, w: 560, h: 88 });
  addPlatform({ x: 3020, y: 420, w: 230, h: 26 });

  addCoins([
    [170, 570], [210, 570], [250, 570], [310, 392], [354, 392],
    [650, 514], [698, 508], [746, 514], [846, 430], [894, 430], [942, 430],
    [1278, 570], [1324, 570], [1370, 570], [1455, 406], [1502, 406],
    [1618, 478], [1666, 478], [1714, 478], [1958, 570], [2010, 390],
    [2060, 390], [2110, 390], [2250, 490], [2300, 490], [2460, 512],
    [2608, 420], [2656, 420], [2704, 420], [2805, 340], [2968, 570],
    [3016, 570], [3064, 570], [3112, 570]
  ]);

  addShard(492, 565, true);
  addShard(380, 392, false);
  addShard(848, 318, false);
  addShard(2078, 388, false);
  addShard(2364, 570, false);
  addShard(3128, 382, false);

  enemies.push({ x: 850, y: 430, w: 38, h: 40, minX: 820, maxX: 1004, vx: 1.1, dead: false, color: "red" });
  enemies.push({ x: 1606, y: 480, w: 38, h: 40, minX: 1584, maxX: 1746, vx: 1.25, dead: false, color: "blue" });
  enemies.push({ x: 2948, y: 570, w: 38, h: 40, minX: 2924, maxX: 3196, vx: 1.45, dead: false, color: "blue" });

  spikes.push({ x: 532, y: 586, w: 118, h: 24 });
  spikes.push({ x: 1130, y: 586, w: 84, h: 24 });
  spikes.push({ x: 1805, y: 586, w: 86, h: 24 });
  spikes.push({ x: 2844, y: 586, w: 70, h: 24 });

  lasers.push({ x: 1524, y: 382, w: 14, h: 142, period: 146, activeFor: 86, offset: 0 });
  lasers.push({ x: 1968, y: 492, w: 212, h: 12, period: 170, activeFor: 86, offset: 54, disabledBySwitch: true });
  lasers.push({ x: 2702, y: 460, w: 12, h: 150, period: 132, activeFor: 66, offset: 40 });

  crushers.push({ x: 1800, baseY: 216, y: 216, w: 72, h: 94, rangeY: 190, speed: 0.036, phase: 0.5 });
  crushers.push({ x: 2875, baseY: 226, y: 226, w: 64, h: 110, rangeY: 188, speed: 0.032, phase: 2.1 });

  drones.push({ baseX: 1170, baseY: 372, x: 1170, y: 372, r: 16, rangeX: 76, rangeY: 34, speed: 0.035, phase: 1.4 });
  drones.push({ baseX: 2480, baseY: 344, x: 2480, y: 344, r: 18, rangeX: 150, rangeY: 70, speed: 0.024, phase: 0.1 });

  springs.push({ x: 1284, y: 592, w: 48, h: 18 });
  springs.push({ x: 2038, y: 592, w: 48, h: 18 });

  switches.push({ x: 2220, y: 486, w: 42, h: 44, on: false });
  checkpoints.push({ x: 1245, y: 548, w: 28, h: 62, active: false });
  checkpoints.push({ x: 2590, y: 398, w: 28, h: 62, active: false });

  keyItem = { x: 2738, y: 420, w: 24, h: 34, taken: false };
  gate = { x: 3260, y: 526, w: 80, h: 84, open: false };
}

function addPlatform(config) {
  const platform = {
    id: config.id || "",
    type: config.type || "static",
    x: config.x,
    y: config.y,
    w: config.w,
    h: config.h,
    baseX: config.x,
    baseY: config.y,
    prevX: config.x,
    prevY: config.y,
    rangeX: config.rangeX || 0,
    rangeY: config.rangeY || 0,
    speed: config.speed || 0,
    phase: config.phase || 0,
    active: config.active !== false,
    crumbleTimer: 0,
    respawnTimer: 0,
    broken: false
  };
  platforms.push(platform);
  return platform;
}

function addCoins(points) {
  points.forEach(([x, y]) => coins.push({ x, y, r: 11, taken: false }));
}

function addShard(x, y, secret) {
  shards.push({ x, y, r: 15, taken: false, secret });
}

function buildDecor() {
  randomSeed(77);
  stars = [];
  buildings = [];
  ships = [];

  for (let i = 0; i < 210; i++) {
    stars.push({
      x: random(WORLD_W * 0.18),
      y: random(14, 328),
      size: random([1, 1, 1, 2]),
      layer: random(0.1, 0.32),
      color: random(["#29f4ff", "#7c5dff", "#ffffff", "#ff3bbd"])
    });
  }

  for (let i = 0; i < 70; i++) {
    buildings.push({
      x: i * 72 + random(-18, 18),
      w: random(42, 118),
      h: random(130, 415),
      y: random(252, 360),
      layer: random([0.18, 0.28, 0.42, 0.58]),
      color: random(["#08163b", "#0b2253", "#151446", "#102a3b", "#21133d"]),
      sign: random(["NEO", "07", "RIFT", "MIRA", "RUN", "VOLT"])
    });
  }

  for (let i = 0; i < 9; i++) {
    ships.push({
      x: random(160, WORLD_W - 250),
      y: random(54, 210),
      speed: random(0.16, 0.42),
      layer: random(0.22, 0.42),
      color: random(["#29f4ff", "#ff3bbd", "#8e54ff"])
    });
  }
}

function updateGame(dt) {
  gameTime += dt;
  player.prevX = player.x;
  player.prevY = player.y;
  updatePlatforms(dt);
  updateMovingHazards(dt);

  if (player.groundPlatform && player.groundPlatform.active) {
    player.x += player.groundPlatform.x - player.groundPlatform.prevX;
    player.y += player.groundPlatform.y - player.groundPlatform.prevY;
  }

  updatePlayerInput(dt);
  updatePlayerPhysics(dt);
  updateEnemies(dt);
  updateInteractions();
  updateParticles(dt);
  updateCamera(dt);
  updateHud();

  if (messageTimer > 0) {
    messageTimer -= dt;
  }
}

function updatePlatforms(dt) {
  platforms.forEach(platform => {
    platform.prevX = platform.x;
    platform.prevY = platform.y;

    if (platform.type === "moving") {
      platform.x = platform.baseX + Math.sin(gameTime * platform.speed + platform.phase) * platform.rangeX;
      platform.y = platform.baseY + Math.sin(gameTime * platform.speed + platform.phase) * platform.rangeY;
    }

    if (platform.type === "crumble") {
      if (platform.crumbleTimer > 0) {
        platform.crumbleTimer += dt;
        if (platform.crumbleTimer > 48) {
          platform.active = false;
          platform.crumbleTimer = 0;
          platform.respawnTimer = 170;
          burst(platform.x + platform.w / 2, platform.y + platform.h / 2, "#ff3bbd", 18);
        }
      } else if (!platform.active) {
        platform.respawnTimer -= dt;
        if (platform.respawnTimer <= 0) {
          platform.active = true;
        }
      }
    }
  });
}

function updateMovingHazards(dt) {
  crushers.forEach(crusher => {
    crusher.prevY = crusher.y;
    crusher.y = crusher.baseY + (Math.sin(gameTime * crusher.speed + crusher.phase) + 1) * 0.5 * crusher.rangeY;
  });

  drones.forEach(drone => {
    drone.x = drone.baseX + Math.sin(gameTime * drone.speed + drone.phase) * drone.rangeX;
    drone.y = drone.baseY + Math.cos(gameTime * drone.speed * 1.3 + drone.phase) * drone.rangeY;
  });
}

function updatePlayerInput(dt) {
  const left = keys.has("KeyA") || keys.has("ArrowLeft") || touchHold.left;
  const right = keys.has("KeyD") || keys.has("ArrowRight") || touchHold.right;
  const down = keys.has("KeyS") || keys.has("ArrowDown");
  const jumpPressed = pressed.has("KeyW") || pressed.has("ArrowUp") || pressed.has("Space") || touchTap.jump;
  const dashPressed = pressed.has("ShiftLeft") || pressed.has("ShiftRight") || touchTap.dash;

  if (jumpPressed) {
    player.jumpBuffer = 9;
  } else if (player.jumpBuffer > 0) {
    player.jumpBuffer -= dt;
  }

  const accel = player.onGround ? 1.35 : 0.78;
  if (left) {
    player.vx -= accel * dt;
    player.facing = -1;
  }
  if (right) {
    player.vx += accel * dt;
    player.facing = 1;
  }

  if (!left && !right && player.onGround) {
    player.vx *= Math.pow(0.76, dt);
  } else {
    player.vx *= Math.pow(0.93, dt);
  }

  if (player.jumpBuffer > 0 && player.coyote > 0) {
    player.vy = -15.3;
    player.onGround = false;
    player.groundPlatform = null;
    player.coyote = 0;
    player.jumpBuffer = 0;
    burst(player.x + player.w / 2, player.y + player.h, "#29f4ff", 12);
    setLog("Jump arc locked. Land on bright platform edges.");
  }

  if (down && !player.onGround) {
    player.vy += 1.35 * dt;
  }

  if (dashPressed && player.dashCooldown <= 0) {
    player.dashTime = 12;
    player.dashCooldown = 52;
    player.vx = player.facing * 15.5;
    player.vy *= 0.32;
    burst(player.x + player.w / 2, player.y + player.h / 2, "#46ffb1", 18);
    setLog("Dash online. Cracked walls can be broken during dash.");
  }
}

function updatePlayerPhysics(dt) {
  player.coyote -= dt;
  player.dashCooldown -= dt;
  player.dashTime -= dt;
  player.invuln -= dt;

  player.vx = constrain(player.vx, -8.4, 8.4);
  if (player.dashTime > 0) {
    player.vx = player.facing * 15.5;
  }

  player.vy += GRAVITY * dt;
  player.vy = Math.min(player.vy, MAX_FALL);
  player.onGround = false;
  player.groundPlatform = null;

  moveAxis("x", player.vx * dt);
  moveAxis("y", player.vy * dt);

  player.x = constrain(player.x, 8, WORLD_W - player.w - 8);

  if (player.y > WORLD_H + 90) {
    loseAndRespawn("Void fall. Rewinding to checkpoint.");
  }
}

function moveAxis(axis, delta) {
  if (delta === 0) return;

  if (axis === "x") {
    player.x += delta;
  } else {
    player.y += delta;
  }

  const solids = getSolidPlatforms();
  for (const solid of solids) {
    if (!rectsOverlap(player, solid)) continue;

    if (solid.type === "breakable" && player.dashTime > 0 && axis === "x") {
      breakWall(solid);
      continue;
    }

    if (axis === "x") {
      if (delta > 0) {
        player.x = solid.x - player.w;
      } else {
        player.x = solid.x + solid.w;
      }
      player.vx = 0;
    } else {
      if (delta > 0) {
        player.y = solid.y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.coyote = 9;
        player.groundPlatform = solid;
        if (solid.type === "crumble" && solid.crumbleTimer <= 0) {
          solid.crumbleTimer = 1;
          setLog("Crumbling tile armed. Keep moving.");
        }
      } else {
        player.y = solid.y + solid.h;
        player.vy = 0;
      }
    }
  }
}

function getSolidPlatforms() {
  return platforms.filter(platform => platform.active && !platform.broken);
}

function breakWall(wall) {
  wall.broken = true;
  wall.active = false;
  burst(wall.x + wall.w / 2, wall.y + wall.h / 2, "#ffd447", 34);
  setLog("Cracked wall broken. Secret route exposed.");
}

function updateEnemies(dt) {
  enemies.forEach(enemy => {
    if (enemy.dead) return;
    enemy.x += enemy.vx * dt;
    if (enemy.x < enemy.minX || enemy.x + enemy.w > enemy.maxX) {
      enemy.vx *= -1;
      enemy.x = constrain(enemy.x, enemy.minX, enemy.maxX - enemy.w);
    }

    if (rectsOverlap(player, enemy) && player.invuln <= 0) {
      const stomp = player.vy > 1 && player.prevY + player.h <= enemy.y + 14;
      if (stomp) {
        enemy.dead = true;
        player.vy = -11.8;
        player.coins += 20;
        burst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#ffd447", 24);
        setLog("Bot stomped. Coins routed to wallet.");
      } else {
        hurt(1, player.x < enemy.x ? -8 : 8, -7, "Bot collision. Stomp from above to defeat.");
      }
    }
  });
}

function updateInteractions() {
  collectCoins();
  collectShards();
  collectKey();
  checkSprings();
  checkHazards();
  checkSwitches();
  checkCheckpoints();
  checkGate();
}

function collectCoins() {
  coins.forEach(coin => {
    if (coin.taken) return;
    if (circleRectOverlap({ x: coin.x, y: coin.y, r: coin.r }, player)) {
      coin.taken = true;
      player.coins += 1;
      burst(coin.x, coin.y, "#ffd447", 12);
      if (player.coins % 10 === 0) {
        setLog("Coin chain rising. Keep the route clean.");
      }
    }
  });
}

function collectShards() {
  shards.forEach(shard => {
    if (shard.taken) return;
    if (circleRectOverlap({ x: shard.x, y: shard.y, r: shard.r }, player)) {
      shard.taken = true;
      player.shards += 1;
      burst(shard.x, shard.y, "#b96aff", 20);
      setLog(shard.secret ? "Hidden shard recovered from the cracked wall." : "Rift shard recovered.");
    }
  });
}

function collectKey() {
  if (keyItem.taken) return;
  if (rectsOverlap(player, keyItem)) {
    keyItem.taken = true;
    player.hasKey = true;
    burst(keyItem.x + keyItem.w / 2, keyItem.y + keyItem.h / 2, "#ffd447", 28);
    setLog("Sector key acquired. The final neon gate will answer.");
  }
}

function checkSprings() {
  springs.forEach(spring => {
    if (!rectsOverlap(player, spring)) return;
    const fromTop = player.prevY + player.h <= spring.y + 11 && player.vy >= 0;
    if (fromTop) {
      player.y = spring.y - player.h;
      player.vy = -20.2;
      player.onGround = false;
      player.groundPlatform = null;
      burst(spring.x + spring.w / 2, spring.y, "#46ffb1", 20);
      setLog("Spring boost. Hold right for a long neon arc.");
    }
  });
}

function checkHazards() {
  spikes.forEach(spike => {
    const hitBox = { x: spike.x + 4, y: spike.y + 8, w: spike.w - 8, h: spike.h };
    if (rectsOverlap(player, hitBox)) {
      hurt(1, player.x < spike.x + spike.w / 2 ? -7 : 7, -9, "Spike rail hit.");
    }
  });

  lasers.forEach(laser => {
    if (laser.disabledBySwitch && switches.some(item => item.on)) return;
    if (!isLaserActive(laser)) return;
    if (rectsOverlap(player, laser)) {
      hurt(1, player.x < laser.x + laser.w / 2 ? -8 : 8, -6, "Timed laser burned the shield.");
    }
  });

  crushers.forEach(crusher => {
    if (rectsOverlap(player, crusher)) {
      hurt(2, player.x < crusher.x + crusher.w / 2 ? -10 : 10, -12, "Crusher impact. Time the opening.");
    }
  });

  drones.forEach(drone => {
    if (circleRectOverlap(drone, player)) {
      hurt(1, player.x < drone.x ? -8 : 8, -8, "Patrol drone clipped the runner.");
    }
  });
}

function checkSwitches() {
  const usePressed = pressed.has("KeyE");
  switches.forEach(item => {
    const near = rectsOverlap(expandRect(player, 18), item);
    if (near && !item.on) {
      ui.mission.textContent = "Press E at the switch to phase in the bridge and shut down the long laser.";
    }

    if (near && usePressed && !item.on) {
      item.on = true;
      if (bridgePlatform) {
        bridgePlatform.active = true;
      }
      burst(item.x + item.w / 2, item.y + 12, "#46ffb1", 24);
      setLog("Switch linked. Bridge materialized and laser grid cooled.");
    }
  });
}

function checkCheckpoints() {
  checkpoints.forEach(point => {
    if (rectsOverlap(player, point) && !point.active) {
      checkpoints.forEach(other => {
        other.active = false;
      });
      point.active = true;
      player.checkpoint = { x: point.x - 10, y: point.y - player.h + 10 };
      burst(point.x + point.w / 2, point.y + 10, "#29f4ff", 26);
      setLog("Checkpoint synced.");
    }
  });
}

function checkGate() {
  gate.open = player.hasKey;
  if (!rectsOverlap(player, gate)) return;

  if (!player.hasKey) {
    setLog("Gate locked. The sector key is above the high route.");
    return;
  }

  finishRun();
}

function hurt(amount, knockX, knockY, message) {
  if (player.invuln > 0 || state !== "playing") return;
  player.health -= amount;
  player.invuln = 80;
  player.vx = knockX;
  player.vy = knockY;
  burst(player.x + player.w / 2, player.y + player.h / 2, "#ff3b5c", 26);
  setLog(message);

  if (player.health <= 0) {
    endRun(false);
  }
}

function loseAndRespawn(message) {
  if (state !== "playing") return;
  player.health -= 1;
  burst(player.x + player.w / 2, VIEW_H - 20, "#ff3b5c", 22);
  if (player.health <= 0) {
    endRun(false);
    return;
  }

  player.x = player.checkpoint.x;
  player.y = player.checkpoint.y;
  player.vx = 0;
  player.vy = 0;
  player.invuln = 92;
  setLog(message);
}

function finishRun() {
  if (state !== "playing") return;
  state = "won";
  ui.endKicker.textContent = "MISSION CLEAR";
  ui.endTitle.textContent = "GATE BREACHED";
  ui.endCopy.textContent = `You cleared Sector 7 with ${player.coins} coins and ${player.shards}/6 rift shards.`;
  ui.end.classList.remove("hidden");
  burst(gate.x + gate.w / 2, gate.y + gate.h / 2, "#ffd447", 80);
  setLog("Gate breached. Sector 7 is clear.", 999);
}

function endRun(won) {
  state = won ? "won" : "lost";
  ui.endKicker.textContent = won ? "MISSION CLEAR" : "SIGNAL LOST";
  ui.endTitle.textContent = won ? "GATE BREACHED" : "RUN FAILED";
  ui.endCopy.textContent = won
    ? `You cleared Sector 7 with ${player.coins} coins and ${player.shards}/6 rift shards.`
    : `The runner lost signal with ${player.coins} coins and ${player.shards}/6 rift shards recovered.`;
  ui.end.classList.remove("hidden");
}

function updateCamera(dt) {
  const target = constrain(player.x + player.w / 2 - VIEW_W * 0.5, 0, WORLD_W - VIEW_W);
  camX += (target - camX) * Math.min(1, 0.09 * dt);
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 0.08 * dt;
    particle.life -= dt;
    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function burst(x, y, colorValue, count) {
  for (let i = 0; i < count; i++) {
    const angle = random(TWO_PI);
    const speed = random(1, 5.5);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: random(22, 56),
      size: random([2, 2, 3, 4]),
      color: colorValue
    });
  }
}

function renderGame() {
  drawSky();
  drawWorld();
  drawScreenHud();
  drawScanlines();
}

function drawSky() {
  noStroke();
  for (let y = 0; y < VIEW_H; y += 6) {
    const t = y / VIEW_H;
    const r = lerp(2, 6, t);
    const g = lerp(8, 4, t);
    const b = lerp(32, 14, t);
    fill(r, g, b);
    rect(0, y, VIEW_W, 6);
  }

  stars.forEach(star => {
    const x = wrapX(star.x - camX * star.layer, VIEW_W + 240) - 120;
    fill(star.color);
    rect(x, star.y, star.size, star.size);
  });

  drawMoon();
  drawBuildings();
  drawShips();
  drawHologram();
}

function drawMoon() {
  const x = 960 - camX * 0.08;
  const y = 122;
  noFill();
  stroke(142, 84, 255, 90);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    ellipse(x, y, 54 + i * 12, 54 + i * 12);
  }
  noStroke();
  fill(174, 122, 255, 40);
  circle(x, y, 72);
}

function drawBuildings() {
  buildings.forEach(building => {
    const x = building.x - camX * building.layer;
    if (x < -160 || x > VIEW_W + 160) return;
    const y = building.y + (1 - building.layer) * 120;
    const h = building.h;
    fill(building.color);
    rect(x, y, building.w, h);
    fill(0, 0, 0, 85);
    rect(x + 5, y + 7, building.w - 10, h - 14);

    const windowColor = building.layer > 0.4 ? "#29f4ff" : "#1a6eff";
    for (let wy = y + 18; wy < y + h - 18; wy += 22) {
      for (let wx = x + 10; wx < x + building.w - 10; wx += 18) {
        if ((floor(wx + wy + gameTime) % 5) !== 0) {
          fill(randomWindowColor(windowColor));
          rect(wx, wy, 7, 4);
        }
      }
    }

    if (building.w > 58 && building.layer > 0.36) {
      fill(building.sign === "07" ? "#ffd447" : "#ff3bbd");
      rect(x + building.w * 0.18, y + 20, building.w * 0.64, 28);
      fill("#061029");
      textSize(14);
      textAlign(CENTER, CENTER);
      text(building.sign, x + building.w * 0.5, y + 34);
    }
  });
}

function randomWindowColor(base) {
  const blink = (frameCount + floor(random(20))) % 40 < 34;
  if (!blink) return "rgba(0,0,0,0)";
  return random([base, "#ff3bbd", "#ffd447", "#46ffb1"]);
}

function drawShips() {
  ships.forEach(ship => {
    const x = wrapX(ship.x + gameTime * ship.speed * 18 - camX * ship.layer, VIEW_W + 260) - 120;
    const y = ship.y + Math.sin(gameTime * 0.018 + ship.x) * 8;
    noStroke();
    fill(20, 28, 64, 220);
    rect(x, y, 78, 16);
    rect(x + 20, y - 8, 42, 8);
    fill(ship.color);
    rect(x + 8, y + 4, 18, 4);
    rect(x + 48, y - 5, 20, 4);
    fill("#ff3bbd");
    rect(x - 12, y + 6, 14, 3);
  });
}

function drawHologram() {
  const x = 1050 - camX * 0.22;
  const y = 164;
  if (x < -100 || x > VIEW_W + 100) return;
  noFill();
  stroke(190, 104, 255, 90 + Math.sin(gameTime * 0.08) * 45);
  strokeWeight(3);
  ellipse(x, y, 46, 58);
  rect(x - 16, y + 34, 32, 88);
  line(x - 16, y + 52, x - 50, y + 90);
  line(x + 16, y + 52, x + 48, y + 88);
  line(x - 8, y + 122, x - 28, y + 170);
  line(x + 8, y + 122, x + 28, y + 170);
  strokeWeight(1);
  for (let i = 0; i < 7; i++) {
    line(x - 34, y + i * 24, x + 34, y + i * 24);
  }
  noStroke();
}

function drawWorld() {
  push();
  translate(-camX, 0);

  drawRouteGlow();
  platforms.forEach(drawPlatform);
  spikes.forEach(drawSpikes);
  springs.forEach(drawSpring);
  switches.forEach(drawSwitch);
  lasers.forEach(drawLaser);
  crushers.forEach(drawCrusher);
  checkpoints.forEach(drawCheckpoint);
  if (!keyItem.taken) drawKey(keyItem);
  shards.forEach(drawShard);
  coins.forEach(drawCoin);
  enemies.forEach(drawEnemy);
  drones.forEach(drawDrone);
  drawGate();
  particles.forEach(drawParticle);
  drawCallouts();
  drawPlayer();
  drawForegroundPipes();

  pop();
}

function drawRouteGlow() {
  noStroke();
  fill(41, 244, 255, 18);
  rect(0, 640, WORLD_W, 80);
  fill(255, 59, 189, 18);
  rect(0, 690, WORLD_W, 16);
}

function drawPlatform(platform) {
  if (!platform.active || platform.broken) {
    if (platform.type === "crumble" && !platform.active) {
      fill(41, 244, 255, 20);
      rect(platform.x, platform.y, platform.w, platform.h);
    }
    return;
  }

  const topColor = platform.type === "moving" ? "#1d7cff" : platform.type === "crumble" ? "#3a365a" : "#1a2548";
  const edgeColor = platform.type === "moving" ? "#29f4ff" : platform.type === "breakable" ? "#ffd447" : "#dcecff";
  const glowColor = platform.type === "moving" ? "#29f4ff" : "#ff3bbd";

  noStroke();
  fill(0, 0, 0, 90);
  rect(platform.x + 8, platform.y + platform.h + 10, platform.w - 16, 16);
  fill(topColor);
  rect(platform.x, platform.y, platform.w, platform.h);
  fill("#0a0d20");
  rect(platform.x + 4, platform.y + 8, platform.w - 8, platform.h - 8);
  fill(edgeColor);
  rect(platform.x, platform.y, platform.w, 5);
  fill(glowColor);
  rect(platform.x + 10, platform.y + platform.h - 6, platform.w - 20, 4);

  for (let x = platform.x + 8; x < platform.x + platform.w - 8; x += 34) {
    fill("#2f3c70");
    rect(x, platform.y + 10, 22, 3);
    fill("#060916");
    rect(x + 3, platform.y + platform.h - 15, 13, 4);
  }

  if (platform.type === "moving") {
    fill("#29f4ff");
    rect(platform.x + 20, platform.y + platform.h + 5, 20, 7);
    rect(platform.x + platform.w - 40, platform.y + platform.h + 5, 20, 7);
    fill(41, 244, 255, 55);
    triangle(platform.x + 22, platform.y + platform.h + 12, platform.x + 38, platform.y + platform.h + 12, platform.x + 30, platform.y + platform.h + 32);
    triangle(platform.x + platform.w - 38, platform.y + platform.h + 12, platform.x + platform.w - 22, platform.y + platform.h + 12, platform.x + platform.w - 30, platform.y + platform.h + 32);
  }

  if (platform.type === "breakable") {
    stroke("#ffd447");
    strokeWeight(2);
    line(platform.x + 8, platform.y + 10, platform.x + platform.w - 8, platform.y + 30);
    line(platform.x + platform.w - 10, platform.y + 12, platform.x + 8, platform.y + platform.h - 12);
    noStroke();
  }

  if (platform.type === "crumble" && platform.crumbleTimer > 0) {
    fill(255, 59, 189, map(platform.crumbleTimer, 0, 48, 25, 150));
    rect(platform.x, platform.y, platform.w, platform.h);
  }
}

function drawSpikes(spike) {
  fill("#061029");
  rect(spike.x, spike.y + spike.h - 5, spike.w, 8);
  for (let x = spike.x; x < spike.x + spike.w; x += 18) {
    fill("#dcecff");
    triangle(x, spike.y + spike.h, x + 9, spike.y, x + 18, spike.y + spike.h);
    fill("#ff3b5c");
    triangle(x + 5, spike.y + spike.h - 2, x + 9, spike.y + 8, x + 13, spike.y + spike.h - 2);
  }
}

function drawSpring(spring) {
  fill("#08182e");
  rect(spring.x, spring.y + 10, spring.w, 8);
  fill("#46ffb1");
  rect(spring.x + 4, spring.y, spring.w - 8, 7);
  stroke("#46ffb1");
  strokeWeight(3);
  line(spring.x + 12, spring.y + 8, spring.x + 20, spring.y + 18);
  line(spring.x + 20, spring.y + 18, spring.x + 30, spring.y + 8);
  line(spring.x + 30, spring.y + 8, spring.x + 38, spring.y + 18);
  noStroke();
}

function drawSwitch(item) {
  fill("#071125");
  rect(item.x + 4, item.y + 18, item.w - 8, item.h - 18);
  fill(item.on ? "#46ffb1" : "#ffd447");
  rect(item.x + 12, item.y + 8, item.w - 24, 16);
  stroke(item.on ? "#46ffb1" : "#ffd447");
  strokeWeight(4);
  line(item.x + item.w / 2, item.y + 18, item.x + item.w / 2 + (item.on ? 12 : -12), item.y - 10);
  noStroke();
}

function drawLaser(laser) {
  const disabled = laser.disabledBySwitch && switches.some(item => item.on);
  const active = isLaserActive(laser) && !disabled;
  fill("#081125");
  if (laser.h > laser.w) {
    rect(laser.x - 9, laser.y - 18, laser.w + 18, 18);
    rect(laser.x - 9, laser.y + laser.h, laser.w + 18, 18);
  } else {
    rect(laser.x - 18, laser.y - 9, 18, laser.h + 18);
    rect(laser.x + laser.w, laser.y - 9, 18, laser.h + 18);
  }
  fill(active ? "#ff3bbd" : "#183255");
  rect(laser.x, laser.y, laser.w, laser.h);
  if (active) {
    fill(255, 255, 255, 180);
    if (laser.h > laser.w) {
      rect(laser.x + laser.w / 2 - 2, laser.y, 4, laser.h);
    } else {
      rect(laser.x, laser.y + laser.h / 2 - 2, laser.w, 4);
    }
  }
}

function drawCrusher(crusher) {
  fill("#071125");
  rect(crusher.x + crusher.w / 2 - 5, 0, 10, crusher.y);
  fill("#1a2548");
  rect(crusher.x, crusher.y, crusher.w, crusher.h);
  fill("#ff3b5c");
  rect(crusher.x + 8, crusher.y + crusher.h - 9, crusher.w - 16, 6);
  fill("#ffd447");
  for (let x = crusher.x + 8; x < crusher.x + crusher.w - 12; x += 18) {
    rect(x, crusher.y + 12, 9, 5);
  }
}

function drawCheckpoint(point) {
  fill("#061029");
  rect(point.x + 10, point.y, 8, point.h);
  fill(point.active ? "#46ffb1" : "#29f4ff");
  rect(point.x + 18, point.y + 8, 32, 18);
  fill(point.active ? "rgba(70,255,177,0.18)" : "rgba(41,244,255,0.14)");
  rect(point.x - 4, point.y + point.h - 8, 62, 8);
}

function drawKey(item) {
  fill("#ffd447");
  rect(item.x, item.y + 12, 32, 9);
  rect(item.x + 21, item.y + 8, 8, 20);
  noFill();
  stroke("#ffd447");
  strokeWeight(5);
  ellipse(item.x + 5, item.y + 16, 18, 18);
  noStroke();
}

function drawShard(shard) {
  if (shard.taken) return;
  const pulse = Math.sin(gameTime * 0.08 + shard.x) * 3;
  fill(185, 106, 255, 55);
  ellipse(shard.x, shard.y, 44 + pulse, 54 + pulse);
  fill("#ffffff");
  quad(shard.x, shard.y - 22, shard.x + 15, shard.y - 2, shard.x, shard.y + 23, shard.x - 15, shard.y - 2);
  fill("#b96aff");
  quad(shard.x, shard.y - 16, shard.x + 10, shard.y - 2, shard.x, shard.y + 17, shard.x - 10, shard.y - 2);
  fill("#ff3bbd");
  rect(shard.x - 2, shard.y - 10, 4, 20);
}

function drawCoin(coin) {
  if (coin.taken) return;
  const pulse = Math.sin(gameTime * 0.12 + coin.x) * 2;
  fill(255, 212, 71, 40);
  circle(coin.x, coin.y, 34 + pulse);
  fill("#ff9c1a");
  ellipse(coin.x, coin.y, 20, 26);
  fill("#ffd447");
  ellipse(coin.x, coin.y, 13, 22);
  fill("#fff0a5");
  rect(coin.x - 2, coin.y - 9, 4, 18);
}

function drawEnemy(enemy) {
  if (enemy.dead) return;
  const body = enemy.color === "red" ? "#ff3b5c" : "#29f4ff";
  fill(body);
  rect(enemy.x, enemy.y + 10, enemy.w, enemy.h - 10);
  fill("#061029");
  rect(enemy.x + 7, enemy.y + 18, enemy.w - 14, 10);
  fill("#ffffff");
  rect(enemy.x + (enemy.vx > 0 ? 23 : 9), enemy.y + 20, 6, 5);
  fill("#ffd447");
  rect(enemy.x + 8, enemy.y + enemy.h - 6, 8, 6);
  rect(enemy.x + enemy.w - 16, enemy.y + enemy.h - 6, 8, 6);
  fill(body);
  rect(enemy.x + 10, enemy.y, enemy.w - 20, 12);
}

function drawDrone(drone) {
  fill(255, 59, 189, 55);
  circle(drone.x, drone.y, drone.r * 4);
  fill("#ff3bbd");
  circle(drone.x, drone.y, drone.r * 2);
  fill("#061029");
  rect(drone.x - 10, drone.y - 5, 20, 10);
  fill("#29f4ff");
  rect(drone.x - 4, drone.y - 3, 8, 6);
  fill("#ffd447");
  rect(drone.x - 2, drone.y - drone.r - 6, 4, 5);
}

function drawGate() {
  const open = player.hasKey;
  const pulse = Math.sin(gameTime * 0.09) * 4;
  fill("#061029");
  rect(gate.x - 12, gate.y - 18, gate.w + 24, gate.h + 28);
  fill(open ? "#29f4ff" : "#10224d");
  rect(gate.x, gate.y, gate.w, gate.h);
  fill("#020510");
  rect(gate.x + 12, gate.y + 10, gate.w - 24, gate.h - 12);
  fill(open ? "rgba(41,244,255,0.35)" : "rgba(255,59,92,0.18)");
  rect(gate.x + 22, gate.y + 20, gate.w - 44, gate.h - 30);
  noFill();
  stroke(open ? "#46ffb1" : "#ff3b5c");
  strokeWeight(4);
  rect(gate.x + 8 - pulse * 0.15, gate.y + 7 - pulse * 0.15, gate.w - 16 + pulse * 0.3, gate.h - 4 + pulse * 0.3);
  noStroke();
}

function drawParticle(particle) {
  const c = color(particle.color);
  c.setAlpha(constrain(particle.life * 6, 0, 255));
  fill(c);
  rect(particle.x, particle.y, particle.size, particle.size);
}

function drawCallouts() {
  drawCallout(560, 302, "JUMP ACROSS", "MOVING PLATFORMS", 675, 545);
  drawCallout(924, 286, "STOMP BOTS", "FROM ABOVE", 870, 430);
  drawCallout(418, 500, "CRACKED WALL", "DASH TO BREAK", 438, 560);
  drawCallout(1538, 330, "TIMED LASERS", "WATCH THE PULSE", 1528, 420);
  drawCallout(1288, 540, "SPRING BOOST", "LONG ARC", 1308, 592);
  drawCallout(2188, 448, "HIT SWITCH", "BRIDGE ONLINE", 2242, 486);
}

function drawCallout(x, y, lineOne, lineTwo, targetX, targetY) {
  if (x < camX - 160 || x > camX + VIEW_W + 160) return;
  stroke("#e9fbff");
  strokeWeight(2);
  line(x, y + 30, targetX, targetY);
  fill("#e9fbff");
  triangle(targetX, targetY, targetX - 8, targetY - 2, targetX - 3, targetY - 10);
  noStroke();
  fill("#ffd447");
  textSize(18);
  textAlign(LEFT, TOP);
  text(lineOne, x, y);
  fill("#e9fbff");
  text(lineTwo, x, y + 21);
}

function drawForegroundPipes() {
  fill(1, 5, 14, 180);
  rect(camX - 20, 675, VIEW_W + 40, 45);
  fill("#0b1832");
  for (let x = Math.floor(camX / 180) * 180 - 180; x < camX + VIEW_W + 180; x += 180) {
    rect(x, 688, 130, 12);
    fill("#29f4ff");
    rect(x + 12, 691, 28, 3);
    fill("#0b1832");
  }
}

function drawPlayer() {
  const blink = player.invuln > 0 && frameCount % 8 < 4;
  if (blink) return;

  const x = player.x;
  const y = player.y;
  const f = player.facing;
  const runBob = player.onGround ? Math.sin(gameTime * 0.34) * Math.min(3, Math.abs(player.vx) * 0.35) : 0;

  fill(41, 244, 255, 36);
  ellipse(x + player.w / 2, y + player.h / 2, 68, 58);

  fill("#071125");
  rect(x + 8, y + 23 + runBob, 18, 20);
  fill("#1e8eff");
  rect(x + 5, y + 24 + runBob, 24, 10);
  fill("#29f4ff");
  rect(x + 7, y + 34 + runBob, 18, 5);
  fill("#11182d");
  rect(x + 7, y + 39 + runBob, 8, 13);
  rect(x + 20, y + 39 - runBob, 8, 13);
  fill("#ffd4a8");
  rect(x + 9, y + 9, 18, 17);
  fill("#071125");
  rect(x + (f > 0 ? 22 : 8), y + 15, 4, 4);
  fill("#0c57ff");
  rect(x + 3, y + 5, 26, 7);
  fill("#29f4ff");
  rect(x + 7, y, 16, 6);
  rect(x - 2, y + 8, 14, 6);
  rect(x + 20, y + 4, 14, 6);
  fill("#ff3bbd");
  rect(x - f * 18 + 12, y + 28, 18, 5);
  fill("#071125");
  rect(x + (f > 0 ? 28 : -4), y + 27 + runBob, 8, 9);
  fill("#46ffb1");
  rect(x + (f > 0 ? 31 : -5), y + 29 + runBob, 5, 5);

  if (player.dashTime > 0) {
    fill(70, 255, 177, 80);
    rect(x - f * 42, y + 18, 46, 12);
    rect(x - f * 62, y + 24, 30, 6);
  }
}

function drawScreenHud() {
  drawMiniMap();

  if (state === "playing") {
    fill(233, 251, 255, 170);
    textAlign(LEFT, BOTTOM);
    textSize(12);
    text("A/D OR ARROWS RUN   W/SPACE JUMP   SHIFT DASH   E SWITCH   P/ESC PAUSE", 18, VIEW_H - 20);
  }
}

function drawMiniMap() {
  const x = VIEW_W - 280;
  const y = 122;
  const w = 252;
  const h = 94;
  fill(3, 7, 19, 230);
  stroke("#29f4ff");
  strokeWeight(2);
  rect(x, y, w, h);
  noStroke();
  fill("#29f4ff");
  textAlign(LEFT, TOP);
  textSize(14);
  text("SECTOR MAP", x + 12, y + 9);
  const mapX = x + 14;
  const mapY = y + 36;
  const mapW = w - 28;
  const scaleX = mapW / WORLD_W;
  fill("#173a65");
  platforms.forEach(platform => {
    if (!platform.active || platform.broken) return;
    rect(mapX + platform.x * scaleX, mapY + platform.y * 0.065, Math.max(2, platform.w * scaleX), 2);
  });
  fill("#ffd447");
  rect(mapX + gate.x * scaleX, mapY + gate.y * 0.065 - 4, 5, 8);
  fill("#ff3bbd");
  rect(mapX + camX * scaleX, mapY + 55, VIEW_W * scaleX, 4);
  fill("#29f4ff");
  circle(mapX + (player.x + player.w / 2) * scaleX, mapY + (player.y + player.h / 2) * 0.065, 6);
}

function drawScanlines() {
  noStroke();
  fill(0, 0, 0, 34);
  for (let y = 0; y < VIEW_H; y += 4) {
    rect(0, y, VIEW_W, 1);
  }

  noFill();
  for (let i = 0; i < 15; i++) {
    stroke(0, 0, 0, i * 12);
    rect(i * 5, i * 4, VIEW_W - i * 10, VIEW_H - i * 8);
  }
  noStroke();
}

function isLaserActive(laser) {
  const cycle = (gameTime + laser.offset) % laser.period;
  return cycle < laser.activeFor;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function circleRectOverlap(circleShape, rectShape) {
  const cx = constrain(circleShape.x, rectShape.x, rectShape.x + rectShape.w);
  const cy = constrain(circleShape.y, rectShape.y, rectShape.y + rectShape.h);
  return dist(circleShape.x, circleShape.y, cx, cy) < circleShape.r;
}

function expandRect(rectShape, amount) {
  return {
    x: rectShape.x - amount,
    y: rectShape.y - amount,
    w: rectShape.w + amount * 2,
    h: rectShape.h + amount * 2
  };
}

function wrapX(value, widthValue) {
  return ((value % widthValue) + widthValue) % widthValue;
}

function setLog(text, ttl) {
  ui.status.textContent = `> ${text}`;
  messageTimer = ttl || 150;
}

function updateHud() {
  ui.hearts.innerHTML = "";
  for (let i = 0; i < player.maxHealth; i++) {
    const heart = document.createElement("span");
    heart.className = i < player.health ? "heart" : "heart empty";
    ui.hearts.appendChild(heart);
  }
  ui.coins.textContent = player.coins;
  ui.shards.textContent = `${player.shards}/6`;
  ui.key.textContent = player.hasKey ? "KEY OK" : "NO KEY";
  ui.level.textContent = "07";

  if (player.hasKey) {
    ui.mission.textContent = "Sector key online. Reach the gold gate at the far right.";
  } else if (player.shards >= 4) {
    ui.mission.textContent = "Shard haul is strong. Climb the high route for the sector key.";
  } else if (!switches.some(item => item.on) && player.x > 2000) {
    ui.mission.textContent = "Find the yellow switch to phase in the bridge.";
  } else if (messageTimer <= 0) {
    ui.mission.textContent = "Collect the sector key, raid hidden shards, and reach the neon gate.";
  }
}

function togglePause() {
  if (state === "playing") {
    state = "paused";
    ui.pause.classList.remove("hidden");
    setLog("Run paused. Press continue or P to resume.", 999);
  } else if (state === "paused") {
    state = "playing";
    ui.pause.classList.add("hidden");
    setLog("Run resumed.");
  }
}

window.addEventListener("keydown", event => {
  const handled = [
    "KeyA", "KeyD", "KeyS", "KeyW", "KeyE", "KeyP",
    "ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp",
    "Space", "ShiftLeft", "ShiftRight", "Escape"
  ];
  if (handled.includes(event.code)) {
    event.preventDefault();
  }

  if (!event.repeat) {
    pressed.add(event.code);
  }
  keys.add(event.code);

  if (event.code === "Escape" || event.code === "KeyP") {
    togglePause();
  }
});

window.addEventListener("keyup", event => {
  keys.delete(event.code);
});

document.querySelectorAll("[data-hold]").forEach(button => {
  const direction = button.dataset.hold;
  const activate = event => {
    event.preventDefault();
    touchHold[direction] = true;
  };
  const release = event => {
    event.preventDefault();
    touchHold[direction] = false;
  };
  button.addEventListener("pointerdown", activate);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
});

document.querySelectorAll("[data-tap]").forEach(button => {
  button.addEventListener("pointerdown", event => {
    event.preventDefault();
    touchTap[button.dataset.tap] = true;
  });
});

ui.startButton.addEventListener("click", startRun);
ui.resumeButton.addEventListener("click", togglePause);
ui.resetButton.addEventListener("click", startRun);
ui.retryButton.addEventListener("click", startRun);

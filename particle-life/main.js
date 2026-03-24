'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// --- Species ---

const SPECIES_COLORS = ['#ff4060', '#40ff60', '#4080ff', '#ffff40', '#ff40ff', '#40ffff'];
const NUM_SPECIES = SPECIES_COLORS.length;

// --- Rules matrix ---

let rules = []; // rules[i][j] = force that species j exerts on species i

function randomRules() {
  rules = [];
  for (let i = 0; i < NUM_SPECIES; i++) {
    rules[i] = [];
    for (let j = 0; j < NUM_SPECIES; j++) {
      rules[i][j] = Math.random() * 2 - 1; // range [-1, 1]
    }
  }
  renderMatrix();
}

function getForce(speciesA, speciesB) {
  return rules[speciesA][speciesB];
}

// --- Particles ---

const DEFAULT_PARTICLE_COUNT = 600;
let particles = [];

function createParticle(species) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: 0,
    vy: 0,
    species: species
  };
}

function initParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(i % NUM_SPECIES));
  }
}

function setParticleCount(count) {
  while (particles.length > count) particles.pop();
  while (particles.length < count) {
    particles.push(createParticle(particles.length % NUM_SPECIES));
  }
}

// --- Spatial grid ---

let grid = [];
let gridCols = 0;
let gridRows = 0;
const CELL_SIZE = 150;

function buildGrid() {
  const w = canvas.width;
  const h = canvas.height;
  gridCols = Math.ceil(w / CELL_SIZE);
  gridRows = Math.ceil(h / CELL_SIZE);
  const totalCells = gridCols * gridRows;

  if (grid.length !== totalCells) {
    grid = new Array(totalCells);
    for (let i = 0; i < totalCells; i++) grid[i] = [];
  } else {
    for (let i = 0; i < totalCells; i++) grid[i].length = 0;
  }

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const col = Math.floor(p.x / CELL_SIZE) % gridCols;
    const row = Math.floor(p.y / CELL_SIZE) % gridRows;
    grid[row * gridCols + col].push(i);
  }
}

// --- Physics ---

const RADIUS = 150;
let friction = 0.5;

function updatePhysics() {
  const w = canvas.width;
  const h = canvas.height;
  const halfW = w * 0.5;
  const halfH = h * 0.5;
  const rSq = RADIUS * RADIUS;
  const n = particles.length;

  buildGrid();

  for (let i = 0; i < n; i++) {
    const a = particles[i];
    let fx = 0;
    let fy = 0;

    const col = Math.floor(a.x / CELL_SIZE) % gridCols;
    const row = Math.floor(a.y / CELL_SIZE) % gridRows;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = (row + dr + gridRows) % gridRows;
        const nc = (col + dc + gridCols) % gridCols;
        const cell = grid[nr * gridCols + nc];

        for (let k = 0; k < cell.length; k++) {
          const j = cell[k];
          if (i === j) continue;
          const b = particles[j];

          let dx = b.x - a.x;
          let dy = b.y - a.y;
          if (dx > halfW) dx -= w;
          else if (dx < -halfW) dx += w;
          if (dy > halfH) dy -= h;
          else if (dy < -halfH) dy += h;

          const distSq = dx * dx + dy * dy;
          if (distSq >= rSq || distSq < 1) continue;

          const dist = Math.sqrt(distSq);
          const force = getForce(a.species, b.species);
          const strength = force * (1 - dist / RADIUS);
          fx += (dx / dist) * strength;
          fy += (dy / dist) * strength;
        }
      }
    }

    a.vx = (a.vx + fx) * friction;
    a.vy = (a.vy + fy) * friction;
  }

  for (let i = 0; i < n; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x += w;
    else if (p.x >= w) p.x -= w;
    if (p.y < 0) p.y += h;
    else if (p.y >= h) p.y -= h;
  }
}

// --- Rendering ---

const PARTICLE_RADIUS = 2.5;
const GLOW_SIZE = 16; // total sprite size including glow halo

// Pre-render glow sprites per species (avoids expensive per-frame shadowBlur)
const glowSprites = SPECIES_COLORS.map(function(color) {
  const size = GLOW_SIZE * 2;
  const off = document.createElement('canvas');
  off.width = size;
  off.height = size;
  const c = off.getContext('2d');
  const cx = size / 2;

  // Radial gradient for glow halo
  const grad = c.createRadialGradient(cx, cx, PARTICLE_RADIUS, cx, cx, GLOW_SIZE);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'transparent');
  c.fillStyle = grad;
  c.fillRect(0, 0, size, size);

  // Solid core
  c.beginPath();
  c.arc(cx, cx, PARTICLE_RADIUS, 0, Math.PI * 2);
  c.fillStyle = color;
  c.fill();

  return off;
});

function draw() {
  // Motion trails: semi-transparent clear instead of full clear
  ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const offset = GLOW_SIZE; // center the sprite on particle position
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.drawImage(glowSprites[p.species], p.x - offset, p.y - offset);
  }
}

// --- Rules matrix UI ---

const matrixEl = document.getElementById('rules-matrix');

function forceToColor(v) {
  // -1 = red, 0 = white, +1 = green
  if (v >= 0) {
    const t = v;
    const r = Math.round(255 * (1 - t));
    const g = 255;
    const b = Math.round(255 * (1 - t));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else {
    const t = -v;
    const r = 255;
    const g = Math.round(255 * (1 - t));
    const b = Math.round(255 * (1 - t));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
}

function renderMatrix() {
  if (!matrixEl) return;
  matrixEl.innerHTML = '';

  const table = document.createElement('table');

  // Header row with species color indicators
  const headerRow = document.createElement('tr');
  headerRow.appendChild(document.createElement('th')); // empty corner
  for (let j = 0; j < NUM_SPECIES; j++) {
    const th = document.createElement('th');
    th.style.background = SPECIES_COLORS[j];
    th.style.width = '24px';
    th.style.height = '12px';
    th.style.borderRadius = '3px';
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let i = 0; i < NUM_SPECIES; i++) {
    const tr = document.createElement('tr');

    // Row header
    const rowHeader = document.createElement('th');
    rowHeader.style.background = SPECIES_COLORS[i];
    rowHeader.style.width = '12px';
    rowHeader.style.height = '24px';
    rowHeader.style.borderRadius = '3px';
    tr.appendChild(rowHeader);

    for (let j = 0; j < NUM_SPECIES; j++) {
      const td = document.createElement('td');
      const val = rules[i][j];
      td.style.background = forceToColor(val);
      td.style.width = '24px';
      td.style.height = '24px';
      td.style.cursor = 'pointer';
      td.style.borderRadius = '3px';
      td.title = val.toFixed(2);
      td.dataset.row = i;
      td.dataset.col = j;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  matrixEl.appendChild(table);
}

// Matrix interaction: click to cycle, drag to fine-tune
if (matrixEl) {
  let dragging = null;
  let dragStartY = 0;
  let dragStartVal = 0;

  matrixEl.addEventListener('mousedown', function(e) {
    const td = e.target.closest('td');
    if (!td || td.dataset.row === undefined) return;
    const r = parseInt(td.dataset.row);
    const c = parseInt(td.dataset.col);
    dragging = { r: r, c: c, el: td };
    dragStartY = e.clientY;
    dragStartVal = rules[r][c];
    e.preventDefault();
  });

  window.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    // Drag up = increase, down = decrease. 100px = full range
    const delta = (dragStartY - e.clientY) / 100;
    const val = Math.max(-1, Math.min(1, dragStartVal + delta));
    rules[dragging.r][dragging.c] = val;
    dragging.el.style.background = forceToColor(val);
    dragging.el.title = val.toFixed(2);
  });

  window.addEventListener('mouseup', function() {
    if (dragging) dragging = null;
  });

  matrixEl.addEventListener('click', function(e) {
    const td = e.target.closest('td');
    if (!td || td.dataset.row === undefined) return;
    // Only cycle if it wasn't a drag
    if (dragging) return;
    const r = parseInt(td.dataset.row);
    const c = parseInt(td.dataset.col);
    // Cycle: current → +0.5, wrapping around [-1, 1]
    let val = rules[r][c] + 0.5;
    if (val > 1) val = -1;
    rules[r][c] = val;
    td.style.background = forceToColor(val);
    td.title = val.toFixed(2);
  });
}

// --- FPS counter ---

let fpsFrames = 0;
let fpsTime = performance.now();
let fpsDisplay = 0;

function updateFPS() {
  fpsFrames++;
  const now = performance.now();
  if (now - fpsTime >= 1000) {
    fpsDisplay = fpsFrames;
    fpsFrames = 0;
    fpsTime = now;
  }
}

function drawFPS() {
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '12px monospace';
  ctx.fillText(fpsDisplay + ' fps', 8, 16);
}

// --- Presets ---

// Each preset is a function that returns a 6x6 rules matrix.
// Only first N rows/cols used if NUM_SPECIES < 6.

function makeMatrix(fn) {
  const m = [];
  for (let i = 0; i < NUM_SPECIES; i++) {
    m[i] = [];
    for (let j = 0; j < NUM_SPECIES; j++) {
      m[i][j] = fn(i, j);
    }
  }
  return m;
}

const PRESETS = {
  Chaos: function() {
    return makeMatrix(function() { return Math.random() * 2 - 1; });
  },
  Symbiosis: function() {
    // Mutual attraction between pairs, self-repulsion
    return makeMatrix(function(i, j) {
      if (i === j) return -0.5; // self-repulsion
      // Pair neighbors attract each other
      if (Math.abs(i - j) === 1 || Math.abs(i - j) === NUM_SPECIES - 1) return 0.7;
      return -0.2;
    });
  },
  Hunters: function() {
    // Asymmetric chain: each species chases the next, flees the previous
    return makeMatrix(function(i, j) {
      if (i === j) return 0.1; // mild self-attraction
      if (j === (i + 1) % NUM_SPECIES) return 0.8;  // chase next
      if (j === (i - 1 + NUM_SPECIES) % NUM_SPECIES) return -0.6; // flee previous
      return 0.0;
    });
  },
  Clusters: function() {
    // Strong self-attraction, mild repulsion between groups
    return makeMatrix(function(i, j) {
      if (i === j) return 0.8;
      return -0.3;
    });
  },
  Orbits: function() {
    // Tuned for circular chasing — asymmetric mild attraction/repulsion
    return makeMatrix(function(i, j) {
      if (i === j) return -0.1;
      const diff = (j - i + NUM_SPECIES) % NUM_SPECIES;
      if (diff === 1) return 0.4;
      if (diff === 2) return 0.2;
      if (diff === NUM_SPECIES - 1) return -0.4;
      return -0.1;
    });
  }
};

function applyPreset(name) {
  const fn = PRESETS[name];
  if (!fn) return;
  rules = fn();
  initParticles(particles.length);
  renderMatrix();
}

// Wire preset buttons
const presetContainer = document.getElementById('presets');
if (presetContainer) {
  Object.keys(PRESETS).forEach(function(name) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = name;
    btn.addEventListener('click', function() { applyPreset(name); });
    presetContainer.appendChild(btn);
  });
}

// --- Simulation state ---

let running = true;
let stepsPerFrame = 1;

// --- Controls ---

const btnPause = document.getElementById('btn-pause');
const btnRandomize = document.getElementById('btn-randomize');
const sliderSpeed = document.getElementById('slider-speed');
const sliderCount = document.getElementById('slider-count');
const sliderFriction = document.getElementById('slider-friction');
const valSpeed = document.getElementById('val-speed');
const valCount = document.getElementById('val-count');
const valFriction = document.getElementById('val-friction');

btnPause.addEventListener('click', function() {
  running = !running;
  btnPause.textContent = running ? 'Pause' : 'Play';
});

btnRandomize.addEventListener('click', function() {
  randomRules();
  initParticles(particles.length);
});

sliderSpeed.addEventListener('input', function() {
  stepsPerFrame = parseInt(this.value);
  valSpeed.textContent = this.value;
});

sliderCount.addEventListener('input', function() {
  setParticleCount(parseInt(this.value));
  valCount.textContent = this.value;
});

sliderFriction.addEventListener('input', function() {
  friction = parseFloat(this.value);
  valFriction.textContent = parseFloat(this.value).toFixed(2);
});

// --- Simulation loop ---

function loop() {
  if (running) {
    for (let s = 0; s < stepsPerFrame; s++) {
      updatePhysics();
    }
  }
  draw();
  updateFPS();
  drawFPS();
  requestAnimationFrame(loop);
}

// --- Initialize ---

randomRules();
initParticles(DEFAULT_PARTICLE_COUNT);
loop();

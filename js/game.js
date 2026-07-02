// ══════════════════════════════════════════════════════════════
//  game.js — Game loop, player actions, screen transitions
//  Depends on: data.js, state.js, save.js, render.js
// ══════════════════════════════════════════════════════════════

// ── Player actions ────────────────────────────────────────────

function clickCookie(e) {
  cookies      += cookiesPerClick;
  totalCookies += cookiesPerClick;
  spawnParticle(e.clientX, e.clientY, '+' + fmt(cookiesPerClick));
}

function buyBuilding(b) {
  const cost = buildingCost(b);
  if (cookies < cost) return;
  cookies -= cost;
  buildingCounts[b.id]++;
  updateCPS();
  needsFullRender = true;
  renderAll();
}

function buyUpgrade(u) {
  if (cookies < u.cost || upgradeOwned[u.id]) return;
  cookies -= u.cost;
  upgradeOwned[u.id] = true;
  if (u.effectType === 'click') cookiesPerClick += u.effectVal;
  if (u.effectType === 'gcps')  { globalCPSMultiplier *= u.effectVal; updateCPS(); }
  if (u.effectType === 'bld')   { buildingMultiplier[u.effectTarget] *= u.effectVal; updateCPS(); }
  needsFullRender = true;
  renderAll();
}

// ── Game loop ─────────────────────────────────────────────────

function gameLoop() {
  if (!loopRunning) return;
  const now = Date.now();
  const dt  = Math.min((now - lastTick) / 1000, 1); // cap at 1s — prevents windfalls after tab sleep
  lastTick  = now;
  if (cookiesPerSecond > 0) {
    const earned  = cookiesPerSecond * dt;
    cookies      += earned;
    totalCookies += earned;
  }
  renderCounters();
  renderAll();
  requestAnimationFrame(gameLoop);
}

// ── Screen transitions ────────────────────────────────────────

function showGame() {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('game').classList.add('visible');

  lastTick        = Date.now();
  loopRunning     = true;
  needsFullRender = true;
  renderAll();
  requestAnimationFrame(gameLoop);

  clearInterval(autosaveTimer);
  autosaveTimer = setInterval(() => saveGame(true), 60000);
  setInterval(rotateTicker, 22000);
}

function showMenu() {
  loopRunning = false;
  saveGame(true);
  document.getElementById('game').classList.remove('visible');
  document.getElementById('main-menu').style.display = 'flex';
  refreshMenuButtons();
}

// ══════════════════════════════════════════════════════════════
//  state.js — Mutable game state and state helper functions
//  Depends on: data.js
// ══════════════════════════════════════════════════════════════

let cookies          = 0;
let totalCookies     = 0;
let cookiesPerClick  = 1;
let cookiesPerSecond = 0;
let globalCPSMultiplier = 1;

const buildingCounts     = {};
const buildingMultiplier = {};
BUILDINGS.forEach(b => { buildingCounts[b.id] = 0; buildingMultiplier[b.id] = 1; });

const upgradeOwned = {};
UPGRADES_DEF.forEach(u => upgradeOwned[u.id] = false);

const unlockedMilestones = new Set();

let lastTick       = Date.now();
let loopRunning    = false;
let needsFullRender = true;
let autosaveTimer  = null;

// ── Helpers ───────────────────────────────────────────────────

function fmt(n) {
  if (n >= 1e15) return (n / 1e15).toFixed(2) + ' Qu';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + ' T';
  if (n >= 1e9)  return (n / 1e9).toFixed(2)  + ' B';
  if (n >= 1e6)  return (n / 1e6).toFixed(2)  + ' M';
  if (n >= 1e3)  return (n / 1e3).toFixed(1)  + 'k';
  return Math.floor(n).toLocaleString();
}

function buildingCost(b) {
  return Math.ceil(b.baseCost * Math.pow(1.15, buildingCounts[b.id]));
}

function updateCPS() {
  cookiesPerSecond = 0;
  BUILDINGS.forEach(b => {
    cookiesPerSecond += b.baseCPS * buildingCounts[b.id] * buildingMultiplier[b.id] * globalCPSMultiplier;
  });
}

// Re-derives all multipliers from scratch — used after loading a save
// so we never rely on stored derived values becoming stale.
function recomputeFromScratch() {
  cookiesPerClick     = 1;
  globalCPSMultiplier = 1;
  BUILDINGS.forEach(b => buildingMultiplier[b.id] = 1);

  UPGRADES_DEF.forEach(u => {
    if (!upgradeOwned[u.id]) return;
    if (u.effectType === 'click') cookiesPerClick += u.effectVal;
    if (u.effectType === 'gcps')  globalCPSMultiplier *= u.effectVal;
    if (u.effectType === 'bld')   buildingMultiplier[u.effectTarget] *= u.effectVal;
  });

  updateCPS();
}

function resetState() {
  cookies = 0; totalCookies = 0;
  cookiesPerClick = 1; cookiesPerSecond = 0;
  globalCPSMultiplier = 1;
  BUILDINGS.forEach(b => { buildingCounts[b.id] = 0; buildingMultiplier[b.id] = 1; });
  UPGRADES_DEF.forEach(u => upgradeOwned[u.id] = false);
  unlockedMilestones.clear();
  document.getElementById('auto-bakers-display').innerHTML = '';
  document.getElementById('autosave-indicator').textContent = '';
}

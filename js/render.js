// ══════════════════════════════════════════════════════════════
//  render.js — DOM rendering: counters, store, achievements
//  Depends on: data.js, state.js
// ══════════════════════════════════════════════════════════════

// ── Fast path: text + affordability only (runs every frame) ──

function renderCounters() {
  document.getElementById('cookie-count').textContent  = fmt(cookies);
  document.getElementById('total-display').textContent = fmt(totalCookies);
  document.getElementById('cps-display').textContent   = fmt(cookiesPerSecond) + ' per second';
  document.getElementById('cps-header').textContent    = fmt(cookiesPerSecond) + '/s';

  // Update building costs + affordability without rebuilding DOM
  document.querySelectorAll('.building-card').forEach((card, i) => {
    const b    = BUILDINGS[i];
    const cost = buildingCost(b);
    card.disabled = cookies < cost;
    card.querySelector('.building-cost').textContent = fmt(cost);
  });

  // Update upgrade affordability without rebuilding DOM
  document.querySelectorAll('.upgrade-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (id && !upgradeOwned[id]) {
      const u = UPGRADES_DEF.find(u => u.id === id);
      if (u) btn.disabled = cookies < u.cost;
    }
  });

  checkMilestones();
}

// ── Slow path: full DOM rebuild (runs only on state changes) ──

function renderAll() {
  if (!needsFullRender) return;
  needsFullRender = false;

  renderBuildings();
  renderUpgrades();
  renderBakerChips();
  renderAchievements();
}

function renderBuildings() {
  const bl = document.getElementById('buildings-list');
  bl.innerHTML = '';
  BUILDINGS.forEach(b => {
    const cost    = buildingCost(b);
    const cpsEach = b.baseCPS * buildingMultiplier[b.id] * globalCPSMultiplier;
    const card    = document.createElement('button');
    card.className = 'building-card';
    card.disabled  = cookies < cost;
    card.innerHTML = `
      <div class="building-icon">${b.icon}</div>
      <div class="building-info">
        <div class="building-name">${b.name}</div>
        <div class="building-owned">Owned: ${buildingCounts[b.id]}</div>
        <div class="building-cps">${fmt(cpsEach)} CPS each</div>
      </div>
      <div class="building-cost">${fmt(cost)}</div>
      ${buildingCounts[b.id] > 0 ? `<div class="building-count-badge">${buildingCounts[b.id]}</div>` : ''}
    `;
    card.addEventListener('click', () => buyBuilding(b));
    bl.appendChild(card);
  });
}

function renderUpgrades() {
  const ul = document.getElementById('upgrades-list');
  const ol = document.getElementById('upgrades-owned-list');
  ul.innerHTML = '';
  ol.innerHTML = '';

  const availableSection = document.getElementById('upgrades-available');
  const ownedSection     = document.getElementById('upgrades-owned-section');
  const available        = UPGRADES_DEF.filter(u => !upgradeOwned[u.id]);
  const owned            = UPGRADES_DEF.filter(u =>  upgradeOwned[u.id]);

  availableSection.style.display = available.length ? 'block' : 'none';
  ownedSection.style.display     = owned.length     ? 'block' : 'none';

  available.forEach(u => {
    const btn = document.createElement('button');
    btn.className  = 'upgrade-btn';
    btn.dataset.id = u.id;
    btn.disabled   = cookies < u.cost;
    btn.innerHTML  = `
      <div class="upgrade-icon">${u.icon}</div>
      <div class="upgrade-info">
        <div class="upgrade-name">${u.name}</div>
        <div class="upgrade-desc">${u.desc}</div>
      </div>
      <div class="upgrade-cost">${fmt(u.cost)}</div>
    `;
    btn.addEventListener('click', () => buyUpgrade(u));
    ul.appendChild(btn);
  });

  owned.forEach(u => {
    const div = document.createElement('div');
    div.className = 'upgrade-btn owned';
    div.innerHTML = `
      <div class="upgrade-icon">${u.icon}</div>
      <div class="upgrade-info">
        <div class="upgrade-name">${u.name}</div>
        <div class="upgrade-desc">${u.desc}</div>
      </div>
      <div class="upgrade-cost">✓</div>
    `;
    ol.appendChild(div);
  });
}

function renderBakerChips() {
  const abd = document.getElementById('auto-bakers-display');
  abd.innerHTML = '';
  BUILDINGS.forEach(b => {
    if (buildingCounts[b.id] > 0) {
      const chip = document.createElement('div');
      chip.className   = 'baker-chip';
      chip.textContent = `${b.icon} ${b.name} ×${buildingCounts[b.id]}`;
      abd.appendChild(chip);
    }
  });
}

function renderAchievements() {
  const list    = document.getElementById('achievements-list');
  list.innerHTML = '';
  const unlocked = unlockedMilestones.size;
  const total    = MILESTONES.length;

  document.getElementById('achievements-count').textContent        = `${unlocked} / ${total} unlocked`;
  document.getElementById('achievements-progress-bar').style.width = `${Math.round((unlocked / total) * 100)}%`;

  MILESTONES.forEach(m => {
    const isUnlocked = unlockedMilestones.has(m.at);
    const row        = document.createElement('div');
    row.className    = 'achievement-row ' + (isUnlocked ? 'unlocked' : 'locked');
    row.innerHTML    = `
      <div class="achievement-icon">${isUnlocked ? '🏅' : '🔒'}</div>
      <div class="achievement-info">
        <div class="achievement-name">${m.label}</div>
        <div class="achievement-req">Bake ${fmt(m.at)} cookies total</div>
      </div>
      <div class="achievement-check">${isUnlocked ? '✓' : ''}</div>
    `;
    list.appendChild(row);
  });
}

// ── Milestone check (called every frame via renderCounters) ──

function checkMilestones() {
  MILESTONES.forEach(m => {
    if (totalCookies >= m.at && !unlockedMilestones.has(m.at)) {
      unlockedMilestones.add(m.at);
      needsFullRender = true;
      renderAll();
      showAchievementToast(m.label);
      spawnNewsItem('🏅 Achievement unlocked: ' + m.label);
    }
  });
}

// ── News ticker ───────────────────────────────────────────────

function spawnNewsItem(text) {
  document.getElementById('ticker-text').textContent = text + ' 🍪 ';
}

function rotateTicker() {
  document.getElementById('ticker-text').textContent = NEWS[Math.floor(Math.random() * NEWS.length)];
}

// ── Toast notifications ───────────────────────────────────────

let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('save-toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 2200);
}

let achToastTimeout;
function showAchievementToast(label) {
  const toast = document.getElementById('ach-toast');
  document.getElementById('ach-toast-text').textContent = label;
  toast.classList.add('show');
  clearTimeout(achToastTimeout);
  achToastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Click particle ────────────────────────────────────────────

function spawnParticle(x, y, text) {
  const p       = document.createElement('div');
  p.className   = 'particle';
  p.textContent = text;
  p.style.left  = (x - 16) + 'px';
  p.style.top   = (y - 20) + 'px';
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 900);
}

// ── Confirm modal ─────────────────────────────────────────────

function showModal(title, body, onConfirm) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent  = body;
  const overlay   = document.getElementById('modal-overlay');
  const confirmBtn = document.getElementById('modal-confirm');
  const cancelBtn  = document.getElementById('modal-cancel');
  const close      = () => overlay.classList.remove('show');
  overlay.classList.add('show');
  confirmBtn.onclick = () => { close(); onConfirm(); };
  cancelBtn.onclick  = close;
}

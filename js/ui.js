// ══════════════════════════════════════════════════════════════
//  ui.js — Event listeners, drawers, menu wiring
//  Depends on: data.js, state.js, save.js, render.js, game.js
//  This file runs last and bootstraps the whole app.
// ══════════════════════════════════════════════════════════════

// ── Store drawer ──────────────────────────────────────────────

function openStore() {
  document.getElementById('right-panel').classList.add('store-open');
  document.getElementById('store-backdrop').classList.add('show');
}

function closeStore() {
  document.getElementById('right-panel').classList.remove('store-open');
  document.getElementById('store-backdrop').classList.remove('show');
}

// ── Achievements drawer ───────────────────────────────────────

function openAchievements() {
  renderAchievements();
  document.getElementById('achievements-panel').classList.add('ach-open');
  document.getElementById('store-backdrop').classList.add('show');
}

function closeAchievements() {
  document.getElementById('achievements-panel').classList.remove('ach-open');
  document.getElementById('store-backdrop').classList.remove('show');
}

// ── Menu save-slot display ────────────────────────────────────

function refreshMenuButtons() {
  const has         = hasSave();
  const continueBtn = document.getElementById('btn-continue');
  const deleteBtn   = document.getElementById('btn-delete-save');
  const preview     = document.getElementById('save-preview');

  continueBtn.disabled = !has;
  deleteBtn.disabled   = !has;

  if (has) {
    const p = getSavePreview();
    if (p) {
      preview.style.display = 'block';
      preview.innerHTML = `<strong>🍪 ${fmt(p.total)} total cookies</strong>${p.bldCount} buildings · Saved ${p.date}`;
    }
  } else {
    preview.style.display = 'none';
  }
}

// ── Wire up all event listeners ───────────────────────────────

// Cookie click
document.getElementById('cookie-btn').addEventListener('click', clickCookie);

// Header buttons
document.getElementById('btn-save').addEventListener('click', () => saveGame(false));
document.getElementById('btn-to-menu').addEventListener('click', () => {
  showModal('Return to Menu?', 'Your progress will be saved automatically.', showMenu);
});

// Store drawer
document.getElementById('open-store-btn').addEventListener('click', () => {
  document.querySelectorAll('.store-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.store-tab[data-tab="buildings"]').classList.add('active');
  document.getElementById('tab-buildings').classList.add('active');
  openStore();
});
document.getElementById('store-close-btn').addEventListener('click', closeStore);

// Achievements drawer
document.getElementById('open-achievements-btn').addEventListener('click', openAchievements);
document.getElementById('achievements-close-btn').addEventListener('click', closeAchievements);

// Shared backdrop (closes whichever drawer is open)
document.getElementById('store-backdrop').addEventListener('click', () => {
  closeStore();
  closeAchievements();
});

// Store tabs
document.querySelectorAll('.store-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.store-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// Main menu buttons
document.getElementById('btn-new-game').addEventListener('click', () => {
  if (hasSave()) {
    showModal('Start New Game?', 'This will overwrite your current save. Are you sure?', () => {
      deleteSave();
      resetState();
      showGame();
    });
  } else {
    resetState();
    showGame();
  }
});

document.getElementById('btn-continue').addEventListener('click', () => {
  if (loadGame()) {
    needsFullRender = true;
    showGame();
  } else {
    showToast('⚠️ Could not load save');
  }
});

document.getElementById('btn-delete-save').addEventListener('click', () => {
  showModal('Delete Save?', 'All your cookies and buildings will be lost forever. This cannot be undone.', () => {
    deleteSave();
    refreshMenuButtons();
    showToast('🗑 Save deleted');
  });
});

// ── Boot ──────────────────────────────────────────────────────
refreshMenuButtons();

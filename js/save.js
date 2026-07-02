// ══════════════════════════════════════════════════════════════
//  save.js — Save, load, and delete game state via localStorage
//  Depends on: data.js, state.js
// ══════════════════════════════════════════════════════════════

function getSaveData() {
  return {
    cookies, totalCookies, cookiesPerClick,
    globalCPSMultiplier,
    buildingCounts:      { ...buildingCounts },
    buildingMultiplier:  { ...buildingMultiplier },
    upgradeOwned:        { ...upgradeOwned },
    unlockedMilestones:  [...unlockedMilestones],
    savedAt: Date.now(),
  };
}

function saveGame(silent) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(getSaveData()));
    if (!silent) showToast('💾 Game Saved!');
    document.getElementById('autosave-indicator').textContent =
      'Autosaved ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    showToast('⚠️ Save failed');
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);
    cookies      = d.cookies      || 0;
    totalCookies = d.totalCookies || 0;
    Object.assign(buildingCounts, d.buildingCounts || {});
    Object.assign(upgradeOwned,   d.upgradeOwned   || {});
    (d.unlockedMilestones || []).forEach(m => unlockedMilestones.add(m));
    recomputeFromScratch();
    return true;
  } catch (e) {
    return false;
  }
}

function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

function getSavePreview() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    const date = new Date(d.savedAt).toLocaleDateString([], {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    const bldCount = Object.values(d.buildingCounts || {}).reduce((a, b) => a + b, 0);
    return { total: d.totalCookies || 0, bldCount, date };
  } catch (e) {
    return null;
  }
}

function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

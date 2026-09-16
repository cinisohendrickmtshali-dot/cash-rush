/* ============================================
   CASH RUSH — Save & Load System
   Version 1.0 — Free Version
   ============================================ */

const SAVE_KEY = 'cash_rush_save_v1';

function createNewGame() {
  return {
    version: 4,
    day: 1,
    cash: 500,
    level: 1,
    inventory: {},
    totalRevenue: 0,
    totalProfit: 0,
    totalCustomers: 0,
    totalItemsSold: 0,
    achievementsUnlocked: [],
    lastPlayed: new Date().toISOString(),
    tutorialSeen: false,
    dailyHistory: [],
    adsWatched: 0,
    daysPlayed: 0
  };
}

function saveGame(state) {
  try {
    state.lastPlayed = new Date().toISOString();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('Save error:', err);
    return false;
  }
}

function loadGame() {
  try {
    var raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    var state = JSON.parse(raw);
    if (!state || typeof state !== 'object') return null;
    if (!state.version) return null;
    // Migrate old fields if missing
    if (state.adsWatched === undefined) state.adsWatched = 0;
    if (state.daysPlayed === undefined) state.daysPlayed = 0;
    return state;
  } catch (err) {
    console.error('Load error:', err);
    return null;
  }
}

function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (err) {
    return false;
  }
}

function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

var _autoSaveTimer = null;
function autoSave(state) {
  if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(function() {
    saveGame(state);
  }, 500);
}

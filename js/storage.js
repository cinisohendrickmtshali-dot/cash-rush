/* ============================================
   CASH RUSH — Save & Load System
   Version 0.3
   Includes premium unlock flag
   ============================================ */

const SAVE_KEY = 'cash_rush_save_v1';

/* Free tier limits */
const FREE_MAX_DAY = 5;
const FREE_PRODUCT_IDS = ['bread', 'milk', 'water', 'soda', 'chips'];

function createNewGame() {
  return {
    version: 3,
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
    premiumUnlocked: false    // ← New in V0.3
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
    // Migrate old saves — add premium field if missing
    if (state.premiumUnlocked === undefined) {
      state.premiumUnlocked = false;
    }
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

function isPremium(state) {
  return state && state.premiumUnlocked === true;
}

var _autoSaveTimer = null;
function autoSave(state) {
  if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(function() {
    saveGame(state);
  }, 500);
}S

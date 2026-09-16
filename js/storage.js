/* ============================================
   CASH RUSH — Save & Load System
   Version 0.1
   
   Handles saving the game to localStorage
   and loading it back when the player returns.
   ============================================ */

const SAVE_KEY = 'cash_rush_save_v1';

/* Create a brand-new game state */
function createNewGame() {
  return {
    version: 1,
    day: 1,
    cash: 500,
    level: 1,
    inventory: {},          // { productId: { stock, price } }
    totalRevenue: 0,
    totalProfit: 0,
    totalCustomers: 0,
    totalItemsSold: 0,
    achievementsUnlocked: [],
    lastPlayed: new Date().toISOString(),
    tutorialSeen: false,
    dailyHistory: []        // Last 30 daily reports
  };
}

/* Save the game to localStorage */
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

/* Load the game from localStorage.
   Returns null if no save exists. */
function loadGame() {
  try {
    var raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    var state = JSON.parse(raw);
    if (!state || typeof state !== 'object') return null;
    if (!state.version) return null;
    return state;
  } catch (err) {
    console.error('Load error:', err);
    return null;
  }
}

/* Delete the saved game (used by Reset Game) */
function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (err) {
    return false;
  }
}

/* Check if a save exists */
function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/* Auto-save on certain events (debounced) */
var _autoSaveTimer = null;
function autoSave(state) {
  if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(function() {
    saveGame(state);
  }, 500);
}

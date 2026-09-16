/* ============================================
   CASH RUSH — Achievements System
   Version 0.1
   
   Tracks player milestones and unlocks
   achievements as they hit them.
   ============================================ */

const ACHIEVEMENTS = [
  {
    id: 'first_sale',
    name: 'First Sale',
    emoji: '🥇',
    description: 'Make your first sale',
    check: function(s) { return s.totalItemsSold >= 1; }
  },
  {
    id: 'first_profit',
    name: 'First Profit',
    emoji: '💚',
    description: 'Finish a profitable day',
    check: function(s) { return s.totalProfit > 0; }
  },
  {
    id: 'r1000_cash',
    name: 'R1,000 Cash',
    emoji: '💰',
    description: 'Reach R1,000 cash',
    check: function(s) { return s.cash >= 1000; }
  },
  {
    id: 'stock_master',
    name: 'Stock Master',
    emoji: '📦',
    description: 'Sell 100 products',
    check: function(s) { return s.totalItemsSold >= 100; }
  },
  {
    id: 'business_owner',
    name: 'Business Owner',
    emoji: '🏪',
    description: 'Survive 10 game days',
    check: function(s) { return s.day >= 10; }
  },
  {
    id: 'profit_machine',
    name: 'Profit Machine',
    emoji: '⚙️',
    description: 'Earn R1,000 cumulative profit',
    check: function(s) { return s.totalProfit >= 1000; }
  },
  {
    id: 'customer_favorite',
    name: 'Customer Favourite',
    emoji: '❤️',
    description: 'Serve 50 customers',
    check: function(s) { return s.totalCustomers >= 50; }
  },
  {
    id: 'big_spender',
    name: 'Big Spender',
    emoji: '💎',
    description: 'Reach R5,000 cash',
    check: function(s) { return s.cash >= 5000; }
  }
];

/* Check all achievements against current state.
   Returns array of NEWLY unlocked achievements. */
function checkAchievements(state) {
  var newUnlocks = [];
  var alreadyUnlocked = state.achievementsUnlocked || [];

  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var a = ACHIEVEMENTS[i];
    if (alreadyUnlocked.indexOf(a.id) !== -1) continue; // already have it
    if (a.check(state)) {
      newUnlocks.push(a);
      alreadyUnlocked.push(a.id);
    }
  }

  state.achievementsUnlocked = alreadyUnlocked;
  return newUnlocks;
}

/* Check if a specific achievement is unlocked */
function isAchievementUnlocked(state, id) {
  var list = state.achievementsUnlocked || [];
  return list.indexOf(id) !== -1;
}

/* Get all achievements with their unlock status */
function getAchievementList(state) {
  return ACHIEVEMENTS.map(function(a) {
    return {
      id: a.id,
      name: a.name,
      emoji: a.emoji,
      description: a.description,
      unlocked: isAchievementUnlocked(state, a.id)
    };
  });
}

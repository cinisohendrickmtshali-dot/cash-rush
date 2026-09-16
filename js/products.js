/* ============================================
   CASH RUSH — Product Data
   Version 0.2
   
   25 products across 6 categories.
   Balanced for a fair but challenging game.
   ============================================ */

const PRODUCTS = [
  // ---------- FOOD (5) ----------
  { id: 'bread', name: 'Bread', emoji: '🍞', category: 'Food', buyPrice: 10, suggestPrice: 14, demand: 85, priceSensitivity: 0.80, storagePerUnit: 1 },
  { id: 'eggs', name: 'Eggs (6 pack)', emoji: '🥚', category: 'Food', buyPrice: 18, suggestPrice: 25, demand: 72, priceSensitivity: 0.60, storagePerUnit: 1 },
  { id: 'noodles', name: 'Instant Noodles', emoji: '🍜', category: 'Food', buyPrice: 7, suggestPrice: 12, demand: 78, priceSensitivity: 0.65, storagePerUnit: 1 },
  { id: 'rice', name: 'Rice 1kg', emoji: '🍚', category: 'Food', buyPrice: 22, suggestPrice: 32, demand: 65, priceSensitivity: 0.55, storagePerUnit: 2 },
  { id: 'canned', name: 'Canned Beans', emoji: '🥫', category: 'Food', buyPrice: 12, suggestPrice: 18, demand: 60, priceSensitivity: 0.70, storagePerUnit: 1 },

  // ---------- DAIRY (3) ----------
  { id: 'milk', name: 'Milk 1L', emoji: '🥛', category: 'Dairy', buyPrice: 15, suggestPrice: 20, demand: 80, priceSensitivity: 0.70, storagePerUnit: 1 },
  { id: 'yogurt', name: 'Yogurt 500ml', emoji: '🍦', category: 'Dairy', buyPrice: 14, suggestPrice: 22, demand: 55, priceSensitivity: 0.65, storagePerUnit: 1 },
  { id: 'cheese', name: 'Cheese Slices', emoji: '🧀', category: 'Dairy', buyPrice: 25, suggestPrice: 38, demand: 50, priceSensitivity: 0.50, storagePerUnit: 1 },

  // ---------- DRINKS (5) ----------
  { id: 'water', name: 'Bottled Water 500ml', emoji: '💧', category: 'Drinks', buyPrice: 5, suggestPrice: 8, demand: 90, priceSensitivity: 0.90, storagePerUnit: 1 },
  { id: 'soda', name: 'Soft Drink 330ml', emoji: '🥤', category: 'Drinks', buyPrice: 8, suggestPrice: 12, demand: 88, priceSensitivity: 0.75, storagePerUnit: 1 },
  { id: 'juice', name: 'Fruit Juice 1L', emoji: '🧃', category: 'Drinks', buyPrice: 18, suggestPrice: 28, demand: 65, priceSensitivity: 0.60, storagePerUnit: 1 },
  { id: 'energy', name: 'Energy Drink', emoji: '⚡', category: 'Drinks', buyPrice: 14, suggestPrice: 25, demand: 60, priceSensitivity: 0.45, storagePerUnit: 1 },
  { id: 'tea', name: 'Tea Bags (25)', emoji: '🍵', category: 'Drinks', buyPrice: 20, suggestPrice: 30, demand: 55, priceSensitivity: 0.50, storagePerUnit: 1 },

  // ---------- SNACKS (5) ----------
  { id: 'chips', name: 'Chips 125g', emoji: '🍟', category: 'Snacks', buyPrice: 12, suggestPrice: 18, demand: 85, priceSensitivity: 0.70, storagePerUnit: 1 },
  { id: 'sweets', name: 'Sweets Pack', emoji: '🍬', category: 'Snacks', buyPrice: 5, suggestPrice: 10, demand: 75, priceSensitivity: 0.85, storagePerUnit: 1 },
  { id: 'chocolate', name: 'Chocolate Bar', emoji: '🍫', category: 'Snacks', buyPrice: 10, suggestPrice: 16, demand: 80, priceSensitivity: 0.65, storagePerUnit: 1 },
  { id: 'biscuits', name: 'Biscuits Pack', emoji: '🍪', category: 'Snacks', buyPrice: 8, suggestPrice: 13, demand: 70, priceSensitivity: 0.75, storagePerUnit: 1 },
  { id: 'nuts', name: 'Peanuts 100g', emoji: '🥜', category: 'Snacks', buyPrice: 15, suggestPrice: 24, demand: 45, priceSensitivity: 0.55, storagePerUnit: 1 },

  // ---------- HOUSEHOLD (4) ----------
  { id: 'soap', name: 'Soap Bar', emoji: '🧼', category: 'Household', buyPrice: 8, suggestPrice: 13, demand: 60, priceSensitivity: 0.50, storagePerUnit: 1 },
  { id: 'toiletpaper', name: 'Toilet Paper (2 pack)', emoji: '🧻', category: 'Household', buyPrice: 10, suggestPrice: 16, demand: 65, priceSensitivity: 0.55, storagePerUnit: 2 },
  { id: 'detergent', name: 'Washing Powder', emoji: '🧴', category: 'Household', buyPrice: 25, suggestPrice: 38, demand: 50, priceSensitivity: 0.45, storagePerUnit: 2 },
  { id: 'matches', name: 'Matches', emoji: '🔥', category: 'Household', buyPrice: 3, suggestPrice: 6, demand: 55, priceSensitivity: 0.85, storagePerUnit: 1 },

  // ---------- PERSONAL CARE (3) ----------
  { id: 'toothpaste', name: 'Toothpaste', emoji: '🪥', category: 'Personal', buyPrice: 15, suggestPrice: 24, demand: 55, priceSensitivity: 0.50, storagePerUnit: 1 },
  { id: 'deodorant', name: 'Deodorant', emoji: '💐', category: 'Personal', buyPrice: 22, suggestPrice: 35, demand: 45, priceSensitivity: 0.45, storagePerUnit: 1 },
  { id: 'sanitizer', name: 'Hand Sanitizer', emoji: '🧴', category: 'Personal', buyPrice: 12, suggestPrice: 20, demand: 50, priceSensitivity: 0.60, storagePerUnit: 1 }
];

function getProductById(id) {
  return PRODUCTS.find(function(p) { return p.id === id; });
}

function getProductEmoji(id) {
  var p = getProductById(id);
  return p ? p.emoji : '📦';
}

function getProductName(id) {
  var p = getProductById(id);
  return p ? p.name : 'Unknown';
}

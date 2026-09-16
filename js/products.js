/* ============================================
   CASH RUSH — Product Data
   Version 0.1
   
   This file defines the 10 starter products
   the player can buy and sell in their shop.
   
   Each product has:
   - id: unique identifier
   - name: display name
   - emoji: visual icon
   - category: product group
   - buyPrice: cost from supplier
   - suggestPrice: recommended selling price
   - demand: base demand level (0-100)
   - priceSensitivity: how price affects demand (0-1)
   - storagePerUnit: storage space per unit
   ============================================ */

const PRODUCTS = [
  { id: 'bread', name: 'Bread', emoji: '🍞', category: 'Food', buyPrice: 10, suggestPrice: 14, demand: 85, priceSensitivity: 0.8, storagePerUnit: 1 },
  { id: 'milk', name: 'Milk 1L', emoji: '🥛', category: 'Dairy', buyPrice: 15, suggestPrice: 20, demand: 80, priceSensitivity: 0.7, storagePerUnit: 1 },
  { id: 'eggs', name: 'Eggs (6 pack)', emoji: '🥚', category: 'Dairy', buyPrice: 18, suggestPrice: 25, demand: 75, priceSensitivity: 0.6, storagePerUnit: 1 },
  { id: 'water', name: 'Bottled Water 500ml', emoji: '💧', category: 'Drinks', buyPrice: 5, suggestPrice: 8, demand: 90, priceSensitivity: 0.9, storagePerUnit: 1 },
  { id: 'soda', name: 'Soft Drink 330ml', emoji: '🥤', category: 'Drinks', buyPrice: 8, suggestPrice: 12, demand: 85, priceSensitivity: 0.75, storagePerUnit: 1 },
  { id: 'chips', name: 'Chips 125g', emoji: '🍟', category: 'Snacks', buyPrice: 12, suggestPrice: 18, demand: 80, priceSensitivity: 0.7, storagePerUnit: 1 },
  { id: 'sweets', name: 'Sweets Pack', emoji: '🍬', category: 'Snacks', buyPrice: 5, suggestPrice: 10, demand: 70, priceSensitivity: 0.85, storagePerUnit: 1 },
  { id: 'noodles', name: 'Instant Noodles', emoji: '🍜', category: 'Food', buyPrice: 7, suggestPrice: 12, demand: 75, priceSensitivity: 0.65, storagePerUnit: 1 },
  { id: 'soap', name: 'Soap Bar', emoji: '🧼', category: 'Household', buyPrice: 8, suggestPrice: 13, demand: 60, priceSensitivity: 0.5, storagePerUnit: 1 },
  { id: 'toiletpaper', name: 'Toilet Paper (2 pack)', emoji: '🧻', category: 'Household', buyPrice: 10, suggestPrice: 16, demand: 65, priceSensitivity: 0.55, storagePerUnit: 1 }
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

/* ============================================
   CASH RUSH — Customer Simulation
   Version 0.1
   
   This file defines the 4 customer types
   and the logic for how they behave.
   ============================================ */

const CUSTOMER_TYPES = {
  budget: {
    id: 'budget',
    name: 'Budget Shopper',
    emoji: '🪙',
    description: 'Very price sensitive. Looks for the best deal.',
    priceTolerance: 0.10,      // Willing to pay max 10% above suggested
    maxItems: 2,                // Usually buys few items
    buyChance: 0.55,            // 55% chance to buy when browsing
    weight: 30                  // 30% of customers are this type
  },
  regular: {
    id: 'regular',
    name: 'Regular Customer',
    emoji: '🙂',
    description: 'Moderate. Buys what they need at a fair price.',
    priceTolerance: 0.25,
    maxItems: 3,
    buyChance: 0.75,
    weight: 40
  },
  convenience: {
    id: 'convenience',
    name: 'Convenience Shopper',
    emoji: '🏃',
    description: 'In a hurry. Will pay a premium for convenience.',
    priceTolerance: 0.50,      // Happy to pay up to 50% above suggested
    maxItems: 2,
    buyChance: 0.85,
    weight: 20
  },
  bulk: {
    id: 'bulk',
    name: 'Bulk Shopper',
    emoji: '🛒',
    description: 'Buys in larger quantities.',
    priceTolerance: 0.15,
    maxItems: 6,                // Buys more per visit
    buyChance: 0.65,
    weight: 10
  }
};

/* Pick a random customer type based on weights */
function getRandomCustomerType() {
  var roll = Math.random() * 100;
  var cumulative = 0;
  var types = ['budget', 'regular', 'convenience', 'bulk'];
  for (var i = 0; i < types.length; i++) {
    cumulative += CUSTOMER_TYPES[types[i]].weight;
    if (roll <= cumulative) return CUSTOMER_TYPES[types[i]];
  }
  return CUSTOMER_TYPES.regular;
}

/* Decide if a customer will buy a specific product
   based on: their type, the selling price vs suggested price,
   and the product's demand level. */
function willCustomerBuy(customer, product, sellingPrice) {
  // Price ratio: 1.0 = at suggested price, 1.2 = 20% above suggested
  var priceRatio = sellingPrice / product.suggestPrice;

  // If price is above what this customer type tolerates, no sale
  if (priceRatio > 1 + customer.priceTolerance) return false;

  // Base buy chance from customer type
  var chance = customer.buyChance;

  // Product demand affects the chance (demand 0-100)
  chance *= product.demand / 100;

  // Price affects the chance: cheaper = higher chance
  // If priced below suggested, boost. Above, reduce.
  chance *= (2 - priceRatio);

  // Add a bit of randomness so it's not perfectly predictable
  chance *= (0.85 + Math.random() * 0.30);

  // Clamp to 0-1
  chance = Math.max(0, Math.min(1, chance));

  return Math.random() < chance;
}

/* How many customers visit the store in one day.
   Base visits + daily random variation. */
function getDailyCustomerCount(baseVisits) {
  var base = baseVisits || 15;
  var variation = Math.floor(Math.random() * 11) - 5;  // -5 to +5
  return Math.max(5, base + variation);
}

/* Helper: format customer type name with emoji */
function getCustomerLabel(type) {
  var c = CUSTOMER_TYPES[type];
  return c ? c.emoji + ' ' + c.name : '👤 Customer';
}

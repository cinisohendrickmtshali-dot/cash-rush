/* ============================================
   CASH RUSH — Random Events
   Version 0.1
   
   Random events make each day different.
   Events can affect:
   - Customer traffic
   - Product prices
   - Product demand
   - Extra costs
   ============================================ */

const EVENTS = [
  {
    id: 'supplier_discount',
    name: '📦 Supplier Discount',
    description: 'Your supplier is offering 20% off Bread today.',
    type: 'buy_price_discount',
    targetProduct: 'bread',
    value: 0.20,
    chance: 8
  },
  {
    id: 'busy_day',
    name: '🔥 Busy Day',
    description: 'Word has spread! More customers than usual today.',
    type: 'traffic_boost',
    value: 1.5,
    chance: 10
  },
  {
    id: 'quiet_day',
    name: '😴 Quiet Day',
    description: 'A slow day in the neighbourhood.',
    type: 'traffic_boost',
    value: 0.7,
    chance: 10
  },
  {
    id: 'price_increase',
    name: '📈 Supplier Price Increase',
    description: 'Your supplier increased the price of Bottled Water by 30%.',
    type: 'buy_price_increase',
    targetProduct: 'water',
    value: 0.30,
    chance: 7
  },
  {
    id: 'soda_trend',
    name: '🥤 Soda Trend',
    description: 'Social media made Soft Drinks popular! Demand is up.',
    type: 'demand_boost',
    targetProduct: 'soda',
    value: 1.6,
    chance: 8
  },
  {
    id: 'chips_trend',
    name: '🍟 Chips Trend',
    description: 'Everyone suddenly wants Chips today!',
    type: 'demand_boost',
    targetProduct: 'chips',
    value: 1.6,
    chance: 8
  },
  {
    id: 'emergency_repair',
    name: '🔧 Emergency Repair',
    description: 'Your fridge broke down. It cost R80 to fix.',
    type: 'extra_cost',
    value: 80,
    chance: 5
  },
  {
    id: 'competitor_discount',
    name: '🏪 Competitor Discount',
    description: 'A nearby shop is running a discount. Traffic is down.',
    type: 'traffic_boost',
    value: 0.75,
    chance: 8
  },
  {
    id: 'school_holiday',
    name: '🎉 School Holiday',
    description: 'Kids are out of school — snacks demand is up!',
    type: 'demand_boost',
    targetProduct: 'sweets',
    value: 1.8,
    chance: 6
  },
  {
    id: 'payday',
    name: '💵 Payday',
    description: 'It\'s payday! More shoppers and bigger baskets today.',
    type: 'traffic_boost',
    value: 1.4,
    chance: 9
  },
  {
    id: 'good_weather',
    name: '☀️ Great Weather',
    description: 'Perfect weather brings more customers to the store.',
    type: 'traffic_boost',
    value: 1.25,
    chance: 12
  },
  {
    id: 'loadshedding',
    name: '⚡ Load Shedding',
    description: 'Power is out. Fewer customers today.',
    type: 'traffic_boost',
    value: 0.6,
    chance: 10
  }
];

/* Roll for events at the start of each day.
   Only ONE event fires per day (keeps it simple).
   Higher chance = more likely, but weighted. */
function rollDailyEvent() {
  var totalChance = EVENTS.reduce(function(sum, e) { return sum + e.chance; }, 0);
  var roll = Math.random() * totalChance;
  var cumulative = 0;
  for (var i = 0; i < EVENTS.length; i++) {
    cumulative += EVENTS[i].chance;
    if (roll <= cumulative) return EVENTS[i];
  }
  return null;
}

/* Apply an event's effects to a game state for the day.
   Returns a modified copy of the day modifiers. */
function applyEventEffects(event) {
  var effects = {
    trafficMultiplier: 1.0,
    buyPriceModifiers: {},   // productId -> multiplier
    demandModifiers: {},     // productId -> multiplier
    extraCost: 0,
    event: event
  };

  if (!event) return effects;

  switch (event.type) {
    case 'traffic_boost':
      effects.trafficMultiplier = event.value;
      break;
    case 'buy_price_discount':
      effects.buyPriceModifiers[event.targetProduct] = 1 - event.value;
      break;
    case 'buy_price_increase':
      effects.buyPriceModifiers[event.targetProduct] = 1 + event.value;
      break;
    case 'demand_boost':
      effects.demandModifiers[event.targetProduct] = event.value;
      break;
    case 'extra_cost':
      effects.extraCost = event.value;
      break;
  }

  return effects;
}

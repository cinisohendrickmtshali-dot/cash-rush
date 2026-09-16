/* ============================================
   CASH RUSH — Random Events
   Version 0.2
   
   20 random events that make each day different.
   ============================================ */

const EVENTS = [
  // ---------- TRAFFIC EVENTS ----------
  { id: 'busy_day', name: '🔥 Busy Day', description: 'Word has spread! More customers than usual today.', type: 'traffic_boost', value: 1.5, chance: 8 },
  { id: 'quiet_day', name: '😴 Quiet Day', description: 'A slow day in the neighbourhood.', type: 'traffic_boost', value: 0.7, chance: 8 },
  { id: 'payday', name: '💵 Payday', description: 'It\'s payday! More shoppers and bigger baskets today.', type: 'traffic_boost', value: 1.4, chance: 8 },
  { id: 'good_weather', name: '☀️ Great Weather', description: 'Perfect weather brings more customers to the store.', type: 'traffic_boost', value: 1.25, chance: 10 },
  { id: 'loadshedding', name: '⚡ Load Shedding', description: 'Power is out. Fewer customers today.', type: 'traffic_boost', value: 0.6, chance: 8 },
  { id: 'month_end', name: '💰 Month-End Rush', description: 'Salaries just paid out. Everyone is shopping!', type: 'traffic_boost', value: 1.7, chance: 6 },
  { id: 'taxi_strike', name: '🚕 Taxi Strike', description: 'Transport strike — most people stayed home.', type: 'traffic_boost', value: 0.5, chance: 5 },
  { id: 'rainy_day', name: '🌧️ Rainy Day', description: 'Heavy rain keeps shoppers away today.', type: 'traffic_boost', value: 0.75, chance: 8 },

  // ---------- COMPETITOR EVENTS ----------
  { id: 'competitor_discount', name: '🏪 Competitor Discount', description: 'A nearby shop is running a discount. Traffic is down.', type: 'traffic_boost', value: 0.75, chance: 6 },
  { id: 'competitor_closed', name: '🚪 Competitor Closed', description: 'The shop down the road is closed today — customers are coming to you!', type: 'traffic_boost', value: 1.35, chance: 6 },

  // ---------- SUPPLIER PRICE EVENTS ----------
  { id: 'supplier_discount', name: '📦 Supplier Discount', description: 'Your supplier is offering 20% off Bread today.', type: 'buy_price_discount', targetProduct: 'bread', value: 0.20, chance: 6 },
  { id: 'bulk_delivery', name: '🚛 Bulk Delivery Discount', description: 'A bulk delivery arrived — ALL products are 15% cheaper today!', type: 'all_buy_discount', value: 0.15, chance: 4 },
  { id: 'price_increase', name: '📈 Supplier Price Increase', description: 'Your supplier increased the price of Bottled Water by 30%.', type: 'buy_price_increase', targetProduct: 'water', value: 0.30, chance: 6 },
  { id: 'dairy_shortage', name: '🐄 Dairy Shortage', description: 'Milk and cheese are harder to get — supplier prices up 25%.', type: 'buy_price_increase', targetProduct: 'milk', value: 0.25, chance: 5 },

  // ---------- DEMAND TREND EVENTS ----------
  { id: 'soda_trend', name: '🥤 Soda Trend', description: 'Social media made Soft Drinks popular! Demand is up.', type: 'demand_boost', targetProduct: 'soda', value: 1.6, chance: 6 },
  { id: 'chips_trend', name: '🍟 Chips Trend', description: 'Everyone suddenly wants Chips today!', type: 'demand_boost', targetProduct: 'chips', value: 1.6, chance: 6 },
  { id: 'school_holiday', name: '🎉 School Holiday', description: 'Kids are out of school — snacks demand is up!', type: 'demand_boost', targetProduct: 'sweets', value: 1.8, chance: 5 },
  { id: 'sick_season', name: '🤒 Sick Season', description: 'Flu season — demand for household and personal care items is up.', type: 'demand_boost', targetProduct: 'toiletpaper', value: 1.5, chance: 5 },
  { id: 'heatwave', name: '🌡️ Heatwave', description: 'Very hot day — water and cold drinks are in high demand!', type: 'demand_boost', targetProduct: 'water', value: 2.0, chance: 5 },

  // ---------- COST / EXPENSE EVENTS ----------
  { id: 'emergency_repair', name: '🔧 Emergency Repair', description: 'Your fridge broke down. It cost R80 to fix.', type: 'extra_cost', value: 80, chance: 4 },
  { id: 'theft', name: '😟 Small Theft', description: 'Someone stole stock while you weren\'t looking. Loss: R60.', type: 'extra_cost', value: 60, chance: 3 },
  { id: 'city_inspection', name: '📋 City Inspection', description: 'Health inspection fee: R50.', type: 'extra_cost', value: 50, chance: 4 }
];

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

function applyEventEffects(event) {
  var effects = {
    trafficMultiplier: 1.0,
    buyPriceModifiers: {},
    demandModifiers: {},
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
    case 'all_buy_discount':
      PRODUCTS.forEach(function(p) {
        effects.buyPriceModifiers[p.id] = 1 - event.value;
      });
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

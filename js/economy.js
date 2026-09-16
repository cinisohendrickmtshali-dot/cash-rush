/* ============================================
   CASH RUSH — Economy Calculations
   Version 0.1
   
   Handles all financial maths for the game:
   - Revenue, COGS, gross profit, net profit
   - Running a full game day (simulating customers)
   ============================================ */

/* Format a number as South African Rand */
function formatRand(amount) {
  return 'R' + Number(amount).toFixed(2);
}

/* Calculate the profit per unit for a product */
function getUnitProfit(product, sellingPrice) {
  return sellingPrice - product.buyPrice;
}

/* Calculate the profit margin percentage */
function getProfitMargin(product, sellingPrice) {
  if (sellingPrice <= 0) return 0;
  return ((sellingPrice - product.buyPrice) / sellingPrice) * 100;
}

/* -------- FINANCIAL SUMMARY --------
   Input: a list of sales records
   Output: full financial breakdown */
function calculateFinancials(sales, expenses) {
  var revenue = 0;
  var cogs = 0;        // Cost of Goods Sold
  var itemsSold = 0;

  for (var i = 0; i < sales.length; i++) {
    var s = sales[i];
    revenue += s.sellingPrice * s.quantity;
    cogs += s.buyPrice * s.quantity;
    itemsSold += s.quantity;
  }

  var grossProfit = revenue - cogs;
  var totalExpenses = 0;
  if (expenses) {
    for (var j = 0; j < expenses.length; j++) {
      totalExpenses += expenses[j].amount;
    }
  }
  var netProfit = grossProfit - totalExpenses;

  return {
    revenue: revenue,
    cogs: cogs,
    grossProfit: grossProfit,
    expenses: totalExpenses,
    netProfit: netProfit,
    itemsSold: itemsSold
  };
}

/* -------- SIMULATE A FULL GAME DAY --------
   Inputs:
   - inventory: { productId: { stock: number, price: number } }
   - dayModifiers: from events.js (traffic, demand, buy price)
   - baseCustomers: number of customers that visit
   
   Output:
   - sales: list of { productId, quantity, sellingPrice, buyPrice }
   - customerCount: total customers served
   - customersServed: customers who actually bought */
function simulateDay(inventory, dayModifiers, baseCustomers) {
  var sales = [];
  var customersServed = 0;

  // Apply traffic multiplier from events
  var trafficMult = dayModifiers.trafficMultiplier || 1.0;
  var customerCount = Math.round(baseCustomers * trafficMult);

  // For each customer...
  for (var c = 0; c < customerCount; c++) {
    var customer = getRandomCustomerType();
    var boughtSomething = false;

    // Each customer browses up to maxItems products
    var maxBrowsing = customer.maxItems;
    for (var b = 0; b < maxBrowsing; b++) {
      // Pick a random product from inventory
      var productIds = Object.keys(inventory);
      if (productIds.length === 0) break;

      var productId = productIds[Math.floor(Math.random() * productIds.length)];
      var inv = inventory[productId];
      if (!inv || inv.stock <= 0) continue;

      var product = getProductById(productId);
      if (!product) continue;

      // Apply demand modifier from events
      var demandMult = dayModifiers.demandModifiers[productId] || 1.0;
      var tempProduct = Object.assign({}, product);
      tempProduct.demand = Math.min(100, product.demand * demandMult);

      // Ask the customer if they'll buy
      if (willCustomerBuy(customer, tempProduct, inv.price)) {
        // Sold!
        var saleRecord = {
          productId: productId,
          productName: product.name,
          emoji: product.emoji,
          quantity: 1,
          sellingPrice: inv.price,
          buyPrice: product.buyPrice
        };

        // Check if we've already sold this product today
        var existing = sales.find(function(s){ return s.productId === productId; });
        if (existing) {
          existing.quantity += 1;
        } else {
          sales.push(saleRecord);
        }

        // Reduce stock
        inv.stock -= 1;
        boughtSomething = true;

        // Bulk shoppers may buy extras
        if (customer.id === 'bulk' && Math.random() < 0.5 && inv.stock > 0) {
          var extra = Math.min(inv.stock, 1 + Math.floor(Math.random() * 3));
          existing.quantity += extra;
          inv.stock -= extra;
        }
      }

      // Stop browsing if they bought something
      if (boughtSomething && Math.random() < 0.7) break;
    }

    if (boughtSomething) customersServed++;
  }

  return {
    sales: sales,
    customerCount: customerCount,
    customersServed: customersServed
  };
}

/* Calculate total value of current inventory */
function getInventoryValue(inventory) {
  var total = 0;
  var ids = Object.keys(inventory);
  for (var i = 0; i < ids.length; i++) {
    var inv = inventory[ids[i]];
    var product = getProductById(ids[i]);
    if (product) {
      total += (inv.stock || 0) * product.buyPrice;
    }
  }
  return total;
}

/* Calculate total units currently in stock */
function getTotalStock(inventory) {
  var total = 0;
  var ids = Object.keys(inventory);
  for (var i = 0; i < ids.length; i++) {
    total += (inventory[ids[i]].stock || 0);
  }
  return total;
}

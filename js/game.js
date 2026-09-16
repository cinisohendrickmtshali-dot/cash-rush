/* ============================================
   CASH RUSH — Main Game Engine
   Version 0.2
   ============================================ */

var gameState = null;
var dayModifiers = null;
var currentView = 'dashboard';

var TUTORIAL_STEPS = [
  { icon: '💰', title: 'Welcome to Cash Rush', text: 'You have R500 to start your business. Let\'s learn how to build it.' },
  { icon: '📦', title: 'Buy Stock', text: 'Buy products from your supplier at wholesale prices. You can\'t sell what you don\'t have.' },
  { icon: '💵', title: 'Set Prices', text: 'Set your selling prices. Lower prices attract more customers — but give you less profit per sale.' },
  { icon: '🏪', title: 'Open the Store', text: 'When you tap "Run Store", customers will visit and buy what they want.' },
  { icon: '📊', title: 'Review the Day', text: 'See your revenue, costs and profit at the end of every day. Learn what works.' },
  { icon: '📈', title: 'Reinvest and Grow', text: 'Use your profits to buy more stock and grow your business day by day.' }
];
var tutorialIndex = 0;

function initGame() {
  var saved = loadGame();
  if (saved) {
    gameState = saved;
    // Make sure new products exist in inventory (migration from V0.1)
    PRODUCTS.forEach(function(p) {
      if (!gameState.inventory[p.id]) {
        gameState.inventory[p.id] = { stock: 0, price: p.suggestPrice };
      }
    });
  } else {
    gameState = createNewGame();
    PRODUCTS.forEach(function(p) {
      gameState.inventory[p.id] = { stock: 0, price: p.suggestPrice };
    });
    saveGame(gameState);
  }

  dayModifiers = applyEventEffects(rollDailyEvent());
  attachUIEvents();

  if (!gameState.tutorialSeen) {
    showTutorial();
  } else {
    showGameScreen();
    refreshAllUI();
  }
}

function showTutorial() {
  document.getElementById('landingScreen').classList.add('hidden');
  document.getElementById('tutorialScreen').classList.remove('hidden');
  document.getElementById('gameScreen').classList.add('hidden');
  renderTutorialStep();
}

function showGameScreen() {
  document.getElementById('landingScreen').classList.add('hidden');
  document.getElementById('tutorialScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');
}

function showLanding() {
  document.getElementById('landingScreen').classList.remove('hidden');
  document.getElementById('tutorialScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.add('hidden');
}

function renderTutorialStep() {
  var step = TUTORIAL_STEPS[tutorialIndex];
  document.getElementById('tutorialStepNum').textContent = 'STEP ' + (tutorialIndex + 1) + ' / ' + TUTORIAL_STEPS.length;
  document.getElementById('tutorialIcon').textContent = step.icon;
  document.getElementById('tutorialTitle').textContent = step.title;
  document.getElementById('tutorialText').textContent = step.text;

  var prog = document.getElementById('tutorialProgress');
  prog.innerHTML = '';
  for (var i = 0; i < TUTORIAL_STEPS.length; i++) {
    var dot = document.createElement('div');
    dot.className = 'progress-dot' + (i === tutorialIndex ? ' active' : '');
    prog.appendChild(dot);
  }

  var nextBtn = document.getElementById('nextTutorialBtn');
  nextBtn.textContent = tutorialIndex === TUTORIAL_STEPS.length - 1 ? 'Start Playing 🎮' : 'Next →';
}

function nextTutorialStep() {
  if (tutorialIndex < TUTORIAL_STEPS.length - 1) {
    tutorialIndex++;
    renderTutorialStep();
  } else {
    finishTutorial();
  }
}

function finishTutorial() {
  gameState.tutorialSeen = true;
  saveGame(gameState);
  showGameScreen();
  refreshAllUI();
}

function switchView(viewName) {
  currentView = viewName;
  document.querySelectorAll('.game-view').forEach(function(v) { v.classList.add('hidden'); });
  var targetId = 'view' + viewName.charAt(0).toUpperCase() + viewName.slice(1);
  var target = document.getElementById(targetId);
  if (target) target.classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.view === viewName);
  });
  refreshAllUI();
}

function refreshAllUI() {
  updateTopBar();
  updateDashboard();
  renderBuyStockView();
  renderPricingView();
  renderAchievementsView();
}

function updateTopBar() {
  document.getElementById('topDay').textContent = gameState.day;
  document.getElementById('topCash').textContent = formatRand(gameState.cash);
  document.getElementById('topLevel').textContent = gameState.level;
}

function updateDashboard() {
  document.getElementById('dashRevenue').textContent = formatRand(gameState.totalRevenue);
  document.getElementById('dashProfit').textContent = formatRand(gameState.totalProfit);
  document.getElementById('dashCustomers').textContent = gameState.totalCustomers;
  document.getElementById('dashStockValue').textContent = formatRand(getInventoryValue(gameState.inventory));
}

function renderBuyStockView() {
  var container = document.getElementById('stockList');
  if (!container) return;
  container.innerHTML = '';

  PRODUCTS.forEach(function(p) {
    var inv = gameState.inventory[p.id] || { stock: 0 };
    var buyMult = dayModifiers.buyPriceModifiers[p.id] || 1.0;
    var todayBuyPrice = Math.round(p.buyPrice * buyMult * 100) / 100;
    var isDiscounted = buyMult < 1.0;

    var card = document.createElement('div');
    card.style.cssText = 'background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:0 2px 4px rgba(37,99,235,0.06);border:1px solid #DBEAFE;';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.8rem;">${p.emoji}</span>
          <div>
            <div style="font-weight:700;color:#0F172A;">${p.name}</div>
            <div style="font-size:0.75rem;color:#64748B;">${p.category} · Stock: ${inv.stock}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.7rem;color:#64748B;font-weight:700;">BUY</div>
          <div style="font-weight:800;color:${isDiscounted ? '#10B981' : '#2563EB'};">${formatRand(todayBuyPrice)}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <button data-buy="${p.id}" data-qty="1" class="buy-btn" style="flex:1;padding:10px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:8px;font-weight:700;cursor:pointer;">+1</button>
        <button data-buy="${p.id}" data-qty="5" class="buy-btn" style="flex:1;padding:10px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:8px;font-weight:700;cursor:pointer;">+5</button>
        <button data-buy="${p.id}" data-qty="10" class="buy-btn" style="flex:1;padding:10px;background:#2563EB;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">+10</button>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.buy-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      buyStock(btn.dataset.buy, parseInt(btn.dataset.qty));
    });
  });
}

function buyStock(productId, qty) {
  var product = getProductById(productId);
  if (!product) return;
  var buyMult = dayModifiers.buyPriceModifiers[productId] || 1.0;
  var unitCost = Math.round(product.buyPrice * buyMult * 100) / 100;
  var totalCost = unitCost * qty;

  if (gameState.cash < totalCost) {
    showToast('You don\'t have enough cash for that purchase.', 'error');
    return;
  }

  gameState.cash -= totalCost;
  gameState.inventory[productId].stock += qty;
  saveGame(gameState);
  showToast('Bought ' + qty + 'x ' + product.emoji + ' ' + product.name, 'success');
  refreshAllUI();
}

function renderPricingView() {
  var container = document.getElementById('pricingList');
  if (!container) return;
  container.innerHTML = '';

  PRODUCTS.forEach(function(p) {
    var inv = gameState.inventory[p.id] || { stock: 0, price: p.suggestPrice };
    var unitProfit = inv.price - p.buyPrice;
    var marginPct = inv.price > 0 ? (unitProfit / inv.price * 100).toFixed(0) : 0;

    var card = document.createElement('div');
    card.style.cssText = 'background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:0 2px 4px rgba(37,99,235,0.06);border:1px solid #DBEAFE;';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.8rem;">${p.emoji}</span>
          <div>
            <div style="font-weight:700;color:#0F172A;">${p.name}</div>
            <div style="font-size:0.75rem;color:#64748B;">Cost: ${formatRand(p.buyPrice)} · Suggested: ${formatRand(p.suggestPrice)}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.7rem;color:#64748B;font-weight:700;">PROFIT</div>
          <div style="font-weight:800;color:#10B981;">${formatRand(unitProfit)} (${marginPct}%)</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button data-price-minus="${p.id}" style="width:44px;height:44px;border-radius:8px;border:1px solid #DBEAFE;background:#fff;font-weight:800;font-size:1.2rem;cursor:pointer;">−</button>
        <input type="number" data-price-input="${p.id}" value="${inv.price}" step="0.5" min="0" style="flex:1;padding:12px;border:1.5px solid #DBEAFE;border-radius:8px;font-size:1rem;font-weight:700;text-align:center;">
        <button data-price-plus="${p.id}" style="width:44px;height:44px;border-radius:8px;border:1px solid #DBEAFE;background:#fff;font-weight:800;font-size:1.2rem;cursor:pointer;">+</button>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('[data-price-minus]').forEach(function(btn) {
    btn.addEventListener('click', function() { changePrice(btn.dataset.priceMinus, -0.5); });
  });
  container.querySelectorAll('[data-price-plus]').forEach(function(btn) {
    btn.addEventListener('click', function() { changePrice(btn.dataset.pricePlus, 0.5); });
  });
  container.querySelectorAll('[data-price-input]').forEach(function(input) {
    input.addEventListener('change', function() {
      setPrice(input.dataset.priceInput, parseFloat(input.value));
    });
  });
}

function changePrice(productId, delta) {
  var inv = gameState.inventory[productId];
  if (!inv) return;
  inv.price = Math.max(0, Math.round((inv.price + delta) * 100) / 100);
  saveGame(gameState);
  renderPricingView();
}

function setPrice(productId, price) {
  if (isNaN(price) || price < 0) {
    showToast('Enter a valid selling price.', 'error');
    renderPricingView();
    return;
  }
  gameState.inventory[productId].price = Math.round(price * 100) / 100;
  saveGame(gameState);
  renderPricingView();
}

function renderAchievementsView() {
  var container = document.getElementById('achievementsList');
  if (!container) return;
  var list = getAchievementList(gameState);
  var html = '';
  list.forEach(function(a) {
    var opacity = a.unlocked ? '1' : '0.45';
    var bg = a.unlocked ? '#ECFDF5' : '#F8FAFC';
    var border = a.unlocked ? '#10B981' : '#CBD5E1';
    html += `
      <div style="background:${bg};border:1.5px solid ${border};border-radius:14px;padding:14px;margin-bottom:10px;display:flex;gap:12px;align-items:center;opacity:${opacity};">
        <div style="font-size:2rem;">${a.emoji}</div>
        <div style="flex:1;">
          <div style="font-weight:800;color:#0F172A;">${a.name}</div>
          <div style="font-size:0.8rem;color:#64748B;">${a.description}</div>
        </div>
        ${a.unlocked ? '<div style="color:#10B981;font-weight:800;font-size:1.2rem;">✓</div>' : ''}
      </div>
    `;
  });
  container.innerHTML = html;
}

/* ---------- DIFFICULTY RAMP ---------- */
/* Base customers increase as the days progress.
   Day 1-5:    15
   Day 6-10:   18
   Day 11-20:  22
   Day 21-30:  26
   Day 31+:    30 */
function getBaseCustomerCount(day) {
  if (day <= 5) return 15;
  if (day <= 10) return 18;
  if (day <= 20) return 22;
  if (day <= 30) return 26;
  return 30;
}

function runStore() {
  var totalStock = getTotalStock(gameState.inventory);
  if (totalStock === 0) {
    showToast('You have no stock! Buy products first.', 'error');
    switchView('buyStock');
    return;
  }

  var baseCustomers = getBaseCustomerCount(gameState.day);
  var result = simulateDay(gameState.inventory, dayModifiers, baseCustomers);
  var financials = calculateFinancials(result.sales, []);

  var extraCost = dayModifiers.extraCost || 0;
  if (extraCost > 0) {
    financials.expenses += extraCost;
    financials.netProfit -= extraCost;
    gameState.cash -= extraCost;
  }

  gameState.cash += financials.revenue;
  gameState.totalRevenue += financials.revenue;
  gameState.totalProfit += financials.netProfit;
  gameState.totalCustomers += result.customersServed;
  gameState.totalItemsSold += financials.itemsSold;

  // Save daily report with top products
  gameState.dailyHistory.unshift({
    day: gameState.day,
    revenue: financials.revenue,
    cogs: financials.cogs,
    grossProfit: financials.grossProfit,
    expenses: financials.expenses,
    netProfit: financials.netProfit,
    itemsSold: financials.itemsSold,
    customersServed: result.customersServed,
    sales: result.sales
  });
  if (gameState.dailyHistory.length > 30) gameState.dailyHistory.length = 30;

  renderDailyReport(financials, result);
  switchView('runStore');

  var newAchievements = checkAchievements(gameState);
  newAchievements.forEach(function(a) {
    setTimeout(function() {
      showToast('🏆 Achievement unlocked: ' + a.name, 'success');
    }, 800);
  });

  saveGame(gameState);
}

function renderDailyReport(financials, result) {
  var container = document.getElementById('dailyReport');
  if (!container) return;

  var event = dayModifiers.event;
  var eventHtml = event ? `
    <div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:12px 14px;border-radius:10px;margin-bottom:16px;">
      <div style="font-weight:800;color:#92400E;margin-bottom:4px;">${event.name}</div>
      <div style="font-size:0.85rem;color:#78350F;">${event.description}</div>
    </div>
  ` : '';

  var profitColor = financials.netProfit >= 0 ? '#10B981' : '#EF4444';
  var profitSign = financials.netProfit >= 0 ? '+' : '';

  // Top products of the day
  var topProductsHtml = '';
  if (result.sales && result.sales.length > 0) {
    var sortedSales = result.sales.slice().sort(function(a, b) {
      return (b.sellingPrice * b.quantity) - (a.sellingPrice * a.quantity);
    }).slice(0, 3);

    topProductsHtml = `
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #E2E8F0;">
        <div style="font-size:0.7rem;color:#64748B;font-weight:800;letter-spacing:1px;margin-bottom:10px;">🏆 TOP SELLERS TODAY</div>
        ${sortedSales.map(function(s, i) {
          var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
          return `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span>${medal}</span>
                <span style="font-size:1.3rem;">${s.emoji}</span>
                <span style="font-weight:700;color:#0F172A;">${s.productName}</span>
              </div>
              <div style="font-weight:800;color:#2563EB;">${s.quantity} sold</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  container.innerHTML = `
    ${eventHtml}
    <div style="background:#fff;border-radius:16px;padding:20px;box-shadow:0 4px 16px rgba(37,99,235,0.10);border:1px solid #DBEAFE;margin-bottom:16px;">
      <div style="font-size:0.75rem;color:#2563EB;font-weight:800;letter-spacing:1.5px;margin-bottom:14px;">DAY ${gameState.day} · REPORT</div>
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #E2E8F0;">
        <span style="color:#64748B;font-weight:600;">Revenue</span>
        <span style="font-weight:800;color:#0F172A;">${formatRand(financials.revenue)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #E2E8F0;">
        <span style="color:#64748B;font-weight:600;">Cost of Goods</span>
        <span style="font-weight:800;color:#0F172A;">−${formatRand(financials.cogs)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #E2E8F0;">
        <span style="color:#64748B;font-weight:600;">Gross Profit</span>
        <span style="font-weight:800;color:#10B981;">${formatRand(financials.grossProfit)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #E2E8F0;">
        <span style="color:#64748B;font-weight:600;">Expenses</span>
        <span style="font-weight:800;color:#EF4444;">−${formatRand(financials.expenses)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:14px 0 6px;">
        <span style="color:#0F172A;font-weight:800;">NET PROFIT</span>
        <span style="font-weight:900;font-size:1.2rem;color:${profitColor};">${profitSign}${formatRand(financials.netProfit)}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px;">
        <div style="background:#EFF6FF;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:0.65rem;color:#2563EB;font-weight:800;letter-spacing:1px;">ITEMS SOLD</div>
          <div style="font-weight:800;color:#0F172A;font-size:1.2rem;">${financials.itemsSold}</div>
        </div>
        <div style="background:#ECFDF5;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:0.65rem;color:#059669;font-weight:800;letter-spacing:1px;">CUSTOMERS</div>
          <div style="font-weight:800;color:#0F172A;font-size:1.2rem;">${result.customersServed}</div>
        </div>
      </div>
      ${topProductsHtml}
    </div>
    <button id="nextDayBtn" style="width:100%;padding:18px;background:linear-gradient(135deg,#2563EB,#3B82F6);color:#fff;border:none;border-radius:14px;font-weight:800;font-size:1rem;letter-spacing:1px;cursor:pointer;box-shadow:0 8px 24px rgba(37,99,235,0.35);">
      ▶ START DAY ${gameState.day + 1}
    </button>
  `;

  document.getElementById('nextDayBtn').addEventListener('click', startNextDay);
}

function startNextDay() {
  gameState.day += 1;
  dayModifiers = applyEventEffects(rollDailyEvent());
  saveGame(gameState);

  if (dayModifiers.event) {
    showToast('📢 ' + dayModifiers.event.name + ': ' + dayModifiers.event.description, 'info');
  }

  switchView('dashboard');
}

function showToast(message, type) {
  var container = document.getElementById('toastContainer');
  var toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'info');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(function() { toast.remove(); }, 300);
  }, 2500);
}

function attachUIEvents() {
  document.getElementById('playFreeBtn').addEventListener('click', function() {
    if (gameState.tutorialSeen) {
      showGameScreen();
      refreshAllUI();
    } else {
      showTutorial();
    }
  });
  document.getElementById('premiumBtnLanding').addEventListener('click', function() {
    showGameScreen();
    switchView('premium');
  });
  document.getElementById('nextTutorialBtn').addEventListener('click', nextTutorialStep);
  document.getElementById('skipTutorialBtn').addEventListener('click', finishTutorial);
  document.querySelectorAll('.nav-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { switchView(btn.dataset.view); });
  });
  document.getElementById('runStoreBtn').addEventListener('click', runStore);
  document.getElementById('subscribeBtn').addEventListener('click', function() {
    showToast('Paystack payments arrive in a future version.', 'info');
  });
  document.getElementById('resetGameBtn').addEventListener('click', function() {
    if (confirm('Are you sure? This will permanently delete your current local game progress.')) {
      deleteSave();
      location.reload();
    }
  });
}

document.addEventListener('DOMContentLoaded', initGame);

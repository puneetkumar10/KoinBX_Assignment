const spreadPercent = 0.5; // Total spread between bid and ask
const priceBandPercent = 0.25; // Threshold for re-quoting if price moves
const orderSize = 0.01; // Volume per order (0.01 BTC)
let marketPrice = 30000; // Simulated live price of BTC
let orderBook = {
  buy: null,
  sell: null
};

// === Calculate bid and ask prices based on spread around market price ===
function getSpreadPrices(basePrice) {
  const halfSpread = spreadPercent / 2 / 100;
  return {
    bid: parseFloat((basePrice * (1 - halfSpread)).toFixed(2)),
    ask: parseFloat((basePrice * (1 + halfSpread)).toFixed(2))
  };
}

// === Place new buy and sell orders ===
function placeOrders(basePrice) {
  const { bid, ask } = getSpreadPrices(basePrice);
  orderBook.buy = { price: bid, size: orderSize };
  orderBook.sell = { price: ask, size: orderSize };
  console.log(`Buy: ${bid} USDT for 0.01 BTC | Sell: ${ask} USDT for 0.01 BTC`);
}

// === Cancel both buy and sell orders when price has moved significantly ===
function cancelOrders() {
  console.log("Price moved too much, canceling old orders...");
  orderBook.buy = null;
  orderBook.sell = null;
}

// === Simulate market price movement (±$50 random shift) ===
function simulateMarketMovement() {
  const randomShift = (Math.random() - 0.5) * 2 * 50; // ±50 USDT
  marketPrice = parseFloat((marketPrice + randomShift).toFixed(2));
}

// === Check if price has moved outside acceptable band since last quote ===
function priceMovedTooMuch(oldPrice, newPrice) {
  const diff = Math.abs(oldPrice - newPrice);
  return diff > (priceBandPercent / 100) * oldPrice;
}

// === Main bot loop: update or refresh orders based on market movement ===
function runBot() {
//   console.clear();
  console.log(`Market Price: ${marketPrice} USDT`);

  // If we already have buy orders and price has moved too much, cancel them
  if (
    orderBook.buy &&
    priceMovedTooMuch(orderBook.buy.price, marketPrice)
  ) {
    cancelOrders();
  }

  // If orders are missing or were cancelled, re-place them
  if (!orderBook.buy || !orderBook.sell) {
    placeOrders(marketPrice);
  }

  // Simulate market price changing for next cycle
  simulateMarketMovement();

  // Run again after 5 seconds
  setTimeout(runBot, 5000);
}

runBot();
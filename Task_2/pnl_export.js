const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

// Sample trade data
// JSON
const trades = [
  {
    trade_id: 1,
    user_id: 101,
    pair: "BTC/USDT",
    type: "BUY",
    price: 3000,
    quantity: 0.1,
    fee: 3,
    timestamp: "2024-01-10 12:00:00"
  },
  {
    trade_id: 2,
    user_id: 101,
    pair: "BTC/USDT",
    type: "SELL",
    price: 3200,
    quantity: 0.1,
    fee: 3.2,
    timestamp: "2024-02-10 12:00:00"
  }
];

// Aggregation store
const userStats = {};

for (const trade of trades) {
  const { user_id, type, price, quantity, fee } = trade;
  const pnl = type === "SELL"
    ? (price * quantity) - fee
    : -(price * quantity) - fee;

  if (!userStats[user_id]) {
    userStats[user_id] = {
      user_id,
      total_buys: 0,
      total_sells: 0,
      total_fees: 0,
      net_pnl: 0
    };
  }

  const stats = userStats[user_id];

  if (type === "BUY") {
    stats.total_buys += price * quantity;
  } else {
    stats.total_sells += price * quantity;
  }

  stats.total_fees += fee;
  stats.net_pnl += pnl;
}

const records = Object.values(userStats);

// Format all fields to 2 decimal places
for (const record of records) {
  record.total_buys = parseFloat(record.total_buys.toFixed(2));
  record.total_sells = parseFloat(record.total_sells.toFixed(2));
  record.total_fees = parseFloat(record.total_fees.toFixed(2));
  record.net_pnl = parseFloat(record.net_pnl.toFixed(2));
}

// Prepare for CSV export
const csvWriter = createObjectCsvWriter({
  path: 'user_pnl_summary.csv',
  header: [
    { id: 'user_id', title: 'user_id' },
    { id: 'total_buys', title: 'total_buys' },
    { id: 'total_sells', title: 'total_sells' },
    { id: 'total_fees', title: 'total_fees' },
    { id: 'net_pnl', title: 'net_pnl' }
  ]
});

csvWriter.writeRecords(records)
  .then(() => {
    console.log("user_pnl_summary.csv exported successfully");
  });

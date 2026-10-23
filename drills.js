
import { orders } from "./data.js";

// Save the original data to check immutability

const ORIGINAL = JSON.stringify(orders);

// 1. Array of all order IDs

const orderIds = orders.map(({ id }) => id);
console.log("1. Order IDs:", orderIds);

// 2. Array of customer names

const customerNames = orders.map(({ customer }) => customer.name);
console.log("2. Customer names:", customerNames);

// 3. All delivered orders

const deliveredOrders = orders.filter(
  ({ status }) => status === "delivered"
);
console.log("3. Delivered orders:", deliveredOrders);

// 4. All orders from Gasabo

const gasaboOrders = orders.filter(
  ({ customer }) => customer.district === "Gasabo"
);
console.log("4. Gasabo orders:", gasaboOrders);

// 5. Find the order with ID 106

const order106 = orders.find(({ id }) => id === 106);
console.log("5. Order 106:", order106);

// 6. Does any order have a rating of 3 or lower?

const hasLowRating = orders.some(
  ({ rating }) => rating !== null && rating <= 3
);
console.log("6. Has rating of 3 or lower:", hasLowRating);

// 7. Are all pending orders unrated?
const pendingOrdersUnrated = orders
  .filter(({ status }) => status === "pending")
  .every(({ rating }) => rating === null);
console.log("7. Pending orders are unrated:", pendingOrdersUnrated);

// 8. Unique customer names
const uniqueNames = [...new Set(customerNames)];
console.log("8. Unique names:", uniqueNames);

// Check that the original data has not changed
console.log("ORIGINAL:", JSON.stringify(orders) === ORIGINAL);



 // Helper: calculate the total price of one order
const orderTotal = ({ items }) =>
  items.reduce((total, { price, qty }) => total + price * qty, 0);

// 9. Add a total to every order without changing the original orders
const ordersWithTotal = orders.map((order) => ({
  ...order,
  total: orderTotal(order)
}));
console.log("9. Orders with totals:", ordersWithTotal);

// 10. Total revenue from delivered orders only
const deliveredRevenue = orders
  .filter(({ status }) => status === "delivered")
  .reduce((total, order) => total + orderTotal(order), 0);
console.log("10. Delivered revenue:", deliveredRevenue);

// 11. Average rating, ignoring null ratings, rounded to 1 decimal
const ratedOrders = orders.filter(({ rating }) => rating !== null);

const averageRating = Number(
  (
    ratedOrders.reduce((total, { rating }) => total + rating, 0) /
    ratedOrders.length
  ).toFixed(1)
);
console.log("11. Average rating:", averageRating);

// 12. Total quantity of Brochettes sold across all orders
const brochetteQuantity = orders
  .flatMap(({ items }) => items)
  .filter(({ name }) => name === "Brochette")
  .reduce((total, { qty }) => total + qty, 0);
console.log("12. Brochettes sold:", brochetteQuantity);

// 13. The single most expensive order
const mostExpensiveOrder = ordersWithTotal.reduce(
  (mostExpensive, order) =>
    order.total > mostExpensive.total ? order : mostExpensive
);
console.log("13. Most expensive order:", mostExpensiveOrder);

// 14. Number of orders per status
const ordersPerStatus = orders.reduce((counts, { status }) => {
  counts[status] = (counts[status] || 0) + 1;
  return counts;
}, {});
console.log("14. Orders per status:", ordersPerStatus);

// Check that the original data has not changed
console.log("ORIGINAL:", JSON.stringify(orders) === ORIGINAL);



 // 15. Revenue per district from delivered orders
const revenueByDistrict = orders
  .filter(({ status }) => status === "delivered")
  .reduce((revenue, order) => {
    const { district } = order.customer;

    revenue[district] =
      (revenue[district] || 0) + orderTotal(order);

    return revenue;
  }, {});

console.log("15. Revenue by district:", revenueByDistrict);

// 16. Group orders by date and calculate count and revenue
const ordersByDate = Object.groupBy(
  orders,
  ({ date }) => date
);

const dailySummary = Object.entries(ordersByDate).map(
  ([date, dateOrders]) => ({
    date,
    count: dateOrders.length,
    revenue: dateOrders
      .filter(({ status }) => status === "delivered")
      .reduce((total, order) => total + orderTotal(order), 0)
  })
);

console.log("16. Daily summary:", dailySummary);

// 17. Top 3 best-selling items by quantity
const itemQuantities = orders
  .flatMap(({ items }) => items)
  .reduce((totals, { name, qty }) => {
    totals[name] = (totals[name] || 0) + qty;
    return totals;
  }, {});

const topThreeItems = Object.entries(itemQuantities)
  .map(([name, qty]) => ({ name, qty }))
  .toSorted((a, b) => b.qty - a.qty)
  .slice(0, 3);

console.log("17. Top 3 best-selling items:", topThreeItems);

// 18. Each customer's number of orders and total spent
const customerSummary = Object.entries(
  orders.reduce((customers, order) => {
    const { name } = order.customer;

    if (!customers[name]) {
      customers[name] = { name, orders: 0, spent: 0 };
    }

    customers[name].orders += 1;
    customers[name].spent += orderTotal(order);

    return customers;
  }, {})
)
  .map(([name, summary]) => summary)
  .toSorted((a, b) => b.spent - a.spent);

console.log("18. Customer summary:", customerSummary);

// 19. Menu price list using Object.fromEntries
const menuPrices = Object.fromEntries(
  orders
    .flatMap(({ items }) => items)
    .map(({ name, price }) => [name, price])
    .filter(
      ([name], index, items) =>
        items.findIndex(([itemName]) => itemName === name) === index
    )
);

console.log("19. Menu prices:", menuPrices);

// Check that the original data has not changed
console.log("ORIGINAL:", JSON.stringify(orders) === ORIGINAL);

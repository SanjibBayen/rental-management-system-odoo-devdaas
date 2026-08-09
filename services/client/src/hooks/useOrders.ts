const { 
  orders, 
  isLoading, 
  filters, 
  setFilters, 
  loadMore, 
  returnOrder,
  getOrderStats 
} = useOrders();

// Filter by status
setFilters({ status: 'active' });

// Sort by amount
setFilters({ sortBy: 'amount', sortOrder: 'desc' });

// Search orders
setFilters({ searchQuery: 'camera' });

// Load more orders
loadMore();

// Get statistics
const stats = getOrderStats();
console.log(`Active orders: ${stats.active}`);
console.log(`Total spent: ₹${stats.totalSpent}`);
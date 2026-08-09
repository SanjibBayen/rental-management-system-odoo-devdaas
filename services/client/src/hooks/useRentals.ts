// User view
const { rentals, isLoading, returnRental, getRentalStats } = useRentals({ 
  view: 'user' 
});

// Admin view with filters
const { rentals, updateFilters, approveRental } = useRentals({ 
  view: 'all' 
});

// Filter by status
updateFilters({ status: 'overdue' });

// Get statistics
const stats = getRentalStats();
console.log(`Active: ${stats.active}, Revenue: ₹${stats.totalRevenue}`);
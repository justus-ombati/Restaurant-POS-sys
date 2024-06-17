const roles = {
    admin: ['createUser', 'manageInventory', 'viewReports', 'manageOrders', 'manageSettings'],
    manager: ['manageInventory', 'viewReports', 'manageOrders', 'manageUsers', 'manageSettings'],
    kitchen: ['viewOrders', 'updateOrderStatus'],
    waitstaff: ['createOrder', 'viewOrders', 'updateOrderStatus']
};

module.exports = roles;
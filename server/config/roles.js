const roles = {
    admin: ['createUser', 'manageInventory', 'viewReports', 'manageOrders', 'manageSettings'],
    manager: ['manageInventory', 'viewReports', 'manageOrders', 'manageUsers', 'manageSettings'],
    kitchen: ['viewInventory', 'viewOrders', 'updateOrderStatus'],
    waitstaff: ['viewInventory', 'createOrder', 'viewOrders', 'updateOrderStatus']
};

module.exports = roles;
const roles = {
    admin: ['createUser', 'manageInventory', 'viewReports', 'manageSettings'],
    manager: ['manageInventory', 'manageMenu', 'viewReports', 'manageOrders', 'manageUsers', 'manageSettings'],
    kitchen: ['viewInventory', 'viewOrders', 'updateOrderStatus', 'manageOrders'],
    waitstaff: ['viewInventory', 'createOrder', 'viewOrders', 'manageOrders', 'updateOrderStatus']
};

module.exports = roles;
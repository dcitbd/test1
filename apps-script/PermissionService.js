var PermissionService = {
  canAccess: function(session, requiredRole) {
    if (!session || !session.role) return false;
    if (session.role === CONFIG.ROLES.SUPER_ADMIN) return true;
    if (session.role === requiredRole) return true;
    var levels = { SUPER_ADMIN: 100, ADMIN: 80, STAFF: 50, SELLER: 30, RESELLER: 20, WHOLESALE_CUSTOMER: 20, CUSTOMER: 10 };
    return (levels[session.role] || 0) >= (levels[requiredRole] || 0);
  },
  verifySellerScope: function(session, sId) {
    if (!session) return false;
    if (session.role === CONFIG.ROLES.SUPER_ADMIN || session.role === CONFIG.ROLES.ADMIN) return true;
    return session.role === CONFIG.ROLES.SELLER && (session.user_id === sId || session.seller_id === sId);
  },
  verifyCustomerOrderScope: function(session, cId) {
    if (!session) return false;
    if (session.role === CONFIG.ROLES.SUPER_ADMIN || session.role === CONFIG.ROLES.ADMIN || session.role === CONFIG.ROLES.STAFF) return true;
    return session.user_id === cId;
  }
};
if (typeof module !== 'undefined') module.exports = PermissionService;

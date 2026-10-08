/**
 * DREAM CART BD — CONCURRENCY & LOCK SERVICE
 * Prevents race conditions during stock deductions, orders, and ledger updates.
 */

var AppLockService = {
  TIMEOUT_MS: 15000,

  runWithLock: function(lockKey, callback) {
    var lock = LockService.getScriptLock();
    var acquired = false;
    try {
      acquired = lock.tryLock(this.TIMEOUT_MS);
      if (!acquired) {
        throw new Error("System busy: Could not acquire lock for " + (lockKey || "operation") + " within " + (this.TIMEOUT_MS / 1000) + "s. Please try again.");
      }
      return callback();
    } finally {
      if (acquired) {
        lock.releaseLock();
      }
    }
  },

  runWithUserLock: function(userKey, callback) {
    var lock = LockService.getUserLock();
    var acquired = false;
    try {
      acquired = lock.tryLock(this.TIMEOUT_MS);
      if (!acquired) {
        throw new Error("Conflict: User action in progress. Please wait a moment.");
      }
      return callback();
    } finally {
      if (acquired) {
        lock.releaseLock();
      }
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = AppLockService;
}

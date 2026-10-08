var NotificationService = {
  queue: function(data) {
    SheetRepository.appendRow(CONFIG.SHEETS.NOTIFICATIONS_QUEUE, { notification_id: IDGenerator.generate("NOTIF"), recipient: data.recipient || "", message: data.message || "", status: "QUEUED", created_at: new Date().toISOString() });
  }
};
if (typeof module !== 'undefined') module.exports = NotificationService;

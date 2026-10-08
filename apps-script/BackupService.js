var BackupService = {
  snapshot: function() {
    var folder = DriveRepository.getSubFolder("Database_Backups");
    var file = DriveApp.getFileById(CONFIG.SPREADSHEET_ID);
    var copy = file.makeCopy("Backup_DreamCartBD_" + new Date().toISOString().slice(0, 10), folder);
    return { success: true, backup_id: copy.getId(), url: copy.getUrl() };
  }
};
if (typeof module !== 'undefined') module.exports = BackupService;

/**
 * DREAM CART BD — DRIVE REPOSITORY
 * Manages Google Drive media assets, product images, documents, invoices, and backups.
 */

var DriveRepository = {
  _rootFolder: null,

  getRootFolder: function() {
    if (!this._rootFolder) {
      var folders = DriveApp.getFoldersByName(CONFIG.DRIVE_ROOT_FOLDER_NAME);
      if (folders.hasNext()) {
        this._rootFolder = folders.next();
      } else {
        this._rootFolder = DriveApp.createFolder(CONFIG.DRIVE_ROOT_FOLDER_NAME);
      }
    }
    return this._rootFolder;
  },

  getSubFolder: function(name) {
    var root = this.getRootFolder();
    var subs = root.getFoldersByName(name);
    if (subs.hasNext()) {
      return subs.next();
    }
    return root.createFolder(name);
  },

  saveBase64Image: function(base64Data, filename, subfolderName) {
    try {
      var folder = this.getSubFolder(subfolderName || "ProductImages");
      var cleanBase64 = base64Data;
      var contentType = "image/jpeg";
      
      if (base64Data.indexOf(";base64,") !== -1) {
        var parts = base64Data.split(";base64,");
        contentType = parts[0].replace("data:", "");
        cleanBase64 = parts[1];
      }
      
      var decodedBytes = Utilities.base64Decode(cleanBase64);
      var blob = Utilities.newBlob(decodedBytes, contentType, filename || ("img_" + Date.now() + ".jpg"));
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      var fileId = file.getId();
      var viewUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
      var thumbUrl = "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w400";
      
      return {
        success: true,
        file_id: fileId,
        url: viewUrl,
        thumbnail_url: thumbUrl,
        download_url: file.getDownloadUrl()
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString()
      };
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = DriveRepository;
}

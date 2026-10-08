var MediaService = {
  uploadImage: function(base64, filename) { return DriveRepository.saveBase64Image(base64, filename, "ProductImages"); }
};
if (typeof module !== 'undefined') module.exports = MediaService;

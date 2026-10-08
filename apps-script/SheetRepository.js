/**
 * DREAM CART BD — SHEET REPOSITORY
 * High-performance batch read/write, indexing, header mapping, avoiding per-cell operations.
 */

var SheetRepository = {
  _ss: null,

  getSpreadsheet: function() {
    if (!this._ss) {
      var id = CONFIG.SPREADSHEET_ID;
      this._ss = SpreadsheetApp.openById(id);
    }
    return this._ss;
  },

  getSheet: function(sheetName) {
    var ss = this.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      // Auto-create sheet if missing to avoid breaking
      sheet = ss.insertSheet(sheetName);
    }
    return sheet;
  },

  getAllRows: function(sheetName) {
    var sheet = this.getSheet(sheetName);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow < 1 || lastCol < 1) return [];
    
    var data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    if (data.length <= 1) return [];
    
    var headers = data[0].map(function(h) { return String(h).trim(); });
    var results = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rowObj = { _rowNumber: i + 1 };
      var isEmpty = true;
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        if (key) {
          rowObj[key] = row[j];
          if (row[j] !== "" && row[j] !== null && row[j] !== undefined) {
            isEmpty = false;
          }
        }
      }
      if (!isEmpty) {
        results.push(rowObj);
      }
    }
    return results;
  },

  findRows: function(sheetName, filterFn) {
    var all = this.getAllRows(sheetName);
    return all.filter(filterFn);
  },

  findOne: function(sheetName, filterFn) {
    var all = this.getAllRows(sheetName);
    for (var i = 0; i < all.length; i++) {
      if (filterFn(all[i])) return all[i];
    }
    return null;
  },

  appendRow: function(sheetName, rowObj) {
    var sheet = this.getSheet(sheetName);
    var lastCol = sheet.getLastColumn();
    var headers = [];
    if (lastCol > 0) {
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h).trim(); });
    }
    
    // If headers empty or missing keys, establish them
    if (headers.length === 0) {
      headers = Object.keys(rowObj);
      sheet.appendRow(headers);
    } else {
      var newKeys = Object.keys(rowObj).filter(function(k) { return headers.indexOf(k) === -1 && !k.startsWith("_"); });
      if (newKeys.length > 0) {
        headers = headers.concat(newKeys);
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
    }

    var rowArray = headers.map(function(h) {
      return rowObj[h] !== undefined ? rowObj[h] : "";
    });

    sheet.appendRow(rowArray);
    return true;
  },

  appendRowsBatch: function(sheetName, rowObjs) {
    if (!rowObjs || rowObjs.length === 0) return true;
    var sheet = this.getSheet(sheetName);
    var lastCol = sheet.getLastColumn();
    var headers = [];
    if (lastCol > 0) {
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h).trim(); });
    }

    if (headers.length === 0) {
      headers = Object.keys(rowObjs[0]);
      sheet.appendRow(headers);
    }

    var rowsMatrix = [];
    for (var r = 0; r < rowObjs.length; r++) {
      var obj = rowObjs[r];
      var row = headers.map(function(h) {
        return obj[h] !== undefined ? obj[h] : "";
      });
      rowsMatrix.push(row);
    }

    var startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rowsMatrix.length, headers.length).setValues(rowsMatrix);
    return true;
  },

  updateRowByCondition: function(sheetName, conditionFn, updateFields) {
    var sheet = this.getSheet(sheetName);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow <= 1) return false;

    var range = sheet.getRange(1, 1, lastRow, lastCol);
    var values = range.getValues();
    var headers = values[0].map(function(h) { return String(h).trim(); });

    var updatedCount = 0;
    for (var i = 1; i < values.length; i++) {
      var rowObj = {};
      for (var j = 0; j < headers.length; j++) {
        rowObj[headers[j]] = values[i][j];
      }
      if (conditionFn(rowObj)) {
        for (var key in updateFields) {
          var colIdx = headers.indexOf(key);
          if (colIdx !== -1) {
            values[i][colIdx] = updateFields[key];
          }
        }
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      range.setValues(values);
    }
    return updatedCount > 0;
  }
};

if (typeof module !== 'undefined') {
  module.exports = SheetRepository;
}

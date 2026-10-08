var Database = {
  getTable: function(name) { return SheetRepository.getSheet(name); },
  findAll: function(name) { return SheetRepository.getAllRows(name); },
  insert: function(name, obj) { return SheetRepository.appendRow(name, obj); },
  updateWhere: function(name, pred, upd) { return SheetRepository.updateRowByCondition(name, pred, upd); }
};
if (typeof module !== 'undefined') module.exports = Database;

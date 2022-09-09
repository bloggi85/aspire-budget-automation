/**
 * This module registers new functionality to manage adding, renaming
 *  and deleting of categories with Aspire Budget
 */

/**
 * Register items in the menu bar
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Budget Tools')
    .addItem('Add category', 'addCategoryModal')
    .addItem('Rename category', 'renameCategoryModal')
    .addItem('Delete category', 'deleteCategoryModal')
    .addToUi();
}

/**
 * Handling the menu option click events below
 */
function addCategoryModal() {
  var htmlDlg = HtmlService.createHtmlOutputFromFile('AddCategory.html')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  SpreadsheetApp.getUi()
    .showModalDialog(htmlDlg, 'Add new category');
};

function deleteCategoryModal() {
  var htmlDlg = HtmlService.createHtmlOutputFromFile('DeleteCategory.html')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  SpreadsheetApp.getUi()
    .showModalDialog(htmlDlg, 'Delete category');
};

function renameCategoryModal() {
  var htmlDlg = HtmlService.createHtmlOutputFromFile('RenameCategory.html')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  SpreadsheetApp.getUi()
    .showModalDialog(htmlDlg, 'Rename category');
};


/**
 * Handle incoming requests and post submissions below
 */

// All category types
function getCategoriesTypesList() {
  var spreadsheet = SpreadsheetApp.getActive();
  var categoryIcon = spreadsheet.getRangeByName("v_ReportableCategorySymbol").getValue();
  var nonReportableBudgetCategoryIcon = spreadsheet.getRangeByName("v_NonReportableCategorySymbol").getValue();
  var debtCategoryIcon = spreadsheet.getRangeByName("v_CategoryGroupSymbol").getValue();
  var categoryGroupIcon = spreadsheet.getRangeByName("v_DebtAccountSymbol").getValue();

  var categoryTypeList = [
    [
      categoryIcon, categoryIcon + " Category",
    ],
    [
      nonReportableBudgetCategoryIcon, nonReportableBudgetCategoryIcon + " Non-reportable Category",
    ],
    [
      debtCategoryIcon, debtCategoryIcon + " Debt Category",
    ],
    [
      categoryGroupIcon, categoryGroupIcon + " Category Group",
    ]
  ];

  console.info(categoryTypeList);

  return categoryTypeList;
}

// All categories
function getCategoriesList() {
  var spreadsheet = SpreadsheetApp.getActive();
  var configData = spreadsheet.getRangeByName("r_ConfigurationData");
  var categoryList = [];
  configData.getValues().forEach(function (val) {
    if (val[1] != "") {
      categoryList.push([val[1], val[0] + " " + val[1]]);
    }
  })
  console.info(categoryList);

  return categoryList;
}

// Types of emergency fund status
function getEmergencyFundTypesList() {
  return [
    ["✓", "✓ Include in Calculation"],
    ["✕", "✕ Exclude from Calculation"]
  ];
}

// Handle Rename Category form submit
function handleRenameCategory(form) {
  var spreadsheet = SpreadsheetApp.getActive();
  

  var oldCategoryName = form.CategoryName;
  var newCategoryName = form.NewCategoryName;

  if ( oldCategoryName == null || oldCategoryName.length == 0 ) {
    Logger.log("ERROR - category name is invalid: '%s'", oldCategoryName);
    return;
  }

  if ( newCategoryName == null || newCategoryName.length == 0 ) {
    Logger.log("ERROR - category name is invalid: '%s'", newCategoryName);
    return;
  }

  var configData = spreadsheet.getRangeByName("r_ConfigurationData");
  if (findInRangeAtColumnIndex_(configData, newCategoryName, getConfigDataCategoryNameColumnIndex_() ) != false ) {
    Logger.log("ERROR - Category '%s' already exists on the configuration sheet.", oldCategoryName);
    return;
  }

  // rename in config sheet
  findReplaceInRange_(configData, oldCategoryName, newCategoryName);

  // rename in transactions
  var categoriesRangeInTransactionSheet = spreadsheet.getRangeByName("trx_Categories");
  findReplaceInRange_(categoriesRangeInTransactionSheet, oldCategoryName, newCategoryName);

  //rename in category transfers
  var fromCategoriesRangeInCategoryTransferSheet = spreadsheet.getRangeByName("cts_FromCategories");
  var toCategoriesRangeInCategoryTransferSheet = spreadsheet.getRangeByName("cts_ToCategories");
  findReplaceInRange_(fromCategoriesRangeInCategoryTransferSheet, oldCategoryName, newCategoryName);
  findReplaceInRange_(toCategoriesRangeInCategoryTransferSheet, oldCategoryName, newCategoryName);

  // Rename in reports
  Logger.log("Changing reference from '%s' to '%s' from Transactions Report sheet.", oldCategoryName, newCategoryName);
  findReplaceInRange_(getTransactionsReportCategoryFilter_(), oldCategoryName,  newCategoryName);
  Logger.log("Changing reference from '%s' to '%s' from Category Transfer sheet.", oldCategoryName, newCategoryName);
  findReplaceInRange_(getCategoryTransferCategoryFilter_(), oldCategoryName,  newCategoryName);
  Logger.log("Changing reference from '%s' to '%s' from Category Report sheet.", oldCategoryName, newCategoryName);
  findReplaceInRange_(getCategoryReportCategoryFilter_(), oldCategoryName,  newCategoryName);
  Logger.log("Changing reference from '%s' to '%s' from Spending Report sheet.", oldCategoryName, newCategoryName);
  findReplaceInRange_(getSpendingReportsCategoryFilter_(), oldCategoryName,  newCategoryName);
  Logger.log("Changing reference from '%s' to '%s' from Trend Report sheet.", oldCategoryName, newCategoryName);
  getTrendReportsCategoryFilters_().getRanges().forEach(range => range.createTextFinder(oldCategoryName).replaceAllWith( newCategoryName));


}





// Handle Add Category form submit
function handleAddCategory(form) {

  var insertAfter = form.AddAfter;
  var newCategorySymbol = form.NewCategorySymbol;
  var newCategoryName = form.NewCategoryName;
  var newCategoryMonthlyAmount = form.NewCategoryMonthlyAmount;
  var newCategoryAmount = form.NewCategoryAmount;
  var newEmergencyFund = form.NewEmergencyFund;;
  var toInsert = [[newCategorySymbol, newCategoryName, newCategoryAmount, newCategoryMonthlyAmount, newEmergencyFund]];

  var spreadsheet = SpreadsheetApp.getActive();
  var configData = spreadsheet.getRangeByName("r_ConfigurationData");
  var configSheet = configData.getSheet();
  var configDataFirstRow = configData.getRowIndex();
  var configDataLastRow = configData.getLastRow();

  if (configSheet.getRange(configDataLastRow, getConfigDataCategoryNameColumnIndex_()).getValue() != "") {
    Logger.log("Error - the spreadsheet is full. Please clear some categories from the configuration sheet")
    return;
  }

  var insertAtRow = findInRangeAtColumnIndex_(configData, insertAfter, getConfigDataCategoryNameColumnIndex_());

  if (insertAtRow == false) {
    insertAtRow = configDataFirstRow;
  }

  // Add after the line we found. Adding 1
  addDataIntoRangeAtRowNumber_(configData, insertAtRow + 1, toInsert);

  return true;
}




// Handle Delete Category form submit
function handleDeleteCategory(form) {    // Select Sheet   var ss = SpreadsheetApp.getActiveSpreadsheet();

  var categoryName = form.DeleteCategory;

  if (categoryName == null || categoryName.length == 0) {
    Logger.log("Error - no category name provided.");
    return;
  }

  var spreadsheet = SpreadsheetApp.getActive();
  var configData = spreadsheet.getRangeByName("r_ConfigurationData");

  // Find the last row within hidden categories that is empty.
  var lastDataCellInRange = getLastRowInDataRange_(getConfigDataHiddenCategoriesRange_());

  // Enure Hidden Categories range isn't full
  if (lastDataCellInRange.getRowIndex() == getConfigDataHiddenCategoriesRange_().getLastRow()) {
    Logger.log("Error - the hidden categories range is full. Please clear some categories from the hidden categories range on the configuration sheet");
    return;
  }
  // Determine which row index needs to be removed.
  var rowIndexToRemove = findInRangeAtColumnIndex_(configData, categoryName, getConfigDataCategoryNameColumnIndex_());

  // Do nothing if the category cannot be found
  if (rowIndexToRemove == false) {
    Logger.log("Error - the category '%s' could not be found in the configuration sheet.", categoryName);
    return false;
  }

  // Add after the line we found. Adding 1
  var toInsert = [[categoryName]];
  Logger.log("Adding category '%s' to list of hidden categories", categoryName);
  addDataIntoRangeAtRowNumber_(getConfigDataHiddenCategoriesRange_(), lastDataCellInRange.getRow() + 1, toInsert);

  // Delete the category from the config range by copying all following rows one line up.
  Logger.log("Deleting category '%s' from list of categories on config sheet.", categoryName);
  deleteRowFromRangeByShiftingRowsUp_(configData, rowIndexToRemove);

  // Clear any of the report filters when deleting/

  Logger.log("Clear reference to '%s' from Transactions Report sheet.", categoryName);
  findReplaceInRange_(getTransactionsReportCategoryFilter_(), categoryName, "");
  Logger.log("Clear reference to '%s' from Category Transfer sheet.", categoryName);
  findReplaceInRange_(getCategoryTransferCategoryFilter_(), categoryName, "");
  Logger.log("Clear reference to '%s' from Category Report sheet.", categoryName);
  findReplaceInRange_(getCategoryReportCategoryFilter_(), categoryName, "");
  Logger.log("Clear reference to '%s' from Spending Report sheet.", categoryName);
  findReplaceInRange_(getSpendingReportsCategoryFilter_(), categoryName, "");
  Logger.log("Clear reference to '%s' from Trend Report sheet.", categoryName);
  getTrendReportsCategoryFilters_().getRanges().forEach(range => range.createTextFinder(categoryName).replaceAllWith(""));

  return true;
}


/**
 * Custom ranges that don't exist in Aspire
 * Remove these when official ranges become available.
 */
function getConfigDataHiddenCategoriesRange_() {
  var spreadsheet = SpreadsheetApp.getActive();
  var configData = spreadsheet.getRangeByName("r_ConfigurationData");
  var configSheet = configData.getSheet();
  return configSheet.getRange("H42:H86");
}
function getTransactionsReportCategoryFilter_() {
  var spreadsheet = SpreadsheetApp.getActive();
  var transactionsData = spreadsheet.getRangeByName("trx_Accounts");
  var transactionsSheet = transactionsData.getSheet();
  return transactionsSheet.getRange("F4");
}
function getCategoryTransferCategoryFilter_() {
  var spreadsheet = SpreadsheetApp.getActive();
  var categoryTransfersData = spreadsheet.getRangeByName("cts_Dates");
  var categoryTransfersSheet = categoryTransfersData.getSheet();
  return categoryTransfersSheet.getRange("E3");
}
function getCategoryReportCategoryFilter_() {
  var spreadsheet = SpreadsheetApp.getActive();
  var categoryReportSheet = spreadsheet.getSheetByName("Category Reports");
  return categoryReportSheet.getRange("B7");
}
function getSpendingReportsCategoryFilter_() {
  var spreadsheet = SpreadsheetApp.getActive();
  var categoryReportSheet = spreadsheet.getSheetByName("Spending Reports");
  return categoryReportSheet.getRange("B36:C36");
}
function getTrendReportsCategoryFilters_() {
  var spreadsheet = SpreadsheetApp.getActive();
  var categoryReportSheet = spreadsheet.getSheetByName("Trend Reports");
  return categoryReportSheet.getRangeList(["B8", "B10", "B12", "B14", "B16", "B18", "B28:C28"]);
}



/**
 * Helper functions below
 */
function getLastRowInDataRange_(range) {
  var lastDataRowIndex = range.getNextDataCell( SpreadsheetApp.Direction.DOWN).getRowIndex();

  //Ensure we don't exceed the range itself.
  if (lastDataRowIndex > range.getLastRow()) {
    lastDataRowIndex = range.getLastRow();
  }
  return range.getSheet().getRange( lastDataRowIndex, range.getColumn(), 1, range.getNumColumns());
}

function getConfigDataCategoryNameColumnIndex_() {
  var spreadsheet = SpreadsheetApp.getActive();
  var configData = spreadsheet.getRangeByName("r_ConfigurationData");
  var configDataFirstColumn = configData.getColumn();
  return configDataFirstColumn + 1;
}

function deleteRowFromRangeByShiftingRowsUp_(range, rowIndex) {
  var lastDataRowInRange = getLastRowInDataRange_(range);
  // Only shift items up if this isn't the last row.
  if (lastDataRowInRange.getRowIndex() > rowIndex) {
    Logger.log("Not deleting last row in range...Shifting rows up by 1");
    range
      .getSheet()
      .getRange(rowIndex + 1, range.getColumn(), range.getLastRow() - rowIndex, range.getNumColumns())
      .copyTo(range.getSheet().getRange(rowIndex, range.getColumn()));
  }
  Logger.log("Clearing the last item in the list.");
  lastDataRowInRange.clear();
  return;
}

function addDataIntoRangeAtRowNumber_(range, rowNumber, toInsert) {
  var sheet = range.getSheet();
  var rangeFirstColumn = range.getColumn();
  var rangeLastRow = range.getLastRow();

  // check that there is space for the row to be added.
  var lastRowValue = sheet.getRange(rangeLastRow,rangeFirstColumn).getValue();
  if (lastRowValue != "") {
    Logger.log("addDataIntoRangeAtRowNumber rowNumber:" + rowNumber + " failed. The range is full.");
    return;
  }

  // copy all rows after the row we found down one row
  var numRowsToCopy = rangeLastRow - rowNumber ;
  sheet.getRange(rowNumber, rangeFirstColumn, numRowsToCopy, toInsert[0].length).copyTo(
    sheet.getRange(rowNumber + 1, rangeFirstColumn, numRowsToCopy, toInsert[0].length),
    { contentsOnly: true }
  );

  // Insert new row under the one we found
  sheet.getRange(rowNumber, rangeFirstColumn, 1, toInsert[0].length).setValues(toInsert);
}

function findReplaceInRange_(range, find, replace) {
  range
    .createTextFinder(find)
    .replaceAllWith(replace);
}

function findInRange_(range, needle) {
  var firstMatch = range.createTextFinder(needle).findNext();

  if (firstMatch != null) {
    return firstMatch.getRowIndex();
  }
  return false;
}

function findInRangeAtColumnIndex_(range, needle, columnIndex) {
  var rangeToSearch = range.getSheet().getRange(range.getRowIndex(), columnIndex, range.getNumRows(), 1);

  return findInRange_(rangeToSearch, needle );

}
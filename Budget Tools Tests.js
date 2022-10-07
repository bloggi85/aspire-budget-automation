/**
 * Pseudo Unit-level tests for the common functions in Budget Tools.
 */
var testRange;
var testRangeFull;
const testRangeStartRow = 2;
const testRangeStartColumn = 2;
const testRangeValues =     [
  [ "B2", "C2", "D2","E2", "F2" ],
  [ "B3", "C3", "D3","E3", "F3" ],
  [ "B4", "C4", "D4","E4", "F4" ],
  [ "B5", "C5", "D5","E5", "F5" ],
  [ "B6", "C6", "D6","E6", "F6" ],
  [ "B7", "C7", "D7","E7", "F7" ],
  [ "B8", "C8", "D8","E8", "F8" ],
  [ "B9", "C9", "D9","E9", "F9" ],
  [ "B10", "C10", "D10","E10", "F10" ],
  [ "B11", "C11", "D11","E11", "F11" ],
  [ "B12", "C12", "D12","E12", "F12" ],
  [ "B13", "C13", "D13","E13", "F13" ],
  [ "B14", "C14", "D14","E14", "F14" ],
  [ "B15", "C15", "D15","E15", "F15" ],
  [ "B16", "C16", "D16","E16", "F16" ],
  [ "B17", "C17", "D17","E17", "F17" ],
  [ "B18", "C18", "D18","E18", "F18" ],
  [ "B19", "C19", "D19","E19", "F19" ],
  [ "B20", "C20", "D20","E20", "F20" ],
  [ "B21", "C21", "D21","E21", "F21" ],
  [ "B22", "C22", "D22","E22", "F22" ],
  [ "B23", "C23", "D23","E23", "F23" ],
  [ "B24", "C24", "D24","E24", "F24" ],
  [ "B25", "C25", "D25","E25", "F25" ],
  [ "B26", "C26", "D26","E26", "F26" ],
];


function testAll(){
  testAddCategoryAssertAddedSuccessfully();
  testAddCategoryAssertLastRowAddedSuccessfully();
  testAddCategoryAssertRangeFull();

  testAppendToRangeAssertAppendedSuccessfully();
  testAppendRangeAssertFullRangeAndNotAdded();

  testGetLastRowIndexInDataRange();
  testDeleteRowFromRangeByShiftingRowsUpAssertDeleteSuccess();
  testDeleteRowFromRangeByShiftingRowsUpAssertLastRowAndDeleteSuccess();
  testFindCategoryAssertFound();
}


function setUp_() {
  const rowCount = testRangeValues.length ;
  const columnCount = testRangeValues[0].length;
  var sheet = SpreadsheetApp.getActive().getSheetByName("__test_sheet");
  if (sheet != null ) {
    SpreadsheetApp.getActive().deleteSheet( sheet );
  }
  sheet = SpreadsheetApp.getActive().insertSheet("__test_sheet");

  sheet.getRange(testRangeStartRow,testRangeStartColumn,rowCount,columnCount).setValues( testRangeValues ); 
  testRange = sheet.getRange( testRangeStartRow,testRangeStartColumn,rowCount+100,columnCount);
  testRangeFull = sheet.getRange( testRangeStartRow,testRangeStartColumn,rowCount,columnCount);
}

function assertEquals_(message, expected, actual) {
  if (actual !== expected) {
    Logger.log( message + " Actual value '" + actual + "' does not match expected value '" + expected + "'");
  }
}
function assert_(message, assert) {
  if (assert !== true) {
    Logger.log(message);
  }
}
function tearDown_(){
  if (testRange != null) {
    SpreadsheetApp.getActive().deleteSheet( testRange.getSheet());
  }
}




function testAddCategoryAssertAddedSuccessfully() {

  setUp_();


  var expected =  [
    [ "B2", "C2", "D2","E2", "F2" ],
    [ "B3", "C3", "D3","E3", "F3" ],
    [ "B4", "C4", "D4","E4", "F4" ],
    [ "B5", "C5", "D5","E5", "F5" ],
    [ "b", "c", "d", "e", "f"],
    [ "B6", "C6", "D6","E6", "F6" ],
    [ "B7", "C7", "D7","E7", "F7" ],
    [ "B8", "C8", "D8","E8", "F8" ],
    [ "B9", "C9", "D9","E9", "F9" ],
    [ "B10", "C10", "D10","E10", "F10" ],
    [ "B11", "C11", "D11","E11", "F11" ],
    [ "B12", "C12", "D12","E12", "F12" ],
    [ "B13", "C13", "D13","E13", "F13" ],
    [ "B14", "C14", "D14","E14", "F14" ],
    [ "B15", "C15", "D15","E15", "F15" ],
    [ "B16", "C16", "D16","E16", "F16" ],
    [ "B17", "C17", "D17","E17", "F17" ],
    [ "B18", "C18", "D18","E18", "F18" ],
    [ "B19", "C19", "D19","E19", "F19" ],
    [ "B20", "C20", "D20","E20", "F20" ],
    [ "B21", "C21", "D21","E21", "F21" ],
    [ "B22", "C22", "D22","E22", "F22" ],
    [ "B23", "C23", "D23","E23", "F23" ],
    [ "B24", "C24", "D24","E24", "F24" ],
    [ "B25", "C25", "D25","E25", "F25" ],
    [ "B26", "C26", "D26","E26", "F26" ],
  ];

  // Add after the row we found. Adding + 1
  addDataIntoRangeAtRowNumber_(testRange, 6, [[ "b", "c", "d", "e", "f"]]);

  var actualValues = testRange.getValues();
  var consecutiveFilledRows = 0;
  for(var i = 0; i<actualValues.length;i++) {
    if (actualValues[i][0] != "" || actualValues[i][1] != "" || actualValues[i][2] != "" || actualValues[i][3] != "") {
      consecutiveFilledRows++;
    }
    for (var j = 0;j<actualValues[i].length;j++){ 
      // Any cell values we cannot predict should be blank
      if ( i >= expected.length ) {
        assertEquals_("testAddCategoryAssertAddedSuccessfully - value in row " + i + " and col " + j + " should be empty", "",actualValues[i][j]);
      } else {
        // If within range of expected, the values need to match exactly
        assertEquals_("testAddCategoryAssertAddedSuccessfully - value in row " + i + " and col " + j + " does not match", expected[i][j],actualValues[i][j]);
      }
    }
  }

  
  assertEquals_("testAddCategoryAssertAddedSuccessfully - row numbers should match", expected.length, consecutiveFilledRows);

  tearDown_();

}

function testAddCategoryAssertLastRowAddedSuccessfully() {

  setUp_();


  var expected =  [
    [ "B2", "C2", "D2","E2", "F2" ],
    [ "B3", "C3", "D3","E3", "F3" ],
    [ "B4", "C4", "D4","E4", "F4" ],
    [ "B5", "C5", "D5","E5", "F5" ],
    [ "B6", "C6", "D6","E6", "F6" ],
    [ "B7", "C7", "D7","E7", "F7" ],
    [ "B8", "C8", "D8","E8", "F8" ],
    [ "B9", "C9", "D9","E9", "F9" ],
    [ "B10", "C10", "D10","E10", "F10" ],
    [ "B11", "C11", "D11","E11", "F11" ],
    [ "B12", "C12", "D12","E12", "F12" ],
    [ "B13", "C13", "D13","E13", "F13" ],
    [ "B14", "C14", "D14","E14", "F14" ],
    [ "B15", "C15", "D15","E15", "F15" ],
    [ "B16", "C16", "D16","E16", "F16" ],
    [ "B17", "C17", "D17","E17", "F17" ],
    [ "B18", "C18", "D18","E18", "F18" ],
    [ "B19", "C19", "D19","E19", "F19" ],
    [ "B20", "C20", "D20","E20", "F20" ],
    [ "B21", "C21", "D21","E21", "F21" ],
    [ "B22", "C22", "D22","E22", "F22" ],
    [ "B23", "C23", "D23","E23", "F23" ],
    [ "B24", "C24", "D24","E24", "F24" ],
    [ "B25", "C25", "D25","E25", "F25" ],
    [ "B26", "C26", "D26","E26", "F26" ],
    ["a", "b", "c", "d", "e"],
  ];

  // Add after the row we found. Adding + 1
  addDataIntoRangeAtRowNumber_(testRange, 27, [["a", "b", "c", "d", "e"]]);

  var actualValues = testRange.getValues();
  var consecutiveFilledRows = 0;
  for(var i = 0; i<actualValues.length;i++) {
    if (actualValues[i][0] != "" || actualValues[i][1] != "" || actualValues[i][2] != "" || actualValues[i][3] != "") {
      consecutiveFilledRows++;
    }
    for (var j = 0;j<actualValues[i].length;j++){ 
      // Any cell values we cannot predict should be blank
      if ( i >= expected.length ) {
        assertEquals_("testAddCategoryAssertLastRowAddedSuccessfully - value in row " + i + " and col " + j + " should be empty", "",actualValues[i][j]);
      } else {
        // If within range of expected, the values need to match exactly
        assertEquals_("testAddCategoryAssertLastRowAddedSuccessfully - value in row " + i + " and col " + j + " does not match", expected[i][j],actualValues[i][j]);
      }
    }
  }

  
  assertEquals_("testAddCategoryAssertLastRowAddedSuccessfully - row numbers should match", expected.length, consecutiveFilledRows);

  tearDown_();

}
function testAddCategoryAssertRangeFull() {

  setUp_();


  // The range must not chan
  var expected =  testRangeFull.getValues();

  // Add after the row we found. Adding + 1
  addDataIntoRangeAtRowNumber_(testRangeFull, 6, [["a", "b", "c", "d", "e"]]);

  var actualValues = testRangeFull.getValues();
  var consecutiveFilledRows = 0;
  for(var i = 0; i<actualValues.length;i++) {
    if (actualValues[i][0] != "" || actualValues[i][1] != "" || actualValues[i][2] != "" || actualValues[i][3] != "") {
      consecutiveFilledRows++;
    }
    for (var j = 0;j<actualValues[i].length;j++){ 
      // Any cell values we cannot predict should be blank
      if ( i >= expected.length ) {
        assertEquals_("testAddCategoryAssertRangeFull - value in row " + i + " and col " + j + " should be empty", "",actualValues[i][j]);
      } else {
        // If within range of expected, the values need to match exactly
        assertEquals_("testAddCategoryAssertRangeFull - value in row " + i + " and col " + j + " does not match", expected[i][j],actualValues[i][j]);
      }
    }
  }

  
  assertEquals_("testAddCategoryAssertRangeFull - row numbers should match", expected.length, consecutiveFilledRows);

  tearDown_();

}

function testAppendToRangeAssertAppendedSuccessfully() {

  setUp_();


  var expected =  [
    [ "B2", "C2", "D2","E2", "F2" ],
    [ "B3", "C3", "D3","E3", "F3" ],
    [ "B4", "C4", "D4","E4", "F4" ],
    [ "B5", "C5", "D5","E5", "F5" ],
    [ "B6", "C6", "D6","E6", "F6" ],
    [ "B7", "C7", "D7","E7", "F7" ],
    [ "B8", "C8", "D8","E8", "F8" ],
    [ "B9", "C9", "D9","E9", "F9" ],
    [ "B10", "C10", "D10","E10", "F10" ],
    [ "B11", "C11", "D11","E11", "F11" ],
    [ "B12", "C12", "D12","E12", "F12" ],
    [ "B13", "C13", "D13","E13", "F13" ],
    [ "B14", "C14", "D14","E14", "F14" ],
    [ "B15", "C15", "D15","E15", "F15" ],
    [ "B16", "C16", "D16","E16", "F16" ],
    [ "B17", "C17", "D17","E17", "F17" ],
    [ "B18", "C18", "D18","E18", "F18" ],
    [ "B19", "C19", "D19","E19", "F19" ],
    [ "B20", "C20", "D20","E20", "F20" ],
    [ "B21", "C21", "D21","E21", "F21" ],
    [ "B22", "C22", "D22","E22", "F22" ],
    [ "B23", "C23", "D23","E23", "F23" ],
    [ "B24", "C24", "D24","E24", "F24" ],
    [ "B25", "C25", "D25","E25", "F25" ],
    [ "B26", "C26", "D26","E26", "F26" ],
    [ "a", "b", "c", "d", "e"],
  ];

  // Add after the row we found. Adding + 1
  appendDataToRange_(testRange, [["a", "b", "c", "d", "e"]]);

  var actualValues = testRange.getValues();
  var consecutiveFilledRows = 0;
  for(var i = 0; i<actualValues.length;i++) {
    if (actualValues[i][0] != "" || actualValues[i][1] != "" || actualValues[i][2] != "" || actualValues[i][3] != "") {
      consecutiveFilledRows++;
    }
    for (var j = 0;j<actualValues[i].length;j++){ 
      // Any cell values we cannot predict should be blank
      if ( i >= expected.length ) {
        assertEquals_("value in row " + i + " and col " + j + " should be empty", "",actualValues[i][j]);
      } else {
        // If within range of expected, the values need to match exactly
        assertEquals_("value in row " + i + " and col " + j + " does not match", expected[i][j],actualValues[i][j]);
      }
    }
  }

  
  assertEquals_("row numbers should match", expected.length, consecutiveFilledRows);

  tearDown_();

}

function testAppendRangeAssertFullRangeAndNotAdded() {

  setUp_();


  // The range must not chan
  var expected =  testRangeFull.getValues();

  // Add after the row we found. Adding + 1
  appendDataToRange_(testRangeFull,[["a", "b", "c", "d", "e"]]);

  var actualValues = testRangeFull.getValues();
  var consecutiveFilledRows = 0;
  for(var i = 0; i<actualValues.length;i++) {
    if (actualValues[i][0] != "" || actualValues[i][1] != "" || actualValues[i][2] != "" || actualValues[i][3] != "") {
      consecutiveFilledRows++;
    }
    for (var j = 0;j<actualValues[i].length;j++){ 
      // Any cell values we cannot predict should be blank
      if ( i >= expected.length ) {
        assertEquals_("testAppendRangeAssertFullRangeAndNotAdded - value in row " + i + " and col " + j + " should be empty", "",actualValues[i][j]);
      } else {
        // If within range of expected, the values need to match exactly
        assertEquals_("testAppendRangeAssertFullRangeAndNotAdded - value in row " + i + " and col " + j + " does not match", expected[i][j],actualValues[i][j]);
      }
    }
  }

  
  assertEquals_("testAppendRangeAssertFullRangeAndNotAdded - row numbers should match", expected.length, consecutiveFilledRows);

  tearDown_();

}
function testGetLastRowIndexInDataRange() {

    
  setUp_();

  
  assertEquals_("testGetLastRowIndexInDataRange - Row count does not match", testRangeStartRow + testRangeValues.length -1, getLastRowInDataRange_(testRange).getRowIndex() );
  assertEquals_("testGetLastRowIndexInDataRange - Row count does not match in the full range", testRangeStartRow + testRangeValues.length -1, getLastRowInDataRange_(testRangeFull).getRowIndex() );

  tearDown_();

}

function testDeleteRowFromRangeByShiftingRowsUpAssertDeleteSuccess() {


  setUp_();


  var expected =  [
    [ "B2", "C2", "D2","E2", "F2" ],
    [ "B3", "C3", "D3","E3", "F3" ],
    [ "B4", "C4", "D4","E4", "F4" ],
    [ "B5", "C5", "D5","E5", "F5" ],
  //  [ "B6", "C6", "D6","E6", "F6" ], // < deleted
    [ "B7", "C7", "D7","E7", "F7" ],
    [ "B8", "C8", "D8","E8", "F8" ],
    [ "B9", "C9", "D9","E9", "F9" ],
    [ "B10", "C10", "D10","E10", "F10" ],
    [ "B11", "C11", "D11","E11", "F11" ],
    [ "B12", "C12", "D12","E12", "F12" ],
    [ "B13", "C13", "D13","E13", "F13" ],
    [ "B14", "C14", "D14","E14", "F14" ],
    [ "B15", "C15", "D15","E15", "F15" ],
    [ "B16", "C16", "D16","E16", "F16" ],
    [ "B17", "C17", "D17","E17", "F17" ],
    [ "B18", "C18", "D18","E18", "F18" ],
    [ "B19", "C19", "D19","E19", "F19" ],
    [ "B20", "C20", "D20","E20", "F20" ],
    [ "B21", "C21", "D21","E21", "F21" ],
    [ "B22", "C22", "D22","E22", "F22" ],
    [ "B23", "C23", "D23","E23", "F23" ],
    [ "B24", "C24", "D24","E24", "F24" ],
    [ "B25", "C25", "D25","E25", "F25" ],
    [ "B26", "C26", "D26","E26", "F26" ],
  ];

  deleteRowFromRangeByShiftingRowsUp_(testRange, 6);

  var actualValues = testRange.getValues();
  var consecutiveFilledRows = 0;
  for(var i = 0; i<actualValues.length;i++) {
    if (actualValues[i][0] != "" || actualValues[i][1] != "" || actualValues[i][2] != "" || actualValues[i][3] != "") {
      consecutiveFilledRows++;
    }
    for (var j = 0;j<actualValues[i].length;j++){ 
      // Any cell values we cannot predict should be blank
      if ( i >= expected.length ) {
        assertEquals_("testDeleteRowFromRangeByShiftingRowsUpAssertDeleteSuccess - value in row " + i + " and col " + j + " should be empty", "",actualValues[i][j]);
      } else {
        // If within range of expected, the values need to match exactly
        assertEquals_("testDeleteRowFromRangeByShiftingRowsUpAssertDeleteSuccess - value in row " + i + " and col " + j + " does not match", expected[i][j],actualValues[i][j]);
      }
    }
  }

  assertEquals_("testDeleteRowFromRangeByShiftingRowsUpAssertDeleteSuccess - row numbers should match", expected.length, consecutiveFilledRows);

  tearDown_();

}

function testDeleteRowFromRangeByShiftingRowsUpAssertLastRowAndDeleteSuccess() {


  setUp_();


  var expected =  [
    [ "B2", "C2", "D2","E2", "F2" ],
    [ "B3", "C3", "D3","E3", "F3" ],
    [ "B4", "C4", "D4","E4", "F4" ],
    [ "B5", "C5", "D5","E5", "F5" ],
    [ "B6", "C6", "D6","E6", "F6" ],
    [ "B7", "C7", "D7","E7", "F7" ],
    [ "B8", "C8", "D8","E8", "F8" ],
    [ "B9", "C9", "D9","E9", "F9" ],
    [ "B10", "C10", "D10","E10", "F10" ],
    [ "B11", "C11", "D11","E11", "F11" ],
    [ "B12", "C12", "D12","E12", "F12" ],
    [ "B13", "C13", "D13","E13", "F13" ],
    [ "B14", "C14", "D14","E14", "F14" ],
    [ "B15", "C15", "D15","E15", "F15" ],
    [ "B16", "C16", "D16","E16", "F16" ],
    [ "B17", "C17", "D17","E17", "F17" ],
    [ "B18", "C18", "D18","E18", "F18" ],
    [ "B19", "C19", "D19","E19", "F19" ],
    [ "B20", "C20", "D20","E20", "F20" ],
    [ "B21", "C21", "D21","E21", "F21" ],
    [ "B22", "C22", "D22","E22", "F22" ],
    [ "B23", "C23", "D23","E23", "F23" ],
    [ "B24", "C24", "D24","E24", "F24" ],
    [ "B25", "C25", "D25","E25", "F25" ],
    // [ "B26", "C26", "D26","E26", "F26" ], // < deleted
  ];

  var lastRowIndexWithDataInTestRange = testRange.getRowIndex() + testRangeValues.length;
  deleteRowFromRangeByShiftingRowsUp_(testRange, lastRowIndexWithDataInTestRange);

  var actualValues = testRange.getValues();
  var consecutiveFilledRows = 0;
  for(var i = 0; i<actualValues.length;i++) {
    if (actualValues[i][0] != "" || actualValues[i][1] != "" || actualValues[i][2] != "" || actualValues[i][3] != "") {
      consecutiveFilledRows++;
    }
    for (var j = 0;j<actualValues[i].length;j++){ 
      // Any cell values we cannot predict should be blank
      if ( i >= expected.length ) {
        assertEquals_("testDeleteRowFromRangeByShiftingRowsUpAssertLastRowAndDeleteSuccess - value in row " + i + " and col " + j + " should be empty", "",actualValues[i][j]);
      } else {
        // If within range of expected, the values need to match exactly
        assertEquals_("testDeleteRowFromRangeByShiftingRowsUpAssertLastRowAndDeleteSuccess - value in row " + i + " and col " + j + " does not match", expected[i][j],actualValues[i][j]);
      }
    }
  }

  assertEquals_("testDeleteRowFromRangeByShiftingRowsUpAssertLastRowAndDeleteSuccess - row numbers should match", expected.length, consecutiveFilledRows);

  tearDown_();

}


function testFindCategoryAssertFound() {

  
  setUp_();

  
  assertEquals_("testFindCategoryAssertFound - Item does not exist", false, findInRangeAtColumnIndex_(testRange, "E6", testRangeStartColumn) );
  assertEquals_("testFindCategoryAssertFound - Item does not exist", false, findInRangeAtColumnIndex_(testRange, "E6", testRangeStartColumn+1) );
  assertEquals_("testFindCategoryAssertFound - Item does not exist", false, findInRangeAtColumnIndex_(testRange, "E6", testRangeStartColumn+2) );
  assertEquals_("testFindCategoryAssertFound - Wrong line number", 6, findInRangeAtColumnIndex_(testRange, "E6", testRangeStartColumn+3) );
  assertEquals_("testFindCategoryAssertFound - Wrong line number (search is case insensitive)", 6, findInRangeAtColumnIndex_(testRange, "e6", testRangeStartColumn+3) );
  assertEquals_("testFindCategoryAssertFound - Item does not exist", false, findInRangeAtColumnIndex_(testRange, "E6", testRangeStartColumn+4) );


  tearDown_();

}
$.get('/stock/stock', (stockMap) => {
  console.log(stockMap);
  // console.log(stockMap[0][0]);
  for (a in stockMap.stockMap){
    console.log ();
    for (b in a){
      console.log(b.get());
    }
  }
  // Find a <table> element with id="myTable":
// var table = document.getElementById("myTable");
//
// // Create an empty <tr> element and add it to the 1st position of the table:
// var row = table.insertRow(0);
//
// // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
// var cell1 = row.insertCell(0);
// var cell2 = row.insertCell(1);
//
// // Add some text to the new cells:
// cell1.innerHTML = "NEW CELL1";
// cell2.innerHTML = "NEW CELL2";
//
//
// var row = table.insertRow(0);
// var cell3 = row.insertCell(0);
// var cell4 = row.insertCell(1);
// cell3.innerHTML = "NEW CELL3";
// cell4.innerHTML = "NEW CELL4";
});

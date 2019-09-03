$.get('/stock/stock', (stockMap) => {

console.log(stockMap.stockMap[0][0]);

// cell2.innerHTML =  stockMap.stockMap[0][1];
var table = document.getElementById("myTable");

for(var i = 0; i < stockMap.stockMap.length; i++) {
    for(var j = 0; j < stockMap.stockMap[i].length; j++) {

       if(stockMap.stockMap[i][j]>=0 &&stockMap.stockMap[i][j] < 10000000){
       }
       else{
         var tr = document.createElement('tr');
         var td1 = document.createElement('td');
         var td2 = document.createElement('td');
         var text1 = document.createTextNode(stockMap.stockMap[i][j]);
         var text2 = document.createTextNode(stockMap.stockMap[i][j+1]);

         td1.appendChild(text1);
         td2.appendChild(text2);
         tr.appendChild(td1);
         tr.appendChild(td2);

         table.appendChild(tr);
       }

        // console.log(stockMap.stockMap[i][j]);
    }
}




var row = table.insertRow(0);
var cell3 = row.insertCell(0);
var cell4 = row.insertCell(1);
cell3.innerHTML = "Código do Produto";
cell4.innerHTML = "Quantidade";
});

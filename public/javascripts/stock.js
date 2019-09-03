$.get('/stock/stock', (stockMap) => {
  console.log(stockMap.stockMap);
  let tableBody = '';
  stockMap.stockMap.forEach(stock => {
      tableBody += `<tr><td>${stock[0]}</td><td>${stock[1]}</td><tr>`;
  });
  $('#table-body').html(tableBody);
});

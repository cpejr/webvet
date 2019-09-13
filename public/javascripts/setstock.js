$.get('/stock/stock', (stockMap) => {
  console.log(stockMap.stockMap);
  let tableBody = '';
  stockMap.stockMap.forEach(stock => {
      tableBody += `<tr><td>${stock[0]}</td><td>
      <div class = "tudo">
        <form class="form-inline">
          <div class="form-group ">
            <input type="" class="form-control" id="stockmin" placeholder="Estoque">
          </div>
          <button type="submit" id="btn-stockmin" class="btn btn-primary mb-2">Enviar</button>
        </form>
      </div>


</td><tr>`;
  });
  $('#table-body').html(tableBody);
});


$.get('/stock/stock', (stockMap) => {
  console.log(stockMap.stockMap);
  let tableBody = '';
  stockMap.stockMap.forEach(stock => {
    tableBody += `<tr><td>${stock[0]}</td><td>${stock[1]}</td><tr>`;
  });
  $('#table-body').html(tableBody);
});

let processing = false;
$("input[name='page']").change(function (e) {
  if(processing)
    e.preventDefault();

  processing = true;
  console.log($(this).val());
  $.get(`/stock/archived?page=${$(this).val() - 1}`).then(response => {
    console.log(response);

    let newHtml = '';
    response.map(kit => {
     newHtml += genkitrow(kit);
    });

    $("#tb-body-archived").empty();
    $("#tb-body-archived").append(newHtml);
    processing = false;
  })
});

function genkitrow(kit) {
  processKit(kit);

  let { productCode, productDescription, dayexpirationDate, monthexpirationDate, yearexpirationDate, color, amount, _id } = kit;

  let html = `
  <tr>
    <th>${productCode}</th>
    <th>${productDescription}</th>
    <th>
      <div class="expirationDate${color}">
        ${dayexpirationDate}/${monthexpirationDate}/${yearexpirationDate}
      </div>
    <th>${amount}</th>
    <th>
      <button onClick="location.href='stock/show/${_id}'" class="fa fa-info btn m-1"></button>
    </th>
  </tr>`

  return html;
}


const oneDay = 24 * 60 * 60 * 1000;

function processKit(kit) {
  const now = Date.now();

  let expirationDate = new Date(`${kit.monthexpirationDate}/${kit.dayexpirationDate}/${kit.yearexpirationDate}`);

  let diffDays = Math.ceil((expirationDate - now) / oneDay);

  if (diffDays > 90)
    kit.color = "Green"
  else if (diffDays >= 30)
    kit.color = "Yellow"
  else
    kit.color = "Red"

  return kit;
}
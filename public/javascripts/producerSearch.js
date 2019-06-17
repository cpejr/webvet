// let producersAdded = [];
let producers = [];


  $(document).ready(() => {
    $('td #add-producer').on('click', () => {
      $('#table-producer').find('tr').click( function(){
        var name = $(this).find('td:eq(0)').text();
        var register = $(this).find('td:eq(1)').text();

        var index = producersAdded.indexOf(name);
        var indexValid = producers.indexOf(name);

        if ((index == -1)&&(indexValid >= -1)) {
          const badgeHtml = `<span class="badge badge-success form-select mr-1" onclick="removeMe(this)">
                              ${ name  } <i class="fa fa-remove float-left">&nbsp;&nbsp;&nbsp;</i>
                              <input class="" type="hidden" name="producer[]" value="${ name }">
                            </span>`;
          $('#select-producer').append(badgeHtml);

          producersAdded.push(name);
        }
      });
    });
  });


function removeMe(element) {
  $(element).remove();
  const name = $(element).find('input').val();
  var index = producersAdded.indexOf(name);
  if (index > -1) {
    producersAdded.splice(index, 1);
  }
}

$("#producer-search").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#table-producer tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

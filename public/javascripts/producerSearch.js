let producersAdded = [];
let producers = [];
$(document).ready(() => {
  $('#add-producer').on('click', () => {

    const nameProducer = $('input[name=producer-selected]').val();
    var index = producersAdded.indexOf(nameProducer);
    var indexValid = producers.indexOf(nameProducer);

    if ((index == -1)&&(indexValid >= -1)) {
      const badgeHtml = `<span class="badge badge-success form-select mr-1" onclick="removeMe(this)">
                          ${ nameProducer  } <i class="fa fa-remove float-left">&nbsp;&nbsp;&nbsp;</i>
                          <input class="" type="hidden" name="producer[]" value="${ nameProducer }">
                        </span>`;
      $('#select-producer').append(badgeHtml);
      producersAdded.push(nameProducer);
      alert(producersAdded);
    }
  });
});

function removeMe(element) {
  $(element).remove();
  const nameProducer = $(element).find('input').val();
  var index = producersAdded.indexOf(nameProducer);
  if (index > -1) {
    producersAdded.splice(index, 1);
  }
}


$.get('/search/producers', (producers) => {
  $(document).ready(function() {
    var producer = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: producers
    });

    $('#producer-list .typeahead').typeahead(
      {
        hint: true,
        highlight: true,
        minLength: 1
      },
      {
        name: 'Producer',
        source: producer,
        templates: {
          empty: [
            '<div class="empty-search">',
            'Ops! Não encontramos resultados para essa busca.',
            '</div>'
          ].join('\n')
        }
      });
  });
});

$.get('/search/producers', (result) => {
  $(document).ready(function() {
    var producer = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: result
    });

    $('#producer-list .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    }, {
      name: 'Producer',
      source: producer
    });

  });
});

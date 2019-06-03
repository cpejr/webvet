$.get('/search/covenants', (covenants) => {
  $(document).ready(function() {
    var covenant = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: covenants
    });

    $('#covenant-list .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    }, {
      name: 'Covenant',
      source: covenant
    });

  });
});

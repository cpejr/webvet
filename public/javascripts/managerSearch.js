$.get('/search/managers', (managers) => {
  $(document).ready(function() {
    var manager = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: managers
    });

    $('#manager-list .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    }, {
      name: 'Manager',
      source: manager
    });

  });
});

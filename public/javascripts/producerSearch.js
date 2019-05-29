$.get('/search/producers', (producers) => {
  $(document).ready(function() {
    var producer = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: producers
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

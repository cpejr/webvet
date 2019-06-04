const mycotoxin1 = new jKanban({
  element : '#mycotoxin1',
  gutter  : '10px',
  widthBoard  : '300px',
  click : function(el) {
    window.location.href = "requisition/show";
  },
  boards  : [
    {
      'id' : '_totest',
      'title'  : 'Disponível',
      'class' : 'info',
      'item'  : [
        {
          'id':'sample-1',
          'title':'Amostra 1',
          'status': 'Nova',
          'analyst':'Gabriela',
        }
      ]
    },
    {
      'id' : '_testing',
      'title'  : 'Para teste',
      'class' : 'success',
      'item'  : [
        {
          'id':'sample-3',
          'title':'Amostra 3',
          'status': 'Nova',
          'analyst':'Gabriela',
        },
        {
          'id':'sample-4',
          'title':'Amostra 4',
          'status': 'Sem amostra',
          'analyst':'Gabriela',
        }
      ]
    }
  ]
});





const mycotoxin2 = new jKanban({
  element : '#mycotoxin2',
  gutter  : '10px',
  widthBoard  : '300px',
  click : function(el) {
    alert(el.innerHTML);
    alert(el.dataset.eid)
  },
  boards  : [
    {
      'id' : '_totest',
      'title'  : 'Disponível',
      'class' : 'info',
      'item'  : [
        {
          'id':'sample-1',
          'title':'Amostra 1',
        },
        {
          'id':'sample-2',
          'title':'Amostra 2',
        }
      ]
    },
    {
      'id' : '_testing',
      'title'  : 'Para teste',
      'class' : 'success',
      'item'  : [
        {
          'id':'sample-3',
          'title':'Amostra 3',
        }
      ]
    }
  ]
});

const mycotoxin3 = new jKanban({
  element : '#mycotoxin3',
  gutter  : '10px',
  widthBoard  : '300px',
  click : function(el) {
    alert(el.innerHTML);
    alert(el.dataset.eid)
  },
  boards  : [
    {
      'id' : '_totest',
      'title'  : 'Disponível',
      'class' : 'info',
      'item'  : [
        {
          'id':'sample-1',
          'title':'Amostra 1',
        },
        {
          'id':'sample-2',
          'title':'Amostra 2',
        }
      ]
    },
    {
      'id' : '_testing',
      'title'  : 'Para teste',
      'class' : 'success',
      'item'  : [
        {
          'id':'sample-3',
          'title':'Amostra 3',
        },
        {
          'id':'sample-4',
          'title':'Amostra 4',
        }
      ]
    }
  ]
});

const mycotoxin4 = new jKanban({
  element : '#mycotoxin4',
  gutter  : '10px',
  widthBoard  : '300px',
  click : function(el) {
    alert(el.innerHTML);
    alert(el.dataset.eid)
  },
  boards  : [
    {
      'id' : '_totest',
      'title'  : 'Disponível',
      'class' : 'info',
      'item'  : [
        {
          'id':'sample-1',
          'title':'Amostra 1',
        },
        {
          'id':'sample-2',
          'title':'Amostra 2',
        }
      ]
    },
    {
      'id' : '_testing',
      'title'  : 'Para teste',
      'class' : 'success',
      'item'  : [
        {
          'id':'sample-3',
          'title':'Amostra 3',
        }
      ]
    }
  ]
});

const mycotoxin5 = new jKanban({
  element : '#mycotoxin5',
  gutter  : '10px',
  widthBoard  : '300px',
  click : function(el) {
    alert(el.innerHTML);
    alert(el.dataset.eid)
  },
  boards  : [
    {
      'id' : '_totest',
      'title'  : 'Disponível',
      'class' : 'info',
      'item'  : [
        {
          'id':'sample-1',
          'title':'Amostra 1',
        },
        {
          'id':'sample-2',
          'title':'Amostra 2',
        }
      ]
    },
    {
      'id' : '_testing',
      'title'  : 'Para teste',
      'class' : 'success',
      'item'  : [
        {
          'id':'sample-3',
          'title':'Amostra 3',
        }
      ]
    }
  ]
});

const mycotoxin6 = new jKanban({
  element : '#mycotoxin6',
  gutter  : '10px',
  widthBoard  : '300px',
  click : function(el) {
    alert(el.innerHTML);
    alert(el.dataset.eid)
  },
  boards  : [
    {
      'id' : '_totest',
      'title'  : 'Disponível',
      'class' : 'info',
      'item'  : [
        {
          'id':'sample-1',
          'title':'Amostra 1',
        },
        {
          'id':'sample-2',
          'title':'Amostra 2',
        }
      ]
    },
    {
      'id' : '_testing',
      'title'  : 'Para teste',
      'class' : 'success',
      'item'  : [
        {
          'id':'sample-3',
          'title':'Amostra 3',
        }
      ]
    }
  ]
});


var formItem = document.createElement('span');
formItem.setAttribute("class", "label label-default");
formItem.innerHTML = "OLA";

mycotoxin1.addForm('sample-4', formItem);

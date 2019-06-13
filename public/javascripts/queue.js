
var aflatoxina = new jKanban({
  element : '#aflatoxina',
  gutter  : '10px',
  widthBoard  : '300px',
  click : function(el) {
    window.location.href = "requisition/show";
  },
  boards  : [
    {
      id : '_totest',
      title  : 'Espera',
      class : 'info'
    },
    {
      id : '_testing',
      title  : 'Em análise',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Devendo',
      class : 'success',
    },
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/' + samplenumber, () => {

      });

      if (el.dataset.status == "Devendo") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Devendo' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

const deoxinivalenol = new jKanban({
  element : '#deoxinivalenol',
  gutter  : '10px',
  widthBoard  : '300px',
  click : function(el) {
    alert(el.innerHTML);
    alert(el.dataset.eid)
  },
  boards  : [
    {
      id : '_totest',
      title  : 'Disponível',
      class : 'info',
    },
    {
      id : '_testing',
      title  : 'Para teste',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Devendo',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/' + samplenumber, () => {

      });

      if (el.dataset.status == "Devendo") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Devendo' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

const ocratoxina = new jKanban({
  element : '#ocratoxina',
  gutter  : '10px',
  widthBoard  : '300px',
  boards  : [
    {
      id : '_totest',
      title  : 'Disponível',
      class : 'info',
    },
    {
      id : '_testing',
      title  : 'Para teste',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Devendo',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/' + samplenumber, () => {

      });

      if (el.dataset.status == "Devendo") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Devendo' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

  }
});

const t2toxina = new jKanban({
  element : '#t2toxina',
  gutter  : '10px',
  widthBoard  : '300px',
  boards  : [
    {
      id : '_totest',
      title  : 'Disponível',
      class : 'info',
    },
    {
      id : '_testing',
      title  : 'Para teste',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Devendo',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/' + samplenumber, () => {

      });

      if (el.dataset.status == "Devendo") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Devendo' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

const fumonisina = new jKanban({
  element : '#fumonisina',
  gutter  : '10px',
  widthBoard  : '300px',
  boards  : [
    {
      id : '_totest',
      title  : 'Disponível',
      class : 'info',
    },
    {
      id : '_testing',
      title  : 'Para teste',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Devendo',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/' + samplenumber, () => {

      });

      if (el.dataset.status == "Devendo") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Devendo' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

const zearalenona = new jKanban({
  element : '#zearalenona',
  gutter  : '10px',
  widthBoard  : '300px',
  click : function(el) {
    alert(el.dataset.eid);
  },
  boards  : [
    {
      id : '_totest',
      title  : 'Disponível',
      class : 'info',
    },
    {
      id : '_testing',
      title  : 'Para teste',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Devendo',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/' + samplenumber, () => {

      });

      if (el.dataset.status == "Devendo") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Devendo' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

  }
});

$.get('/search/samples', (samples) => {
  $(document).ready(function() {
    samples.forEach((sample) => {
      mycotoxins = sample.mycotoxin;
      mycotoxins.forEach((m) => {
        //AFLATOXINA
        if(m == "Aflatoxina") {
          if(sample.status=="Nova" || sample.status=="Sem amostra" || sample.status=="A corrigir") {
            aflatoxina.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Em análise") {
            aflatoxina.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Devendo") {
            aflatoxina.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
        }

        //OCRATOXINA A
        if(m == "Ocratoxina A") {
          if(sample.status=="Nova" || sample.status=="Sem amostra" || sample.status=="A corrigir") {
            ocratoxina.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Em análise") {
            ocratoxina.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Devendo") {
            ocratoxina.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
        }

        //DEOXINIVALENOL
        if(m == "Deoxinivalenol") {
          if(sample.status=="Nova" || sample.status=="Sem amostra" || sample.status=="A corrigir") {
            deoxinivalenol.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Em análise") {
            deoxinivalenol.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Devendo") {
            deoxinivalenol.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
        }

        //T-2 TOXINA
        if(m == "T-2 toxina") {
          if(sample.status=="Nova" || sample.status=="Sem amostra" || sample.status=="A corrigir") {
            t2toxina.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Em análise") {
            t2toxina.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Devendo") {
            t2toxina.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
        }

        //FUMONISINA
        if(m == "Fumonisina") {
          if(sample.status=="Nova" || sample.status=="Sem amostra" || sample.status=="A corrigir") {
            fumonisina.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Em análise") {
            fumonisina.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Devendo") {
            fumonisina.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
        }

        //ZEARALENONA
        if(m == "Zearalenona") {
          if(sample.status=="Nova" || sample.status=="Sem amostra" || sample.status=="A corrigir") {
            zearalenona.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Em análise") {
            zearalenona.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
          if(sample.status=="Devendo") {
            zearalenona.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.status
            });
          }
        }
      });
    });
  });
});

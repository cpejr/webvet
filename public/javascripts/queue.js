
var aflatoxina = new jKanban({
  element : '#aflatoxina',
  gutter  : '10px',
  widthBoard  : '242px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
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
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'info'
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/aflatoxina/' + samplenumber, () => {

      });

      if (el.dataset.status == "Aguardando pagamento") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

const deoxinivalenol = new jKanban({
  element : '#deoxinivalenol',
  gutter  : '10px',
  widthBoard  : '242px',
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
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/deoxinivalenol/' + samplenumber, () => {

      });

      if (el.dataset.status == "Aguardando pagamento") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/deoxinivalenol/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/deoxinivalenol/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/deoxinivalenol/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

const ocratoxina = new jKanban({
  element : '#ocratoxina',
  gutter  : '10px',
  widthBoard  : '242px',
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
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/ocratoxina/' + samplenumber, () => {

      });

      if (el.dataset.status == "Aguardando pagamento") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/ocratoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/ocratoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/ocratoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

  }
});

const t2toxina = new jKanban({
  element : '#t2toxina',
  gutter  : '10px',
  widthBoard  : '242px',
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
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/t2toxina/' + samplenumber, () => {

      });

      if (el.dataset.status == "Aguardando pagamento") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/t2toxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/t2toxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/t2toxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

const fumonisina = new jKanban({
  element : '#fumonisina',
  gutter  : '10px',
  widthBoard  : '242px',
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
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/fumonisina/' + samplenumber, () => {

      });

      if (el.dataset.status == "Aguardando pagamento") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/fumonisina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/fumonisina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/fumonisina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

const zearalenona = new jKanban({
  element : '#zearalenona',
  gutter  : '10px',
  widthBoard  : '242px',
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
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    }
  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if (target == '_totest') {
      $.post('/sample/totest/edit/zearalenona/' + samplenumber, () => {

      });

      if (el.dataset.status == "Aguardando pagamento") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Nova' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      } else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'A corrigir' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
      }

    }
    if  (target == '_testing') {
      $.post('/sample/testing/edit/zearalenona/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/zearalenona/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/zearalenona/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

  }
});

$.get('/search/samples', (samples) => {
  $(document).ready(function() {

    samples.forEach((sample) => {
        //AFLATOXINA
        if(sample.aflatoxina.active == true) {
          if(sample.aflatoxina.status=="Nova" || sample.aflatoxina.status=="Sem amostra" || sample.aflatoxina.status=="A corrigir") {
            aflatoxina.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.aflatoxina.status
            });
          }
          if(sample.aflatoxina.status=="Em análise") {
            aflatoxina.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.aflatoxina.status
            });
          }
          if(sample.aflatoxina.status=="Aguardando pagamento") {
            aflatoxina.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.aflatoxina.status
            });
          }
          if(sample.aflatoxina.status=="Aguardando amostra") {
            aflatoxina.addElement('_waiting', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.aflatoxina.status
            });
          }
        }

        //OCRATOXINA A
        if(sample.ocratoxina.active == true) {
          if(sample.ocratoxina.status=="Nova" || sample.ocratoxina.status=="Sem amostra" || sample.ocratoxina.status=="A corrigir") {
            ocratoxina.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.ocratoxina.status
            });
          }
          if(sample.ocratoxina.status=="Em análise") {
            ocratoxina.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.ocratoxina.status
            });
          }
          if(sample.ocratoxina.status=="Aguardando pagamento") {
            ocratoxina.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.ocratoxina.status
            });
          }
          if(sample.ocratoxina.status=="Aguardando amostra") {
            ocratoxina.addElement('_waiting', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.ocratoxina.status
            });
          }
        }

        //DEOXINIVALENOL
        if(sample.deoxinivalenol.active == true) {
          if(sample.deoxinivalenol.status=="Nova" || sample.deoxinivalenol.status=="Sem amostra" || sample.deoxinivalenol.status=="A corrigir") {
            deoxinivalenol.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.deoxinivalenol.status
            });
          }
          if(sample.deoxinivalenol.status=="Em análise") {
            deoxinivalenol.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.deoxinivalenol.status
            });
          }
          if(sample.deoxinivalenol.status=="Aguardando pagamento") {
            deoxinivalenol.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.deoxinivalenol.status
            });
          }
          if(sample.deoxinivalenol.status=="Aguardando amostra") {
            deoxinivalenol.addElement('_waiting', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.deoxinivalenol.status
            });
          }
        }

        //ZEARALENONA
        if(sample.zearalenona.active == true) {
          if(sample.zearalenona.status=="Nova" || sample.zearalenona.status=="Sem amostra" || sample.zearalenona.status=="A corrigir") {
            zearalenona.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.zearalenona.status
            });
          }
          if(sample.zearalenona.status=="Em análise") {
            zearalenona.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.zearalenona.status
            });
          }
          if(sample.zearalenona.status=="Aguardando pagamento") {
            zearalenona.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.zearalenona.status
            });
          }
          if(sample.zearalenona.status=="Aguardando amostra") {
            zearalenona.addElement('_waiting', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.zearalenona.status
            });
          }
        }

        //T-2 TOXINA
        if(sample.t2toxina.active == true) {
          if(sample.t2toxina.status=="Nova" || sample.t2toxina.status=="Sem amostra" || sample.t2toxina.status=="A corrigir") {
            t2toxina.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.t2toxina.status
            });
          }
          if(sample.t2toxina.status=="Em análise") {
            t2toxina.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.t2toxina.status
            });
          }
          if(sample.t2toxina.status=="Aguardando pagamento") {
            t2toxina.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.t2toxina.status
            });
          }
          if(sample.t2toxina.status=="Aguardando amostra") {
            t2toxina.addElement('_waiting', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.t2toxina.status
            });
          }
        }

        //FUMOSININA
        if(sample.fumonisina.active == true) {
          if(sample.fumonisina.status=="Nova" || sample.fumonisina.status=="Sem amostra" || sample.fumonisina.status=="A corrigir") {
            fumonisina.addElement("_totest", {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.fumonisina.status
            });
          }
          if(sample.fumonisina.status=="Em análise") {
            fumonisina.addElement('_testing', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.fumonisina.status
            });
          }
          if(sample.fumonisina.status=="Aguardando pagamento") {
            fumonisina.addElement('_ownering', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.fumonisina.status
            });
          }
          if(sample.fumonisina.status=="Aguardando amostra") {
            fumonisina.addElement('_waiting', {
              id: sample.samplenumber,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsable,
              status: sample.fumonisina.status
            });
          }
        }

    });
  });
});

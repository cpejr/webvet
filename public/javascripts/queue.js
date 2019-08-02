var aflatoxina = new jKanban({
  element : '#aflatoxina',
  gutter  : '10px',
  widthBoard  : '190px',
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
      class : 'info',
    },
    {
      id: '_workmap',
      title : 'Mapa de trabalho',
      class : 'success',
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
    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }


  }
});




var scndAflatoxina = new jKanban({
  element : '#afla2toxina',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
    },
    {
      id : '_workmap1',
      title  : 'Mapa de trabalho 1',
      class : 'success',
    },

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
    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }


  }
});

var aflaclicks = 1;
    function AflaPlusButton() {
        aflaclicks += 1;
        if(aflaclicks>16) {
          aflaclicks-=1;

        } else {
            scndAflatoxina.addBoards(
                  [{
                      'id' : '_workmap' + aflaclicks,
                      'title'  : 'Mapa de trabalho' + ' '+ aflaclicks,
                      'class' : 'info',

                  }]
              )


        document.getElementById("countMapAfla").innerHTML = aflaclicks;

      }
    };

    function AflaMinusButton() {

        if(aflaclicks==1){
        aflaclicks=1;
          document.getElementById("countMapAfla").innerHTML = clicks;
        } else {


               scndAflatoxina.removeBoard('_workmap' + aflaclicks);
                aflaclicks -= 1;
                document.getElementById("countMapAfla").innerHTML = aflaclicks;
        }

    };






const deoxinivalenol = new jKanban({
  element : '#deoxinivalenol',
  gutter  : '10px',
  widthBoard  : '190px',
  click : function(el) {
    alert(el.innerHTML);
    alert(el.dataset.eid)
  },
  boards  : [
    {
      id : '_totest',
      title  : 'Espera',
      class : 'info',
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
      class : 'success',
    },
    {
      id : '_workmap',
      title : 'Mapa de trabalho',
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

    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/deoxinivalenol/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }



  }
});

var scndDeoxinivalenol = new jKanban({
  element : '#deoxini2valenol',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
    },
    {
      id : '_workmap1',
      title  : 'Mapa de trabalho 1',
      class : 'success',
    },

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
    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }


  }
});
var deoxclicks = 1;
    function DeoxPlusButton() {
        deoxclicks += 1;
        if(deoxclicks>16) {
          deoxclicks-=1;

        } else {
            scndDeoxinivalenol.addBoards(
                  [{
                      'id' : '_workmap' + deoxclicks,
                      'title'  : 'Mapa de trabalho' + ' '+ deoxclicks,
                      'class' : 'info',

                  }]
              )


        document.getElementById("countMapDeox").innerHTML = deoxclicks;

      }
    };

    function DeoxMinusButton() {

        if(deoxclicks==1){
        deoxclicks=1;
          document.getElementById("countMapDeox").innerHTML = deoxclicks;
        } else {


               scndDeoxinivalenol.removeBoard('_workmap' + deoxclicks);
                deoxclicks -= 1;
                document.getElementById("countMapDeox").innerHTML = deoxclicks;
        }

    };


const ocratoxina = new jKanban({
  element : '#ocratoxina',
  gutter  : '10px',
  widthBoard  : '190px',
  boards  : [
    {
      id : '_totest',
      title  : 'Espera',
      class : 'info',
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
      class : 'success',
    },
    {
      id : '_workmap',
      title : 'Mapa de trabalho',
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

    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/ocratoxina/' + samplenumber, () => {


      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

  }
});

var scndOcratoxina = new jKanban({
  element : '#ocra2toxina',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
    },
    {
      id : '_workmap1',
      title  : 'Mapa de trabalho 1',
      class : 'success',
    },

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
    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }


  }
});

var ocraclicks = 1;
function OcraPlusButton() {
        ocraclicks += 1;
        if(ocraclicks>16) {
          ocraclicks-=1;

        } else {
            scndOcratoxina.addBoards(
                  [{
                      'id' : '_workmap' + ocraclicks,
                      'title'  : 'Mapa de trabalho' + ' '+ ocraclicks,
                      'class' : 'info',

                  }]
              )


        document.getElementById("countMapOcra").innerHTML = ocraclicks;

      }
    };

function OcraMinusButton() {

        if(ocraclicks==1){
        ocraclicks=1;
          document.getElementById("countMapOcra").innerHTML = ocraclicks;
        } else {


               scndOcratoxina.removeBoard('_workmap' + ocraclicks);
                ocraclicks -= 1;
                document.getElementById("countMapOcra").innerHTML = ocraclicks;
        }

    };


const t2toxina = new jKanban({
  element : '#t2toxina',
  gutter  : '10px',
  widthBoard  : '190px',
  boards  : [
    {
      id : '_totest',
      title  : 'Espera',
      class : 'info',
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
      class : 'success',
    },
    {
      id : '_workmap',
      title : 'Mapa de trabalho',
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

    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/t2toxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

var scndT2toxina = new jKanban({
  element : '#t22toxina',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
    },
    {
      id : '_workmap1',
      title  : 'Mapa de trabalho 1',
      class : 'success',
    },

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
    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }


  }
});

var t2clicks = 1;
function T2PlusButton() {
        t2clicks += 1;
        if(t2clicks>16) {
          t2clicks-=1;

        } else {
            scndT2toxina.addBoards(
                  [{
                      'id' : '_workmap' + t2clicks,
                      'title'  : 'Mapa de trabalho' + ' '+ t2clicks,
                      'class' : 'info',

                  }]
              )


        document.getElementById("countMapT2").innerHTML = t2clicks;

      }
    };

function T2MinusButton() {

        if(t2clicks==1){
         t2clicks=1;
          document.getElementById("countMapT2").innerHTML =t2clicks;
        } else {


               scndT2toxina.removeBoard('_workmap' + t2clicks);
                t2clicks -= 1;
                document.getElementById("countMapT2").innerHTML = t2clicks;
        }

    };

const fumonisina = new jKanban({
  element : '#fumonisina',
  gutter  : '10px',
  widthBoard  : '190px',
  boards  : [
    {
      id : '_totest',
      title  : 'Espera',
      class : 'info',
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
      class : 'success',
    },
    {
      id: '_workmap',
      title: 'Mapa de trabalho',
      class: 'success',
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

    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/fumonisina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});


var scndFumonisina = new jKanban({
  element : '#fumonisina2',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
    },
    {
      id : '_workmap1',
      title  : 'Mapa de trabalho 1',
      class : 'success',
    },

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
    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }


  }
});

var fumoclicks = 1;
function FumoPlusButton() {
        fumoclicks += 1;
        if(fumoclicks>16) {
          fumoclicks-=1;

        } else {
            scndFumonisina.addBoards(
                  [{
                      'id' : '_workmap' + fumoclicks,
                      'title'  : 'Mapa de trabalho' + ' '+ fumoclicks,
                      'class' : 'info',

                  }]
              )


        document.getElementById("countMapFumo").innerHTML = fumoclicks;

      }
    };

function FumoMinusButton() {

        if(fumoclicks==1){
         fumoclicks=1;
          document.getElementById("countMapFumo").innerHTML =fumoclicks;
        } else {


               scndFumonisina.removeBoard('_workmap' + fumoclicks);
                fumoclicks -= 1;
                document.getElementById("countMapFumo").innerHTML = fumoclicks;
        }

    };

const zearalenona = new jKanban({
  element : '#zearalenona',
  gutter  : '10px',
  widthBoard  : '190px',
  click : function(el) {
    alert(el.dataset.eid);
  },
  boards  : [
    {
      id : '_totest',
      title  : 'Espera',
      class : 'info',
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
      class : 'success',
    },
    {
      id: '_workmap',
      title: 'Mapa de trabalho',
      class: 'success',
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

    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/zearalenona/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho ' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

  }
});

var scndZearalenona = new jKanban({
  element : '#zearalenona2',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
    },
    {
      id : '_workmap1',
      title  : 'Mapa de trabalho 1',
      class : 'success',
    },

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
    if  (target == '_workmap') {
      $.post('/sample/waiting/edit/aflatoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }


  }
});

var zclicks = 1;
function ZPlusButton() {
      zclicks += 1;
        if(zclicks>16) {
          zclicks-=1;

        } else {
            scndZearalenona.addBoards(
                  [{
                      'id' : '_workmap' + zclicks,
                      'title'  : 'Mapa de trabalho' + ' '+ zclicks,
                      'class' : 'info',

                  }]
              )


        document.getElementById("countMapZ").innerHTML = zclicks;

      }
    };

function ZMinusButton() {

        if(zclicks==1){
         zclicks=1;
          document.getElementById("countMapZ").innerHTML =zclicks;
        } else {


               scndZearalenona.removeBoard('_workmap' + zclicks);
                zclicks -= 1;
                document.getElementById("countMapZ").innerHTML = zclicks;
        }

    };

//cria cedulas kanban
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
          if(sample.ocratoxina.status=="Mapa de Trabalho") {
            ocratoxina.addElement('_mapwork', {
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
          if(sample.deoxinivalenol.status=="Mapa de Trabalho") {
            deoxinivalenol.addElement('_mapwork', {
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
          if(sample.zearalenona.status=="Mapa de Trabalho") {
            zearalenona.addElement('_mapwork', {
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
          if(sample.t2toxina.status=="Mapa de Trabalho") {
            t2toxina.addElement('_mapwork', {
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
          if(sample.fumonisina.status=="Mapa de Trabalho") {
            fumonisina.addElement('_mapwork', {
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


$('#KitRadio').change(function(){

  if($('#KitAflaB').is(':checked')) {
      $('#hide').removeClass('form-disabled');
  } else {
      $('#hide').addClass('form-disabled');
  }
});

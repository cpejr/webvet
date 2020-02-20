ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];


function createAnalysisKanban(toxinaFull) {
  return new jKanban({
    element: '#' + toxinaFull,
    gutter: '10px',
    widthBoard: '190px',
    click: function (el) {
      window.location.href = 'sample/edit/' + el.dataset.eid;
    },
    dragBoards: false,
    boards: [
      {
        id: '_testing',
        title: 'Em análise',
        class: 'success',
      },
      {
        id: '_ownering',
        title: 'Aguardando pagamento',
        class: 'success',
      },
      {
        id: '_waiting',
        title: 'Aguardando amostra',
        class: 'info',
      },

    ],
    dropEl: function (el, target, source, sibling) {
      const samplenumber = el.dataset.title.replace("Amostra", "");

      let text;

      switch (target) {
        case '_testing':
          text = 'Em análise';
          break;

        case '_ownering':
          text = 'Aguardando pagamento';
          break;
        case '_waiting':
          text = 'Aguardando amostra';
          break;
      }

      $.post(`/sample/${target.replace("_", "")}/edit/${toxinaFull}/${samplenumber}`);

      if (el.dataset.eid == "owner")
        el.innerHTML = el.dataset.title + " " + '<br><span  class="badge badge-secondary">' + text + '</span>' + " " + '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>' + " " + '<span  class="badge badge-danger">' + el.dataset.owner + '</span>';
      else
        el.innerHTML = el.dataset.title + " " + '<br><span  class="badge badge-secondary">' + text + '</span>' + " " + '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
    }
  });
}

const aflatoxina = createAnalysisKanban('aflatoxina');
const deoxinivalenol = createAnalysisKanban('deoxinivalenol');
const ocratoxina = createAnalysisKanban('ocratoxina');
const t2toxina = createAnalysisKanban('t2toxina');
const fumonisina = createAnalysisKanban('fumonisina');
const zearalenona = createAnalysisKanban('zearalenona');

let Analysiskanbans = { aflatoxina, deoxinivalenol, ocratoxina, t2toxina, fumonisina, zearalenona };


function createWormapKanban(toxinaFull) {
  return new jKanban({
    element: '#' + toxinaFull + '2',
    gutter: '10px',
    widthBoard: '165px',
    click: function (el) {
      window.location.href = 'sample/edit/' + el.dataset.eid;
    },
    dragBoards: false,
    boards: [
      {
        id: '_scndTesting',
        title: 'Em análise',
        class: 'info'
      }
    ],
    dropEl: function (el, target, source, sibling) {
      const samplenumber = el.dataset.title.replace("Amostra", "");
      var goTO = target;
      if (goTO.indexOf("workmap") != -1) { //se o alvo for um board workmap qualquer
        if (el.dataset.calibrator) {//cards originais
          return false;
        }
        else {
          var mapName = goTO.toString();
          $.post(`/sample/mapedit/${toxinaFull}/${samplenumber}/${nowActiveKits[toxinaFull]}/${mapName}`);

          if (el.dataset.eid == "owner") {
            el.innerHTML = el.dataset.title + " " + '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>' + " " + '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>' + " " + '<span  class="badge badge-danger">' + el.dataset.owner + '</span>';
          }
          else {
            el.innerHTML = el.dataset.title + " " + '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>' + " " + '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
          }
        }
      }
      if (target == '_scndTesting') {
        var calibrator = el.dataset.eid;
        if (el.dataset.calibrator) {//cards P não se movem para em analise
          return false
        }
        else {
          $.post(`/sample/scndTesting/edit/${toxinaFull}/${samplenumber}/${nowActiveKits[toxinaFull]}`);
          el.innerHTML = el.dataset.title + " " + '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>' + " " + '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

        }
      }


    }
  });
}

let Wormapskanbans = {
  aflatoxina: createWormapKanban('aflatoxina'),
  deoxinivalenol: createWormapKanban('deoxinivalenol'),
  ocratoxina: createWormapKanban('ocratoxina'),
  t2toxina: createWormapKanban('t2toxina'),
  fumonisina: createWormapKanban('fumonisina'),
  zearalenona: createWormapKanban('zearalenona')
};

let nowActiveKits = {};

//cria cedulas kanban
$.get('/search/samplesActive', (samples) => {
  $(document).ready(function () {
    samples.forEach((sample) => {
      if (!sample.isCalibrator) {
        $.get('/search/userFromRequisiton/' + sample.requisitionId, (user) => {
          //Teste para cada toxina
          for (let i = 0; i < ToxinasFull.length; i++) {
            if (sample[ToxinasFull[i]].active == true) {
              let toxina = ToxinasFull[i];
              let status = sample[toxina].status;
              let kanban = Analysiskanbans[toxina];

              if (status == "Nova" || status == "Sem amostra" || status == "A corrigir") {
                if (user.debt) {
                  kanban.addElement('_waiting', {
                    id: "owner",
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsible,
                    status: status,
                    owner: "Devedor"
                  });
                }
                else {
                  kanban.addElement('_waiting', {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsible,
                    status: status
                  });

                }

              }

              if (status == "Em análise" || status == "Mapa de Trabalho") {
                if (user.debt) {
                  kanban.addElement('_testing', {
                    id: "owner",
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsible,
                    status: status,
                    owner: "Devedor"
                  });
                } else {
                  kanban.addElement('_testing', {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsible,
                    status: status
                  });
                  if (status == "Em análise") {
                    Wormapskanbans[toxina].addElement('_scndTesting', {
                      id: sample.samplenumber,
                      title: "Amostra " + sample.samplenumber,
                      analyst: sample.responsible,
                      status: status
                    });
                  }
                }
              }

              if (status == "Aguardando pagamento") {
                if (user.debt) {
                  kanban.addElement('_ownering', {
                    id: "owner",
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsible,
                    status: status,
                    owner: "Devedor"
                  });
                }
                else {
                  kanban.addElement('_ownering', {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsible,
                    status: status,
                  });
                }
              }

              if (status == "Aguardando amostra") {
                if (user.debt) {
                  kanban.addElement('_waiting', {
                    id: "owner",
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsible,
                    status: status,
                    owner: "Devedor"
                  });
                }
                else {
                  kanban.addElement('_waiting', {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsible,
                    status: status
                  });
                }
              }
            }
          }
        });
      }
    });
  });
});

let workmapsStart = 0;
let workmapsEnd = 0;

$('div[class="loteradio"]').each(function (index, group) {
  console.log("aa")
  let toxina = $(group).data("toxin");
  $(group).find('input.radio-queue').each(function (index, checkbox) {
    $(checkbox).change(function () {
      console.log("bbbb")
      let letter = $(this).data("letter");
      $.get(`/search/kits/${toxina}/${letter}`, (kits) => {
        let kit = kits[0];
        //if kit exists
        if (kit) {
          $('#hide' + toxina).removeClass('form-disabled');
          let begin = kit.toxinaStart + 1; //Workmaps start       
          nowActiveKits[toxina] = kit._id;

          $(group).parent().find("#countkits" + toxina).text(kit.stripLength);

          $.post(`/sample/setActiveKit/${toxina}/${kit._id}`);

          //remove boards
          for (let i = workmapsStart; i <= workmapsEnd; i++) {//the map 0 was defined before
            let board = "_workmap" + i;
            Wormapskanbans[toxina].removeBoard(board);
          }

          //Add boards
          for (let i = begin; i <= kit.stripLength; i++) {//the map 0 was defined before
            Wormapskanbans[toxina].addBoards(
              [{
                'id': '_workmap' + (i),
                'title': 'Mapa de trabalho' + ' ' + (i),
                'class': 'info',
              }]
            )
          }

          //ADD and DelETE calibradores
          for (let i = 1; i <= 5; i++) {
            Wormapskanbans[toxina].removeElement("P" + i);
            Wormapskanbans[toxina].addElement("_workmap" + begin, {
              id: "P" + i,
              title: "P" + i,
              calibrator: true
            });
          }

          //Update variables
          workmapsStart = begin;
          workmapsEnd = kit.stripLength;

          //allocate the samples/calibrators that are in an workmap
          kit.mapArray.forEach((mapID) => {
            $.get('/search/getWorkmap/' + mapID, (workmap) => {
              workmap.samplesArray.forEach((sampleID) => {
                $.get('/search/getOneSample/' + sampleID, (sample) => {
                  if (sample[toxina].active == true && sample[toxina].status == "Mapa de Trabalho") {
                    Wormapskanbans[toxina].addElement(sample[toxina].mapReference, {
                      id: sample.samplenumber,
                      title: "Amostra " + sample.samplenumber,
                      analyst: sample.responsible,
                      status: sample[toxina].status
                    });
                  }
                });
              });
            });
          });
        }
        else {
          $(group).parent().find("#countkits" + toxina).text("0");
          $('#hide' + toxina).addClass('form-disabled');
        }
      });
    });
  });
});
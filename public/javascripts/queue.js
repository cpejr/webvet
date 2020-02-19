ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];


function createAnalysisKanban(toxinaFull) {
  return new jKanban({
    element: '#' + toxinaFull,
    gutter: '10px',
    widthBoard: '190px',
    click: function (el) {
      window.location.href = 'sample/edit/' + el.dataset.eid;
    },
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
          console.log(nowActiveKits);
          console.log(nowActiveKits[toxinaFull]);
          $.post(`/sample/mapedit/${toxinaFull}/${samplenumber}/${nowActiveKits[toxinaFull]._id}/${mapName}`);

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

var scndAflatoxina = createWormapKanban('aflatoxina');
var scndDeoxinivalenol = createWormapKanban('deoxinivalenol')
var scndOcratoxina = createWormapKanban('ocratoxina');
var scndT2toxina = createWormapKanban('t2toxina');
var scndFumonisina = createWormapKanban('fumonisina');
var scndZearalenona = createWormapKanban('zearalenona');

let Wormapskanbans = {
  aflatoxina: scndAflatoxina,
  deoxinivalenol: scndDeoxinivalenol,
  ocratoxina: scndOcratoxina,
  t2toxina: scndT2toxina,
  fumonisina: scndFumonisina,
  zearalenona: scndZearalenona
};

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
                    console.log(toxina)
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

//Funções "hide" para puxar os kits desejados(A,B,C)


// ______________________________________________________________________

var nowAflaKit;
var aflaLimit = 0;
var AflaFilter = 0; //this variable will hide the second kanban if the selected radio hasn't a corresponding kit in mongo
var aflaBegin = 0;
$('#KitRadioAfla').click(function () {//não repete

  AflaFilter = 0;

  for (i = aflaLimit; i > aflaBegin - 1; i--) {//delete previus workmap;
    var board = "_workmap" + i;
    scndAflatoxina.removeBoard(board);
  }
  if (aflaLimit != 0 || AflaFilter == 3) {
    var elementId;
    for (j = 0; j < 5; j++) {

      elementId = "P" + (j + 1);
      scndAflatoxina.removeElement(elementId);
    }
  }
  var isSelected = false;
  var kitToxin;
  $.get('/search/kits', (kits) => {
    kits.forEach((kit) => {
      isSelected = false;
      kitToxin = kit.productCode;
      //------------------------------------------------------------------------------------
      if (kitToxin.includes("AFLA") || kitToxin.includes("Afla")) {
        if ($('#KitAflaB').is(':checked') && kit.kitType == "B") {
          $('#hideAfla').removeClass('form-disabled');
          aflaLimit = kit.stripLength;
          nowAflaKit = kit._id;
          aflacount = aflaLimit;
          aflaBegin = kit.toxinaStart + 1;
          isSelected = true;
          document.getElementById("countkitsAfla").innerHTML = aflacount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowAflaKit, () => {

          });
        }
        else {
          AflaFilter++;
        }
        // daqui 
        if ($('#KitAflaA').is(':checked') && kit.kitType == "A") {

          $('#hideAfla').removeClass('form-disabled');
          aflaLimit = kit.stripLength;
          nowAflaKit = kit._id;
          aflacount = aflaLimit;
          isSelected = true;
          aflaBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsAfla").innerHTML = aflacount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowAflaKit, () => {

          });

        }
        else {
          AflaFilter++;
        }
        // até aqui                 
        if ($('#KitAflaC').is(':checked') && kit.kitType == "C") {
          $('#hideAfla').removeClass('form-disabled');
          aflaLimit = kit.stripLength;
          nowAflaKit = kit._id;
          aflacount = aflaLimit;
          isSelected = true;
          aflaBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsAfla").innerHTML = aflacount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowAflaKit, () => {

          });

        }
        else {
          AflaFilter++;
        }
        if ($('#KitAflaD').is(':checked') && kit.kitType == "D") {

          $('#hideAfla').removeClass('form-disabled');
          aflaLimit = kit.stripLength;
          nowAflaKit = kit._id;
          aflacount = aflaLimit;
          isSelected = true;
          aflaBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsAfla").innerHTML = aflacount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowAflaKit, () => {

          });

        }
        else {
          AflaFilter++;
        }
        if ($('#KitAflaE').is(':checked') && kit.kitType == "E") {

          $('#hideAfla').removeClass('form-disabled');
          aflaLimit = kit.stripLength;
          nowAflaKit = kit._id;
          aflacount = aflaLimit;
          isSelected = true;
          aflaBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsAfla").innerHTML = aflacount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowAflaKit, () => {

          });

        }
        else {
          AflaFilter++;
        }
        if ($('#KitAflaF').is(':checked') && kit.kitType == "F") {

          $('#hideAfla').removeClass('form-disabled');
          aflaLimit = kit.stripLength;
          nowAflaKit = kit._id;
          aflacount = aflaLimit;
          isSelected = true;
          aflaBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsAfla").innerHTML = aflacount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowAflaKit, () => {

          });

        }
        else {
          AflaFilter++;
        }

        if (AflaFilter == 6) {
          $('#hideAfla').addClass('form-disabled');
        }

        if (isSelected) {
          for (i = aflaBegin; i <= aflaLimit; i++) {//the map 0 was defined before

            scndAflatoxina.addBoards(
              [{
                'id': '_workmap' + (i),
                'title': 'Mapa de trabalho' + ' ' + (i),
                'class': 'info',
              }]
            )
          }
        }



      }
    });//for each kit
    scndAflatoxina.addElement("_workmap" + aflaBegin, {
      id: "P1",
      title: "P1",
      calibrator: true

    });
    scndAflatoxina.addElement("_workmap" + aflaBegin, {
      id: "P2",
      title: "P2",
      calibrator: true

    });
    scndAflatoxina.addElement("_workmap" + aflaBegin, {
      id: "P3",
      title: "P3",
      calibrator: true

    });
    scndAflatoxina.addElement("_workmap" + aflaBegin, {
      id: "P4",
      title: "P4",
      calibrator: true

    });
    scndAflatoxina.addElement("_workmap" + aflaBegin, {
      id: "P5",
      title: "P5",
      calibrator: true

    });

    $.get('/search/getKit/' + nowAflaKit, (kit) => {//allocate the samples/calibrators that are in an workmap
      kit.mapArray.forEach((mapID) => {
        $.get('/search/getWorkmap/' + mapID, (workmap) => {
          workmap.samplesArray.forEach((sampleID) => {
            $.get('/search/getOneSample/' + sampleID, (sample) => {
              $.get('/search/userFromSample/' + sample._id, (user) => {
                if (sample.aflatoxina.active == true && sample.aflatoxina.status == "Mapa de Trabalho") {
                  scndAflatoxina.addElement(sample.aflatoxina.mapReference, {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.aflatoxina.status
                  });
                }

              });

            });
          });
        });
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    }); //end of the allocation of workmaps

  })

});

var nowOcraKit;
var ocraLimit = 0;
var ocraFilter;
var ocraBegin;
$('#KitRadioOcra').change(function () {
  ocraFilter = 0;
  for (i = ocraLimit; i > ocraBegin - 1; i--) {//delete previus workmap;
    var board = "_workmap" + i;
    scndOcratoxina.removeBoard(board);
  }
  if (ocraLimit != 0 || ocraFilter == 3) {
    var elementId;
    for (j = 0; j < 5; j++) {

      elementId = "P" + (j + 1);
      scndOcratoxina.removeElement(elementId);
    }
  }
  var isSelected = false;
  var kitToxin;

  $.get('/search/kits', (kits) => {

    kits.forEach((kit) => {
      kitToxin = kit.productCode;
      isSelected = false;
      if (kitToxin.includes("OTA") || kitToxin.includes("Och")) {
        if ($('#KitOcraA').is(':checked') && kit.kitType == "A") {
          $('#hideOcra').removeClass('form-disabled');
          ocraLimit = kit.stripLength;
          nowOcraKit = kit._id;
          ocracount = ocraLimit;
          isSelected = true;
          ocraBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsOcra").innerHTML = ocracount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowOcraKit, () => {

          });

        } else {
          ocraFilter++;
        }

        if ($('#KitOcraB').is(':checked') && kit.kitType == "B") {
          $('#hideOcra').removeClass('form-disabled');
          ocraLimit = kit.stripLength;
          nowOcraKit = kit._id;
          ocracount = ocraLimit;
          isSelected = true;
          ocraBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsOcra").innerHTML = ocracount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowOcraKit, () => {

          });
        } else {
          ocraFilter++;
        }
        if ($('#KitOcraC').is(':checked') && kit.kitType == "C") {
          $('#hideOcra').removeClass('form-disabled');
          ocraLimit = kit.stripLength;
          nowOcraKit = kit._id;
          ocracount = ocraLimit;
          isSelected = true;
          ocraBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsOcra").innerHTML = ocracount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowOcraKit, () => {

          });
        } else {
          ocraFilter++;
        }
        if ($('#KitOcraD').is(':checked') && kit.kitType == "D") {
          $('#hideOcra').removeClass('form-disabled');
          ocraLimit = kit.stripLength;
          nowOcraKit = kit._id;
          ocracount = ocraLimit;
          isSelected = true;
          ocraBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsOcra").innerHTML = ocracount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowOcraKit, () => {

          });

        } else {
          ocraFilter++;
        }
        if ($('#KitOcraE').is(':checked') && kit.kitType == "E") {
          $('#hideOcra').removeClass('form-disabled');
          ocraLimit = kit.stripLength;
          nowOcraKit = kit._id;
          ocracount = ocraLimit;
          isSelected = true;
          ocraBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsOcra").innerHTML = ocracount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowOcraKit, () => {

          });

        } else {
          ocraFilter++;
        }
        if ($('#KitOcraF').is(':checked') && kit.kitType == "F") {
          $('#hideOcra').removeClass('form-disabled');
          ocraLimit = kit.stripLength;
          nowOcraKit = kit._id;
          ocracount = ocraLimit;
          isSelected = true;
          ocraBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsOcra").innerHTML = ocracount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowOcraKit, () => {

          });

        } else {
          ocraFilter++;
        }



        if (ocraFilter == 6) {
          $('#hideOcra').addClass('form-disabled');
        }

        if (isSelected) {
          for (i = ocraBegin; i <= ocraLimit; i++) {//the map 0 was defined before
            scndOcratoxina.addBoards(
              [{
                'id': '_workmap' + (i),
                'title': 'Mapa de trabalho' + ' ' + (i),
                'class': 'info',
              }]
            )
          }
        }


      }

    })//for each
    scndOcratoxina.addElement("_workmap" + ocraBegin, {
      id: "P1",
      title: "P1",
      calibrator: true

    });
    scndOcratoxina.addElement("_workmap" + ocraBegin, {
      id: "P2",
      title: "P2",
      calibrator: true

    });
    scndOcratoxina.addElement("_workmap" + ocraBegin, {
      id: "P3",
      title: "P3",
      calibrator: true

    });
    scndOcratoxina.addElement("_workmap" + ocraBegin, {
      id: "P4",
      title: "P4",
      calibrator: true

    });
    scndOcratoxina.addElement("_workmap" + ocraBegin, {
      id: "P5",
      title: "P5",
      calibrator: true

    });
    $.get('/search/getKit/' + nowOcraKit, (kit) => {//allocate the samples/calibrators that are in an workmap
      kit.mapArray.forEach((mapID) => {
        $.get('/search/getWorkmap/' + mapID, (workmap) => {
          workmap.samplesArray.forEach((sampleID) => {
            $.get('/search/getOneSample/' + sampleID, (sample) => {
              $.get('/search/userFromSample/' + sample._id, (user) => {
                if (sample.ocratoxina.active == true && sample.ocratoxina.status == "Mapa de Trabalho") {

                  scndOcratoxina.addElement(sample.ocratoxina.mapReference, {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.ocratoxina.status
                  });

                }

              });

            });
          });



        });



      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    }); //end of the allocation of workmaps

  });

});


var nowDeoxKit;
var deoxLimit = 0;
var deoxFilter;
var deoxBegin;
$('#KitRadioDeox').change(function () {
  deoxFilter = 0;
  for (i = deoxLimit; i > deoxBegin - 1; i--) {//delete previus workmap;
    var board = "_workmap" + i;
    scndDeoxinivalenol.removeBoard(board);
  }
  if (deoxLimit != 0 || deoxFilter == 3) {
    var elementId;
    for (j = 0; j < 5; j++) {

      elementId = "P" + (j + 1);
      scndDeoxinivalenol.removeElement(elementId);
    }
  }
  var isSelected = false;
  var kitToxin;


  $.get('/search/kits', (kits) => {
    kits.forEach((kit) => {
      kitToxin = kit.productCode;
      isSelected = false;
      if (kitToxin.includes("DON")) {
        if ($('#KitDeoxA').is(':checked') && kit.kitType == "A") {
          $('#hideDeox').removeClass('form-disabled');
          deoxLimit = kit.stripLength;
          nowDeoxKit = kit._id;
          deoxcount = deoxLimit;
          isSelected = true;
          deoxBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsDeox").innerHTML = deoxcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowDeoxKit, () => {

          });

        } else {
          deoxFilter++;
        }

        if ($('#KitDeoxB').is(':checked') && kit.kitType == "B") {
          $('#hideDeox').removeClass('form-disabled');
          deoxLimit = kit.stripLength;
          nowDeoxKit = kit._id;
          deoxcount = deoxLimit;
          isSelected = true;
          deoxBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsDeox").innerHTML = deoxcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowDeoxKit, () => {

          });
        } else {
          deoxFilter++;
        }
        if (kit.kitType == "C" && $('#KitDeoxC').is(':checked')) {
          $('#hideDeox').removeClass('form-disabled');
          deoxLimit = kit.stripLength;
          nowDeoxKit = kit._id;
          deoxcount = deoxLimit;
          isSelected = true;
          deoxBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsDeox").innerHTML = deoxcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowDeoxKit, () => {

          });
        } else {
          deoxFilter++;
        }
        if (kit.kitType == "D" && $('#KitDeoxD').is(':checked')) {
          $('#hideDeox').removeClass('form-disabled');
          deoxLimit = kit.stripLength;
          nowDeoxKit = kit._id;
          deoxcount = deoxLimit;
          isSelected = true;
          deoxBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsDeox").innerHTML = deoxcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowDeoxKit, () => {

          });
        } else {
          deoxFilter++;
        }
        if (kit.kitType == "E" && $('#KitDeoxE').is(':checked')) {
          $('#hideDeox').removeClass('form-disabled');
          deoxLimit = kit.stripLength;
          nowDeoxKit = kit._id;
          deoxcount = deoxLimit;
          isSelected = true;
          deoxBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsDeox").innerHTML = deoxcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowDeoxKit, () => {

          });
        } else {
          deoxFilter++;
        }
        if (kit.kitType == "F" && $('#KitDeoxF').is(':checked')) {
          $('#hideDeox').removeClass('form-disabled');
          deoxLimit = kit.stripLength;
          nowDeoxKit = kit._id;
          deoxcount = deoxLimit;
          isSelected = true;
          deoxBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsDeox").innerHTML = deoxcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowDeoxKit, () => {

          });
        } else {
          deoxFilter++;
        }

        if (deoxFilter == 6) {
          $('#hideDeox').addClass('form-disabled');
        }

        if (isSelected) {
          for (i = deoxBegin; i <= deoxLimit; i++) {//the map 0 was defined before
            scndDeoxinivalenol.addBoards(
              [{
                'id': '_workmap' + (i),
                'title': 'Mapa de trabalho' + ' ' + (i),
                'class': 'info',
              }]
            )
          }
        }

      }

    });//kit foreach

    scndDeoxinivalenol.addElement("_workmap" + deoxBegin, {
      id: "P1",
      title: "P1",
      calibrator: true

    });
    scndDeoxinivalenol.addElement("_workmap" + deoxBegin, {
      id: "P2",
      title: "P2",
      calibrator: true

    });
    scndDeoxinivalenol.addElement("_workmap" + deoxBegin, {
      id: "P3",
      title: "P3",
      calibrator: true

    });
    scndDeoxinivalenol.addElement("_workmap" + deoxBegin, {
      id: "P4",
      title: "P4",
      calibrator: true
    });

    scndDeoxinivalenol.addElement("_workmap" + deoxBegin, {
      id: "P5",
      title: "P5",
      calibrator: true
    });

    $.get('/search/getKit/' + nowDeoxKit, (kit) => {//allocate the samples/calibrators that are in an workmap
      kit.mapArray.forEach((mapID) => {
        $.get('/search/getWorkmap/' + mapID, (workmap) => {
          workmap.samplesArray.forEach((sampleID) => {
            $.get('/search/getOneSample/' + sampleID, (sample) => {
              $.get('/search/userFromSample/' + sample._id, (user) => {
                if (sample.deoxinivalenol.active == true && sample.deoxinivalenol.status == "Mapa de Trabalho") {
                  if (user.debt) {
                    scndDeoxinivalenol.addElement(sample.deoxinivalenol.mapReference, {
                      id: "owner",
                      title: "Amostra " + sample.samplenumber,
                      analyst: sample.responsable,
                      status: sample.deoxinivalenol.status,
                      owner: "Devedor"
                    });
                  }

                  else {
                    scndDeoxinivalenol.addElement(sample.deoxinivalenol.mapReference, {
                      id: sample.samplenumber,
                      title: "Amostra " + sample.samplenumber,
                      analyst: sample.responsable,
                      status: sample.deoxinivalenol.status
                    });
                  }

                }
              });
            });
          });
        });
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    }); //end of the allocation of workmaps
  });
});

var nowFumKit;
var fumLimit = 0;
var fumFilter;
var fumBegin;
$('#KitRadioFum').change(function () {
  fumFilter = 0;
  for (i = fumLimit; i > fumBegin - 1; i--) {//delete previus workmap;
    var board = "_workmap" + i;
    scndFumonisina.removeBoard(board);
  }
  if (fumLimit != 0 || fumFilter == 3) {
    var elementId;
    for (j = 0; j < 5; j++) {

      elementId = "P" + (j + 1);
      scndFumonisina.removeElement(elementId);
    }
  }
  var isSelected = false;
  var kitToxin;

  $.get('/search/kits', (kits) => {
    kits.forEach((kit) => {
      kitToxin = kit.productCode;
      isSelected = false;

      if (kitToxin.includes("FUMO") || kitToxin.includes("Fum")) {
        if ($('#KitFumA').is(':checked') && kit.kitType == "A") {
          $('#hideFum').removeClass('form-disabled');
          fumLimit = kit.stripLength;
          nowFumKit = kit._id;
          fumcount = fumLimit;
          isSelected = true;
          fumBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsFumo").innerHTML = fumcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowFumKit, () => {

          });

        } else {
          fumFilter++;
        }
        if ($('#KitFumB').is(':checked') && kit.kitType == "B") {
          $('#hideFum').removeClass('form-disabled');
          fumLimit = kit.stripLength;
          nowFumKit = kit._id;
          fumcount = fumLimit;
          isSelected = true;
          fumBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsFumo").innerHTML = fumcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowFumKit, () => {

          });
        } else {
          fumFilter++;
        }
        if (kit.kitType == "C" && $('#KitFumC').is(':checked')) {
          $('#hideFum').removeClass('form-disabled');
          fumLimit = kit.stripLength;
          nowFumKit = kit._id;
          fumcount = fumLimit;
          isSelected = true;
          fumBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsFumo").innerHTML = fumcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowFumKit, () => {

          });
        } else {
          fumFilter++;
        }
        if ($('#KitFumD').is(':checked') && kit.kitType == "D") {
          $('#hideFum').removeClass('form-disabled');
          fumLimit = kit.stripLength;
          nowFumKit = kit._id;
          fumcount = fumLimit;
          isSelected = true;
          fumBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsFumo").innerHTML = fumcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowFumKit, () => {

          });

        } else {
          fumFilter++;
        }
        if ($('#KitFumE').is(':checked') && kit.kitType == "E") {
          $('#hideFum').removeClass('form-disabled');
          fumLimit = kit.stripLength;
          nowFumKit = kit._id;
          fumcount = fumLimit;
          isSelected = true;
          fumBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsFumo").innerHTML = fumcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowFumKit, () => {

          });

        } else {
          fumFilter++;
        }
        if ($('#KitFumF').is(':checked') && kit.kitType == "F") {
          $('#hideFum').removeClass('form-disabled');
          fumLimit = kit.stripLength;
          nowFumKit = kit._id;
          fumcount = fumLimit;
          isSelected = true;
          fumBegin = kit.toxinaStart + 1;
          document.getElementById("countkitsFumo").innerHTML = fumcount;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowFumKit, () => {

          });

        } else {
          fumFilter++;
        }

        if (fumFilter == 6) {
          $('#hideFum').addClass('form-disabled');
        }

        if (isSelected) {
          for (i = fumBegin; i <= fumLimit; i++) {//the map 0 was defined before
            scndFumonisina.addBoards(
              [{
                'id': '_workmap' + (i),
                'title': 'Mapa de trabalho' + ' ' + (i),
                'class': 'info',
              }]
            )
          }
        }



      }

    })//kit foreacj
    scndFumonisina.addElement("_workmap" + fumBegin, {
      id: "P1",
      title: "P1",
      calibrator: true

    });
    scndFumonisina.addElement("_workmap" + fumBegin, {
      id: "P2",
      title: "P2",
      calibrator: true

    });
    scndFumonisina.addElement("_workmap" + fumBegin, {
      id: "P3",
      title: "P3",
      calibrator: true

    });
    scndFumonisina.addElement("_workmap" + fumBegin, {
      id: "P4",
      title: "P4",
      calibrator: true
    });

    scndFumonisina.addElement("_workmap" + fumBegin, {
      id: "P5",
      title: "P5",
      calibrator: true
    });
    $.get('/search/getKit/' + nowFumKit, (kit) => {//allocate the samples/calibrators that are in an workmap
      kit.mapArray.forEach((mapID) => {
        $.get('/search/getWorkmap/' + mapID, (workmap) => {
          workmap.samplesArray.forEach((sampleID) => {
            $.get('/search/getOneSample/' + sampleID, (sample) => {

              $.get('/search/userFromSample/' + sample._id, (user) => {
                if (sample.fumonisina.active == true && sample.fumonisina.status == "Mapa de Trabalho") {


                  scndFumonisina.addElement(sample.fumonisina.mapReference, {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.fumonisina.status
                  });


                }

              });
            });
          });
        });
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    }); //end of the allocation of workmaps

  })
});

var nowT2Kit;
var t2Limit = 0;
var t2Filter;
var t2Begin;
$('#KitRadioT').change(function () {
  t2Filter = 0;
  for (i = t2Limit; i > t2Begin - 1; i--) {//delete previus workmap;
    var board = "_workmap" + i;
    scndT2toxina.removeBoard(board);
  }

  if (t2Limit != 0 || t2Filter == 3) {
    var elementId;
    for (j = 0; j < 5; j++) {

      elementId = "P" + (j + 1);
      scndT2toxina.removeElement(elementId);
    }
  }
  var isSelected = false;
  var kitToxin;

  $.get('/search/kits', (kits) => {
    kits.forEach((kit) => {
      kitToxin = kit.productCode;
      isSelected = false;
      if (kitToxin.includes("T2")) {
        if ($('#KitTA').is(':checked') && kit.kitType == "A") {
          $('#hideT').removeClass('form-disabled');
          t2Limit = kit.stripLength;
          nowT2Kit = kit._id;
          t2count = t2Limit;
          isSelected = true;
          t2Begin = kit.toxinaStart + 1;
          document.getElementById("countkits").innerHTML = t2count;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowT2Kit, () => {

          });

        } else {
          t2Filter++;
        }
        if ($('#KitTB').is(':checked') && kit.kitType == "B") {
          $('#hideT').removeClass('form-disabled');
          t2Limit = kit.stripLength;
          nowT2Kit = kit._id;
          t2count = t2Limit;
          t2Begin = kit.toxinaStart + 1;
          document.getElementById("countkits").innerHTML = t2count;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowT2Kit, () => {

          });

        } else {
          t2Filter++;
        }
        if (kit.kitType == "C" && $('#KitTC').is(':checked')) {
          $('#hideT').removeClass('form-disabled');
          t2Limit = kit.stripLength;
          nowT2Kit = kit._id;
          t2count = t2Limit;
          t2Begin = kit.toxinaStart + 1;
          document.getElementById("countkits").innerHTML = t2count;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowT2Kit, () => {

          });
        } else {
          t2Filter++;
        }
        if ($('#KitTD').is(':checked') && kit.kitType == "D") {
          $('#hideT').removeClass('form-disabled');
          t2Limit = kit.stripLength;
          nowT2Kit = kit._id;
          t2count = t2Limit;
          isSelected = true;
          t2Begin = kit.toxinaStart + 1;
          document.getElementById("countkits").innerHTML = t2count;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowT2Kit, () => {

          });

        } else {
          t2Filter++;
        }
        if ($('#KitTE').is(':checked') && kit.kitType == "E") {
          $('#hideT').removeClass('form-disabled');
          t2Limit = kit.stripLength;
          nowT2Kit = kit._id;
          t2count = t2Limit;
          isSelected = true;
          t2Begin = kit.toxinaStart + 1;
          document.getElementById("countkits").innerHTML = t2count;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowT2Kit, () => {

          });

        } else {
          t2Filter++;
        }
        if ($('#KitTF').is(':checked') && kit.kitType == "F") {
          $('#hideT').removeClass('form-disabled');
          t2Limit = kit.stripLength;
          nowT2Kit = kit._id;
          t2count = t2Limit;
          isSelected = true;
          t2Begin = kit.toxinaStart + 1;
          document.getElementById("countkits").innerHTML = t2count;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowT2Kit, () => {

          });

        } else {
          t2Filter++;
        }


        if (t2Filter == 6) {
          $('#hideT').addClass('form-disabled');
        }

        if (isSelected) {
          for (i = t2Begin; i <= t2Limit; i++) {//the map 0 was defined before
            scndT2toxina.addBoards(
              [{
                'id': '_workmap' + (i),
                'title': 'Mapa de trabalho' + ' ' + (i),
                'class': 'info',
              }]
            );
          }
        }
      }

    }) //kit
    scndT2toxina.addElement("_workmap" + t2Begin, {
      id: "P1",
      title: "P1",
      calibrator: true

    });
    scndT2toxina.addElement("_workmap" + t2Begin, {
      id: "P2",
      title: "P2",
      calibrator: true

    });
    scndT2toxina.addElement("_workmap" + t2Begin, {
      id: "P3",
      title: "P3",
      calibrator: true

    });
    scndT2toxina.addElement("_workmap" + t2Begin, {
      id: "P4",
      title: "P4",
      calibrator: true

    });

    scndT2toxina.addElement("_workmap" + t2Begin, {
      id: "P5",
      title: "P5",
      calibrator: true

    });
    $.get('/search/getKit/' + nowT2Kit, (kit) => {//allocate the samples/calibrators that are in an workmap
      kit.mapArray.forEach((mapID) => {
        $.get('/search/getWorkmap/' + mapID, (workmap) => {
          workmap.samplesArray.forEach((sampleID) => {
            $.get('/search/getOneSample/' + sampleID, (sample) => {
              $.get('/search/userFromSample/' + sample._id, (user) => {
                if (sample.t2toxina.active == true && sample.t2toxina.status == "Mapa de Trabalho") {
                  scndT2toxina.addElement(sample.t2toxina.mapReference, {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.t2toxina.status
                  });


                }

              });
            });
          });
        });
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    }); //end of the allocation of workmaps


  });
});

var nowZKit;
var zLimit = 0;
var zFilter;
var zBegin;
$('#KitRadioZ').change(function () {
  zFilter = 0;
  for (i = zLimit; i > zBegin - 1; i--) {//delete previus workmap;
    var board = "_workmap" + i;
    scndZearalenona.removeBoard(board);
  }
  if (zLimit != 0) {
    var elementId;
    for (j = 0; j < 5; j++) {

      elementId = "P" + (j + 1);
      scndZearalenona.removeElement(elementId);
    }
  }
  var isSelected = false;
  var kitToxin;

  $.get('/search/kits', (kits) => {
    kits.forEach((kit) => {
      kitToxin = kit.productCode;
      isSelected = false;

      if (kitToxin.includes("ZEA") || kitToxin.includes("Zea")) {
        if ($('#KitZA').is(':checked') && kit.kitType == "A") {
          $('#hideZ').removeClass('form-disabled');
          zLimit = kit.stripLength;
          nowZKit = kit._id;
          isSelected = true;
          zBegin = kit.toxinaStart + 1;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowZKit, () => {

          });

        } else {
          zFilter++;
        }
        if ($('#KitZB').is(':checked') && kit.kitType == "B") {
          $('#hideZ').removeClass('form-disabled');
          zLimit = kit.stripLength;
          nowZKit = kit._id;
          isSelected = true;
          zBegin = kit.toxinaStart + 1;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowZKit, () => {

          });

        } else {
          zFilter++;
        }
        if (kit.kitType == "C" && $('#KitZC').is(':checked')) {
          $('#hideZ').removeClass('form-disabled');
          zLimit = kit.stripLength;
          nowZKit = kit._id;
          isSelected = true;
          zBegin = kit.toxinaStart + 1;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowZKit, () => {

          });
        } else {
          zFilter++;
        }
        if ($('#KitZD').is(':checked') && kit.kitType == "D") {
          $('#hideZ').removeClass('form-disabled');
          zLimit = kit.stripLength;
          nowZKit = kit._id;
          isSelected = true;
          zBegin = kit.toxinaStart + 1;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowZKit, () => {

          });

        } else {
          zFilter++;
        }
        if ($('#KitZE').is(':checked') && kit.kitType == "E") {
          $('#hideZ').removeClass('form-disabled');
          zLimit = kit.stripLength;
          nowZKit = kit._id;
          isSelected = true;
          zBegin = kit.toxinaStart + 1;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowZKit, () => {

          });

        } else {
          zFilter++;
        }
        if ($('#KitZF').is(':checked') && kit.kitType == "F") {
          $('#hideZ').removeClass('form-disabled');
          zLimit = kit.stripLength;
          nowZKit = kit._id;
          isSelected = true;
          zBegin = kit.toxinaStart + 1;
          $.post('/sample/setActiveKit/' + kitToxin + '/' + nowZKit, () => {

          });

        } else {
          zFilter++;
        }

        if (zFilter == 6) {
          $('#hideZ').addClass('form-disabled');
        }
        if (isSelected) {
          for (i = zBegin; i <= zLimit; i++) {//the map 0 was defined before
            scndZearalenona.addBoards(
              [{
                'id': '_workmap' + (i),
                'title': 'Mapa de trabalho' + ' ' + (i),
                'class': 'info',
              }]
            )
          }
        }


      }

    }) //foreach
    scndZearalenona.addElement("_workmap" + zBegin, {
      id: "P1",
      title: "P1",
      calibrator: true

    });
    scndZearalenona.addElement("_workmap" + zBegin, {
      id: "P2",
      title: "P2",
      calibrator: true

    });
    scndZearalenona.addElement("_workmap" + zBegin, {
      id: "P3",
      title: "P3",
      calibrator: true

    });
    scndZearalenona.addElement("_workmap" + zBegin, {
      id: "P4",
      title: "P4",
      calibrator: true

    });

    scndZearalenona.addElement("_workmap" + zBegin, {
      id: "P5",
      title: "P5",
      calibrator: true

    });

    $.get('/search/getKit/' + nowZKit, (kit) => {//allocate the samples/calibrators that are in an workmap
      kit.mapArray.forEach((mapID) => {
        $.get('/search/getWorkmap/' + mapID, (workmap) => {
          workmap.samplesArray.forEach((sampleID) => {
            $.get('/search/getOneSample/' + sampleID, (sample) => {
              $.get('/search/userFromSample/' + sample._id, (user) => {
                if (sample.zearalenona.active == true && sample.zearalenona.status == "Mapa de Trabalho") {

                  scndZearalenona.addElement(sample.zearalenona.mapReference, {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.zearalenona.status
                  });


                }

              });

            });
          });
        });
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });


  })
});


let nowActiveKits = {
  aflatoxina: nowAflaKit,
  deoxinivalenol: nowDeoxKit,
  ocratoxina: nowOcraKit,
  t2toxina: nowT2Kit,
  fumonisina: nowFumKit,
  zearalenona: nowZKit
};


  //
  // // Use of Date.now() function
  // var d = Date(Date.now());
  //
  // // Converting the number of millisecond in date string
  // a = d.toString()
  //
  // // Printing the current date
  //
  //   // Use of Date.now() function
  //   var d = Date(Date.now());
  //
  //   // Converting the number of millisecond in date string
  //   a = d.toString()
  //
  //
  //   var contando = 0;
  //   var ano = new Array;
  //   for(var cont = 0; cont < a.length; cont++){
  //     if(a[cont] == 1||2||3||4||5||6||7||8||9||0){
  //       ano2[contando] = a=[cont];
  //       ano[contando] = a [cont] ;
  //       contando++;
  //     }
  //   }
  //   ano = ano.toString;
  //   document.write(ano);

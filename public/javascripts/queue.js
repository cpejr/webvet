ToxinasFull = [
  "aflatoxina",
  "deoxinivalenol",
  "fumonisina",
  "ocratoxina",
  "t2toxina",
  "zearalenona",
];

function createAnalysisKanban(toxinaFull) {
  return new jKanban({
    element: "#" + toxinaFull,
    gutter: "10px",
    widthBoard: "190px",
    click: function (el) {
      window.location.href = "sample/edit/" + el.dataset.eid;
    },
    dragBoards: false,
    boards: [
      {
        id: "_testing",
        title: "Em análise",
        class: "success",
      },
      {
        id: "_ownering",
        title: "Aguardando pagamento",
        class: "success",
      },
      {
        id: "_waiting",
        title: "Aguardando amostra",
        class: "info",
      },
    ],
    dropEl: function (el, target, source, sibling) {
      const sampleId = el.dataset.eid;

      let sourceName = $(source).parent().data("id");

      if (sourceName === "_testing")
        Wormapskanbans[toxinaFull].removeElement(sampleId);

      let text;

      switch (target) {
        case "_testing":
          text = "Em análise";

          //Se está a provada, o usuário não é devedor e já não estiver lá
          if (
            el.dataset.approved === "true" &&
            el.dataset.owner === "false" &&
            !Wormapskanbans[toxinaFull].findElement(sampleId)
          ) {
            Wormapskanbans[toxinaFull].addElement("_scndTesting", {
              id: sampleId,
              title: el.dataset.title,
              analyst: el.dataset.analyst,
              status: "Em análise",
              approved: el.dataset.approved,
              owner: el.dataset.owner,
              iscitrus: el.dataset.iscitrus,
              click: function (el) {
                window.location.href = "sample/edit/" + el.dataset.eid;
              },
            });
          }
          break;

        case "_ownering":
          text = "Aguardando pagamento";
          break;
        case "_waiting":
          text = "Aguardando amostra";
          break;
      }

      $.post(
        `sample/updatestatus/${target.replace(
          "_",
          ""
        )}/${toxinaFull}/${sampleId}`
      );

      let badges = `${el.dataset.title}<br><span  class="badge badge-secondary">${text}</span>`;
      badges += `<span  class="badge badge-primary">${el.dataset.analyst}</span>`;

      if (el.dataset.owner + "" === "true")
        badges += `<span  class="badge badge-danger">Devedor</span>`;

      if (el.dataset.approved == "false")
        badges += `<span  class="badge badge-danger">Não aprovada</span>`;

      if (el.dataset.iscitrus == "true")
        badges += `<span  class="badge badge-success">Polpa Cítrica</span>`;

      if (el.dataset.limitDate)
        badges += `<span  class="badge badge-secondary">${el.dataset.limitDate}</span>`;

      el.innerHTML = badges;
    },
  });
}

const aflatoxina = createAnalysisKanban("aflatoxina");
const deoxinivalenol = createAnalysisKanban("deoxinivalenol");
const ocratoxina = createAnalysisKanban("ocratoxina");
const t2toxina = createAnalysisKanban("t2toxina");
const fumonisina = createAnalysisKanban("fumonisina");
const zearalenona = createAnalysisKanban("zearalenona");

let Analysiskanbans = {
  aflatoxina,
  deoxinivalenol,
  ocratoxina,
  t2toxina,
  fumonisina,
  zearalenona,
};

function createWormapKanban(toxinaFull) {
  return new jKanban({
    element: "#" + toxinaFull + "2",
    gutter: "10px",
    widthBoard: "165px",
    dragBoards: false,
    boards: [
      {
        id: "_scndTesting",
        title: "Em análise",
        class: "info",
      },
    ],
    dropEl: function (el, target, source, sibling) {
      const sampleId = el.dataset.eid;

      if (target == "_scndTesting") {
        if (el.dataset.calibrator) {
          //cards P não se movem para em analise
          return false;
        } else {
          $.post(`/sample/scndTesting/edit/${toxinaFull}/${sampleId}`);

          let badges = `${el.dataset.title}<br><span  class="badge badge-secondary">Em análise</span>`;
          badges += `<span  class="badge badge-primary">${el.dataset.analyst}</span>`;

          if (el.dataset.owner + "" === "true")
            badges += `<span  class="badge badge-danger">Devedor</span>`;

          if (el.dataset.approved == "false")
            badges += `<span  class="badge badge-danger">Não aprovada</span>`;

          if (el.dataset.iscitrus + "" == "true")
            badges += `<span  class="badge badge-success">Polpa Cítrica</span>`;

          if (el.dataset.limitDate)
            badges += `<span  class="badge badge-secondary">${el.dataset.limitDate}</span>`;

          el.innerHTML = badges;
        }
      } else {
        if (el.dataset.calibrator)
          //cards originais
          return false;
        else {
          $.post(`/sample/mapedit/${toxinaFull}/${sampleId}/${target}`);

          let badges = `${el.dataset.title}<br><span  class="badge badge-secondary">Mapa de trabalho</span>`;
          badges += `<span  class="badge badge-primary">${el.dataset.analyst}</span>`;

          if (el.dataset.owner + "" === "true")
            badges += `<span  class="badge badge-danger">Devedor</span>`;

          if (el.dataset.approved == "false")
            badges += `<span  class="badge badge-danger">Não aprovada</span>`;

          if (el.dataset.iscitrus == "true")
            badges += `<span  class="badge badge-success">Polpa Cítrica</span>`;

          if (el.dataset.limitDate)
            badges += `<span  class="badge badge-secondary">${el.dataset.limitDate}</span>`;

          el.innerHTML = badges;
        }
      }
    },
  });
}

let Wormapskanbans = {
  aflatoxina: createWormapKanban("aflatoxina"),
  deoxinivalenol: createWormapKanban("deoxinivalenol"),
  ocratoxina: createWormapKanban("ocratoxina"),
  t2toxina: createWormapKanban("t2toxina"),
  fumonisina: createWormapKanban("fumonisina"),
  zearalenona: createWormapKanban("zearalenona"),
};

let nowActiveKits = {};

//cria cedulas kanban
$.get("/search/samplesActiveWithUser", (objects) => {
  $(document).ready(function () {
    objects.forEach((user) => {
      let debt = user.debt;

      user.samples.forEach((sample) => {
        //Teste para cada toxina
        ToxinasFull.forEach((toxina) => {
          if (sample[toxina].active == true) {
            let status = sample[toxina].status;
            let kanban = Analysiskanbans[toxina];
            let approved = sample.approved;

            let element = {
              id: sample._id,
              title: "Amostra " + sample.samplenumber,
              analyst: sample.responsible,
              status: status,
              approved: sample.approved,
              owner: debt,
              iscitrus: sample.isCitrus,
              click: function (el) {
                window.location.href = "sample/edit/" + el.dataset.eid;
              },
            };

            if (
              status == "Nova" ||
              status == "Sem amostra" ||
              status == "A corrigir" ||
              status == "Aguardando amostra"
            )
              kanban.addElement("_waiting", element);
            else if (status == "Mapa de Trabalho")
              kanban.addElement("_testing", element);
            else if (status == "Em análise") {
              kanban.addElement("_testing", element);
              if (!debt && approved)
                Wormapskanbans[toxina].addElement("_scndTesting", element);
            } else if (status == "Aguardando pagamento")
              kanban.addElement("_ownering", element);
          }
        });
      });
    });
  });
});

let workmapsStart = 0;
let workmapsEnd = 0;

//Add eventos
$('div[class="loteradio"]').each(function (index, group) {
  let toxina = $(group).data("toxin");
  $(group)
    .find("input.radio-queue")
    .each(function (index, checkbox) {
      $(checkbox).change(function (e, data) {
        let letter = $(this).data("letter");
        $.get(`/search/kits/${toxina}/${letter}`, (kits) => {
          let kit = kits[0];
          //if kit exists
          if (kit) {
            $("#hide" + toxina).removeClass("form-disabled");
            let begin = kit.toxinaStart; //Workmaps start
            nowActiveKits[toxina] = kit._id;

            $("#countkits" + toxina).text(kit.stripLength);

            if (data == undefined)
              $.post(`/sample/setActiveKit/${toxina}/${kit._id}`);

            //remove boards
            for (
              let i = workmapsStart;
              i <= workmapsEnd;
              i++ //the map 0 was defined before
            )
              Wormapskanbans[toxina].removeAllBoards("_scndTesting");

            //Add boards
            for (let i = begin; i < kit.stripLength; i++) {
              //the map 0 was defined before
              Wormapskanbans[toxina].addBoards([
                {
                  id: kit.mapArray[i],
                  title: "Mapa de trabalho" + " " + (i + 1),
                  class: "info",
                },
              ]);
            }

            //If there is workmaps
            if (begin != kit.stripLength) {
              //ADD and DelETE calibradores
              for (let i = 1; i <= 5; i++) {
                Wormapskanbans[toxina].removeElement("P" + i);
                Wormapskanbans[toxina].addFixedElement(kit.mapArray[begin], {
                  id: "P" + i,
                  title: "P" + i,
                  calibrator: true,
                  click: () => {},
                });
              }

              //Update variables
              workmapsStart = begin;
              workmapsEnd = kit.stripLength;

              //allocate the samples/calibrators that are in an workmap
              $.get(
                `/search/getSamplesActiveByWorkmapArray/${kit.mapArray}/${toxina}`
              ).then((samples) => {
                for (let i = 0; i < samples.length; i++) {
                  const sample = samples[i];
                  if (sample[toxina].status === "Mapa de Trabalho") {
                    let sampleAnalysis = Analysiskanbans[toxina].findElement(
                      sample._id
                    );

                    let element = {
                      id: sample._id,
                      title: "Amostra " + sample.samplenumber,
                      analyst: sample.responsible,
                      status: sample[toxina].status,
                      approved: sample.approved,
                      iscitrus: sample.isCitrus,
                      click: function (el) {
                        window.location.href = "sample/edit/" + el.dataset.eid;
                      },
                    };

                    if (sampleAnalysis)
                      element.owner = sampleAnalysis.dataset.owner;
                    else element.owner = "false";

                    Wormapskanbans[toxina].addElement(
                      sample[toxina].workmapId,
                      element
                    );
                  }
                }
              });
            }
          } else {
            $("#countkits" + toxina).text("0");
            $("#hide" + toxina).addClass("form-disabled");
          }
        });
      });
    });
});

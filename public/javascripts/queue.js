ToxinasFull = [
  "aflatoxina",
  "deoxinivalenol",
  "fumonisina",
  "ocratoxina",
  "t2toxina",
  "zearalenona",
];

function createAnalysisKanban(toxinId) {
  return new jKanban({
    element: `#Analysis${toxinId}`,
    gutter: "10px",
    widthBoard: "190px",
    click: function (el) {
      window.location.href = "sample/edit/" + el.dataset.eid;
    },
    dragBoards: false,
    boards: [
      {
        id: "Em análise",
        title: "Em análise",
        class: "success",
      },
      {
        id: "Aguardando pagamento",
        title: "Aguardando pagamento",
        class: "success",
      },
      {
        id: "Aguardando amostra",
        title: "Aguardando amostra",
        class: "info",
      },
    ],
    dropEl: function (el, target, source, sibling) {
      const { eid: sampleId, analysis_id, approved, owner } = el.dataset;

      let sourceName = $(source).parent().data("id");

      // Saiu do em análise
      if (sourceName === "Em análise")
        Wormapskanbans[toxinId].removeElement(sampleId);

      // Entrou no em análige
      //Se está a provada, o usuário não é devedor e já não estiver lá
      if (
        target === "Em análise" &&
        approved === "true" &&
        owner === "false" &&
        !Wormapskanbans[toxinId].findElement(sampleId)
      )
        Wormapskanbans[toxinId].addElement("_scndTesting", {
          ...el,
        });

      $.post(`sample/updateAnalysis/${analysis_id}`, { status: target });

      el.innerHTML = getElementHtml({ ...el.dataset, status: target });
    },
  });
}

function createWorkmapKanban(toxinId) {
  return new jKanban({
    element: `#Workmap${toxinId}`,
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

          if (el.dataset.limitdate)
            badges += `<span  class="badge badge-secondary">${el.dataset.limitdate}</span>`;

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

          if (el.dataset.limitdate)
            badges += `<span  class="badge badge-secondary">${el.dataset.limitdate}</span>`;

          el.innerHTML = badges;
        }
      }
    },
  });
}

function getElementHtml({
  title,
  analyst,
  approved,
  iscitrus,
  limitdate,
  owner,
  status,
}) {
  let innerHTML = `${title}<br><span  class="badge badge-secondary">${status}</span>`;
  innerHTML += `<span  class="badge badge-primary">${analyst}</span>`;

  if (owner == true)
    innerHTML += `<span  class="badge badge-danger">Devedor</span>`;

  if (approved == "false")
    innerHTML += `<span  class="badge badge-danger">Não aprovada</span>`;

  if (iscitrus == true)
    innerHTML += `<span  class="badge badge-success">Polpa Cítrica</span>`;

  if (limitdate)
    innerHTML += `<span  class="badge badge-secondary">${limitdate}</span>`;

  return innerHTML;
}

let Analysiskanbans = {};
let Wormapskanbans = {};

let nowActiveKits = {};

$(function () {
  $.get("/toxins", (response) => {
    response.forEach((toxin) => {
      Wormapskanbans[toxin._id] = createWorkmapKanban(toxin._id);
      Analysiskanbans[toxin._id] = createAnalysisKanban(toxin._id);
    });
    populateAnalysisKanban();
  });
});

//cria cedulas kanban
function populateAnalysisKanban() {
  $.get("/search/getAllWithoutWorkmap", (response) => {
    response.forEach((toxinData) => {
      toxinData.samples.forEach((sample) => {
        let element = {
          id: sample._id,
          title: `Amostra ${sample.samplenumber}`,
          analyst: sample.name,
          status: sample.analysis.status,
          approved: sample.requisition.approved,
          owner: sample.requisition.charge?.user?.debt,
          iscitrus: sample.isCitrus,
          limitDate: sample.limitDate,
          analysis_id: sample.analysis._id,
        };
        addElementToAnalysis(toxinData._id, element);
      });
    });
  });
}

function addElementToAnalysis(
  toxinId,
  {
    id,
    title,
    analyst,
    status,
    approved,
    owner,
    iscitrus,
    limitDate,
    analysis_id,
  }
) {
  let kanban = Analysiskanbans[toxinId];

  let element = {
    id,
    title,
    analyst,
    status,
    approved,
    owner,
    iscitrus,
    limitDate,
    analysis_id,
    click: function (el) {
      window.location.href = `sample/edit/${id}`;
    },
  };

  switch (element.status) {
    case "nova":
    case "Nova":
    case "Sem amostra":
    case "A corrigir":
    case "Aguardando amostra":
      kanban.addElement("Aguardando amostra", element);
      break;

    case "Em análise":
    case "Mapa de Trabalho":
      kanban.addElement("Em análise", element);
      break;

    case "Aguardando pagamento":
      kanban.addElement("Aguardando pagamento", element);
      break;
  }
}

function addElementToWorkmaps(
  toxinId,
  {
    id,
    title,
    analyst,
    status,
    approved,
    owner,
    iscitrus,
    limitDate,
    analysis_id,
  }
) {
  let kanban = Analysiskanbans[toxinId];

  let element = {
    id,
    title,
    analyst,
    status,
    approved,
    owner,
    iscitrus,
    limitDate,
    analysis_id,
    click: function (el) {
      window.location.href = "sample/edit/" + el.dataset.eid;
    },
  };

  switch (element.status) {
    case "Nova":
    case "Sem amostra":
    case "A corrigir":
    case "Aguardando amostra":
      kanban.addElement("Aguardando amostra", element);
      break;

    case "Em análise":
    case "Mapa de Trabalho":
      kanban.addElement("Em análise", element);
      break;

    case "Aguardando pagamento":
      kanban.addElement("Aguardando pagamento", element);
      break;
  }
}

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
            let begin = kit.toxinIndex; //Workmaps start
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
                      limitDate: sample.limitDate,
                      analysis_id: sample.analysis._id,
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

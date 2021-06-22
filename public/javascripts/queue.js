const Analysiskanbans = {};
const Workmapskanbans = {};
let SamplesInAnalysis = {};

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
      const { eid: sampleId, analysis_id, approved, debt } = el.dataset;

      let sourceName = $(source).parent().data("id");

      // Saiu do em análise
      if (sourceName === "Em análise")
        Workmapskanbans[toxinId].removeElement(`${sampleId}`);

      // Entrou no em análise
      //Se está a provada, o usuário não é devedor e já não estiver lá

      if (
        target == "Em análise" &&
        `${approved}` == "true" &&
        `${debt}` == "false" &&
        !Workmapskanbans[toxinId].findElement(sampleId)
      )
        Workmapskanbans[toxinId].addElement("Em análise", {
          ...el.dataset,
          status: target,
          innerHTML: getElementHtml({ ...el.dataset, status: target }),
        });

      el.innerHTML = getElementHtml({ ...el.dataset, status: target });
      $.post(`sample/updateAnalysisWorkmapAndStatus/${analysis_id}`, {
        status: target,
      });
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
        id: "Em análise",
        title: "Em análise",
        class: "info",
      },
    ],
    dropEl: function (el, target, source, sibling) {
      const { analysis_id } = el.dataset;

      const newWorkmapId = target != "Em análise" ? target : null;
      $.post(`sample/updateAnalysisWorkmapAndStatus/${analysis_id}`, {
        workmapId: newWorkmapId,
      });

      el.innerHTML = getElementHtml(el.dataset);
    },
  });
}

function getElementHtml({
  title,
  analyst,
  approved,
  iscitrus,
  limitdate,
  debt,
  status,
}) {
  let innerHTML = `${title}<br><span  class="badge badge-secondary">${status}</span>`;
  innerHTML += `<span  class="badge badge-primary">${analyst}</span>`;

  if (`${debt}` == "true")
    innerHTML += `<span  class="badge badge-danger">Devedor</span>`;

  if (`${approved}` == "false")
    innerHTML += `<span  class="badge badge-danger">Não aprovada</span>`;

  if (`${iscitrus}` == "true")
    innerHTML += `<span  class="badge badge-success">Polpa Cítrica</span>`;

  if (limitdate)
    innerHTML += `<span  class="badge badge-secondary">${limitdate}</span>`;

  return innerHTML;
}

$(async function () {
  // Generate kanbans
  const toxins = await $.get("/toxins");
  toxins.forEach((toxin) => {
    Workmapskanbans[toxin._id] = createWorkmapKanban(toxin._id);
    Analysiskanbans[toxin._id] = createAnalysisKanban(toxin._id);
    SamplesInAnalysis[toxin._id] = [];
  });

  //First load for workmaps kanbans
  const activeKits = await $.get("/stock/getAllActiveWithSamples");
  activeKits.forEach((activeKit) =>
    populateWorkmapsKanbans(activeKit, activeKit.toxinId)
  );

  await populateKanbans();

  //Add events
  $('div[class="container-radio-kit-type"]').each((index, element) => {
    let toxinId = $(element).data("toxin");
    $(element)
      .find("input.radio-queue")
      .each(function (index, radio) {
        // Add onChange para cada radio
        $(radio).on("change", async function (e, data) {
          let kitType = $(this).val();
          const newActive = await $.post(
            `/stock/toggleActive/${toxinId}/${kitType}`
          );
          populateWorkmapsKanbans(newActive, toxinId);
        });
      });
  });
});

function populateWorkmapsKanbans(activeKit, toxinId) {
  if (activeKit) {
    $(`#hide${toxinId}`).removeClass("form-disabled");

    const currentKanban = Workmapskanbans[activeKit.toxinId];

    currentKanban?.removeAllBoards("Em análise");
    const boards = [];

    activeKit.workmaps.forEach((workmap, index) => {
      if (!workmap.wasUsed) {
        // Generate items
        const items = [];

        // Generate boards
        boards.push({
          id: workmap._id,
          title: `Mapa de trabalho ${index + 1}`,
          class: "info",
          item: items,
        });
      }
    });

    if (boards.length > 0) {
      currentKanban.addBoards(boards);

      // Add calibradores
      for (let i = 1; i <= 5; i++)
        currentKanban.addFixedElement(boards[0].id, {
          id: `P${i}`,
          title: `P${i}`,
          calibrator: true,
        });
    }
  } else $(`#hide${toxinId}`).addClass("form-disabled");
}

function createSampleElement(sample) {
  const element = {
    id: sample._id,
    title: `Amostra ${sample.sampleNumber}`,
    analyst: sample.name,
    status: sample?.analysis?.status,
    approved: sample.requisition.approved,
    debt: sample.requisition.charge?.user?.debt,
    iscitrus: sample.isCitrus,
    limitdate: sample.limitDate,
    analysis_id: sample?.analysis?._id,
    workmap_id: sample?.analysis?.workmapId,
    click: function (el) {
      window.location.href = `sample/edit/${id}`;
    },
  };
  element.innerHTML = getElementHtml({
    ...element,
  });

  return element;
}

//cria cedulas kanban
async function populateKanbans() {
  const response = await $.get("/sample/getAllWithoutFinalization");
  console.log(
    "🚀 ~ file: queue.js ~ line 215 ~ populateKanbans ~ response",
    response
  );

  response.forEach((toxinData) =>
    toxinData.samples.forEach((sample) => {
      const element = createSampleElement(sample);
      addElementToAnalysis(toxinData._id, element);
      addElementToWorkmaps(toxinData._id, element);
    })
  );
}

function addElementToAnalysis(toxinId, element) {
  let kanban = Analysiskanbans[toxinId];

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

function addElementToWorkmaps(toxinId, element) {
  let kanban = Workmapskanbans[toxinId];

  const sampleMustGoToWorkmaps =
    element.approved && !element.debt && findElement(element.workmap_id);

  console.log(
    "🚀 ~ file: queue.js ~ line 256 ~ addElementToWorkmaps ~ sampleMustGoToWorkmaps",
    sampleMustGoToWorkmaps,
    element
  );

  if (sampleMustGoToWorkmaps)
    switch (element.status) {
      case "Em análise":
        kanban.addElement("Em análise", element);
        break;

      case "Mapa de Trabalho":
        kanban.addElement(element.workmap_id, element);
        break;
    }
}

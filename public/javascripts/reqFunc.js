var num = 1;
function addInput() {
  let isFromLab = $(".isFromLab").text();

  isFromLab = isFromLab === "true" ? true : false;

  if (num < 11) {
    var newInput = document.createElement("div");

    let html;

    if (isFromLab) {
      html = `
      <div class="requisition-text col-md-3">
          <input required type="text" name="requisition[sampleVector][${num}][name]" id="sample${num}" class="requisition-text floating-label-field"
          placeholder="Amostra ${num + 1}">
          <label for='sample${num}' class="floating-label">Amostra ${
        num + 1
      }</label>
      </div>
      <div class="requisition-text col-md-5">
         <input id="receivedlimitdate[${num}]" type="text" name="requisition[sampleVector][${num}][limitDate]"
           class="requisition-text" placeholder="Data Limite de Avaliação (dd/mm/yyyy)">
       </div>
      <div class="checkbox col-md-2 d-flex pb-1">
          <div class="align-self-end">
          <input type="checkbox" id="polpa${num}" name="requisition[sampleVector][${num}][isCitrus]" value="true" class="my-auto" />
          <label for="polpa${num}" class="">Contém polpa cítrica</label>
          </div>
      </div>
      <div class="btn-polpa">
         <a id="remove[${num}]" type="button" class="btn btn-outline-danger removeButton">x</a>
       </div>`;
    } else {
      html = `
      <div class="requisition-text col-md-8">
          <input required type="text" name="requisition[sampleVector][${num}][name]" id="sample${num}" class="requisition-text floating-label-field"
          placeholder="Amostra ${num + 1}">
          <label for='sample${num}' class="floating-label">Amostra ${
        num + 1
      }</label>
      </div>
      <div class="checkbox col-md-2 d-flex pb-1">
          <div class="align-self-end">
          <input type="checkbox" id="polpa${num}" name="requisition[sampleVector][${num}][isCitrus]" value="true" class="my-auto" />
          <label for="polpa${num}" class="">Contém polpa cítrica</label>
          </div>
      </div>
      <div class="btn-polpa">
         <a id="remove[${num}]" type="button" class="btn btn-outline-danger removeButton">x</a>
      </div>`;
    }

    html = newInput.innerHTML = html;
    newInput.className = "form-row sample_row";
    document.getElementById("samples").appendChild(newInput);
    num++;
  } else {
    req.flash("alert", "Número máximo de requisições atingido");
  }
}

$(document).on("click", ".removeButton", function () {
  $(this).closest(".sample_row").remove();
});

var checados = document.getElementsByName("polpa");
var inputs = document.getElementsByName("requisition[sampleVector]");
var polpaCitrica = " com polpa cítrica";

for (var i = 0; i < checados.lenght; i++) {
  if (checados[i].checked) {
    inputs[i] = input[i].concat(polpaCitrica);
  }
}

function findAndUpdateValue(elementId, newData) {
  //Acha o elemento com o ID passado e muda o seu valor para o dado passado.
  //Se for undefined vira "" por padrão.
  $(`${elementId}`).val(newData !== undefined ? newData : "");
}

function findAndSelectCorrectly(elementId, newData, defaultId) {
  //Seleciona a opção com o valor passado do select com o id passado.
  //Se o valor é undefined seleciona pelo id default.
  if (newData !== undefined) {
    $(`${elementId} option[value="${newData}"]`).prop("selected", true);
  } else {
    $(`${defaultId}`).prop("selected", true);
  }
}

async function populateByUserId(userId) {
  const userData = await $.get(`/users/byid/${userId}`);

  findAndUpdateValue("#fullname", userData.fullname);
  findAndUpdateValue("#cpfCnpj", userData.cpfCnpj);
  findAndUpdateValue("#IE", userData.address?.IE);
  findAndUpdateValue("#street", userData.address?.street);
  findAndUpdateValue("#number", userData.address?.number);
  findAndUpdateValue("#complement", userData.address?.complement);
  findAndUpdateValue("#neighborhood", userData.address?.neighborhood);
  findAndUpdateValue("#city", userData.address?.city);
  findAndUpdateValue("#cep", userData.address?.cep);
  findAndSelectCorrectly(
    "#state",
    userData.address?.state,
    "#defaultStateOption"
  );

  //Dados de Contato
  findAndUpdateValue("#responsible", userData.fullname);
  findAndUpdateValue("#email", userData.email);
  findAndUpdateValue("#phone", userData.phone);
  findAndUpdateValue("#cellphone", userData.cellphone);

  //Requisição de Análise
  findAndUpdateValue("#reqCity", userData.address?.city);
  findAndSelectCorrectly(
    "#reqState",
    userData.address?.state,
    "#defaultStateReqOption"
  );
}

// Logica para setar os dados do endereço ao selecionar o usuário no select
$("#analystUser").on("change", async function (event) {
  //Dados de Conbrança
  const target = event.target.value;
  populateByUserId(target);
});

$(function () {
  let isFromLab = $(".isFromLab").text();

  isFromLab = isFromLab === "true" ? true : false;
  if (!isFromLab) {
    let id = $(".userId").text();
    populateByUserId(id);
  }
});

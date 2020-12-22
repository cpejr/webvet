var num = 2;
function addInput() {
  if (num < 11) {
    var newInput = document.createElement("div");

    let html = `<div class="requisition-text col-md-8">
                <input required type="text" name="requisition[sampleVector][${num}][name]" id="sample${num}" class="requisition-text floating-label-field"
                placeholder="Amostra ${num}">
                <label for='sample${num}' class="floating-label">Amostra ${num}</label>
            </div>
            <div class="checkbox col-md-2 d-flex pb-1">
                <div class="align-self-end">
                <input type="checkbox" id="polpa${num}" name="requisition[sampleVector][${num}][citrus]"  value="true" class="my-auto" />
                <label for="polpa${num}" class="">Contém polpa cítrica</label>
                </div>
            </div>`;

    newInput.innerHTML = html;
    newInput.className = "form-row";
    document.getElementById("samples").appendChild(newInput);
    num++;
  } else {
    req.flash("alert", "Número máximo de requisições atingido");
  }
}
var checados = document.getElementsByName("polpa");
var inputs = document.getElementsByName("requisition[sampleVector]");
var polpaCitrica = " com polpa cítrica";

for (var i = 0; i < checados.lenght; i++) {
  if (checados[i].checked) {
    inputs[i] = input[i].concat(polpaCitrica);
  }
}

$(".destination").change(function () {
  if ($("#Others").is(":checked")) {
    $("#Other-destination").removeClass("form-disabled");
  } else {
    $("#Other-destination").addClass("form-disabled");
  }
});

$("#Other-destination").keyup(function () {
  $("#Others").val($(this).find("input").val());
});

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

// Logica para setar os dados do endereço ao selecionar o usuário no select
$("#adminUser").on("change", async function (event) {
  console.log("aa");
  //Dados de Conbrança  
  const target = event.target.value;
  const userData = await $.get(`/users/byid/${target}`)

  findAndUpdateValue("#fullname", userData.fullname);
  findAndUpdateValue("#register", userData.register);
  findAndUpdateValue(
    "#IE",
    userData.address ? userData.address.ie : undefined
  );
  findAndUpdateValue(
    "#street",
    userData.address ? userData.address.street : undefined
  );
  findAndUpdateValue(
    "#number",
    userData.address ? userData.address.number : undefined
  );
  findAndUpdateValue(
    "#complement",
    userData.address ? userData.address.complement : undefined
  );
  findAndUpdateValue(
    "#neighborhood",
    userData.address ? userData.address.neighborhood : undefined
  );
  findAndUpdateValue(
    "#city",
    userData.address ? userData.address.city : undefined
  );
  findAndUpdateValue(
    "#cep",
    userData.address ? userData.address.cep : undefined
  );
  findAndSelectCorrectly(
    "#state",
    userData.address ? userData.address.state : undefined,
    "#defaultStateOption"
  );

  //Dados de Contato
  findAndUpdateValue("#responsible", userData.fullname);
  findAndUpdateValue("#email", userData.email);
  findAndUpdateValue("#phone", userData.phone);
  findAndUpdateValue("#cellphone", userData.cellphone);

  //Requisição de Análise
  findAndUpdateValue(
    "#reqCity",
    userData.address ? userData.address.city : undefined
  );
  findAndSelectCorrectly(
    "#reqState",
    userData.address ? userData.address.state : undefined,
    "#defaultStateReqOption"
  );
});

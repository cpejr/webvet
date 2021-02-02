let users = JSON.parse($("#users").val());
var numInput = 2;

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

$(document).on("click", ".removeButton", function(){
  $(this).closest(".sample_row").remove();
})

function addInput() {
  if (numInput < 11) {
    var newInput = document.createElement("div");

    let html = `
            <div class="col-md-12 d-flex flex-row">
                <div class="requisition-text col-md-4">
                    <input required type="text" name="requisition[sampleVector][${numInput}][name]" id="name[${numInput}]"
                        class="requisition-text" placeholder="Nome da amostra ${numInput}">
                </div>
                <div class="requisition-text col-md-4">
                    <input required type="number" name="sample[sampleVector][${numInput}][specialNumber]"
                        id="specialNumber[${numInput}]" class="requisition-text"
                        placeholder="Número da amostra">
                </div>
                <div class="col-md-4 d-flex flex-row">
                    <div class="checkbox col-md-6 d-flex align-items-center m-0">
                        <input type="checkbox" id="citrus[${numInput}]" name="requisition[sampleVector][${numInput}][citrus]" value="true"
                            class="my-auto" />
                        Contém polpa cítrica
                    </div>
                    <div class="btn-polpa col-md-6 d-flex align-items-center justify-content-center">
                        <a id="remove[${numInput}]" type="button" class="btn removeButton btn-outline-danger">x</a>
                    </div>
                </div>
            </div>
            <div class="col-md-12 d-flex flex-row">
                <div class="col-md-6 d-flex requisition-text align-items-center">
                    <select id="sampletype[${numInput}]" class="drowdownoptions w-100"
                        name="requisition[sampleVector][1][sampletype]" required>
                        <option value="Algodão / Subprodutos">Algodão / Subprodutos</option>
                        <option value="Amendoim / Subprodutos">Amendoim / Subprodutos</option>
                        <option value="Arroz">Arroz</option>
                        <option value="Aveia">Aveia</option>
                        <option value="Gramíneas / Leguminosas">Gramíneas / Leguminosas</option>
                        <option value="Cevada /Subprodutos">Cevada /Subprodutos</option>
                        <option value="Dieta Total">Dieta Total</option>
                        <option value="Feijão">Feijão</option>
                        <option value="Milho / Subprodutos">Milho / Subprodutos</option>
                        <option value="Outros">Outros</option>
                        <option value="Polpa Cítrica">Polpa Cítrica</option>
                        <option value="Ração">Ração</option>
                        <option value="Silagem">Silagem</option>
                        <option value="Soja / Subprodutos">Soja / Subprodutos</option>
                        <option value="Sorgo / Subprodutos">Sorgo / Subprodutos</option>
                        <option value="Subprodutos">Subprodutos</option>
                        <option value="Trigo / Subprodutos">Trigo / Subprodutos</option>
                    </select>
                </div>
                <div class="col-md-3 requisition-text">
                    <input required id="packingtype[${numInput}]" type="text" name="requisition[sampleVector][${numInput}][packingtype]"
                        class="col-md-10" placeholder="Tipo de embalagem">
                </div>
                <div class="requisition-text col-md-3">
                    <input required id="receivedquantity[${numInput}]" type="text" name="requisition[sampleVector][${numInput}][receivedquantity]"
                        class="requisition-text" placeholder="Quantidade recebida (g)">
                </div>
            </div>
    `;
    newInput.innerHTML = html;
    newInput.className = "d-flex flex-column card col-md-12 mt-2 sample_row";
    $("#samples").append(newInput);
    numInput++;
  } else {
    alert("Número máximo de amostras atingido!");
  }
}

// Logica para setar os dados do endereço ao selecionar o usuário no select
$("#adminUser").on("change", function (event) {
  //Dados de Conbrança
  let selectedUser = users.find((user) => user._id === event.target.value);
  findAndUpdateValue("#fullname", selectedUser.fullname);
  findAndUpdateValue("#register", selectedUser.register);
  findAndUpdateValue(
    "#IE",
    selectedUser.address ? selectedUser.address.ie : undefined
  );
  findAndUpdateValue(
    "#street",
    selectedUser.address ? selectedUser.address.street : undefined
  );
  findAndUpdateValue(
    "#number",
    selectedUser.address ? selectedUser.address.number : undefined
  );
  findAndUpdateValue(
    "#complement",
    selectedUser.address ? selectedUser.address.complement : undefined
  );
  findAndUpdateValue(
    "#neighborhood",
    selectedUser.address ? selectedUser.address.neighborhood : undefined
  );
  findAndUpdateValue(
    "#city",
    selectedUser.address ? selectedUser.address.city : undefined
  );
  findAndUpdateValue(
    "#cep",
    selectedUser.address ? selectedUser.address.cep : undefined
  );
  findAndSelectCorrectly(
    "#state",
    selectedUser.address ? selectedUser.address.state : undefined,
    "#defaultStateOption"
  );

  //Dados de Contato
  findAndUpdateValue("#responsible", selectedUser.fullname);
  findAndUpdateValue("#email", selectedUser.email);
  findAndUpdateValue("#phone", selectedUser.phone);
  findAndUpdateValue("#cellphone", selectedUser.cellphone);

  //Requisição de Análise
  findAndUpdateValue(
    "#reqCity",
    selectedUser.address ? selectedUser.address.city : undefined
  );
  findAndSelectCorrectly(
    "#reqState",
    selectedUser.address ? selectedUser.address.state : undefined,
    "#defaultStateReqOption"
  );
});

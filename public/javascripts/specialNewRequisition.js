let users = JSON.parse($("#users").val());

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

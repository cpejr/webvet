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
  findAndUpdateValue("#IE", selectedUser.address.ie);
  findAndUpdateValue("#street", selectedUser.address.street);
  findAndUpdateValue("#number", selectedUser.address.number);
  findAndUpdateValue("#complement", selectedUser.address.complement);
  findAndUpdateValue("#neighborhood", selectedUser.address.neighborhood);
  findAndUpdateValue("#city", selectedUser.address.city);
  findAndUpdateValue("#cep", selectedUser.address.cep);
  findAndSelectCorrectly(
    "#state",
    selectedUser.address.state,
    "#defaultStateOption"
  );

  //Dados de Contato
  findAndUpdateValue("#responsible", selectedUser.fullname);
  findAndUpdateValue("#email", selectedUser.email);
  findAndUpdateValue("#phone", selectedUser.phone);
  findAndUpdateValue("#cellphone", selectedUser.cellphone);

  //Requisição de Análise
  findAndUpdateValue("#reqCity", selectedUser.address.city);
  findAndSelectCorrectly("#reqState", selectedUser.address.state, "#defaultStateReqOption");
});

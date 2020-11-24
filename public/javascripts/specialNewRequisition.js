let users = JSON.parse($("#users").val());

// Logica para setar os dados do endereço ao selecionar o usuário no select
$("#adminUser").on("change", function (event) {
    let selectedUser = users.find(user => user._id === event.target.value);
    $("#fullname").attr("value", selectedUser.fullname !== undefined ? selectedUser.fullname : "");
    $("#register").val(selectedUser.register !== undefined ? selectedUser.register : "");
    $("#IE").val(selectedUser.address.ie !== undefined ? selectedUser.IE : "");
    $("#street").val(selectedUser.address.street !== undefined ? selectedUser.address.street : "");
    $("#number").val(selectedUser.address.number !== undefined ? selectedUser.address.number : "");
    $("#complement").val(selectedUser.address.complement !== undefined ? selectedUser.address.complement : "");
    $("#neighborhood").val(selectedUser.address.neighborhood !== undefined ? selectedUser.address.neighborhood : "")
    $("#city").val(selectedUser.address.city !== undefined ? selectedUser.address.city : "");
    $("#cep").val(selectedUser.address.cep !== undefined ? selectedUser.address.cep : "");
    if(selectedUser.address.state !== undefined){
        $(`#state option[value="${selectedUser.address.state}"]`).prop("selected",true);
    } else {
        $("#defaultStateOption").prop("selected",true);
    }
    $("#responsible").val(selectedUser.fullname !== undefined ? selectedUser.fullname : "");
    $("#email").val(selectedUser.email !== undefined ? selectedUser.email : "");
    $("#phone").val(selectedUser.phone !== undefined ? selectedUser.phone : "");
    $("#cellphone").val(selectedUser.cellphone !== undefined ? selectedUser.cellphone : "");
});

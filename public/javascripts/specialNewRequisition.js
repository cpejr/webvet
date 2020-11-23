let users = JSON.parse($("#users").val());

$("#adminUser").on("change", function (event) {
    let selectedUser = users.find(user => user._id === event.target.value);
    $("#fullname").attr("value", selectedUser.fullname !== undefined ? selectedUser.fullname : "Indefinido");
    $("#register").val(selectedUser.register !== undefined ? selectedUser.register : "Indefinido");
    $("#IE").val(selectedUser.IE !== undefined ? selectedUser.IE : "Indefinido");
    $("#street").val(selectedUser.address.street !== undefined ? selectedUser.address.street : "Indefinido");
    $("#number").val(selectedUser.address.number !== undefined ? selectedUser.address.number : "Indefinido");
    $("#complement").val(selectedUser.address.complement !== undefined ? selectedUser.address.complement : "Indefinido");
    $("#neighborhood").val(selectedUser.address.neighborhood !== undefined ? selectedUser.address.neighborhood : "Indefinido")
    $("#city").val(selectedUser.address.city !== undefined ? selectedUser.address.city : "Indefinido")
});

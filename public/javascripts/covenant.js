$(document).ready(() => {
    let previousId;
    let previousText;
    let id;
    let text;
    $("#admin").on("change", function () {
        //console.log("previousId: ", previousId, " previousText: ", previousText);
        if (previousId !== undefined) {
            //console.log("Adding option ", previousId, " in #managers");
            $("#managers").append(
            `<option id= "M_${previousId}" value="${previousId}">${previousText}</option>`
            );
        }
        id = $(this).children(":selected").attr("value");
        text = $(this).children(":selected").text();
        //console.log("Id selecionado: ", id);
        previousId = id;
        previousText = text;
        //console.log("Removing option M_", id, " from #managers");
        $("#M_" + previousId).remove();
    })
})
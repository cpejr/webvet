$(document).ready(() => {
    let previousId;
    let previousText;
    let id;
    let text;
    $("#admin").on("change", function () {
        if (previousId !== undefined) {
            $("#managers").append(
            `<option id= "M_${previousId}" value="${previousId}">${previousText}</option>`
            );
        }
        id = $(this).children(":selected").attr("value");
        text = $(this).children(":selected").text();
        previousId = id;
        previousText = text;
        $("#M_" + previousId).remove();
    })
})
function myFunction() {
    window.print();
};

$(document).ready(function () {

    var countChecked = function () {
        var n = $('input[id="toxinaCheck"]:checked').length;
        var listNames = [];
        var idName = {};
        var frase = "";
        var inicio = ""
        var fraseCompleta = "*inicio* a presença de *frase* na amostra analisada. O resultado da análise restringe-se tão somente à amostra analisada."

        $('input[id="toxinaCheck"]:checked').each(function () {
            listNames.push($(this).val());
        });

        if (n > 0) { //Pedaço que analiza o vetor de nomes e escreve apropriadamente.
            if (listNames.length > 2) {
                for (i = 0; i < listNames.length - 2; i++) {
                    frase = frase + " " + listNames[i] + ",";
                }
                frase = frase + " " + listNames[listNames.length - 2];
                frase = frase + " e " + listNames[listNames.length - 1];
                inicio = "Foram detectadas";
            } else if (listNames.length == 1) {
                frase = frase + listNames[0];
                inicio = "Foi detectada";
            } else {
                for (i = 0; i < listNames.length - 1; i++) {
                    frase = frase + " " + listNames[i];
                }
                frase = frase + " e " + listNames[listNames.length - 1];
                inicio = "Foram detectadas";
            }
            fraseCompleta = fraseCompleta.replace("*frase*", frase);
            fraseCompleta = fraseCompleta.replace("*inicio*", inicio);
            $("#parecer").text(fraseCompleta);
        } else {
            $("#parecer").text("Não foi detectada a presença de nenhuma toxina na amostra analisada. O resultado da análise restringe-se tão somente à amostra analisada.");
        }
    };

    countChecked();
    $("input[type=checkbox][id=toxinaCheck]").change(countChecked);

    var checkAll = function () {
        $('input[type=checkbox][id="toxinaCheck"]').each(function () {
            $(this).prop("checked", $("#allCheck").is(":checked"));
            countChecked();
        });
    };

    $("#allCheck").change(checkAll);
});

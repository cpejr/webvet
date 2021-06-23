function submitForm(finalized) {
  let route = $("#formReport").attr("action");
  route += `?status=${finalized}`;
  $("#formReport").attr("action", route);
  $("#formReport").submit();
}

$("#finalize").on('click', function () {
  submitForm("Disponível para o produtor");
});

$("#analize").on('click', function () {
  submitForm("Revisada por Analista");
});

$("#unanalize").on('click', function () {
  submitForm("Não finalizado");
});

$("#unfinalize").on('click', function () {
  submitForm("Não finalizado");
});


$(function () {
  var countChecked = function () {
    var n = $('input[id="toxinaDetected"]:checked').length;
    var listNames = [];
    var frase = "";
    var fraseCompleta =
      "Foi detectada a presença de *frase* na amostra analisada. O resultado da análise restringe-se tão somente à amostra analisada.";

    $('input[id="toxinaDetected"]:checked').each(function () {
      listNames.push($(this).val());
    });

    if (n > 0) {
      //Pedaço que analiza o vetor de nomes e escreve apropriadamente.
      if (listNames.length > 2) {
        for (i = 0; i < listNames.length - 2; i++) {
          frase = frase + " " + listNames[i] + ",";
        }
        frase = frase + " " + listNames[listNames.length - 2];
        frase = frase + " e " + listNames[listNames.length - 1];
      } else if (listNames.length == 1) {
        frase = frase + listNames[0];
      } else {
        for (i = 0; i < listNames.length - 1; i++) {
          frase = frase + " " + listNames[i];
        }
        frase = frase + " e " + listNames[listNames.length - 1];
      }
      fraseCompleta = fraseCompleta.replace("*frase*", frase);
      $("#feedback").text(fraseCompleta);
    } else {
      $("#feedback").text(
        "Não foi detectada a presença destas micotoxinas na amostra analisada. O resultado da análise restringe-se tão somente à amostra analisada."
      );
    }
  };

  countChecked();
  $("input[type=checkbox][id=toxinaDetected]").on('change',countChecked);

  var checkAll = function () {
    $('input[type=checkbox][id="toxinaDetected"]').each(function () {
      $(this).prop("checked", $("#allCheck").is(":checked"));
      countChecked();
    });
  };

  $("#allCheck").on('change',checkAll);
}); 

var num = 2;
function addInput() {
  if(num<11) {
    var newInput = '<div class="form-row"><div class="requisition-text col-md-8"><input type="text" name="requisition[sampleVector]" id="sample'+num+'" class="requisition-text" placeholder="Amostra '+num+'"/></div><div class="checkbox"><input type="checkbox" id="poupa'+num+'" name="poupa" value="poupa"> Contém poupa cítrica</input></div></div>';
     document.getElementById('samples').innerHTML += newInput;
     num++;
  } else {
    req.flash('alert', 'Número máximo de requisições atingido');
  }
}

var checados = document.getElementsByName('poupa');
var inputs = document.getElementsByName('requisition[sampleVector]');
var poupaCitrica = " com poupa cítrica"

for (var i = 0; i < checados.lenght; i++) {
  if (checados[i].checked) {
    inputs[i]=input[i].concat(poupaCitrica)
  }
}

$('#radio').change(function(){
  if($('#new-address').is(':checked')) {
      $('#form-address').removeClass('form-disabled');
  } else {
      $('#form-address').addClass('form-disabled');
  }
});

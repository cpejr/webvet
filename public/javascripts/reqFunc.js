
var num = 2;
function addInput() {
  if(num<11) {
    var newInput = '<div class="form-row"><div class="requisition-text col-md-8"><input type="text" name="requisition[sampleVector]" id="sample'+num+'" class="requisition-text" placeholder="Amostra '+num+'"/></div><div class="checkbox"><input type="checkbox" id="polpa'+num+'" name="polpa" value="polpa"> Contém polpa cítrica</input></div></div>';
     document.getElementById('samples').innerHTML += newInput;
     num++;
  } else {
    req.flash('alert', 'Número máximo de requisições atingido');
  }
}

var checados = document.getElementsByName('polpa');
var inputs = document.getElementsByName('requisition[sampleVector]');
var polpaCitrica = " com polpa cítrica"

for (var i = 0; i < checados.lenght; i++) {
  if (checados[i].checked) {
    inputs[i]=input[i].concat(polpaCitrica)
  }
}

 $('#radio').change(function(){
 if($('#now-address').is(':checked')) {
        $('#keep-address').removeClass('form-disabled');
        $('#Change-address').addClass('form-disabled');
  } else {
    $('#keep-address').addClass('form-disabled');
    $('#Change-address').removeClass('form-disabled');
  }

});

$('#radio-animal').change(function(){

  if($('#Others').is(':checked')) {
      $('#Other-destination').removeClass('form-disabled');
  } else {
      $('#Other-destination').addClass('form-disabled');
  }
});

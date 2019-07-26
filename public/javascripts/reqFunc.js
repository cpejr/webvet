
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

$('#btn-new-address').click(function(){

   $('#fullname').each(function(){
       $(this).val('');
   });
   $('#cpf').each(function(){
       $(this).val('');
   });
   $('#I.E').each(function(){
       $(this).val('');
   });
   $('#street').each(function(){
       $(this).val('');
   });
   $('#number').each(function(){
       $(this).val('');
   });
   $('#complement').each(function(){
       $(this).val('');
   });
   $('#bairro').each(function(){
       $(this).val('');
   });
   $('#city').each(function(){
       $(this).val('');
   });
   $('#state').each(function(){
       $(this).val('');
   });
   $('#cep').each(function(){
       $(this).val('');
   });
   $('#phone').each(function(){
       $(this).val('');
   });
   $('#cellphone').each(function(){
       $(this).val('');
   });
   $('#email').each(function(){
       $(this).val('');
   });
});

$('#radio-animal').change(function(){

  if($('#Others').is(':checked')) {
      $('#Other-destination').removeClass('form-disabled');
  } else {
      $('#Other-destination').addClass('form-disabled');
  }
});

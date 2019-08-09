
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

//fução preencher automático
var fullname=document.getElementById("fullname").value;
var cpf=document.getElementById("cpf").value;
var ie=document.getElementById("I.E").value;
var street=document.getElementById("street").value;
var number=document.getElementById("number").value;
var complement=document.getElementById("complement").value;
var neighborhood=document.getElementById("neighborhood").value;
var city=document.getElementById("city").value;
var state=document.getElementById("state").value;
var cep=document.getElementById("cep").value;
var phone=document.getElementById("phone").value;
var cellphone=document.getElementById("cellphone").value;
var email=document.getElementById("email").value;


var firstClick=1;
$('#btn-new-address').click(function(){

    if(firstClick) {
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
      $('#neighborhood').each(function(){
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
      firstClick=!firstClick;
   }
   else {
     $('#fullname').each(function(){
         $(this).val(fullname);
     });
     $('#cpf').each(function(){
         $(this).val(cpf);
     });
     $('#I.E').each(function(){
         $(this).val(ie);
     });
     $('#street').each(function(){
         $(this).val(street);
     });
     $('#number').each(function(){
         $(this).val(number);
     });
     $('#complement').each(function(){
         $(this).val(complement);
     });
     $('#neighborhood').each(function(){
         $(this).val(neighborhood);
     });
     $('#city').each(function(){
         $(this).val(city);
     });
     $('#state').each(function(){
         $(this).val(state);
     });
     $('#cep').each(function(){
         $(this).val(cep);
     });
     $('#phone').each(function(){
         $(this).val(phone);
     });
     $('#cellphone').each(function(){
         $(this).val(cellphone);
     });
     $('#email').each(function(){
         $(this).val(email);
     });
     firstClick=!firstClick;

   }

});

$('#radio-animal').change(function(){

  if($('#Others').is(':checked')) {
      $('#Other-destination').removeClass('form-disabled');
  } else {
      $('#Other-destination').addClass('form-disabled');
  }
});

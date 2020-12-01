
var num = 2;
function addInput() {
    if (num < 11) {
        var newInput = document.createElement("div");

        let html =
            `<div class="requisition-text col-md-8">
                <input required type="text" name="requisition[sampleVector][${num}][name]" id="sample${num}" class="requisition-text floating-label-field"
                placeholder="Amostra ${num}">
                <label for='sample${num}' class="floating-label">Amostra ${num}</label>
            </div>
            <div class="checkbox col-md-2 d-flex pb-1">
                <div class="align-self-end">
                <input type="checkbox" id="polpa${num}" name="requisition[sampleVector][${num}][citrus]"  value="true" class="my-auto" />
                <label for="polpa${num}" class="">Contém polpa cítrica</label>
                </div>
            </div>`;

        newInput.innerHTML = html;
        newInput.className = "form-row";
        document.getElementById('samples').appendChild(newInput);
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
        inputs[i] = input[i].concat(polpaCitrica)
    }
}

//fução preencher automático
var fullname = document.getElementById("fullname").value;
var cpf = document.getElementById("cpf").value;
var ie = document.getElementById("I.E").value;
var street = document.getElementById("street").value;
var number = document.getElementById("number").value;
var complement = document.getElementById("complement").value;
var neighborhood = document.getElementById("neighborhood").value;
var city = document.getElementById("city").value;
var state = document.getElementById("state").value;
var cep = document.getElementById("cep").value;
var phone = document.getElementById("phone").value;
var cellphone = document.getElementById("cellphone").value;
var email = document.getElementById("email").value;


var firstClick = 1;
function clearData(){

    if (firstClick) {
        $('#fullname').each(function () {
            $(this).val('');
        });
        $('#cpf').each(function () {
            $(this).val('');
        });
        $('#I.E').each(function () {
            $(this).val('');
        });
        $('#street').each(function () {
            $(this).val('');
        });
        $('#number').each(function () {
            $(this).val('');
        });
        $('#complement').each(function () {
            $(this).val('');
        });
        $('#neighborhood').each(function () {
            $(this).val('');
        });
        $('#city').each(function () {
            $(this).val('');
        });
        $('#state').each(function () {
            $(this).val('');
        });
        $('#cep').each(function () {
            $(this).val('');
        });
        $('#phone').each(function () {
            $(this).val('');
        });
        $('#cellphone').each(function () {
            $(this).val('');
        });
        $('#email').each(function () {
            $(this).val('');
        });
        firstClick = !firstClick;
    }
    else {
        $('#fullname').each(function () {
            $(this).val(fullname);
        });
        $('#cpf').each(function () {
            $(this).val(cpf);
        });
        $('#I.E').each(function () {
            $(this).val(ie);
        });
        $('#street').each(function () {
            $(this).val(street);
        });
        $('#number').each(function () {
            $(this).val(number);
        });
        $('#complement').each(function () {
            $(this).val(complement);
        });
        $('#neighborhood').each(function () {
            $(this).val(neighborhood);
        });
        $('#city').each(function () {
            $(this).val(city);
        });
        $('#state').each(function () {
            $(this).val(state);
        });
        $('#cep').each(function () {
            $(this).val(cep);
        });
        $('#phone').each(function () {
            $(this).val(phone);
        });
        $('#cellphone').each(function () {
            $(this).val(cellphone);
        });
        $('#email').each(function () {
            $(this).val(email);
        });
        firstClick = !firstClick;

    }

});

$('.destination').change(function () {
    if ($('#Others').is(':checked')) {
        $('#Other-destination').removeClass('form-disabled');
    } else {
        $('#Other-destination').addClass('form-disabled');
    }
});

$("#Other-destination").keyup(function () {
    $('#Others').val($(this).find('input').val());
});

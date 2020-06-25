$(document).ready(function () {
    //Add dynamic placeholder on top
    let idcount = 0;
    $('input[type=text], input[type=number], input[type=email], input[type=password]').each((index, elem) => {  //All input elements with type="text" 

        $(elem).addClass('floating-label-field')
        let id = elem.id;
        if (id === '') {
            $(elem).attr("id", idcount);
            id = idcount;
            idcount++;
        }

        let container = $(elem).parent().get(0);

        $(container).append(
            $(`<label for='${id}' class="floating-label">${$(elem).attr('placeholder')}</label>`)
        );

    });
});

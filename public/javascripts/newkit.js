var productdropdown;
$("#productCode").change(function() {
  productdropdown = $(this).val();
  //use rfiSchooldropdown
}).change();

$(document).ready(function(){
    var bindClickToToggle = function(element){
        element.click(function(){
            $(this).parents('.dropdown').find('dd ul').toggle();
        });
    };

    $('#productCode').change(function () {
        if ($('#productCode option:selected').text() == "Outros"){
            $('#otherCity').show();
            CheckCitySelect($('#productCode'));
        } else {
            $("#otherCity").hide();
        } });


    var bindClickToUpdateSelect = function(element){
        element.click(function(){
            var text = element.html();
            var value = element.find('span.value').html();
            var dropdown = element.parents('.dropdown');
            var select = $( dropdown.attr('target') );
            dropdown.children('dt').find('a').html(text);
            dropdown.find('dd ul').hide();
            select.attr('value', value);
        });
    };

    var getItemHtml = function(element){
        return '<dt><a href="#">'+element.text()+'<span class="value">'+element.attr('value')+'</span></a></dt>';
    };

    var getDropdownHtml = function(id, target){
        return '<dl id="target'+id+'" class="dropdown" target="#'+target.attr('id')+'"></dl>';
    };

    var getEnclosingHtml = function(){
        return '<dd><ul></ul></dd>';
    };

    var createDropDown = function(element, appendTo){
        var selected = element.find('option[selected]');
        var options = element.find('option');
        appendTo.append(getDropdownHtml(i, element));
        var target = appendTo.find('#target' + i);
        target.append(getItemHtml(selected));
        target.append(getEnclosingHtml());
        var appendOptionsTo = target.find('ul');
        options.each(function(){
            appendOptionsTo.append(getItemHtml($(this)));
        });
        appendOptionsTo.find('a').each(function(){
            bindClickToUpdateSelect($(this));
        });
        i++;
    };


    $('a').each(function(){
        bindClickToToggle($(this));
        $(this).click(function(){
            $(this).parents('ul').hide();
        });
    });

    $(document).bind('click', function(e) {
        var $clicked = $(e.target);
        if (! $clicked.parents().hasClass("dropdown")){
            $(".dropdown dd ul").hide();
        }
    });

    $(".drowdownoptions").change(function(){
        CheckCitySelect(this);
    });

    function CheckCitySelect(input){
        if($(input).find("option:selected").text() == "Outros"){
            $("#otherCity").show();
        }
        else{
            $("#otherCity").hide();
        }
    }
});

$(document).ready(function(){
 $(window).resize(function(){
   const screenwidth = $(window).width();

   if (screenwidth < 400) {
     $("#box-radio").removeClass("ml-3");
   } else {
     $("#box-radio").addClass("ml-3");
   }
 });


 if($('#manager-radio').is(':checked')) {
     $('#producer-form').removeClass('form-disabled');
 } else {
     $('#producer-form').addClass('form-disabled');
 }

 if($('#covenant-radio').is(':checked')) {
     $('#manager-form').removeClass('form-disabled');
 } else {
     $('#manager-form').addClass('form-disabled');
 }

});


$('#box-radio').change(function(){
  if($('#manager-radio').is(':checked')) {
      $('#producer-form').removeClass('form-disabled');
  } else {
      $('#producer-form').addClass('form-disabled');
  }

  if($('#covenant-radio').is(':checked')) {
      $('#manager-form').removeClass('form-disabled');
  } else {
      $('#manager-form').addClass('form-disabled');
  }
});

$(document).ready(function(){
 $(window).resize(function(){
   const screenwidth = $(window).width();

   if (screenwidth < 770) {
     $("#radio").removeClass("form-check-inline col-md-7");
   } else {
     $("#radio").addClass("form-check-inline col-md-7");
   }
 });
});

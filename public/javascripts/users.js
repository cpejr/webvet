$(document).ready(function(){
 $(window).resize(function(){
   const screenwidth = $(window).width();

   if (screenwidth < 400) {
     $("#box-radio").removeClass("ml-3");
   } else {
     $("#box-radio").addClass("ml-3");
   }
 });
});

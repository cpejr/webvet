$(document).ready(function(){
 $(window).resize(function(){
   const screenwidth = $(window).width();

   if (screenwidth < 475) {
     $("#user-box-device").removeClass("user-box");
   } else {
     $("#user-box-device").addClass("user-box-device");
   }
   if (screenwidth < 475) {
     $("#requisition-user").removeClass("user-card");
   } else {
     $("#requisition-user").addClass("user-card-device");
   }
   if (screenwidth < 475) {
     $("#laudo-user").removeClass("user-card");
   } else {
     $("#laudo-user").addClass("user-card-device");
   }
 });
});

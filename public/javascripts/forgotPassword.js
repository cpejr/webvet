$(document).ready(function(){
 $(window).resize(function(){
   const screenwidth = $(window).width();

   if (screenwidth < 475) {
     $("#forgotPassword").removeClass("img");
   } else {
     $("#forgotPassword").addClass("login-device");
   }
   if (screenwidth < 475) {
     $("#forgotPassword-box").removeClass("password-box");
   } else {
     $("#forgotPassword-box").addClass("login-box-device");
   }
   if (screenwidth < 475) {
     $("#forgotPassword-text").removeClass("textbox");
   } else {
     $("#forgotPassword-text").addClass("textbox-device");
   }
   if (screenwidth < 475) {
     $("#login-btn").removeClass("btn-login");
   } else {
     $("#login-btn").addClass("btn-login-device");
   }
 });
});

$(document).ready(function(){
 $(window).resize(function(){
   const screenwidth = $(window).width();

   if (screenwidth < 475) {
     $("#login").removeClass("img");
   } else {
     $("#login").addClass("login-device");
   }
   if (screenwidth < 475) {
     $("#login-box").removeClass("login-box");
   } else {
     $("#login-box").addClass("login-box-device");
   }
   if (screenwidth < 475) {
     $("#login-text-email").removeClass("textbox");
   } else {
     $("#login-text-email").addClass("textbox-device");
   }
   if (screenwidth < 475) {
     $("#login-text-password").removeClass("textbox");
   } else {
     $("#login-text-password").addClass("textbox-device");
   }
   if (screenwidth < 475) {
     $("#login-btn").removeClass("btn-login");
   } else {
     $("#login-btn").addClass("btn-login-device");
   }
 });
});

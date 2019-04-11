$(document).ready(function(){

 $('.cards-element').on('click', function(){
   if ( $(this).hasClass('cards-open') ) {
     $(this).removeClass('cards-open');
   } else {
     $('.element-card').removeClass('cards-open');
     $(this).addClass('cards-open');
   }

 });

});

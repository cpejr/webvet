var aflatoxina = new jKanban({
  element : '#aflatoxina',
  gutter  : '10px',
  widthBoard  : '190px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_testing',
      title  : 'Em análise',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'info',
    },

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.title.replace("Amostra","");

    if  (target == '_testing') {
      $.post('/sample/testing/edit/aflatoxina/' + samplenumber, () => {

      });

      if(el.dataset.eid=="owner") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>'+ " "+'<span  class="badge badge-danger">' + el.dataset.owner + '</span>';
      }
      else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

      }

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/aflatoxina/' + samplenumber, () => {

      });
      if(el.dataset.eid=="owner") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento'  + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>'+ " "+'<span  class="badge badge-danger">' + el.dataset.owner + '</span>';
      }
      else {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';


      }

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/aflatoxina/' + samplenumber, () => {

      });

      if(el.dataset.eid=="owner") {
        el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>'+ " "+'<span  class="badge badge-danger">' + el.dataset.owner + '</span>';
      }
      else{
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
       }
    }



  }
});




var scndAflatoxina = new jKanban({
  element : '#afla2toxina',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',

    },


  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.title.replace("Amostra","");
    var goTO=target;
    if(target =='_calibrator'){
        if( el.dataset.calibrator) {//soemente cards P  se movem

          $.post('/sample/calibrator/edit/aflatoxina/'+el.dataset.calid+'/'+nowAflaKit,  () => {

          });
        }

        else{
               
          return false // impede outros cards de entrarem no board dos calibradores

        }
    }

    if( goTO.indexOf("workmap")!=-1) { //se o alvo for um board workmap qualquer
        if( el.dataset.calibrator) {//cards originais
              
              var mapName=goTO.toString();
              $.post('/sample/addponmap/aflatoxina/'+nowAflaKit+'/'+mapName+'/'+el.dataset.calid,  () => {

              });

           

        } 

        else {
          // $.post('/sample/mapwork/edit/aflatoxina/' + samplenumber+'/'+goTO, () => {
          //
          // });
          var mapName=goTO.toString();

          $.post('/sample/mapedit/aflatoxina/' + samplenumber+'/'+nowAflaKit+'/'+mapName,  () => {

          });

          if(el.dataset.eid=="owner") {
            el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>'+ " "+'<span  class="badge badge-danger">' + el.dataset.owner + '</span>';
          }
          else {
          el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
        }
      }
    }

    if(target=='_scndTesting') {
      var calibrator=el.dataset.eid;
      if( el.dataset.calibrator) {//cards P não se movem para em analise
             return false
      }
       else {
         $.post('/sample/scndTesting/edit/aflatoxina/' + samplenumber+'/'+nowAflaKit, () => {

         });

         if(el.dataset.eid=="owner") {
           el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>'+ " "+'<span  class="badge badge-danger">' + el.dataset.owner + '</span>';
         }

         else{
          el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';
        }
      }
    }


  }
});

var countAfla=0;

function IdAflaCount ()
{
    countAfla++;
    return countAfla;
}



const deoxinivalenol = new jKanban({
  element : '#deoxinivalenol',
  gutter  : '10px',
  widthBoard  : '190px',
  click : function(el) {
    alert(el.innerHTML);
    alert(el.dataset.eid)
  },
  boards  : [
    {
      id : '_testing',
      title  : 'Em análise',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    },

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if  (target == '_testing') {
      $.post('/sample/testing/edit/deoxinivalenol/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/deoxinivalenol/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/deoxinivalenol/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

    if  (target == '_workmap') {
      $.post('/sample/mapwork/edit/deoxinivalenol/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }



  }
});

var scndDeoxinivalenol = new jKanban({
  element : '#deoxini2valenol',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
     
    },
   

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;
    var goTO=target;
    if(target =='_calibrator'){
        if( el.dataset.calibrator) {//cards P não se movem
          $.post('/sample/calibrator/edit/deoxinivalenol/'+el.dataset.calid+'/'+nowDeoxKit,  () => {

          });
         }
        else {
          return false // impede outros cards de entrarem no board dos calibradores
        }
    }

    if( goTO.indexOf("workmap")!=-1) { //se o alvo for um board workmap qualquer
        if( el.dataset.calibrator) {//cards P    
          var mapName=goTO.toString();
             
          $.post('/sample/addponmap/deoxinivalenol/'+nowDeoxKit+'/'+mapName+'/'+el.dataset.calid,  () => {

          });
         
         }  else {
          var mapName=goTO.toString();

          $.post('/sample/mapedit/deoxinivalenol/' + samplenumber+'/'+nowDeoxKit+'/'+mapName,  () => {

          });
          el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

     }

   }

    if(target=='_scndTesting') {
        var calibrator=el.dataset.eid;
      if( el.dataset.calibrator) {//cards P não se movem para em analise
             return false;
       }
       else if (calibrator.indexOf("child")!=-1) {

             return false;
       }
       else {
      $.post('/sample/scndTesting/edit/deoxinivalenol/' + samplenumber+'/'+nowDeoxKit, () => {

         });
         el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

       }
    }


   }

});

//função de criação dos id dos Pchild para o scndDeoxinivalenol
var countDeox=0;

function IdDeoxCount ()
{
    countDeox++;
    return countDeox;
}




const ocratoxina = new jKanban({
  element : '#ocratoxina',
  gutter  : '10px',
  widthBoard  : '190px',
  boards  : [
    {
      id : '_testing',
      title  : 'Em análise',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    },

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if  (target == '_testing') {
      $.post('/sample/testing/edit/ocratoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/ocratoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/ocratoxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

    if  (target == '_workmap') {
      $.post('/sample/mapwork/edit/ocratoxina/' + samplenumber, () => {


      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

  }
});

var scndOcratoxina = new jKanban({
  element : '#ocra2toxina',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
     
    },
   

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;
    var goTO=target;
    if(target =='_calibrator'){
        var strId=el.dataset.eid; //id do card
        if( el.dataset.calibrator) {//cards P 
          $.post('/sample/calibrator/edit/ocratoxina/'+el.dataset.calid+'/'+nowOcraKit,  () => {

          });
         }
          else {
          return false // impede outros cards de entrarem no board dos calibradores
        }
    }

    if( goTO.indexOf("workmap")!=-1) { //se o alvo for um board workmap qualquer
       var calibrator=el.dataset.eid;
        if( el.dataset.calibrator) {//cards P
               var mapName=goTO.toString();
               $.post('/sample/addponmap/ocratoxina/'+nowOcraKit+'/'+mapName+'/'+el.dataset.calid,  () => {

              });

         } else {
          var mapName=goTO.toString();


          $.post('/sample/mapedit/ocratoxina/' + samplenumber+'/'+nowOcraKit+'/'+mapName,  () => {

          });
          el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

      }
    }

    if(target=='_scndTesting') {
    
      if( el.dataset.calibrator) {//cards P não se movem para em analise
             return false
       }
      
       else {
       $.post('/sample/scndTesting/edit/ocratoxina/' +samplenumber+'/'+nowOcraKit, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }

 }
});

//função de criação dos id dos Pchild para o scndOcratoxina
var countOcra = 0;

function IdOcraCount (){
    countOcra++;
    return countOcra;
}




const t2toxina = new jKanban({
  element : '#t2toxina',
  gutter  : '10px',
  widthBoard  : '190px',
  boards  : [
    {
      id : '_testing',
      title  : 'Em análise',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    },

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if  (target == '_testing') {
      $.post('/sample/testing/edit/t2toxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/t2toxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/t2toxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

    if  (target == '_workmap') {
      $.post('/sample/mapwork/edit/t2toxina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});

var scndT2toxina = new jKanban({
  element : '#t22toxina',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
      
    },
  

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;
    var goTO=target;
    if(target =='_calibrator'){
        var strId=el.dataset.eid; //id do card
        if( el.dataset.calibrator) {//cards P 
          $.post('/sample/calibrator/edit/t2toxina/'+el.dataset.calid+'/'+nowT2Kit,  () => {

          });
         }
         else {
          return false // impede outros cards de entrarem no board dos calibradores
        }
    }

    if( goTO.indexOf("workmap")!=-1) { //se o alvo for um board workmap qualquer
        if( el.dataset.calibrator) {//cards P
          var mapName=goTO.toString();
           $.post('/sample/addponmap/t2toxina/'+nowT2Kit+'/'+mapName+'/'+el.dataset.calid,  () => {

              });
         } else {
           var mapName=goTO.toString();

          $.post('/sample/mapedit/t2toxina/' + samplenumber+'/'+nowT2Kit+'/'+mapName,  () => {

          });
          el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

      }
    }

    if(target=='_scndTesting') {
        
      if( el.dataset.calibrator) {//cards P não se movem para em analise
             return false
       }
      
       else {
         $.post('/sample/scndTesting/edit/t2toxina/' + samplenumber+'/'+nowT2Kit, () => {

         });
         el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

       }
    }


  }
});

//função de criação dos id dos Pchild para o T2 toxina
var countT2=0;

function IdT2Count ()
{
    countT2++;0
    return countT2;
}


var t2Limit;



const fumonisina = new jKanban({
  element : '#fumonisina',
  gutter  : '10px',
  widthBoard  : '190px',
  boards  : [
    {
      id : '_testing',
      title  : 'Em análise',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    },

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if  (target == '_testing') {
      $.post('/sample/testing/edit/fumonisina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/fumonisina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/fumonisina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

    if  (target == '_workmap') {
      $.post('/sample/mapwork/edit/fumonisina/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
  }
});


var scndFumonisina = new jKanban({
  element : '#fumonisina2',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
    },
    

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;
    var goTO=target;
    if(target =='_calibrator'){
        var strId=el.dataset.eid; //id do card
        if( el.dataset.calibrator) {//cards P 
            $.post('/sample/calibrator/edit/fumonisina/'+el.dataset.calid+'/'+nowFumKit,  () => {

            });        
         }
         else {
          return false // impede outros cards de entrarem no board dos calibradores
        }
    }

    if( goTO.indexOf("workmap")!=-1) { //se o alvo for um board workmap qualquer
    
        if( el.dataset.calibrator) {//cards originais
           var mapName=goTO.toString();
           $.post('/sample/addponmap/fumonisina/'+nowFumKit+'/'+mapName+'/'+el.dataset.calid,  () => {

          });

         } else {
          var mapName=goTO.toString();


          $.post('/sample/mapedit/fumonisina/' + samplenumber+'/'+nowFumKit+'/'+mapName,  () => {

          });
          el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

      }
    }

    if(target=='_scndTesting') {
       
      if( el.dataset.calibrator) {//cards P não se movem para em analise
             return false
       }

       else {
         $.post('/sample/scndTesting/edit/fumonisina/' + samplenumber+'/'+nowFumKit, () => {

         });
         el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

       }
    }


  }
});

//função de criação dos id dos Pchild para a fumonisina
var countFum=0;


function IdFumCount ()
{
    countFum++;
    return countFum;
}



const zearalenona = new jKanban({
  element : '#zearalenona',
  gutter  : '10px',
  widthBoard  : '190px',
  click : function(el) {
    alert(el.dataset.eid);
  },
  boards  : [
    {
      id : '_testing',
      title  : 'Em análise',
      class : 'success',
    },
    {
      id : '_ownering',
      title  : 'Aguardando pagamento',
      class : 'success',
    },
    {
      id : '_waiting',
      title  : 'Aguardando amostra',
      class : 'success',
    },

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;

    if  (target == '_testing') {
      $.post('/sample/testing/edit/zearalenona/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_ownering') {
      $.post('/sample/ownering/edit/zearalenona/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando pagamento' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }
    if  (target == '_waiting') {
      $.post('/sample/waiting/edit/zearalenona/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Aguardando amostra' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

    if  (target == '_workmap') {
      $.post('/sample/mapwork/edit/zearalenona/' + samplenumber, () => {

      });
      el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho ' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

    }

  }
});

var scndZearalenona = new jKanban({
  element : '#zearalenona2',
  gutter  : '10px',
  widthBoard  : '165px',
  click : function(el) {
    window.location.href = 'sample/edit/' + el.dataset.eid;
  },
  boards  : [
    {
      id : '_scndTesting',
      title  : 'Em análise',
      class : 'info'
    },
    {
      id : '_calibrator',
      title  : 'Calibradores',
      class : 'success',
      
    },
   

  ],
  dropEl : function (el, target, source, sibling) {
    const samplenumber = el.dataset.eid;
    var goTO=target;
    if(target =='_calibrator'){
        if( el.dataset.calibrator) {//cards P 
          $.post('/sample/calibrator/edit/zearalenona/'+el.dataset.calid+'/'+nowZKit,  () => {

          });   
         }
         else {
          return false // impede outros cards de entrarem no board dos calibradores
        }
    }

    if( goTO.indexOf("workmap")!=-1) { //se o alvo for um board workmap qualquer
        if( el.dataset.calibrator) {//cards P
          var mapName=goTO.toString();

          $.post('/sample/addponmap/zearalenona/'+nowZKit+'/'+mapName+'/'+el.dataset.calid,  () => {

          });
        }   
         else {
          var mapName=goTO.toString();


          $.post('/sample/mapedit/zearalenona/' + samplenumber+'/'+nowZKit+'/'+mapName,  () => {

          });
          el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Mapa de trabalho' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

      }
    }

    if(target=='_scndTesting') {
      if( el.dataset.calibrator) {//cards P não se movem para em analise
           return false;
       }
       
       else {
          $.post('/sample/scndTesting/edit/zearalenona/' + samplenumber+'/'+nowZKit, () => {

         });
         el.innerHTML = el.dataset.title + " "+ '<br><span  class="badge badge-secondary">' + 'Em análise' + '</span>'+ " "+ '<span  class="badge badge-primary">' + el.dataset.analyst + '</span>';

       }
    }


  }
});
//função de criação dos id dos Pchild para a fumonisina
var countZ=0;

function IdZCount ()
{
     countZ++;
    return countZ;
}


//cria cedulas kanban
$.get('/search/samples', (samples) => {
  $(document).ready(function() {
    samples.forEach((sample) => {
       if(!sample.isCalibrator){
        $.get('/search/userFromSample/'+sample._id,(user) =>{
          //AFLATOXINA
          if(sample.aflatoxina.active == true) {
             console.log(sample)
            if(sample.aflatoxina.status=="Nova" || sample.aflatoxina.status=="Sem amostra" || sample.aflatoxina.status=="A corrigir") {
              if(user.debt) {
                aflatoxina.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.aflatoxina.status,
                  owner: "Devedor"
                });
              }
              else{
                aflatoxina.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.aflatoxina.status
                });

              }

            }
            if(sample.aflatoxina.status=="Em análise"||sample.aflatoxina.status=="Mapa de Trabalho") {
              if(user.debt) {
                aflatoxina.addElement('_testing', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.aflatoxina.status,
                  owner: "Devedor"
                });
                if(sample.aflatoxina.status=="Em análise") {
                    scndAflatoxina.addElement('_scndTesting', {
                      id: "owner",
                      title: "Amostra " + sample.samplenumber,
                      analyst: sample.responsable,
                      status: sample.aflatoxina.status,
                      owner: "Devedor"
                    });
                }

              }
              else{
              aflatoxina.addElement('_testing', {
                id: sample.samplenumber,
                title: "Amostra " + sample.samplenumber,
                analyst: sample.responsable,
                status: sample.aflatoxina.status
              });
              if(sample.aflatoxina.status=="Em análise") {
                scndAflatoxina.addElement('_scndTesting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.aflatoxina.status
                });
               }
             }

            }
            if(sample.aflatoxina.status=="Aguardando pagamento") {
              if(user.debt){
                aflatoxina.addElement('_ownering', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.aflatoxina.status,
                  owner: "Devedor"
                });
              }
              else {
                aflatoxina.addElement('_ownering', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.aflatoxina.status,
                });
              }
            }
            if(sample.aflatoxina.status=="Aguardando amostra") {
              if(user.debt){
                aflatoxina.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.aflatoxina.status,
                  owner: "Devedor"
                });
              }
              else {
                aflatoxina.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.aflatoxina.status
                });
              }
            }

          }

          //OCRATOXINA A
          if(sample.ocratoxina.active == true) {
            if(sample.ocratoxina.status=="Nova" || sample.ocratoxina.status=="Sem amostra" || sample.ocratoxina.status=="A corrigir") {
              if(user.debt) {
                ocratoxina.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.ocratoxina.status,
                  owner: "Devedor"
                });
              }
              else {
                ocratoxina.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.ocratoxina.status
                });

              }

            }
            if(sample.ocratoxina.status=="Em análise"||sample.ocratoxina.status=="Mapa de Trabalho") {
              if(user.debt) {
                ocratoxina.addElement('_testing', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.ocratoxina.status,
                  owner: "Devedor"
                });

                if(sample.ocratoxina.status=="Em análise") {
                  scndOcratoxina.addElement('_scndTesting', {
                   id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.ocratoxina.status,
                  owner: "Devedor"
                  });
                }

              }

              else {
                ocratoxina.addElement('_testing', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.ocratoxina.status
                });

                if(sample.ocratoxina.status=="Em análise") {
                  scndOcratoxina.addElement('_scndTesting', {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.ocratoxina.status
                  });
                }

              }



            }
            if(sample.ocratoxina.status=="Aguardando pagamento") {
              if(user.debt){
                ocratoxina.addElement('_ownering', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.ocratoxina.status
                });
              }
              else{
                ocratoxina.addElement('_ownering', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.ocratoxina.status,
                  owner: "Devedor"
                });

              }

            }
            if(sample.ocratoxina.status=="Aguardando amostra") {
              if(user.debt) {
                ocratoxina.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.ocratoxina.status,
                  owner: "Devedor"
                });

              }
              else {
                ocratoxina.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.ocratoxina.status
                });
              }
            }


          }

          //DEOXINIVALENOL
          if(sample.deoxinivalenol.active == true) {
            if(sample.deoxinivalenol.status=="Nova" || sample.deoxinivalenol.status=="Sem amostra" || sample.deoxinivalenol.status=="A corrigir") {
              if(user.debt) {
                deoxinivalenol.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.deoxinivalenol.status,
                  owner:"Devedor"
                });
              }
             else {
              deoxinivalenol.addElement('_waiting', {
                id: sample.samplenumber,
                title: "Amostra " + sample.samplenumber,
                analyst: sample.responsable,
                status: sample.deoxinivalenol.status
              });

              }

            }
            if(sample.deoxinivalenol.status=="Em análise"||sample.deoxinivalenol.status=="Mapa de Trabalho") {
              if(user.debt) {
                deoxinivalenol.addElement('_testing', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.deoxinivalenol.status,
                  owner: "Devedor"
                });
                if(sample.deoxinivalenol.status=="Em análise") {
                    scndDeoxinivalenol.addElement('_scndTesting', {
                      id: "owner",
                      title: "Amostra " + sample.samplenumber,
                      analyst: sample.responsable,
                      status: sample.deoxinivalenol.status,
                      owner: "Devedor"
                    });
                }
              }

              else {
                deoxinivalenol.addElement('_testing', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.deoxinivalenol.status
                });
                if(sample.deoxinivalenol.status=="Em análise") {
                    scndDeoxinivalenol.addElement('_scndTesting', {
                      id: sample.samplenumber,
                      title: "Amostra " + sample.samplenumber,
                      analyst: sample.responsable,
                      status: sample.deoxinivalenol.status
                    });
                }

              }



            }
            if(sample.deoxinivalenol.status=="Aguardando pagamento") { //continuar aqui
               if(user.debt) {
                deoxinivalenol.addElement('_ownering', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.deoxinivalenol.status,
                  owner: "Devendo"
                });
               }
               else {
                deoxinivalenol.addElement('_ownering', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.deoxinivalenol.status
                });
               }

            }
            if(sample.deoxinivalenol.status=="Aguardando amostra") {
              if(user.debt) {
                deoxinivalenol.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.deoxinivalenol.status,
                  owner: "Devendo"
                });
              }
              else {
                deoxinivalenol.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.deoxinivalenol.status
                });
              }

            }
          }

          //ZEARALENONA
          if(sample.zearalenona.active == true) {
            if(sample.zearalenona.status=="Nova" || sample.zearalenona.status=="Sem amostra" || sample.zearalenona.status=="A corrigir") {
               if(user.debt) {
                zearalenona.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status,
                  owner: "Devedor"
                });
               }
               else {
                zearalenona.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status
                });

               }

            }
            if(sample.zearalenona.status=="Em análise"||sample.zearalenona.status=="Mapa de Trabalho") {
              if(user.debt){
                zearalenona.addElement('_testing', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status,
                  owner: "Devedor"
                });
                scndZearalenona.addElement('_scndTesting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status
                });
              }
              else {
                zearalenona.addElement('_testing', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status
                });
                scndZearalenona.addElement('_scndTesting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status
                });
              }

            }
            if(sample.zearalenona.status=="Aguardando pagamento") {
              if(user.debt) {
                zearalenona.addElement('_ownering', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status,
                  owner:"Devedor"
                });
              }
              else{
                zearalenona.addElement('_ownering', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status
                });
              }

            }
            if(sample.zearalenona.status=="Aguardando amostra") {
              if(user.debt) {
                zearalenona.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status,
                  owner:"Devedor"
                });
              }
              else{
                zearalenona.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.zearalenona.status
                });
              }

            }

          }

          //T-2 TOXINA
          if(sample.t2toxina.active == true) {
            if(sample.t2toxina.status=="Nova" || sample.t2toxina.status=="Sem amostra" || sample.t2toxina.status=="A corrigir") {
               if(user.debt) {
                t2toxina.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.t2toxina.status,
                  owner: "Devedor"
                });
               }
               else{
                t2toxina.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.t2toxina.status
                });
               }

            }
            if(sample.t2toxina.status=="Em análise"||sample.t2toxina.status=="Mapa de Trabalho") {
              if(user.debt) {
                t2toxina.addElement('_testing', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.t2toxina.status,
                  owner:"Devedor"
                });
                if(sample.t2toxina.status=="Em análise") {
                  scndT2toxina.addElement('_scndTesting', {
                    id: "owner",
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.t2toxina.status,
                    owner:"Devedor"
                  });
                }
              }
              else {
                t2toxina.addElement('_testing', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.t2toxina.status
                });
                if(sample.t2toxina.status=="Em análise") {
                  scndT2toxina.addElement('_scndTesting', {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.t2toxina.status
                  });
                }
              }


            }
            if(sample.t2toxina.status=="Aguardando pagamento") {
              if(user.debt){
                t2toxina.addElement('_ownering', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.t2toxina.status,
                  owner: "Devedor"
                });
              }
              else {
                t2toxina.addElement('_ownering', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.t2toxina.status
                });
              }

            }
            if(sample.t2toxina.status=="Aguardando amostra") {
              if(user.debt){
                t2toxina.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.t2toxina.status,
                  owner:"Devedor"
                });
              }
              else{
                t2toxina.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.t2toxina.status
                });
              }

            }

          }

          //FUMOSININA
          if(sample.fumonisina.active == true) {
            if(sample.fumonisina.status=="Nova" || sample.fumonisina.status=="Sem amostra" || sample.fumonisina.status=="A corrigir") {
              if(user.debt) {
                fumonisina.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.fumonisina.status,
                  owner:"Devedor"
                });
              }
              else {
                fumonisina.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.fumonisina.status
                });
              }

            }
            if(sample.fumonisina.status=="Em análise"||sample.fumonisina.status=="Mapa de Trabalho") {
              if(user.debt){
                fumonisina.addElement('_testing', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.fumonisina.status,
                  owner: "Devedor"
                });
                if(sample.fumonisina.status=="Em análise") {
                  scndFumonisina.addElement('_scndTesting', {
                    id: "owner",
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.fumonisina.status,
                    owner: "Devedor"
                  });
                }
              }
              else {
                fumonisina.addElement('_testing', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.fumonisina.status
                });
                if(sample.fumonisina.status=="Em análise") {
                  scndFumonisina.addElement('_scndTesting', {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.fumonisina.status
                  });
                }
              }


            }
            if(sample.fumonisina.status=="Aguardando pagamento") {
              fumonisina.addElement('_ownering', {
                id: sample.samplenumber,
                title: "Amostra " + sample.samplenumber,
                analyst: sample.responsable,
                status: sample.fumonisina.status
              });
            }
            if(sample.fumonisina.status=="Aguardando amostra") {
              if(user.debt) {
                fumonisina.addElement('_waiting', {
                  id: "owner",
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.fumonisina.status,
                  owner:"Devedor"
                });
              }
              else {
                fumonisina.addElement('_waiting', {
                  id: sample.samplenumber,
                  title: "Amostra " + sample.samplenumber,
                  analyst: sample.responsable,
                  status: sample.fumonisina.status
                });
              }

            }

          }
        });
      }



    });

  });
});

//Funções "hide" para puxar os kits desejados(A,B,C)



var nowAflaKit;
var aflaLimit=0;
var throughtIf;
$('#KitRadioAfla').click(function(){//não repete
   
  throughtIf=0;

  for(i=aflaLimit;i>0;i--){//delete previus workmap;
    var board= "_workmap"+i;
    scndAflatoxina.removeBoard(board);
  }
  if(aflaLimit!=0||throughtIf==3) {
    var elementId;
     for(j=0;j<5;j++){

      elementId= "P"+(j+1);
       scndAflatoxina.removeElement(elementId);
     }
  }
  var isSelected=false;
  var   kitToxin;
    $.get('/search/kits', (kits) => {
        kits.forEach((kit) => {
              isSelected=false;
              kitToxin=kit.productCode;
          if(kitToxin.includes("AFLA")||kitToxin.includes("Afla") ) {
               if ($('#KitAflaB').is(':checked')&&kit.kitType=="B") {
                   $('#hideAfla').removeClass('form-disabled');
                   aflaLimit=kit.stripLength;
                   nowAflaKit=kit._id;
                   aflacount = aflaLimit;
                   isSelected=true;
                   throughtIf=false;
                   document.getElementById("countkitsAfla").innerHTML = aflacount;
                   $.post('/sample/setActiveKit/'+kitToxin+'/' + nowAflaKit, () => {

                   });
               }
               else{
                throughtIf++;
               }

                if($('#KitAflaA').is(':checked')&&kit.kitType=="A") {

                    $('#hideAfla').removeClass('form-disabled');
                     aflaLimit=kit.stripLength;
                     nowAflaKit=kit._id;
                     aflacount = aflaLimit;
                     isSelected=true;
                     throughtIf=false;
                     document.getElementById("countkitsAfla").innerHTML = aflacount;
                     $.post('/sample/setActiveKit/'+kitToxin+'/' + nowAflaKit, () => {

                     });

                }
                else{
                  throughtIf++;
                 }
              if ($('#KitAflaC').is(':checked')&&kit.kitType=="C") {
                    $('#hideAfla').removeClass('form-disabled');
                    aflaLimit=kit.stripLength;
                    nowAflaKit=kit._id;
                    aflacount = aflaLimit;
                    isSelected=true;
                    document.getElementById("countkitsAfla").innerHTML = aflacount;
                    $.post('/sample/setActiveKit/'+kitToxin+'/' + nowAflaKit, () => {

                    });

               }
               else{
                throughtIf++;
               }
               console.log(throughtIf);
               
               if(throughtIf==3) {
                 $('#hideAfla').addClass('form-disabled');
                }

               if(isSelected) {
                for(i=1;i<=aflaLimit;i++){//the map 0 was defined before
                  console.log(i);
                  scndAflatoxina.addBoards(
                          [{
                              'id' : '_workmap' + (i),
                              'title'  : 'Mapa de trabalho' + ' '+ (i),
                              'class' : 'info',
                          }]
                      )
                }
               }



        }
      });//for each kit
      $.get('/search/getKit/'+nowAflaKit,(kit)=>{
          $.get('/search/samples', (samples) => {
            samples.forEach((sample) => {
              if(sample.isCalibrator) {
                if(sample.aflatoxina.mapReference=='Sem mapa') {
                    if(kit.calibrators.P1.sampleID==sample._id||kit.calibrators.P2.sampleID==sample._id||kit.calibrators.P3.sampleID==sample._id||kit.calibrators.P4.sampleID==sample._id||kit.calibrators.P5.sampleID==sample._id) {
                      scndAflatoxina.addElement("_calibrator", {
                        id: sample.name,
                        title:  sample.name,
                        calibrator: true,
                        calid:sample._id
                      });
                   
                     
                    }
                }
              }
            });
          });
        }).catch((error) => {
          console.log(error);
          res.redirect('/error');
        });
       $.get('/search/getKit/'+nowAflaKit,(kit)=>{//allocate the samples/calibrators that are in an workmap
          kit.mapArray.forEach((mapID) => {
            $.get('/search/getWorkmap/'+mapID,(workmap)=>{
              workmap.samplesArray.forEach((sampleID)=>{
                $.get('/search/getOneSample/'+sampleID,(sample)=>{
                  if(sample.isCalibrator) {
                      scndAflatoxina.addElement(sample.aflatoxina.mapReference, {
                        id: sample.name,
                          title:  sample.name,
                          calibrator: true,
                          calid:sample._id
                      });
                }
                else {
                  $.get('/search/userFromSample/'+sample._id,(user)=>{
                    if(sample.aflatoxina.active == true && sample.aflatoxina.status=="Mapa de Trabalho" ) {
                          if(user.debt){
                            scndAflatoxina.addElement(sample.aflatoxina.mapReference, {
                              id: "owner",
                              title: "Amostra " + sample.samplenumber,
                              analyst: sample.responsable,
                              status: sample.aflatoxina.status,
                              owner: "Devedor"
                            });
                          }

                          else {
                           scndAflatoxina.addElement(sample.aflatoxina.mapReference, {
                              id: sample.samplenumber,
                              title: "Amostra " + sample.samplenumber,
                              analyst: sample.responsable,
                              status: sample.aflatoxina.status
                           });
                        }

                   }

                 });
               }
                });
              });
           });
          });
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
      }); //end of the allocation of workmaps

  })

});

var nowOcraKit;
var ocraLimit=0;
$('#KitRadioOcra').change(function(){
  for(i=ocraLimit;i>0;i--){//delete previus workmap;
    var board= "_workmap"+i;
    scndOcratoxina.removeBoard(board);
  }
  if(ocraLimit!=0) {
    var elementId;
     for(j=0;j<5;j++){

      elementId= "P"+(j+1);
       scndOcratoxina.removeElement(elementId);
     }
  }
  var isSelected=false;
  var   kitToxin;

   $.get('/search/kits', (kits) => {

       kits.forEach((kit) => {
             kitToxin=kit.productCode;
             isSelected=false;
         if(kitToxin.includes("OTA")||kitToxin.includes("Och")) {
           if($('#KitOcraA').is(':checked')&&kit.kitType=="A") {
               $('#hideOcra').removeClass('form-disabled');
                ocraLimit=kit.stripLength;
                nowOcraKit=kit._id;
                ocracount = ocraLimit;
                isSelected=true;
                document.getElementById("countkitsOcra").innerHTML = ocracount;
                $.post('/sample/setActiveKit/'+kitToxin+'/' + nowOcraKit, () => {

                });

           }
            if($('#KitOcraB').is(':checked')&&kit.kitType=="A") {
                 $('#hideOcra').removeClass('form-disabled');
                  ocraLimit=kit.stripLength;
                    nowOcraKit=kit._id;
                    ocracount = ocraLimit;
                    isSelected=true;
                    document.getElementById("countkitsOcra").innerHTML = ocracount;
                    $.post('/sample/setActiveKit/'+kitToxin+'/' + nowOcraKit, () => {

                    });
             }
             if ($('#KitOcraC').is(':checked')&&kit.kitType=="C") {
              $('#hideOcra').removeClass('form-disabled');
               ocraLimit=kit.stripLength;
                nowOcraKit=kit._id;
                ocracount = ocraLimit;
                isSelected=true;
                document.getElementById("countkitsOcra").innerHTML = ocracount;
                $.post('/sample/setActiveKit/'+kitToxin+'/' + nowOcraKit, () => {

                });
            }

            if(isSelected){
              for(i=0;i<ocraLimit;i++){//the map 0 was defined before
                scndOcratoxina.addBoards(
                        [{
                            'id' : '_workmap' + (i+1),
                            'title'  : 'Mapa de trabalho' + ' '+ (i+1),
                            'class' : 'info',
                        }]
                    )
              }
            }


         }

     })//for each
     $.get('/search/samples', (samples) => {
      samples.forEach((sample) => {
        if(sample.isCalibrator) {
           if(sample.ocratoxina.mapReference=='Sem mapa') {
              if(kit.calibrators.P1.sampleID==sample._id||kit.calibrators.P2.sampleID==sample._id||kit.calibrators.P3.sampleID==sample._id||kit.calibrators.P4.sampleID==sample._id||kit.calibrators.P5.sampleID==sample._id) {
                scndOcratoxina.addElement("_calibrator", {
                  id: sample.name,
                  title:  sample.name,
                  calibrator: true,
                  calid:sample._id
                });

              }
           }
        }
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
     $.get('/search/getKit/'+nowOcraKit,(kit)=>{//allocate the samples/calibrators that are in an workmap
        kit.mapArray.forEach((mapID) => {
          $.get('/search/getWorkmap/'+mapID,(workmap)=>{
            workmap.samplesArray.forEach((sampleID)=>{
              $.get('/search/getOneSample/'+sampleID,(sample)=>{
                if(sample.isCalibrator) {
                    scndOcratoxina.addElement(sample.ocratoxina.mapReference, {
                      id: sample.name,
                        title:  sample.name,
                        calibrator: true,
                        calid:sample._id
                    });
              }
              else {
                $.get('/search/userFromSample/'+sample._id,(user)=>{
                  if(sample.ocratoxina.active == true && sample.ocratoxina.status=="Mapa de Trabalho" ) {
                        if(user.debt){
                          scndOcratoxina.addElement(sample.ocratoxina.mapReference, {
                            id: "owner",
                            title: "Amostra " + sample.samplenumber,
                            analyst: sample.responsable,
                            status: sample.ocratoxina.status,
                            owner: "Devedor"
                          });
                        }

                        else {
                         scndOcratoxina.addElement(sample.ocratoxina.mapReference, {
                            id: sample.samplenumber,
                            title: "Amostra " + sample.samplenumber,
                            analyst: sample.responsable,
                            status: sample.ocratoxina.status
                         });
                      }

                 }

               });
             }
              });
            });



         });



        });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    }); //end of the allocation of workmaps

  });

});


var nowDeoxKit;
var deoxLimit=0;
$('#KitRadioDeox').change(function(){
  for(i=deoxLimit;i>0;i--){//delete previus workmap;
    var board= "_workmap"+i;
    scndDeoxinivalenol.removeBoard(board);
  }
  if(deoxLimit!=0) {
    var elementId;
     for(j=0;j<5;j++){

      elementId= "P"+(j+1);
       scndDeoxinivalenol.removeElement(elementId);
     }
  }
  var isSelected=false;
  var   kitToxin;


   $.get('/search/kits', (kits) => {
       kits.forEach((kit) => {
        kitToxin=kit.productCode;
        isSelected=false;
         if(kitToxin.includes("DON")) {
           if($('#KitDeoxA').is(':checked')&&kit.kitType=="A") {
               $('#hideDeox').removeClass('form-disabled');
                deoxLimit=kit.stripLength;
                nowDeoxKit=kit._id;
                deoxcount = deoxLimit;
                isSelected=true;
                document.getElementById("countkitsDeox").innerHTML = deoxcount;
                $.post('/sample/setActiveKit/'+kitToxin+'/' + nowDeoxKit, () => {

                });

           }
           if($('#KitDeoxB').is(':checked')&&kit.kitType=="B") {
              $('#hideDeox').removeClass('form-disabled');
               deoxLimit=kit.stripLength;
               nowDeoxKit=kit._id;
               deoxcount = deoxLimit;
               isSelected=true;
               document.getElementById("countkitsDeox").innerHTML = deoxcount;
               $.post('/sample/setActiveKit/'+kitToxin+'/' + nowDeoxKit, () => {

               });
             }
             if (kit.kitType=="C"&&$('#KitDeoxC').is(':checked')) {
              $('#hideDeox').removeClass('form-disabled');
               deoxLimit=kit.stripLength;
                 nowDeoxKit=kit._id;
                 deoxcount = deoxLimit;
                 isSelected=true;
                 document.getElementById("countkitsDeox").innerHTML = deoxcount;
                 $.post('/sample/setActiveKit/'+kitToxin+'/' + nowDeoxKit, () => {

                 });
            }

            if(isSelected){
              for(i=1;i<deoxLimit;i++){//the map 0 was defined before
                scndDeoxinivalenol.addBoards(
                        [{
                            'id' : '_workmap' + (i+1),
                            'title'  : 'Mapa de trabalho' + ' '+ (i+1),
                            'class' : 'info',
                        }]
                    )
              }
            }

         }

     });//kit foreach
     $.get('/search/samples', (samples) => {
      $(document).ready(function() {
        samples.forEach((sample) => {
          if(sample.isCalibrator) {
            $.get('/search/getKit/'+nowOcraKit,(kit)=>{
              if(kit.calibrators.P1.sampleID==sample._id||kit.calibrators.P2.sampleID==sample._id||kit.calibrators.P3.sampleID==sample._id||kit.calibrators.P4.sampleID==sample._id||kit.calibrators.P5.sampleID==sample._id) {
                scndAflatoxina.addElement("_calibrator", {
                        id: sample.name,
                        title:  sample.name,
                        calibrator: true,
                        calid:sample._id
                });
              }
            })


          }
        $.get('/search/userFromSample/'+sample._id,(user)=>{
          if(sample.deoxinivalenol.active == true && sample.deoxinivalenol.status=="Mapa de Trabalho" ) {
                if(user.debt){
                  scndDeoxinivalenol.addElement(sample.deoxinivalenol.mapReference, {
                    id: "owner",
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.deoxinivalenol.status,
                    owner: "Devedor"
                  });
                }

                else {
                 scndDeoxinivalenol.addElement(sample.deoxinivalenol.mapReference, {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.deoxinivalenol.status
                 });
              }

         }
         })
        });
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });


  });
});

var nowFumKit;
var fumLimit=0;
$('#KitRadioFum').change(function(){
  for(i=fumLimit;i>0;i--){//delete previus workmap;
    var board= "_workmap"+i;
    scndFumonisina.removeBoard(board);
  }
  var isSelected=false;
  var   kitToxin;

   $.get('/search/kits', (kits) => {
       kits.forEach((kit) => {
        kitToxin=kit.productCode;
        isSelected=false;

         if(kitToxin.includes("FUMO")||kitToxin.includes("Fum")) {
           if($('#KitFumA').is(':checked')&&kit.kitType=="A") {
               $('#hideFum').removeClass('form-disabled');
                  fumLimit=kit.stripLength;
                  nowFumKit=kit._id;
                  fumcount = fumLimit;
                  isSelected=true;
                  document.getElementById("countkitsFumo").innerHTML = fumcount;
                  $.post('/sample/setActiveKit/'+kitToxin+'/' + nowFumKit, () => {

                  });

           }
           if($('#KitFumB').is(':checked')&&kit.kitType=="B") {
              $('#hideFum').removeClass('form-disabled');
                 fumLimit=kit.stripLength;
                 nowFumKit=kit._id;
                 fumcount = fumLimit;
                 isSelected=true;
                 document.getElementById("countkitsFumo").innerHTML = fumcount;
                 $.post('/sample/setActiveKit/'+kitToxin+'/' + nowFumKit, () => {

                 });
             }
            if (kit.kitType=="C"&&$('#KitFumC').is(':checked')) {
              $('#hideFum').removeClass('form-disabled');
                  fumLimit=kit.stripLength;
                   nowFumKit=kit._id;
                   fumcount = fumLimit;
                   isSelected=true;
                   document.getElementById("countkitsFumo").innerHTML = fumcount;
                   $.post('/sample/setActiveKit/'+kitToxin+'/' + nowFumKit, () => {

                   });
            }

           if(isSelected) {
            for(i=1;i<fumLimit;i++){//the map 0 was defined before
              scndFumonisina.addBoards(
                      [{
                          'id' : '_workmap' + (i+1),
                          'title'  : 'Mapa de trabalho' + ' '+ (i+1),
                          'class' : 'info',
                      }]
                  )
            }
           }



         }

     })//kit foreacj
     $.get('/search/getKit/'+nowFumKit,(kit)=>{
      $.get('/search/samples', (samples) => {
        samples.forEach((sample) => {
          if(sample.isCalibrator) {
            if(sample.fumonisina.mapReference=='Sem mapa') {
                if(kit.calibrators.P1.sampleID==sample._id||kit.calibrators.P2.sampleID==sample._id||kit.calibrators.P3.sampleID==sample._id||kit.calibrators.P4.sampleID==sample._id||kit.calibrators.P5.sampleID==sample._id) {
                  scndFumonisina.addElement("_calibrator", {
                    id: sample.name,
                    title:  sample.name,
                    calibrator: true,
                    calid:sample._id
                  });
                  console.log(sample.name)

                }
            }
          }
        });
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   $.get('/search/getKit/'+nowFumKitt,(kit)=>{//allocate the samples/calibrators that are in an workmap
      kit.mapArray.forEach((mapID) => {
        $.get('/search/getWorkmap/'+mapID,(workmap)=>{
          workmap.samplesArray.forEach((sampleID)=>{
            $.get('/search/getOneSample/'+sampleID,(sample)=>{
              if(sample.isCalibrator) {
                  scndFumonisina.addElement(sample.fumonisina.mapReference, {
                    id: sample.name,
                      title:  sample.name,
                      calibrator: true,
                      calid:sample._id
                  });
            }
            else {
              $.get('/search/userFromSample/'+sample._id,(user)=>{
                if(sample.fumonisina.active == true && sample.fumonisina.status=="Mapa de Trabalho" ) {
                      if(user.debt){
                        scndFumonisina.addElement(sample.fumonisina.mapReference, {
                          id: "owner",
                          title: "Amostra " + sample.samplenumber,
                          analyst: sample.responsable,
                          status: sample.fumonisina.status,
                          owner: "Devedor"
                        });
                      }

                      else {
                       scndFumonisina.addElement(sample.fumonisina.mapReference, {
                          id: sample.samplenumber,
                          title: "Amostra " + sample.samplenumber,
                          analyst: sample.responsable,
                          status: sample.fumonisina.status
                       });
                    }

               }

             });
           }
            });
          });
       });
      });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  }); //end of the allocation of workmaps

  })
});
//alterar daqui pra frente
var nowT2Kit;
var t2Limit=0;

$('#KitRadioT').change(function(){
  for(i=t2Limit;i>0;i--){//delete previus workmap;
    var board= "_workmap"+i;
    scndT2toxina.removeBoard(board);
  }

  if(t2Limit!=0) {
    var elementId;
     for(j=0;j<5;j++){

      elementId= "P"+(j+1);
       scndT2toxina.removeElement(elementId);
     }
  }
  var isSelected=false;
  var   kitToxin;

   $.get('/search/kits', (kits) => {
       kits.forEach((kit) => {
        kitToxin=kit.productCode;
        isSelected=false;
         if(kitToxin.includes("T2")) {
           if($('#KitTA').is(':checked')&&kit.kitType=="A") {
               $('#hideT').removeClass('form-disabled');
                  t2Limit=kit.stripLength;
                  nowT2Kit=kit._id;
                  t2count = t2Limit;
                  isSelected=true;
                  document.getElementById("countkits").innerHTML = t2count;
                  $.post('/sample/setActiveKit/'+kitToxin+'/' + nowFumKit, () => {

                  });

           }
           if($('#KitTB').is(':checked')&&kit.kitType=="B") {
              $('#hideT').removeClass('form-disabled');
                   t2Limit=kit.stripLength;
                   nowT2Kit=kit._id;
                   t2count = t2Limit;
                   document.getElementById("countkits").innerHTML = t2count;
                   $.post('/sample/setActiveKit/'+kitToxin+'/' + nowFumKit, () => {

                  });

             }
             if (kit.kitType=="C"&&$('#KitTC').is(':checked')) {
              $('#hideT').removeClass('form-disabled');
                    t2Limit=kit.stripLength;
                    nowT2Kit=kit._id;
                    t2count = t2Limit;
                    document.getElementById("countkits").innerHTML = t2count;
                    $.post('/sample/setActiveKit/'+kitToxin+'/' + nowFumKit, () => {

                    });
            }

            if(isSelected) {
              for(i=1;i<t2Limit;i++){//the map 0 was defined before
                scndT2toxina.addBoards(
                        [{
                            'id' : '_workmap' + (i+1),
                            'title'  : 'Mapa de trabalho' + ' '+ (i+1),
                            'class' : 'info',
                        }]
                    );
              }
            }
         }

     }) //kit
     $.get('/search/samples', (samples) => {
        samples.forEach((sample) => {
          if(sample.isCalibrator) {
            $.get('/search/getKit/'+nowT2Kit,(kit)=>{
              if(kit.calibrators.P1.sampleID==sample._id||kit.calibrators.P2.sampleID==sample._id||kit.calibrators.P3.sampleID==sample._id||kit.calibrators.P4.sampleID==sample._id||kit.calibrators.P5.sampleID==sample._id) {
                scndT2toxina.addElement("_calibrator", {
                  id: sample.name,
                  title:  sample.name,
                  calibrator: true,
                  calid:sample._id
                });
              }
            })


          }
        $.get('/search/userFromSample/'+sample._id,(user)=>{
          if(sample.t2toxina.active == true && sample.t2toxina.status=="Mapa de Trabalho" ) {
                if(user.debt){
                  scndT2toxina.addElement(sample.t2toxina.mapReference, {
                    id: "owner",
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.t2toxina.status,
                    owner: "Devedor"
                  });
                }

                else {
                 scndT2toxina.addElement(sample.t2toxina.mapReference, {
                    id: sample.samplenumber,
                    title: "Amostra " + sample.samplenumber,
                    analyst: sample.responsable,
                    status: sample.t2toxina.status
                 });
              }

         }
         });
        });

    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });


  });
});

var nowZKit;
var zLimit=0;
$('#KitRadioZ').change(function(){
  for(i=zLimit;i>0;i--){//delete previus workmap;
    var board= "_workmap"+i;
    scndZearalenona.removeBoard(board);
  }
  if(zLimit!=0) {
    var elementId;
     for(j=0;j<5;j++){

      elementId= "P"+(j+1);
       scndZearalenona.removeElement(elementId);
     }
  }
  var isSelected=false;
  var   kitToxin;

   $.get('/search/kits', (kits) => {
       kits.forEach((kit) => {
          kitToxin=kit.productCode;
          isSelected=false;

         if(kitToxin.includes("ZEA")||kitToxin.includes("Zea")) {
           if($('#KitZA').is(':checked')&&kit.kitType=="A") {
               $('#hideZ').removeClass('form-disabled');
                  zLimit=kit.stripLength;
                  nowZKit=kit._id;
                  isSelected=true;
                  $.post('/sample/setActiveKit/'+kitToxin+'/' + nowZKit, () => {

                  });

           }
             if($('#KitZB').is(':checked')&&kit.kitType=="B") {
              $('#hideZ').removeClass('form-disabled');
                 zLimit=kit.stripLength;
                   nowZKit=kit._id;
                   isSelected=true;
                   $.post('/sample/setActiveKit/'+kitToxin+'/' + nowZKit, () => {

                   });

             }
             if (kit.kitType=="C"&&$('#KitZC').is(':checked')) {
              $('#hideZ').removeClass('form-disabled');
                 zLimit=kit.stripLength;
                   nowZKit=kit._id;
                   isSelected=true;
                   $.post('/sample/setActiveKit/'+kitToxin+'/' + nowZKit, () => {

                   });
            }

            if(isSelected) {
              for(i=1;i<zLimit;i++){//the map 0 was defined before
                scndZearalenona.addBoards(
                        [{
                            'id' : '_workmap' + (i+1),
                            'title'  : 'Mapa de trabalho' + ' '+ (i+1),
                            'class' : 'info',
                        }]
                    )
              }
            }


         }

     }) //foreach
     $.get('/search/getKit/'+nowZKit,(kit)=>{
      $.get('/search/samples', (samples) => {
        samples.forEach((sample) => {
          if(sample.isCalibrator) {
            if(sample.zearalenona.mapReference=='Sem mapa') {
                if(kit.calibrators.P1.sampleID==sample._id||kit.calibrators.P2.sampleID==sample._id||kit.calibrators.P3.sampleID==sample._id||kit.calibrators.P4.sampleID==sample._id||kit.calibrators.P5.sampleID==sample._id) {
                  scndFumonisina.addElement("_calibrator", {
                    id: sample.name,
                    title:  sample.name,
                    calibrator: true,
                    calid:sample._id
                  });


                }
            }
          }
        });
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   $.get('/search/getKit/'+nowZKit,(kit)=>{//allocate the samples/calibrators that are in an workmap
      kit.mapArray.forEach((mapID) => {
        $.get('/search/getWorkmap/'+mapID,(workmap)=>{
          workmap.samplesArray.forEach((sampleID)=>{
            $.get('/search/getOneSample/'+sampleID,(sample)=>{
              if(sample.isCalibrator) {
                  scndFumonisina.addElement(sample.zearalenona.mapReference, {
                    id: sample.name,
                      title:  sample.name,
                      calibrator: true,
                      calid:sample._id
                  });
            }
            else {
              $.get('/search/userFromSample/'+sample._id,(user)=>{
                if(sample.zearalenona.active == true && sample.zearalenona.status=="Mapa de Trabalho" ) {
                      if(user.debt){
                        scndFumonisina.addElement(sample.zearalenona.mapReference, {
                          id: "owner",
                          title: "Amostra " + sample.samplenumber,
                          analyst: sample.responsable,
                          status: sample.zearalenona.status,
                          owner: "Devedor"
                        });
                      }

                      else {
                       scndFumonisina.addElement(sample.zearalenona.mapReference, {
                          id: sample.samplenumber,
                          title: "Amostra " + sample.samplenumber,
                          analyst: sample.responsable,
                          status: sample.zearalenona.status
                       });
                    }

               }

             });
           }
            });
          });
       });
      });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });


  })
});


  //
  // // Use of Date.now() function
  // var d = Date(Date.now());
  //
  // // Converting the number of millisecond in date string
  // a = d.toString()
  //
  // // Printing the current date
  //
  //   // Use of Date.now() function
  //   var d = Date(Date.now());
  //
  //   // Converting the number of millisecond in date string
  //   a = d.toString()
  //
  //
  //   var contando = 0;
  //   var ano = new Array;
  //   for(var cont = 0; cont < a.length; cont++){
  //     if(a[cont] == 1||2||3||4||5||6||7||8||9||0){
  //       ano2[contando] = a=[cont];
  //       ano[contando] = a [cont] ;
  //       contando++;
  //     }
  //   }
  //   ano = ano.toString;
  //   document.write(ano);

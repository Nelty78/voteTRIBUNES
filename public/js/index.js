/* global $ */
/* global cookies */
/* global toastr */


$( document ).ready(function() {
  
    $(" .spinner ").removeClass('hide'); // Let's load the page first...
    $(" span#author ").on( "click", authorInfo); // Let's link the author's name to a pop-up
  
    if(cookies.get('fromParis') === 1 || cookies.get('fromParis') === null) { // If it's the first visit or he's from Paris
      $.confirm({
          columnClass: 'large',
          type: 'red',
          icon: 'fa fa-warning',
          theme: 'supervan',
          title: 'Attention !',
          content: 'Êtes-vous étudiant sur le campus de Paris ?',
          buttons: {
              Oui: function () {
                cookies.set('fromParis', 1);
                $.confirm({
                  title: 'Votez sur place :)',
                  theme: 'supervan',
                  content: 'Les étudiants du campus de Paris sont invités à voter sur place !',
                  buttons: {
                    "J'ai compris": function() { window.location.replace("https://www.google.fr"); }
                  }
                });
              },
              Non: function() { cookies.set('fromParis', 0); },
          }
      });  
    }

    function isFacebookApp() {
      var ua = navigator.userAgent || navigator.vendor || window.opera;
      return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
    }
    
    if(isFacebookApp()) {
      $(" #fb ").text('Veuillez ouvrir ce site dans votre navigateur internet, et non le navigateur de Facebook (Google bloque les connexions depuis Facebook).');
      $(" #fb ").removeClass('hide');
      $(" #fb ").addClass('alert alert-danger'); 
    }

    $.get('api/isAdmin', function (result) {
      if(result === true) $(" .admin ").html('<a href="/admin""><i class="fa fa-lock fa-lg" aria-hidden="true"></i> Administration</a>');
    });
    
});

function displayIfConnected(beforeVote) {
  $.get('api/connected', function(data) { 
        
        $(" .spinner ").addClass('hide');
        $(" #countdown ").removeClass("hide");  
        
        
        if(data.connected) {
          
          var showedToastr = false; 
          toastr.options = {
            "closeButton": true,
            "positionClass": "toast-top-left",
            "onclick": null,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          };
          if(!showedToastr) {
            $.get('api/getTotalCount', function (data) {
              if(data.count > 5 && !beforeVote) {
                toastr.success(data.count+" personnes ont déjà voté !");
                showedToastr = true; 
              }
            });
          }
          
          if(!beforeVote) {
          $(" #welcome3 ").addClass("hide");
          $(" #login ").removeClass('alert alert-danger');
          $(" #welcome ").addClass('hide');
          $(" #form ").removeClass('hide');
          $(" #login ").html('Bienvenue aux Élections Présidentielles Scépiennes !<br> Choisissez votre candidat ci-dessous. Le vote est complètement <strong>anonyme</strong>.');
          $(" .logout ").removeClass('hide');
          $(" .logout ").html('<a href="/logout"">Déconnexion <i class="fa fa-sign-out fa-lg" aria-hidden="true"></i></a>');
          }
            
        }
        else {
          $(" #welcome3 ").removeClass("hide");
          if(data.message != "") {
            $(" #login ").text(data.message);
            $(" #login ").addClass('alert alert-danger'); 
          }
          else {
            $(" #login ").html('');
          }
          $(" #form ").addClass('hide');
          $(" .logout ").addClass('hide');
          $(" #welcome ").removeClass('hide');  
        }
  });
}



function submite() {
  var selectValue = $('input[name=candidat]:checked', '#form').val();
  //var possibleSelects = ['Dupont', 'Pen', 'Macron', 'Hamon', 'Arthaud', 'Poutou', 'Cheminade', 'Lassalle', 'Melenchon', 'Asselineau', 'Fillon', 'Blanc'];
  var possibleSelects = ['Macron', 'Fillon', 'Blanc'];
  
  if(possibleSelects.indexOf(selectValue) > -1) {
    $(" #login ").text('');
    $(" #login ").removeClass('alert alert-danger'); 
    $(" #form ").addClass('hide');
    $(" #welcome ").addClass('hide');
    $(" #login ").html('');
    $(" .spinner ").removeClass('hide');
    $.post( "/vote", { candidat: selectValue }, function (data) {
      
      $(" .spinner ").addClass('hide');
      $(" #login ").removeClass('hide').html(data+" Redirection...");
      setTimeout(function(){
        $(" img ").addClass('grey');
        $(" #form ").removeClass('hide');
        $(" #welcome ").removeClass('hide');
        $(" #login ").html("Merci d'avoir voté !");
        $(" #submit ").addClass("hide");
      }, 2000);
    });
  }
  else {
    $(" #login ").text('Veuillez compléter le formulaire.');
    $(" #login ").addClass('alert alert-danger'); 
  }
}

function authorInfo() {
  $.dialog({
    title: 'About me',
    theme: 'supervan',
    content: "J'ai réalisé cette application pendant mon année de Master 1 à ESCP Europe, pour l'assocation Tribunes ESCP.<br>Cette application utilise uniquement du HTML, CSS, Javascript et Node.JS .<br>Pour me contacter, vous pouvez m'envoyer un e-mail à l'adresse suivante : <a>leo.roux@edu.escpeurope.eu</a> .",
  });
}


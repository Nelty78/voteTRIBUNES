/* global $ */


$( document ).ready(function() {

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
    
    $.get('api/connected', function(data) { 
      if(data.connected) {
        $(" #login ").removeClass('alert alert-danger');
        $(" #welcome ").addClass('hide');
        $(" #form ").removeClass('hide');
        $(" #login ").html('Bienvenue aux Élections Présidentielles Scépiennes !<br> Choisissez votre candidat ci-dessous. Le vote est complètement <strong>anonyme</strong>.');
        $(" .logout ").removeClass('hide');
        $(" .logout ").html('<a href="/logout"">Déconnexion <i class="fa fa-sign-out fa-lg" aria-hidden="true"></i></a>');
      }
      else {
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
});

function submite() {
  var selectValue = $('select option:selected').val();
  var possibleSelects = ['Dupont', 'Pen', 'Macron', 'Hamon', 'Arthaud', 'Poutou', 'Cheminade', 'Lassalle', 'Melenchon', 'Asselineau', 'Fillon', 'Blanc'];
  
  if(possibleSelects.indexOf(selectValue) > -1) {
    $(" #login ").text('');
    $(" #login ").removeClass('alert alert-danger'); 
    $(" #form ").addClass('hide');
    $(" #welcome ").addClass('hide');
    $(" #login ").html('');
    $(" .spinner ").removeClass('hide');
    $.post( "/vote", { candidat: selectValue }, function (data) {
      $(" .spinner ").addClass('hide');
      $(" #login ").removeClass('hide').html(data);
    });
  }
  else {
    $(" #login ").text('Veuillez compléter le formulaire.');
    $(" #login ").addClass('alert alert-danger'); 
  }
}


/* global $ */
/* global io */

$( document ).ready(function() {
 
 $.blockUI({message: "Chargement..."});
 
 function socketMessages() {
    var vote = io.connect('https://tribunes.herokuapp.com/vote');
    vote.on('new vote', function (data) {
        getVotes();
        getStats();
        console.log(data);
  });
  
    vote.on('connection', function (socket) {
        socket.emit('connected', 'yup');
        console.log('sent');
    });
    
    vote.on('connected', function (message) {
        console.log(message);
    })
 }
 
 socketMessages();
 
 function barWidth(ratio) {
     return (ratio*800).toFixed(0);
 }
 
 
 function per(ratio) {
     return (ratio*100).toFixed(2);
 }
 
 function deleteVote() {
    var emailAddress = this.getAttribute("data-usage");
    $.confirm({
        columnClass: 'large',
        type: 'red',
        icon: 'fa fa-warning',
        title: 'Attention !',
        content: 'Êtes-vous sûr de vouloir supprimer le vote de '+emailAddress+' ?',
        buttons: {
            Supprimer: {
                btnClass: 'btn-danger',
                action: function () { deleteVoteConfirmed(emailAddress); } 
            },
            Annuler: function () {
            },
        }
    });
 }
 
 function deleteVoteConfirmed(emailAddress) {
    $.blockUI({message: "Suppression..."});
    $.post( "/admin/deleteVote", { email: emailAddress }, function (data) {
        if(data.n > 0) { // Something was deleted in the db!
            getVotes();
        }
        else {
            alert('Bug, préviens Léo');
            getVotes();
        }
    });
 }
 
 function getStats() {
     $.get('admin/getVotes', function(data) { 
         
          var total = data.total;
          if(total < 5) {
              $(" .candidates ").addClass('hide');
              $(" .message ").removeClass('hide');
          }
          else {
              $(" .candidates ").removeClass('hide');
              $(" .message ").addClass('hide');              
          }
          
          $(" #nbtotal ").text(total);
          $(" #nbblanc ").text(data.Blanc);
          
          //var p1 = data.Dupont/total, p2 = data.Pen/total;
          var p3 = data.Macron/total;
          //var p4 = data.Hamon/total,
          //p5 = data.Arthaud/total, p6 = data.Poutou/total, p7 = data.Cheminade/total, p8 = data.Lassalle/total,
          //p9 = data.Melenchon/total, p10 = data.Asselineau/total;
          var p11 = data.Fillon/total, p12 = data.Blanc/total;
          
          //$(" #p1 ").text(per(p1));
          //$(" #b1 ").css('width', barWidth(p1));
          
          //$(" #p2 ").text(per(p2));
          //$(" #b2 ").css('width', barWidth(p2));
          
          $(" #p3 ").text(per(p3));
          $(" #b3 ").css('width', barWidth(p3));
          
          //$(" #p4 ").text(per(p4));
          //$(" #b4 ").css('width', barWidth(p4));
          
          //$(" #p5 ").text(per(p5));
          //$(" #b5 ").css('width', barWidth(p5));
          
          //$(" #p6 ").text(per(p6));
          //$(" #b6 ").css('width', barWidth(p6));
          
          //$(" #p7 ").text(per(p7));
          //$(" #b7 ").css('width', barWidth(p7));
          
          //$(" #p8 ").text(per(p8));
          //$(" #b8 ").css('width', barWidth(p8));
          
          //$(" #p9 ").text(per(p9));
          //$(" #b9 ").css('width', barWidth(p9));
          
          //$(" #p10 ").text(per(p10));
          //$(" #b10 ").css('width', barWidth(p10));
          
          $(" #p11 ").text(per(p11));
          $(" #b11 ").css('width', barWidth(p11));
          
          $(" #p12 ").text(per(p12));
          $(" #b12 ").css('width', barWidth(p12));
        
     });
}

function getTime() {
    $.get('api/getStartEnd', function(data) {
    
        var start = new Date(data.start);
        var end = new Date(data.end);
    
        var startHours = start.getHours();
        var startMinutes = start.getMinutes();
        var endHours = end.getHours();
        var endMinutes = end.getMinutes();
                
        // # ADJUST TO DAYLIGHT SAVING TIME...
        var startHour = (startHours < 10 ? '0' : '') + (startHours+1); // adjust +1 according to server time 
        var endHour = (endHours < 10 ? '0' : '') + (endHours+1); // adjust +1 according to server time 
        
        var startMinute = (startMinutes < 10 ? '0' : '') + startMinutes;
        var endMinute = (endMinutes < 10 ? '0' : '') + endMinutes;
            
        var startTime = startHour+'h'+startMinute;
        var endTime = endHour+'h'+endMinute;
        
        var debut = ('0' + start.getDate()).slice(-2) + '/'
                 + ('0' + (start.getMonth()+1)).slice(-2)+' '+startTime;
        var cloture = ('0' + end.getDate()).slice(-2) + '/'
                 + ('0' + (end.getMonth()+1)).slice(-2)+' '+endTime;
        
        var now = new Date();
        var nowHours = now.getHours();
        var nowMinutes = now.getMinutes();
        var nowHour = (nowHours < 10 ? '0' : '') + nowHours; // adjust +1 according to server time
        var nowMinute = (nowMinutes < 10 ? '0' : '') + nowMinutes;
        var nowTime = nowHour+'h'+nowMinute;
        
        var nowDate = ('0' + now.getDate()).slice(-2) + '/'
                 + ('0' + (now.getMonth()+1)).slice(-2) + ' ' + nowTime;
        var restant = (end-now)/1000;
        
    
        // calculate (and subtract) whole days
        var daysRestant = ('0' + Math.floor(restant / 86400).toString()).slice(-2);
        restant -= daysRestant * 86400;
    
        // calculate (and subtract) whole hours
        var hoursRestant = ('0' + (Math.floor(restant / 3600) % 24).toString()).slice(-2);
        restant -= hoursRestant * 3600;
        
        // calculate (and subtract) whole minutes
        var minutesRestant = ('0' + (Math.floor(restant / 60) % 60).toString()).slice(-2);
        restant -= minutesRestant * 60;
        
        daysRestant = daysRestant+'j';
        hoursRestant = hoursRestant+'h';
        minutesRestant = minutesRestant+'mn';
        
        if(daysRestant == "00j") daysRestant = "";
        if(hoursRestant == "00h") hoursRestant = "";
    
        restant = daysRestant + hoursRestant + minutesRestant;
        
        if((now-start) < 0) restant = 'vote pas commencé. ';
        if((end-now) < 0) restant = 'vote terminé. ';
        
        $(" #debut ").text(debut);
        $(" #cloture ").text(cloture);
        $(" #now ").text(nowDate);
        $(" #restant ").text(restant);
    });
}
function getVotes() {
    $.get('admin/getListVotes', function(data) { 
    
        
        var html = '<table class="responstable display" id="dataTable"><thead><tr><th data-th="Votant"><span>Adresse e-mail</span></th><th>Date</th><th>Heure</th><th>Supprimer</th></tr></thead><tfoot><tr><th data-th="Votant"><span>Adresse e-mail</span></th><th>Date</th><th>Heure</th><th>Supprimer</th></tr></tfoot><tbody>';
        
        for(var i = 0; i < data.length; i++) {
            
            var time = new Date(data[i].time);
            
            var hours = time.getHours();
            var minutes = time.getMinutes();
                
            // # ADJUST TO DAYLIGHT SAVING TIME...    
            var hour = (hours < 9 ? '0' : '') + (hours+1); // adjust +1 according to server time 
            var minute = (minutes < 10 ? '0' : '') + minutes;
            
            var dateTab = ('0' + time.getDate()).slice(-2) + '/'
                 + ('0' + (time.getMonth()+1)).slice(-2);
            time = hour+'h'+minute;
            html += '<tr><td>'+data[i].email+'</td><td>'+dateTab+'</td><td>'+time+'</td><td class="delete"><span id="'+i+'" href="#" data-usage="'+data[i].email+'"><i class="fa fa-times" aria-hidden="true"></i></span></td></tr>';
        }
        
        html += '</tbody></table>';
        
        $(" #table ").html(html);
        
        $(' span[data-usage] ').each(function(i, obj) {
            $(" span#"+i+" ").on( "click", deleteVote);
        });
        
        
        $('#dataTable').DataTable({
        dom: 'Blftipr',
        "bSort": false,
        buttons: [
            'excel', 'csv', 'pdf'
        ],
        "language": {
        "sProcessing":     "Traitement en cours...",
        "sSearch":         "Rechercher&nbsp;:",
        "sLengthMenu":     "Afficher _MENU_ &eacute;l&eacute;ments",
        "sInfo":           "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        "sInfoEmpty":      "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
        "sInfoFiltered":   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        "sInfoPostFix":    "",
        "sLoadingRecords": "Chargement en cours...",
        "sZeroRecords":    "Aucun &eacute;l&eacute;ment &agrave; afficher",
        "sEmptyTable":     "Aucune donn&eacute;e disponible dans le tableau",
        "oPaginate": {
            "sFirst":      "Premier",
            "sPrevious":   "Pr&eacute;c&eacute;dent",
            "sNext":       "Suivant",
            "sLast":       "Dernier"
        },
        "oAria": {
            "sSortAscending":  ": activer pour trier la colonne par ordre croissant",
            "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
        }
    }
    });
    
    $.unblockUI();
    
    setTimeout(function() { getTime();}, 60000);
    });
}

getStats();
getTime();
getVotes();

});
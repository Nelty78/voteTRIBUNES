'use strict';

function voteHandler (db, passport, io) {

    var clicks = db.collection('votes');
    var startEnd = db.collection('startEnd');
    
    var sockets = [];

    io.of('/vote').on('connection', function(socket) {
        socket.emit('connected', 'You are connected!');
        sockets.push(socket);
        
        socket.on('disconnect', function() {
            var k = sockets.indexOf(socket);
            sockets.splice(k, 1);
        });
    });
    
    this.getStartEnd = function (req, res) {
        startEnd.findOne(function (err, doc) {
            if(err) throw err;
            doc.now = new Date();
            res.send(doc);
        });
    }
    
    this.getVotes = function (req, res) {
        
       clicks.find({}, { 'value': 1 }).toArray(function (err, data) {
          if(err) throw err;
          else {
              var counts = {'total':0,'Blanc':0,'Dupont':0,'Pen':0,'Macron':0,'Hamon':0,'Arthaud':0,'Poutou':0,'Cheminade':0,
                  'Lassalle':0,'Melenchon':0,'Asselineau':0,'Fillon':0};
              for(var i = 0; i < data.length; i++) {
                  counts[data[i].value]++;
                  counts.total++;
              }
              res.send(counts);
          }
       }); 
    }
    
    this.deleteVote = function(req, res) {
        clicks.remove( { 'email': req.body.email }, function(err, data) {
            if(err) console.log(err);
            
            var count = {n: data.result.n};
            
            res.send(count);
        });
    }
    
    this.getListVotes = function (req, res) {
       clicks.find({}, {'email': 1, 'time': 1, 'value': 1}).sort( { _id: -1 } ).toArray(function (err, data) {
          if (err) {
             throw err;
          }
          res.send(data);
       });
    }
    
    this.newVote = function (req, res) {
    
      var voteProjection = { 'email': 1, 'value': 1, 'time': 1 };
    
      clicks.findOne({'email': req.user.email }, voteProjection, function (err, result) {
         if (err) {
            throw err;
         }
    
         if (result) {
             var vote = result.value;
             switch(vote) {
                          case 'Dupont':
                              vote = "pour M. Nicolas DUPONT-AIGNAN";
                              break;
                          case 'Pen':
                              vote = "pour Mme Marine LE PEN";
                              break;
                          case 'Macron':
                              vote = "pour M. Emmanuel MACRON";
                              break;
                          case 'Hamon':
                              vote = "pour M. Benoît HAMON";
                              break;
                          case 'Arthaud':
                              vote = "pour Mme Nathalie ARTHAUD";
                              break;
                          case 'Poutou':
                              vote = "pour M. Philippe POUTOU";
                              break;
                          case 'Cheminade':
                              vote = "pour M. Jacques CHEMINADE";
                              break;
                          case 'Lassalle':
                              vote = "pour M. Jean LASSALLE";
                              break;
                          case 'Melenchon':
                              vote = "pour M. Jean-Luc MÉLENCHON";
                              break;
                          case 'Asselineau':
                              vote = "pour M. François ASSELINEAU";
                              break; 
                          case 'Fillon':
                              vote = "pour M. François FILLON";
                              break;
                          case 'Blanc':
                              vote = "blanc";
                              break;
                          default:
                              vote = "[ Vote invalide ]";
                              break;
                      }
            res.send('Tu as déjà voté '+vote+' !');
         } else {
            var date = new Date();
            
            // Let's check the POST data
            var selectValue = req.body.candidat;
            var possibleSelects = ['Dupont', 'Pen', 'Macron', 'Hamon', 'Arthaud', 'Poutou', 'Cheminade', 'Lassalle', 'Melenchon', 'Asselineau', 'Fillon', 'Blanc'];
            
            if(possibleSelects.indexOf(selectValue) === -1) {
             res.send('Petit malin.');   
            }
            else {
                clicks.insert({ 'email': req.user.email, 'value': selectValue, 'time': date}, function (err) {
                   if (err) {
                      throw err;
                   }
                   
        
                   clicks.findOne({'email': req.user.email}, voteProjection, function (err, doc) {
                      if (err) {
                         throw err;
                      }
                     
                      var vote = doc.value;
                      switch(vote) {
                          case 'Dupont':
                              vote = " pour M. Nicolas DUPONT-AIGNAN.";
                              break;
                          case 'Pen':
                              vote = " pour Mme Marine LE PEN.";
                              break;
                          case 'Macron':
                              vote = " pour M. Emmanuel MACRON.";
                              break;
                          case 'Hamon':
                              vote = " pour M. Benoît HAMON.";
                              break;
                          case 'Arthaud':
                              vote = " pour Mme Nathalie ARTHAUD.";
                              break;
                          case 'Poutou':
                              vote = " pour M. Philippe POUTOU.";
                              break;
                          case 'Cheminade':
                              vote = " pour M. Jacques CHEMINADE.";
                              break;
                          case 'Lassalle':
                              vote = " M. Jean LASSALLE.";
                              break;
                          case 'Melenchon':
                              vote = " M. Jean-Luc MÉLENCHON.";
                              break;
                          case 'Asselineau':
                              vote = " M. François ASSELINEAU.";
                              break; 
                          case 'Fillon':
                              vote = " M. François FILLON.";
                              break;
                          case 'Blanc':
                              vote = ".";
                              break;
                          default:
                              vote = "[ Vote invalide ]";
                              break;
                      }
                        
                      console.log('new vote registered'); 
                      
                      /* SOCKET.IO */ 
                      for(var i = 0; i < sockets.length; i++) {
                          sockets[i].emit('new vote','new vote, refreshing...');
                      }
                      /* SOCKET.IO */
                    
                      res.send("Merci d'avoir voté"+vote+"");
                   });
                });
            }
         }
      });
    };
}

module.exports = voteHandler;
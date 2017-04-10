'use strict';

var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
var UserHandler = require(process.cwd() + '/app/controllers/userHandler.server.js');

module.exports = function (app, db, passport, io) {

    var user = new UserHandler();
    var voteHandler = new VoteHandler(db, passport, io);

    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });

    app.route('/admin')
        .get(user.admin, function (req, res) {
            res.sendFile(process.cwd() + '/public/admin.html');
        });        
     
    app.route('/admin/getVotes')
        .get(user.admin, voteHandler.getVotes);
        
    app.route('/admin/getListVotes')
        .get(user.admin, voteHandler.getListVotes);

    app.route('/admin/deleteVote')
        .post(user.admin, voteHandler.deleteVote);
    app.route('/vote')
        .post(user.connected, voteHandler.newVote); // Only grant access if he is connected
    
    app.route('/api/getStartEnd')
        .get(voteHandler.getStartEnd);

    app.route('/api/connected')
        .get(user.isconnected);
        
    app.route('/api/isAdmin')
        .get(user.isAdmin);
    
    app.route('/api/getTotalCount')
        .get(user.connected, voteHandler.getTotalCount);
    
    app.route('/auth/google')   
        .get(passport.authenticate('google', { scope: ['email profile'] }));
        
    app.route('/auth/google/callback')
        .get(passport.authenticate('google', { failureRedirect: '/' }),
            function(req, res) {
                res.redirect('/');
            });
    app.route('/logout')
        .get(function(req, res){
            req.logout();
            res.redirect('/');
});    

};
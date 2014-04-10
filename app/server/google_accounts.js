Meteor.methods({
  'googleDriveFiles': function(){
    var url = "https://www.googleapis.com/drive/v2/files";
    var auth = "Bearer " + Meteor.user().services.google.accessToken;
    var clientId = Accounts.loginServiceConfiguration.findOne({service: 'google'}).clientId;
    
    return Meteor.http.get(url, {
      params: {key: clientId, maxResults: 10},
      headers: {'Authorization': auth }
    });
    
    
    // , function(err, result){
      // console.log("ERR:",err);
      // if(!err){
        // var data = JSON.parse(result.content);
        // console.log(data.items);
        // Session.set("google_drive_items", data.items);
      // }else{
        // Meteor.call('refresh_token', clientId, auth, console.log);
      // }
    // });

  },
  'googleRefreshToken': function(){
    var cfg = Accounts.loginServiceConfiguration.findOne({service:'google'});

    var refreshToken = Meteor.user().services.google.refreshToken;
    var result = Meteor.http.post("https://accounts.google.com/o/oauth2/token", {params: {
      client_id: cfg.clientId,
      client_secret: cfg.secret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }});


    var newAccessToken = result.data.access_token;
    var expiresIn = result.data.expires_in;


    Meteor.users.update({_id: Meteor.userId()}, {$set:
      {
        'services.google.accessToken': newAccessToken,
        'expiresAt': (+new Date()) + (1000 * expiresIn)
      }
    });

    console.log(result);
    return result;

  }

});

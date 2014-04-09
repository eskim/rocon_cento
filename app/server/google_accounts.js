Meteor.methods({
  'google_drive_files': function(){
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
  'refresh_token': function(clientId, token){
    Meteor.http.post("https://accounts.google.com/o/oauth2/token", {params: {
      client_id: clientId,
      client_secret: 'TKUUQQgUAgAdVySNxzk_r95b',
      refresh_token: token,
      grant_type: 'refresh_token'
    }}, function(e, res){
      console.log('xxxxxxxxxxxxxx');
      console.error(e); console.log(res);
    })

  }

});



Router.configure({
  layoutTemplate: 'layout'
});


Router.map(function(){
  this.route('home', {
    path: '/',
    template: 'home'
  });


  this.route('login', {
    path: '/login',
  });

  this.route('users', {
    path: '/users',
  });

  this.route('ideation', {
    path: '/ideation',
    template: 'ideation',
    before: function(){
      console.log("BEFORE");
      Session.set('filesToAttach', []);
    },
    data: function(){
      console.log(this.params);
      var categoryId = this.params.category;
    
      var data = {};
      var query = {};
      if(categoryId && categoryId != "")
        query['category'] = categoryId;

      data['posts'] = Cento.Posts.find(query, {'sort': {'created': -1},
        transform: function(doc){
          doc.user = Meteor.users.findOne(doc.user_id);
          return doc;

       }});

      if(categoryId){
        data['currentCategory'] = Cento.Categories.findOne(categoryId);
        return data;
        }
      return data;
    }
    });

  this.route('modeling', {
    path: '/modeling',
    template: 'modeling',
    data: function(){
      console.log('DATA');
      var data = {};
      var id = Session.get('selectedModelId');
      data['selectedModel'] = Cento.Posts.findOne({_id: id});
      // data.items = Session.get('model_items');

      data.files = Cento.Posts.find({type: 'modeling'});
      data.google_drive_files = Session.get('google_drive_files');
      data.iframe_src = Session.get('iframe_src');

      return data;
    },
    before: function(){
      console.log("BEFORE!!!!!!!!!!");
      // Session.set('model_items', []);
      // console.log("fetching google drive files");

      // Meteor.call('google_drive_files', function(err, result){

        // console.log("ERR:",err);
        // if(!err){
          // var data = JSON.parse(result.content);
          // console.log(data.items);
          // // Session.set("model_items", data.items);
        // }else{
        // }

      // });
    }
  });

  this.route('battle_loom', {
    path: '/battle_loom',
    template: 'battle_loom'
  });

  this.route('management', {
    path: '/management',
    template: 'management'
  });

  this.route('solution', {
    path: '/solution',
    template: 'solution'
  });

  this.route('google_drive', {
    path: '/google_drive',
    template: 'google_drive'
  });
  this.route('manage', {
    path: '/manage',
    template: 'manage'
  });

});

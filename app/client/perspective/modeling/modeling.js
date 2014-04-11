Template.modeling.preserve({
  'iframe[src]': function(node){ return node.src; }
});

Template.modeling.helpers({
  'isGoogleDriveFileSelected': function(){
    var mid = Session.get('selectedModelId');
    var m = Cento.Posts.findOne({_id: mid});
    return (!m || m.type === 'google_drive');
  },

  'isLocalFileSelected': function(){
    var mid = Session.get('selectedModelId');
    var m = Cento.Posts.findOne({_id: mid});
    return (m && m.type === 'modeling');
  },

});

Template.modeling.events({
  'click form[name=modeling_upload] button': function(e, t){
    var f = $(e.target).closest('form');
    var file = f.find('input[type=file]')[0].files[0];
    var txt = f.find('input[type=text]').val();


    f.find('input[type=file]').val('');
    f.find('input[type=text]').val('');

    Meteor.saveFile(file);


    var model = {title: txt, type: 'modeling', file_name: file.name};
    Cento.Posts.insert(model);
    return false;

    
  },
  'click #files a': function(e){
    console.log('CLICK', e.target);
    var a = $(e.target)[0];
    var li = $(e.target).closest('li');

    if(li.data('id')){
      Session.set('selectedModelId', li.data('id'));
    }else{
      Session.set('selectedModelId', null);
    }
    Session.set('iframe_src', a.href);

    
    return false;
  },

  'click .btn.comment': function(e, t){
    var f = $(e.target).closest('form');
    var id = f.data('post_id');
    var txt = f.find('textarea').val();


    if(!Session.get('selectedModel')){ // google docs
      Cento.Posts.insert({_id: id, type: 'google_drive'});

    }
    Cento.Posts.update({_id: id},{$push: {comments:{body: txt, 'created':new Date(), user_id: Meteor.userId()}}});
    f.find('textarea').val('');
    console.log('zzzz');
    return false;
  }

  // 'click #google_drive_items a': function(e){
    // var embedLink = $(e.target).data('embed_link');
    // $('iframe#embed_frame').attr('src', embedLink);
    // console.log('zzzzzzzzzzzz');
    // console.log(li.data('id'));
  // }
});

if(!Session.get('google_drive_files')){
  console.log('fetch google drive files');
  Meteor.call('googleDriveFiles', function(err, result){

    console.log("ERR:",err);
    if(!err){
      var data = JSON.parse(result.content);
      console.log(data.items);
      Session.set("google_drive_files", data.items);
    }else{
    }

  });
}

Template.modeling.rendered = function(){
  console.log('modeling rendered');
  // reorder
  var ul = $('#files');
  var items = ul.find('li');

  items.sort(function(a, b){
    var x = $(a).text().trim().toLowerCase();
    var y = $(b).text().trim().toLowerCase();
    var re = x > y ? 1 : -1;
    return re;
  });

  items.each(function(i, e){ ul.append(e); });



};

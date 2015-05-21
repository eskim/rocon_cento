Meteor.startup(function(){
  $(function(){
    console.log('jquery ready');

  });
  

});
Template.user_needs.helpers({

  'filesToAttach': function(){
    Session.setDefault('filesToAttach', []);
    return Session.get('filesToAttach');
  },


  'users': function(){
    return Meteor.users.find({'services.github': {$exists: true}}).fetch();
    // return Meteor.users.find({});
  },
  'new_replys': function(login){
    return Cento.WorkItems.find({type: Cento.WorkItemTypes.USER_NEEDS, 'comments.body': new RegExp("@"+login), deleted_at: {$exists: false}}).fetch();
  }
});

Template.user_needs_form_modal.events({
  'click .btn.post': function(e){
    var f = $(e.target).closest('form');

    var title = f.find('input[name=title]').val();
    var txt = f.find('textarea').val();
    var files = Session.get('filesToAttach');
    var attachments = _.map(files, function(f){
      return _.pick(f, 'name', 'size', 'type');
    });
    var tags = f.find('.tag').toArray().map(function(e){ return e.value; });
    tags = _.compact(tags);
    
    try{
      Cento.WorkItems.insert({
        type: Cento.WorkItemTypes.USER_NEEDS,
        // work_group_id: this.currentWorkGroup._id,
        user_id: Meteor.userId(),
        title: title,
        body: txt,
        created:new Date(),
        votes: 0,
        tags: tags,
        attachments: attachments
      });

      if(files && files.length > 0){
        Meteor.saveFile(files[0], console.log);
      }
      f[0].reset();
      $('.modal.user_needs_form').modal('hide');
      alertify.success('Successfully created.');
    }catch(e){
      console.error(e.message);
      console.trace(e);
    }
    return false;
  },
});

Template.user_needs.rendered = function(){
  new Cento.DragAndDrop();

  $('.modal .add_group').click(function(){
    var $s = $(this).closest('form').find('select');
    var title = $(this).closest('form').find('input[name=group_title]').val();

    $s.append('<option>'+title+'</option>');
    $(this).closest('form').find('input[name=group_title]').val('');
    return false;
  });
};

Template.user_needs.events({
  'click .new_needs': function(e){
    $('.modal.user_needs_form').modal();
    return false;
  },
  'click .delete': function(e){
    var id = this._id;
    Cento.deleteWorkItem(id);
    return false;
  },
  'click .show': function(e){
    var id = this._id;
    $('#modal-show-'+id).modal();
    // var m = $(e.target).closest('tr').find('.modal_show');
    
    // // $('#modal-'+id).modal();
    // m.modal();
    return false;
  },
  'blur .body': function(e){
    var $e = $(e.target);
    Cento.WorkItems.update({_id:this._id}, {$set:{body: $e.html()}});

  },

  'click .delete_post': function(){
    Cento.WorkItems.remove({_id: this._id});
  },
  'click .create_task': function(e){
    console.log('xxx');
    var ideation_id = this._id;
    // $('#modal-'+ideation_id).find('select').select2().on('change', function(e){
      // $(this).data("selected", e.val.join());
    // });
      
    $('#modal-'+ideation_id).modal();

    return false;
  },

  'click .create_solution': function(e){
    var ideation = this;
    $('#modal-'+ideation._id).modal('show');
    // var f = $(e.target).closest('form');
    // var modal = $(e.target).closest('.modal');
    // var title = f.find('input[name=title]').val();
    // var description = f.find('textarea').val();

    // var sid = Cento.Solutions.insert({
      // solution_id: this.solution_id,
      // related: [
        // {
          // related_work_id: ideation._id,
          // type: 'reference'
        // }
      // ],
      // user_id: Meteor.userId(),
      // title: title,
      // description: description,
      // created:new Date()
    // });



    // f.find('select option').each(function(){
      // Cento.WorkGroups.insert({solution_id: sid, title: $(this).text()});

    // });

    // modal.modal('hide');
    return false;


  }


});

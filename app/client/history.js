Template.history.helpers({
  'getRelationHistory': function(workItem){

    var paths = [];
    if(!workItem){
      return paths;
    }


    console.log("WORK_ITEM:", workItem);
    var solution = Cento.Solutions.findOne({_id: workItem.solution_id});

    var relatedItems = function(item){
      paths.push(item);
      var relatedId = null;
      try {
        relatedId = _.detect(item.related, function(i){
          return i.type == 'reference';
        }).related_work_id;
      }catch(e){}
      if(relatedId){
        var i = Cento.WorkItems.findOne({_id: relatedId});
        if(i) relatedItems(i);
      }
    }

    relatedItems(workItem);


    paths.push(solution);
    if(solution.related && solution.related.length > 0){
      var userNeed = Cento.WorkItems.findOne({_id: solution.related[0].related_work_id});
      paths.push(userNeed);
    }


    return paths.reverse();

    

  }

});


Template.history.events({
  'click .show': function(){
    Session.set('currentIdeation', this._id);
    $('#modal-show-ideation').modal();
    return false;
  }
});

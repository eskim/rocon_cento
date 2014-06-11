Template.history.helpers({
  'getRelationHistory': function(workItem){

    var paths = [];
    if(!workItem){
      return paths;
    }


    console.log("WORK_ITEM:", workItem);

    if(workItem.type == 'modeling'){
      paths.push(workItem);


      var projectIdeation = Cento.WorkItems.findOne({_id: workItem.related[0].related_work_id});
      paths.push(projectIdeation);

      var solution = Cento.Solutions.findOne({_id: workItem.solution_id});
      paths.push(solution);


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

Template.nav.events({
	'click li > a.record': function (event) {
		event.preventDefault();
		module_id = $("#" + event.currentTarget.id.toString()).attr("module_id");
		module_name = Modules.findOne({_id: module_id}).slug;
		Meteor.Router.to("/" + module_name);
	},
	
	'keyup input#search': function (event) {
		Session.set("currentFilter", $('input#search').val());
		console.log(Session.get("currentFilter"));
	}
});

Template.modules.events({
	
	'submit form#save_module' : function (event) {
		console.log("clicked save module");
		if (Session.get("currentAction") === "new") {
			
			result = createRecord("Modules", Session.get("currentAction"), event);
				
			if (result) {
				Session.set("currentAction", false);
			};
				
		} else if (Session.get("currentAction") === "view" || Session.get("currentAction") === "edit") {
			
			result = createRecord(capitalize(Session.get("currentModule")), Session.get("currentAction"), event, Session.get("moduleId"));
			
			if (result) {
				var custId = Session.get("moduleId");
			};
			
		} else if (Session.get("currentAction") === "delete") {
			
			result = createRecord(capitalize(Session.get("currentModule")), Session.get("currentAction"), event, Session.get("moduleId"));
			
			if (result) {
				Session.set("currentAction", false);
				Session.set("moduleId", null);
			};
			
		}
	},
	
	'click a.subModule' : function(event) {
		var subModule = $("#" + event.currentTarget.id.toString()).attr("id");
		Session.set("currentAction", subModule);
	}
	
});

Template.modules_list.events({

	'click a.record': function (event, template) {
		module_id = $("#" + event.currentTarget.id.toString()).attr("module_id");
		console.log(Session.get("currentModule"));
		console.log(Session.get("moduleId"));
		Meteor.Router.to("/modules/" + module_id);
		Session.set("currentAction", "view");
		Session.set("tabs", "view");
  },
	
});
Template.leases.events({
	'click button#new_lease' : function(event) {
		event.preventDefault();
		Session.set("recordId", null);
		Meteor.Router.to("/leases/new/");
		Session.set("currentAction", "new");
	},
	
	'submit form#save_lease' : function (event) {
		
		if (Session.get("currentAction") === "new") {
			
			result = createRecord("Leases", Session.get("currentAction"), event);
				
			if (result) {
				Session.set("currentAction", false);
			};
				
		} else if (Session.get("currentAction") === "view" || Session.get("currentAction") === "edit") {
			
			result = createRecord(capitalize(Session.get("currentModule")), Session.get("currentAction"), event, Session.get("recordId"));
			
			if (result) {
				// Session.set("currentAction", "view");
				var custId = Session.get("recordId");
				// Session.set("customerId", null);
				// Meteor.Router.to("/leases/" + custId);
			};
		} else if (Session.get("currentAction") === "delete") {
			
			result = createRecord(capitalize(Session.get("currentModule")), Session.get("currentAction"), event, Session.get("recordId"));
			
			if (result) {
				Session.set("currentAction", false);
				Session.set("recordId", null);
			};
			
		}
	},
	
	'click a.subModule' : function(event) {
		var subModule = $("#" + event.currentTarget.id.toString()).attr("id");
		Session.set("currentAction", subModule);
	},
	
	'change input[type="checkbox"]': function (event, template) {
		task_id = $("#" + event.currentTarget.id).attr("id");
		checked = $("#" + event.currentTarget.id).attr('checked');
		if (checked === "checked") {
			Tasks.update({_id: task_id}, {$set: {complete: true, completed_at: new Date()}});
		} else {
			Tasks.update({_id: task_id}, {$set: {complete: false}});
		};
		
	}
});

Template.leases_list.events({

	'click tr.record': function (event, template) {
		lease_id = $("#" + event.currentTarget.id.toString()).attr("record_id");
		console.log(Session.get("currentModule"));
		console.log(Session.get("leaseId"));
		Meteor.Router.to("/leases/" + lease_id);
		Session.set("tabs", "view");
  },
	
	'click button.edit_lease': function (event, template) {
		customer_id = $("#" + event.currentTarget.id.toString()).attr("lease_id");
		Session.set("currentAction", "edit");
		console.log(Session.get("currentAction"));
    Session.set("leaseId", customer_id);
  },
	
	'click button.delete_lease': function (event, template) {
		customer_id = $("#" + event.currentTarget.id.toString()).attr("lease_id");
		Session.set("currentAction", "delete");
		console.log(Session.get("currentAction"));
		Session.set("leaseId", customer_id);
	}
	
});
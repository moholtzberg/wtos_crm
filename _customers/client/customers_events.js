Template.customers.events({
	'click button#toggleView' : function(event) {
		console.log("Clicked Toggle");
		event.preventDefault();
		if (Session.get("mapView") === false) {
			Session.set("mapView", true);
		} else {
			Session.set("mapView", false);
		};
	},
	
	'click button#new_customer' : function(event) {
		console.log("Clicked New Customer");
		event.preventDefault();
		Session.set("customerId", null);
		Meteor.Router.to("/customers/new/");
		// Session.set("tabs", "new");
		Session.set("currentAction", "new");
	},
	
	'submit form#save_customer' : function (event) {
		console.log("clicked save customer");
		if (Session.get("currentAction") === "new") {
			
			result = createRecord("Customers", Session.get("currentAction"), event);
				
			if (result) {
				Session.set("currentAction", false);
			};
				
		} else if (Session.get("currentAction") === "view") {
			
			result = createRecord(capitalize(Session.get("currentModule")), Session.get("currentAction"), event, Session.get("recordId"));
			
			if (result) {
				// Session.set("currentAction", false);
				// var custId = Session.get("recordId");
				// Session.set("recordId", null);
				// Meteor.Router.to("/customers/" + custId);
			};
		} else if (Session.get("currentAction") === "delete") {
			
			result = createRecord(capitalize(Session.get("currentModule")), Session.get("currentAction"), event, Session.get("recordId"));
			
			if (result) {
				Session.set("currentAction", false);
				Session.set("recordId", null);
				Meteor.Router.to("/customers/");
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

Template.customers_list.events({
	'click button#new_customer': function(event) {
		event.preventDefault();
		Session.set("currentAction", "new");
		console.log(Session.get("currentAction"));
	},
	
	'click a.page': function(event) {
		event.preventDefault();
		Session.set("page", event.currentTarget.id);
	},
	
	'click tr.record': function(event, template) {
		customer_id = $("#" + event.currentTarget.id.toString()).attr("record_id");
		Meteor.Router.to("/customers/" + customer_id);
		Session.set("currentAction", "view");
		// Session.set("tabs", "view");
  },
	
});
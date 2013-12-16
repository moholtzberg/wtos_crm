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
		event.preventDefault();
		Session.set("recordId", null);
		Meteor.Router.to("/customers/new/");
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
	
	'click a.page': function(event) {
		event.preventDefault();
		Session.set("page", event.currentTarget.id);
	},
	
	'click tr.record': function(event, template) {
		customer_id = $("#" + event.currentTarget.id.toString()).attr("record_id");
		Meteor.Router.to("/customers/" + customer_id);
		Session.set("currentAction", "view");
  }

});
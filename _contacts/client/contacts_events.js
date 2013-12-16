Template.contacts.events({
  'click button#new_contact' : function (event) {
		event.preventDefault();
		Meteor.Router.to("/contacts/new");
		Session.set("recordId", null);
	},
	
	'click tr.record': function(event, template) {
		customer_id = $("#" + event.currentTarget.id.toString()).attr("record_id");
		Meteor.Router.to("/contacts/" + customer_id);
		Session.set("currentAction", "view");
  },
	
	'click a.subModule' : function(event) {
		var subModule = $("#" + event.currentTarget.id.toString()).attr("id");
		Session.set("currentAction", subModule);
	},
	
	'click a.page': function(event) {
		event.preventDefault();
		Session.set("page", event.currentTarget.id);
	},

	'submit form#save_contact': function (event, template) {
		if (Session.get("currentAction") === "new") {
			
			result = createRecord("Contacts", Session.get("currentAction"), event);
				
			if (result) {
				Session.set("currentAction", false);
			};
				
		} else if (Session.get("currentAction") === "view" || Session.get("currentAction") === "edit") {
			
			result = createRecord(capitalize(Session.get("currentModule")), Session.get("currentAction"), event, Session.get("recordId"));
			
			if (result) {
				var custId = Session.get("recordId");
			};
		} else if (Session.get("currentAction") === "delete") {
			
			result = createRecord(capitalize(Session.get("currentModule")), Session.get("currentAction"), event, Session.get("recordId"));
			
			if (result) {
				Session.set("currentAction", false);
				Session.set("recordId", null);
			};
			
		}
  }

});
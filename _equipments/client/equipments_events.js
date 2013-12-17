Template.equipments.events({
	'click button#new_equipment' : function (event) {
		console.log("Clicked New Equipment");
		event.preventDefault();
		Session.set("equipmentId", null);
		Meteor.Router.to("/equipments/new/");
		Session.set("currentAction", "new");
	},
	
	'click button.view_equipment': function (event, template) {
		equipment_id = $("#" + event.currentTarget.id.toString()).attr("equipment_id");
		Session.set("currentAction", "view");
		console.log(Session.get("currentAction"));
		Session.set("equipmentId", equipment_id);
	},
	
	'click tr.record': function (event, template) {
		record_id = $("#" + event.currentTarget.id.toString()).attr("equipment_id");
		Meteor.Router.to("/equipments/" + record_id);
		Session.set("currentAction", "view");
	},
	
	'click a.subModule' : function(event) {
		var subModule = $("#" + event.currentTarget.id.toString()).attr("id");
		Session.set("currentAction", subModule);
	},
	
	'submit form#save_equipment' : function (event) {
		event.preventDefault();
		if (Session.get("currentAction") === "new") {
			
			result = createRecord("Equipments", Session.get("currentAction"), event);
				
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

Template.equipments_form.events({
	
	'change select#make_id, rendered select#make_id' :function (event) {
		event.preventDefault();
		Session.set("makeId", $('select#make_id').val());
	},
	
	'change select#customer_id, rendered select#customer_id' :function (event) {
		event.preventDefault();
		Session.set("leaseCustomerId", $('select#customer_id').val());
	},
	
	'click input.toggle, change input#is_prospect': function (event) {
		event.preventDefault();
		var val = Session.get("isProspect");
		if (val) {
			Session.set("isProspect", false);
		} else {
			Session.set("isProspect", true);
		}
	},
	
	'click input#tac' :function(event) {
		Session.set("searchResults", true);
	},
	
	'focus input#tac' :function(event) {
		Session.set("searchResults", true);
	},
	
	'blur input#tac' :function(event) {
		Session.set("searchResults", null);
	},
	
	'keyup input#tac': function (event) {
		if (event.which !== 13) {
			var input = $("input#tac").val();
			Session.set("searchResults", input);
		};
	}
	
});
Activity = function (doc) {
	_.extend(this, doc);
};

Activity.prototype = {
  constructor: Activity
};

Activities = new Meteor.Collection("activities", {
	transform: function (doc) {
		return new Activity(doc);
	}
});

Meteor.subscribe("Activities");

// Template.activities.helpers({
// 	
// 	actions: function () {
// 		return ["new", "edit", "view", "delete"];
// 	}
// 	
// });
// 
// Template.activities_list.record = function() {
// 	var qry = Session.get("currentFilter");
// 	if (qry) {
// 		searchQry = Search(qry, ["first_name", "last_name", "email", "phone"]);
// 		return Activities.find({$or: searchQry}, {sort: {first_name: 1, last_name: 1}});
// 	} else {
// 		return Activities.find({}, {sort: {first_name: 1, last_name:1}});
// 	};
// }
// 
// Template.activities_form.record = function() {
// 	return Activities.findOne({_id: Session.get("activityId")});
// }
// 
// Template.activities_form.customers = function() {
// 	return Customers.find().fetch();
// }
// 
// Template.activities_list.events({
//   'click button#new_activity' : function (event) {
// 		event.preventDefault();
// 		Session.set("currentAction", "new");
// 		Session.set("activityId", null);
// 		console.log("clicked" + new Date().toString());
// 	},
// 	
// 	'click button.view_activity': function (event, template) {
// 		activity_id = $("#" + event.currentTarget.id.toString()).attr("activity_id");
// 		Session.set("currentAction", "view");
//     Session.set("activityId", activity_id);
//   },
// 	
// 	'click button.edit_activity': function (event, template) {
// 		activity_id = $("#" + event.currentTarget.id.toString()).attr("activity_id");
// 		Session.set("currentAction", "edit");
// 		Session.set("activityId", activity_id);
//   },
// 	
// 	'click button.delete_activity': function (event, template) {
// 		activity_id = $("#" + event.currentTarget.id.toString()).attr("activity_id");
// 		Session.set("currentAction", "delete");
// 		Session.set("activityId", activity_id);
// 	}
// });
// 
// Template.crud.events({
// 	'click a#cancel, click button#close' : function(event) {
// 		event.preventDefault();
// 		Session.set("currentAction", false);
// 		Session.set("activityId", null);
// 	},
// 	
// 	'submit form#save_activity, click a#save_activity' : function (event) {
// 		
// 		if (event.type === 'click' || event.type === 'submit') {
// 			event.preventDefault();
// 			
// 			var customer_id		 					= $("#activity_customer_id").val();
// 			var first_name							= $("#activity_first_name").val();
// 			var last_name								= $("#activity_last_name").val();
// 			var email										= $("#activity_email").val();
// 			var phone										= $("#activity_phone").val();
// 		
// 			if (Session.get("currentAction") === "new") {
// 				
// 				if(Activities.insert(
// 					{user_id: Meteor.user()._id, customer_id: customer_id, first_name: first_name, last_name: last_name, email: email, phone: phone})) {
// 						
// 					$("#activity_customer_id").val(null);
// 					$("#activity_first_name").val(null);
// 					$("#activity_last_name").val(null);
// 					$("#activity_email").val(null);
// 					$("#activity_phone").val(null);
// 					Session.set("currentAction", false);
// 				};
// 				
// 			} else if (Session.get("currentAction") === "edit") {
// 				
// 				if (!Activities.update(Session.get("activityId"), 
// 					{$set: {user_id: Meteor.user()._id, customer_id: customer_id, first_name: first_name, last_name: last_name, email: email, phone: phone}})) {
// 						
// 					$("#activity_customer_id").val(null);
// 					$("#activity_first_name").val(null);
// 					$("#activity_last_name").val(null);
// 					$("#activity_email").val(null);
// 					$("#activity_phone").val(null);
// 					Session.set("currentAction", false);
// 					Session.set("activityId", null);
// 				};
// 				
// 			};
// 			
// 		};
// 	},
// 	
// 	'click a#edit_activity' : function (event) {
// 		event.preventDefault();
// 		Session.set("currentAction", "edit");
// 	},
// 	
// 	'click a#delete_activity, submit form#delete_activity' : function (event) {
// 		event.preventDefault();
// 		if (!Activities.remove(Session.get("activityId"))) {
// 			Session.set("currentAction", false);
// 			Session.set("customerId", null);
// 		};
// 	}
// 	
// });

createActivity = function (options) {
	options = options.hash || {}
	module = _.singularize(Session.get("currentModule"));
	record = Session.get(module + "Id");
	action = Session.get("currentAction");
	console.log(module, record, action, options);
// 	Activities.insert(
// 		{user_id: Meteor.user()._id, ,customer_id: customer_id, first_name: first_name, last_name: last_name, email: email, phone: phone}))
// }
}
Template.messages.events({
	
	'click tr.record': function(event, template) {
		record_id = $("#" + event.currentTarget.id.toString()).attr("record_id");
		Meteor.Router.to("/messages/" + record_id);
		Session.set("currentAction", "view");
	},
	
	'click a.page': function(event) {
		event.preventDefault();
		Session.set("page", event.currentTarget.id);
	},
	
	'click #save_message': function (event) {
		event.preventDefault();
		var email = $('#email_to').val();
		var subj = $('#subject').val();
		var body = $('#body').val();
		
		console.log(email);
		console.log(subj);
		console.log(body);
		
		Meteor.call("sendEmail", email, subj, body, body);
		Session.set("currentAction", "list");
		
	}
})
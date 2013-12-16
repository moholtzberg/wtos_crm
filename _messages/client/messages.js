Message = function (doc) {
  _.extend(this, doc);
};

Message.prototype = {
	constructor: Message,
	
	stage: function () {
		
		var obj = {};
		
		if (!this.sent) {
			obj.message = "Sending...";
			obj.label_class = "";
		
		} else if (this.sent) {
			
			if (this.delivered && this.delivered.status === true) {
				obj.message = "Delivered!";
				obj.label_class = "info";
				
				if (this.opened && this.opened.status === true) {
					obj.message = "Opened!";
					obj.label_class = "success";
					
				}	else if (this.spam) {
					obj.message = "Spam!";
					obj.label_class = "important";
					
				} else if (this.bounced) {
					obj.message = "Bounced!";
					obj.label_class = "warning";
				};
				
			} else if (this.bounced) {
				obj.message = "Bounced!";
				obj.label_class = "warning";
			} else {
				obj.message = "Failed!";
				obj.label_class = "inverse";
			}
		};
		return obj;	
	}
};

Messages = new Meteor.Collection("messages", {
	transform: function (doc) {
		return new Message(doc);
	}
});

Meteor.subscribe("Messages");

Template.messages_list.record = function() {
	return Messages.find().fetch();
};

Template.messages_create.contact = function () {
	console.log(Session.get("contactId"));
	return Contacts.findOne({_id: Session.get("contactId")});
}

Template.messages_create.template = function () {
	return Template.find('.template_text');
}

Template.messages_create.events({
	'click #close, click #cancel': function (event) {
		event.preventDefault();
		Session.set("currentAction", "list");
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

// Template.messages_stub.records = function () {
// 	module = Session.get("currentModule");
// 	record_id = Session.get(module + "Id");
// 	collection = capitalize(module);
// 	field_id = _.singularize(module) + "_id";
// 	collection = eval(collection);
// 	return collection.find({field_id: record_id});
// }

Template.messages_create.rendered = function () {
	console.log("Rendered");
	var email_txt = $('#email_tmp_text').remove();
	console.log(email_txt.html());
	$('#body').html(email_txt.html());
}

Template.welcome_email.to = function() {
	// console.log(contact_id);
	// var c = Contacts.findOne({_id: contact_id});
	// console.log(c);
	var contact = Contacts.findOne({_id: Session.get("contactId")});
	
	return contact;
}

Template.welcome_email.from = function() {
	return Meteor.user().profile;
}

Template.welcome_email.equipment = function(customer_id) {
	var customer = Customers.findOne(customer_id);
	return customer;
}
Messages = new Meteor.Collection("messages");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "messages"})) {
		Modules.insert({name: "Messages", slug: "messages", icon: "fa-envelope", admin_only: false, active: true});
	};
});

process.env.MAIL_URL = 'smtp://postmaster%40moholtzberg.mailgun.org:3nvcayl0a1p8@smtp.mailgun.org:587';
	
Meteor.startup(function () {
	
	if (Messages.find({}).count() === 0) {
		Messages.insert({
			user_id: "AeuELzksdfLNrx4XS",
			to: "info@worldtradecopiers.com", 
			from: "info@worldtradecopiers.com", 
			subject: "Test", 
			body: "Test", 
			html: "Test",
			sent_at: new Date()});
	};
	
});

Messages.allow({
	insert: function() {
		return true;
	},
	
	update: function() {
		return true;
	}
});

Meteor.publish("Messages", function () {
	var customerIds = Customers.find({user_id : this.userId}).map(function(customer) {
		return customer._id;
	});
	var contactIds = Contacts.find({customer_id: {$in: customerIds}}).map(function(customer) {
		return customer.email;
	});
  return Messages.find({to: {$in: contactIds}});
});

Meteor.methods({
	sendEmail: function (to, subject, text, html) {
		var from = Meteor.user().profile.name + "<" + Meteor.user().emails[0].address + ">";
		check([to, subject, text, html], [String]);
		
		this.unblock();
		
		var msg_id = Messages.insert({
			user_id: this.userId, 
			to: to, 
			from:  from, 
			subject: subject, 
			text: text, 
			html: html,
			sent_at: new Date(),
			sent: true,
			delivered: {
				status: false,
				time_stamp: null
			},
			opened: {
				status: false,
				time_stamp: null,
				ip_address: null,
				city: null,
				client_name: null,
				client_os: null,
				device_type: null
			}
			});
		
		console.log(msg_id);
		
		Email.send({ "headers": {"X-Mailgun-Variables": JSON.stringify({message_id: msg_id})}, "to": to, "from": from, "subject": subject, "text": text, "html": html});
	}
});
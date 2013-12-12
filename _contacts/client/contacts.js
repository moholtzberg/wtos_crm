Contact = function (doc) {
	_.extend(this, doc);
};

Contact.prototype = {
  constructor: Contact,
	
	recordName: function () {
		return "Foonmae";
	},
	
	customer: function () {
		return Customers.findOne({_id: this.customer_id});
	},
	
	messages: function () {
		console.log(this.email);
		return Messages.find({to: this.email}).fetch();
	},
	
  fullName: function () {
		return this.first_name + " " + this.last_name;
  },
	
	neverContacted: function () {
		if (!Messages.findOne({email: this.email})) {
			return true;
		} else {
			return false;
		};
	}
	
};

Contacts = new Meteor.Collection("contacts", {
	transform: function (doc) {
		return new Contact(doc);
	}
});

Meteor.subscribe("Contacts");

Template.contacts_list.helpers({
	
	record: function() {
		return Contacts.find();
	}
	
});

Template.contacts_view.helpers({
	
	record: function() {
		return Contacts.findOne({_id: Session.get("recordId")});
	}
	
});

Template.contacts_form.helpers({
	
	record: function () {
		return Contacts.findOne({_id: Session.get("recordId")});
	},
	
	customers: function() {
		return Customers.find();
	}
	
});
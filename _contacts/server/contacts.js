Contacts = new Meteor.Collection("contacts");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "contacts"})) {
		Modules.insert({name: "Contacts", slug: "contacts", icon: "fa-user", admin_only: false, active: true});
	};
});

Meteor.publish("Contacts", function () {
	user = Meteor.users.findOne({_id: this.userId});
	if (user.is_admin || user.profile.is_admin) {
		return Contacts.find({}, {sort: {last_name: 1}});
	} else {
		var customerIds = Customers.find({user_id : this.userId}).map(function(customer) {
			return customer._id;
		});
		return Contacts.find({customer_id: {$in: customerIds}});
	};
});

Contacts.allow({
	insert: function (userId, doc) {
		// return userId === doc.user_id || Meteor.users.findOne({_id: userId}).is_admin;
		return true;
	},
	update: function (userId, doc) {
		// return userId === doc.user_id || Meteor.users.findOne({_id: userId}).is_admin;
		return true;
	},
	remove: function (userId, doc) {
		return userId === doc.user_id || Meteor.users.findOne({_id: userId}).is_admin;
	}
});
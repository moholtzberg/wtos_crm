Orders = new Meteor.Collection("orders");

Meteor.publish("Orders", function () {
	var customerIds = Customers.find({user_id : this.userId}).map(function(customer) {
		return customer._id;
	});
	
	return Orders.find({customer_id: {$in: customerIds}});
});

Orders.allow({
	insert: function (userId, doc) {
		return userId === doc.user_id || Meteor.users.findOne({_id: userId}).is_admin;
	},
	update: function (userId, doc) {
		return userId === doc.user_id || Meteor.users.findOne({_id: userId}).is_admin;
	}, 
	remove: function (userId, doc) {
		return userId === doc.user_id || Meteor.users.findOne({_id: userId}).is_admin;
	}
});
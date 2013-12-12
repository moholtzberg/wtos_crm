OrderLineItems = new Meteor.Collection("order_line_items");

Meteor.publish("OrderLineItems", function () {
  return OrderLineItems.find({});
});

OrderLineItems.allow({
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
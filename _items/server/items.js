Items = new Meteor.Collection("items");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "items"})) {
		Modules.insert({name: "Items", slug: "items", icon: "fa-shopping-cart", admin_only: "false", active: "false"});
	};
});

Meteor.publish("Items", function () {
	return Items.find();
});

Items.allow({
	insert: function (userId, doc) {
		return Meteor.users.findOne({_id: userId}).is_admin;
	},
	update: function (userId, doc) {
		return Meteor.users.findOne({_id: userId}).is_admin;
	},
	remove: function (userId, doc) {
		return Meteor.users.findOne({_id: userId}).is_admin;
	}
});
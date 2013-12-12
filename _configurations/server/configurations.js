Configurations = new Meteor.Collection("configurations");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "configurations"})) {
		Modules.insert({name: "Configurations", slug: "configurations", icon: "fa-wrench", admin_only: true, active: false});
	};
});

Meteor.publish("Configurations", function () {
  return Configurations.find({});
});

Configurations.allow({
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
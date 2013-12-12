Equipments = new Meteor.Collection("equipments");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "equipments"})) {
		Modules.insert({name: "Equipments", slug: "equipments", icon: "fa-truck", admin_only: false, active: false});
	};
});

Meteor.publish("Equipments", function () {
  return Equipments.find({user_id: this.userId});
});

Equipments.allow({
	insert: function (userId, doc) {
		return userId === doc.user_id || Meteor.users.findOne({_id: userId}).is_admin;
	},
	update: function (userId, doc) {
		return userId === doc.user_id;
	}
});
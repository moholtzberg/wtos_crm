Makes = new Meteor.Collection("makes");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "makes"})) {
		Modules.insert({name: "Makes", slug: "makes", icon: "fa-fire", admin_only: true, active: false});
	};
});

Meteor.publish("Makes", function () {
  return Makes.find();
});

Makes.allow({
	insert: function (userId, doc) {
		return userId === doc.user_id;
	},
	update: function (userId, doc) {
		console.log(EJSON.stringify(doc));
		return userId === doc.user_id;
	}
});
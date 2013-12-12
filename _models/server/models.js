Models = new Meteor.Collection("models");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "models"})) {
		Modules.insert({name: "Models", slug: "models", icon: "fa-th-list", admin_only: true, active: false});
	};
});

// Meteor.startup(function () {
// 	if (Models.find().count === 0 ) {
// 		Models.insert({make: "Copystar", number: "CS-3500i"});
// 	};
// });

Meteor.publish("Models", function () {
  return Models.find();
});

Models.allow({
	insert: function () {
		return true;
	},
	update: function (userId, doc) {
		console.log(EJSON.stringify(doc));
		return userId === doc.user_id;
	}
});
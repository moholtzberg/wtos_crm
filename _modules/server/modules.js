Modules = new Meteor.Collection("modules");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "modules"})) {
		Modules.insert({name: "Modules", slug: "modules", icon: "fa-cog", admin_only: true, active: true});
	};
});

Meteor.publish("Modules", function () {
	if (Meteor.users.findOne(this.userId).is_admin) {
		return Modules.find();
	} else {
		return Modules.find({admin_only: false, active: true})
	};
});

Modules.allow({
	insert: function (userId, doc) {
		return userId === doc.user_id;
	},
	update: function (userId, doc) {
		return userId === doc.user_id;
	}
});

// Meteor.startup(function () {
// 	console.log("Starting Up");
// 	var mods = Modules.find().fetch();
// 	console.log(mods);
// 	for (var i = 0; i < mods.length; i++) {
// 		console.log(mods[i].name);
// 		c = eval(mods[i].name).find();
// 		if (c.count() === 0) {
// 			var d = new Meteor.Collection(mods[i].name.toLowerCase());
// 			d.insert({test: "test"});
// 		} else {
// 			console.log("--- " + c.count() + " Documents");
// 		};
// 	};
// });
Tasks = new Meteor.Collection("tasks");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "tasks"})) {
		Modules.insert({name: "Tasks", slug: "tasks", icon: "fa-tasks", admin_only: false, active: false});
	};
});


Meteor.publish("Tasks", function (pageNo, perPage) {
	// console.log("pageNo => " + pageNo);
	// console.log("perPage => " + perPage);
	// console.log("skip => " + (pageNo - 1) * perPage);
	// console.log("limit => " + perPage);
  // return Tasks.find({user_id: this.userId}, {limit: perPage, skip: (pageNo - 1) * perPage});
	return Tasks.find({user_id: this.userId});
});

Tasks.allow({
	insert: function (userId, doc) {
		return userId === doc.user_id;
	},
	update: function (userId, doc) {
		return userId === doc.user_id;
	},
	remove: function (userId, doc) {
		return userId === doc.user_id;
	}
});
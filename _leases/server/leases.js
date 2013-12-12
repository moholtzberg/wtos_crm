Leases = new Meteor.Collection("leases");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "leases"})) {
		Modules.insert({name: "Leases", slug: "leases", icon: "fa-file", admin_only: false, active: true});
	};
});

endDate = function(doc) {
	return moment(doc.start_date).add("months", doc.lease_term);
}

Meteor.publish("Leases", function () {
	return Leases.find({user_id: this.userId}, {sort: {start_date: 1, lease_term: 1}});
});

Leases.allow({
	insert: function (userId, d) {
		console.log(d);
		return userId === d.user_id || Meteor.users.findOne({_id: userId}).is_admin;
	},
	update: function (userId, d) {
		console.log(d);
		return userId === d.user_id || Meteor.users.findOne({_id: userId}).is_admin;
	}, 
	remove: function (userId, doc) {
		console.log(doc);
		return userId === doc.user_id || Meteor.users.findOne({_id: userId}).is_admin;
	}
});
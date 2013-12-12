Meteor.startup(function(){
	if (!Modules.findOne({slug: "users"})) {
		Modules.insert({name: "Users", slug: "users", icon: "fa-group", admin_only: true, active: false});
	};
});

Meteor.publish("users", function () {
	var user = Meteor.users.findOne({_id: this.userId})
	if (user && user.is_admin === true) {
		console.log(user.profile.first_name + " " + user.profile.last_name + " : " + user.emails[0].address +" => {admin:true}");
		return Meteor.users.find();
	} else {
		console.log(user.profile.first_name + " " + user.profile.last_name + " : " + user.emails[0].address +" => {admin:false}");
		return Meteor.users.findOne({_id: this.userId});
	};
});

Meteor.users.allow({
	insert: function () {
		return true;
	},
	update: function (userId) {
		return true;
	}
});

Meteor.methods({
	
	createNewUser: function(options) {
		console.log("===============NEW USER=======")
		var h = Accounts.createUser({email: options.email, profile: options});
		console.log("===============END USER=======")
		Accounts.sendEnrollmentEmail(h);
		console.log(Meteor.users.findOne(h).services);
		var u = Meteor.users.findOne(h).services.password.reset;
		Meteor.users.update(h, {$set: {"services.email.verificationTokens" : [{token: u.token, address: u.email, when: u.when}]} });
	},
	
	setPassword: function(options) {
		Accounts.setPassword(options.user, options.password);
	}
	
});


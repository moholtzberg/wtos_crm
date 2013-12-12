User = function (doc) {
  _.extend(this, doc);
};

User.prototype = {
	constructor: User,
	
	is_admin: function() {
		if (!this.is_admin && !this.profile.is_admin) {
			return false;
		} else {
			return true;
		};
	},
	
	full_name: function() {
		if (this.record) {
			var self = this.record;
		} else {
			var self = this; 
		};
		return self.profile.first_name + " " + self.profile.last_name;
	}
};

Meteor.users._transform = function(doc) {
	return new User(doc);
}

Users = Meteor.users
//============================ Subscribe  

Meteor.subscribe("users");

Template.users.selected = function() {
	console.log("users selected");
	return Session.get("currentModule") === "Users";
}

Template.users_list.records = function() {
	return Users.find({});
}

Template.users_form.record = function() {
	return Users.findOne({_id: Session.get("userId")});
}
Template.user_profile_dropdown.events({
	'click button#logout' : function(event) {
		event.preventDefault();
		console.log("logging out");
		Meteor.logout();
	},
	
	'click a#change_password' : function(event) {
		event.preventDefault();
		Session.set("showChangePasswordForm", true);
	}
});

Template.main.events({
	'click button#logout': function(event) {
		event.preventDefault();
		Meteor.logout();
		Meteor.Router.to("/login");
	}
})

// Template.user_profile_dropdown.showChangePasswordForm = function () {
// 	return Session.get("showChangePasswordForm");
// }
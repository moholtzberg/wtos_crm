Template.users.events({
	
	'click button#new_user' : function(event) {
		console.log("Clicked New USer");
		event.preventDefault();
		Session.set("recordId", null);
		Meteor.Router.to("/users/new/");
	},
	
	'submit form#save_user' : function (event) {
		event.preventDefault();
		console.log("saving a user");
		console.log(Session.get("currentAction"));
		var profile = {};
		
		profile.first_name 	= $("input#user_first_name").val();
		profile.last_name 	= $("input#user_last_name").val();
		profile.address		 	= $("input#user_address").val();
		profile.city			 	= $("input#user_city").val();
		profile.state 			= $("input#user_state").val();
		profile.zip				 	= $("input#user_zip").val();
		profile.phone			  = $("input#user_phone").val();
		profile.email				= $("input#user_email").val();
		profile.is_admin    = $("#user_is_admin").is(":checked");
		
		if (Session.get("currentAction") === "new") {
			console.log(profile);
			Meteor.call("createNewUser", profile, function(err){
				if (!err) {
					console.log("no err")
				} else {
					console.log(err);
				};
			});
			
		} else {
			if ($("#user_id") != null) {
				Users.update({_id: $("#user_id").val()}, {$set: {profile: {first_name: profile.first_name, last_name: profile.last_name, address: profile.address, city: profile.city, state: profile.state, zip: profile.zip, phone: profile.phone, email: profile.email}, emails: [{address:profile.email, verifeid: true}], is_admin: $("#user_is_admin").is(":checked")}});
			};
		} 
		
	},
	
	'click a.record' : function (event) {
		event.preventDefault();
		user_id = $("#" + event.currentTarget.id.toString()).attr("user_id");
		Meteor.Router.to("/users/" + user_id);
	}

});

Template.set_password.events({
	
	'submit form#save_password' : function(event) {
		console.log("Saving Password");
		event.preventDefault();
		var pass1 = $("input#password").val();
		var pass2 = $("input#confirm_password").val();
		
		if (pass1 === pass2) {
			
			Accounts.resetPassword(Session.get("token"), pass1, function(err) {
				if (!err) {
					console.log("password changed");
				} else {
					console.log(err);
				};
			});
			
		};
	} 
	
});
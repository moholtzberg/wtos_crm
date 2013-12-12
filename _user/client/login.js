var trimInput = function(val) {
	return val.replace(/^\s*|\s*$/g, "");
}

var isValidPassword = function(val) {
	if (val.length >= 6) {
		return true;
	} else {
		Session.set('displayMessage', 'Error &amp; Password is too short');
		return false;
	}
}

var isNotEmpty = function(val) {
	if (val.length >= 1 && val !== null && val !== (" " || "	")) {
		return true;
	} else {
		Session.set('displayMessage', 'Error &amp; Cannot be an empty string');
		return false;
	}
}

Template.login_form.events({
	'submit #login-form' : function(e, t) {
		e.preventDefault();
		
		var email 		= trimInput(t.find('#login-email').value);
		var password 	= t.find('#login-password').value;
		console.log(email)
		console.log(password)
		Meteor.loginWithPassword(email, password, function(err) {
			
			if (err) {
				console.log(err)
				Session.set('displayMessage', 'Error &amp; ' + err.reason);
			} else {
				Session.set('displayMessage', null);
				Meteor.Router.to("/");
				// console.log(window.location.pathname);
			}
		});
		
		return false;
	},
	
	'click a#register' : function(e) {
		e.preventDefault();
		Session.set('displayMessage', null);
		Session.set("showRegisterForm", true);
		Session.set("showResetForm", false);
	},
	
	'click a#reset' : function(e) {
		e.preventDefault();
		Session.set('displayMessage', null);
		Session.set("showResetForm", true);
		Session.set("showRegisterForm", false);
	}
});

Template.register_form.events({
	'submit #register-form' : function(e, t) {
		e.preventDefault();
		
		var f_name = t.find('#account-first_name').value
		var l_name = t.find('#account-last_name').value
		var email = t.find('#account-email').value;
		var password = t.find('#account-password').value;
		
		var f_name = trimInput(f_name);
		var l_name = trimInput(l_name);
		var email = trimInput(email);
		
		var profile = {
			first_name: f_name,
			last_name: l_name,
		};
		
		if (f_name !== null && l_name !== null && email !== null && isValidPassword(password) ) {
			
			Accounts.createUser({email: email, password : password, profile: profile}, function(err){
				console.log(profile);
				if (err) {
					console.log(err);
					Session.set('displayMessage', 'Error &amp; ' + err.reason);
				} else {
					Session.set('displayMessage', null);
				}
				
			});
		}
		
		return false;
	},
	
	'click a#cancel' : function(e) {
		e.preventDefault();
		Session.set('displayMessage', null);
		Session.set("showResetForm", false);
		Session.set("showRegisterForm", false);
	}

});

// Meteor.autorun(function() {
// 	// Whenever this session variable changes, run this function.
// 	var message = Session.get('displayMessage');
// 	if (message) {
// 		var stringArray = message.split('&amp;');
// 		Session.set('displayMessage', null);
// 	}
// });

Handlebars.registerHelper('errors', function(){
	var message = Session.get('displayMessage');
	if (message) {
		var stringArray = message.split('&amp;');
		// Session.set('displayMessage', null);
		return stringArray[0], stringArray[1];
	}
});

Template.forgot_password.helpers({
	resetPassword : function(t) {
		return Session.get('resetPassword');
	}
});

if (Accounts._resetPasswordToken) {
	Session.set('resetPassword', Accounts._resetPasswordToken);
}

Template.forgot_password.events({
	'submit #recovery-form' : function(e, t) {
		e.preventDefault();
		
		var email = trimInput(t.find('#recovery-email').value);
		
		if (isNotEmpty(email) && isEmail(email)) {
			
			Session.set('loading', true);
			
			Accounts.forgotPassword({email: email}, function(err){
				if (err) {
					Session.set('displayMessage', 'Password Reset Error &amp; Doh');
				} else {
					Session.set('displayMessage', 'Email Sent &amp; Please check your email.');
				}
				Session.set('loading', false);
			});
		}
		return false;
	},
	
	'submit #new-password' : function(e, t) {
		e.preventDefault();
		
		var pw = t.find('#new-password-password').value;
		
		if (isNotEmpty(pw) && isValidPassword(pw)) {
			
			Session.set('loading', true);
			
			Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
				
				if (err){
					Session.set('displayMessage', 'Password Reset Error &amp; Sorry');
				} else {
					Session.set('resetPassword', null);
				}
				Session.set('loading', false);
			});
		}
		return false;
	},
	
	'click a#cancel' : function(e) {
		e.preventDefault();
		Session.set('displayMessage', null);
		Session.set("showResetForm", false);
		Session.set("showRegisterForm", false);
	}
	
});

Template.login.resetForm = function () {
	return Session.get("showResetForm");
}

Template.login.registerForm = function () {
	return Session.get("showRegisterForm");
}
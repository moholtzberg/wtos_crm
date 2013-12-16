Accounts.config({
	// restrictCreationByEmailDomain: 'worldtradecopiers.com'
	sendVerificationEmail: true
});

Accounts.emailTemplates.siteName = "WTOS - CRM";
Accounts.emailTemplates.from =  "crm@worldtradecopiers.com";

Accounts.emailTemplates.verifyEmail.subject = function (user) {
	return "Activate Your WTOS CRM Account"
};

Accounts.emailTemplates.verifyEmail.text = function (user, url) {
	url = url.replace("#/", "");
	console.log(url);
	return "Hello " + user.profile.first_name + " please click the link. " + url;
};

Accounts.emailTemplates.enrollAccount.subject = function (user) {
	return "Welcome to WTOS CRM";
};

Accounts.emailTemplates.enrollAccount.text = function (user, url) {
	url = url.replace("#/", "");
	console.log(url);
	return "Hi " + user.profile.first_name + 
				 "welcome to World Trade Office Solutions CRM" + 
				 "please click the link below to activate your account and create your pass" + url;
};
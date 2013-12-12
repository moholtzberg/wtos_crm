//============================ Model definition
Configuration = function (doc) {
  _.extend(this, doc);
};

//============================ Model propery definition 
Configuration.prototype = {
	constructor: Configuration,
};

//============================ Transform the collection
Configurations = new Meteor.Collection("configurations", {
	transform: function (doc) {
		return new Configuration(doc);
	}
});

//============================ Subscribe  
Meteor.subscribe("Configurations");

Template.configurations.helpers({
	
	actions: function () {
		return ["new", "edit", "view", "delete"];
	}
	
});
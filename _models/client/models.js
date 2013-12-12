//============================ Model definition
Model = function (doc) {
  _.extend(this, doc);
};

//============================ Model propery definition 
Model.prototype = {
  constructor: Model
	
};

//============================ Transform the collection
Models = new Meteor.Collection("models", {
	transform: function (doc) {
		return new Model(doc);
	}
});

//============================ Subscribe  
Meteor.subscribe("Models");

Template.nav.modules = function () {
	return Modules.find();
}
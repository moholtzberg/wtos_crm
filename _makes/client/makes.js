//============================ Model definition
Make = function (doc) {
  _.extend(this, doc);
};

//============================ Model propery definition 
Make.prototype = {
  constructor: Make
	
};

//============================ Transform the collection
Makes = new Meteor.Collection("makes", {
	transform: function (doc) {
		return new Make(doc);
	}
});

//============================ Subscribe  
Meteor.subscribe("Makes");
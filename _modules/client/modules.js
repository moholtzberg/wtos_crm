Module = function (doc) {
  _.extend(this, doc);
};

//============================ Model propery definition 
Module.prototype = {
	constructor: Module,
	
	size: function () {
		var c = eval(this.name);
		c = c.find().count();
		return c;
	},
	
	filters: function () {
		if (this.fields) {
			console.log("gonna return true");
			return this.fields;
		};
	}
	
};

//============================ Transform the collection
Modules = new Meteor.Collection("modules", {
	transform: function (doc) {
		return new Module(doc);
	}
});

Meteor.subscribe("Modules");

Template.modules_list.record = function () {
	return Modules.find({}, {sort: {name: 1}});
}

Template.modules_form.record = function () {
	return Modules.findOne({_id: Session.get("moduleId")});
}
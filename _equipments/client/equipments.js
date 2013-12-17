//============================ Model definition
Equipment = function (doc) {
  _.extend(this, doc);
};

//============================ Model propery definition 
Equipment.prototype = {
	constructor: Equipment,
	
	customer: function () {
		return Customers.findOne({_id: this.customer_id});
	},
	
	make: function () {
		return Makes.findOne({_id: this.make_id});
	},
	
	model: function () {
		return Models.findOne({_id: this.model_id});
	},
	
	competitor: function () {
		return Customers.findOne({_id: this.competitor_id});
	},
	
	owner: function () {
		return Meteor.users.findOne({_id: this.user_id});
	},
	
	leases: function() {
		// if (this.record) {
		// 	var self = this.record;
		// } else {
		// 	var self = this; 
		// };
		var self = this.record ? this.record : this;
		return Leases.find({_id: self.lease_id}).fetch()
	},
	
	leased: function() {
		return this.lease_id ? true : false;
	}
	
};

//============================ Transform the collection
Equipments = new Meteor.Collection("equipments", {
	transform: function (doc) {
		return new Equipment(doc);
	}
});

//============================ Subscribe  
Meteor.subscribe("Equipments");

Template.equipments_form.helpers({
	
	record: function(){
		return Equipments.findOne({_id: Session.get("recordId")});
	},
	
	customers: function(){
		return Customers.find();
	},
	
	makes: function(){
		return Makes.find();
	},
	
	models: function(){
		return Models.find({make_id: Session.get("makeId")});
	},
	
	vendors: function(){
		return Customers.find({vendor: true}, {fields: {_id: 1, name: 1, city: 1, state: 1}});
	},
	
	prospect: function(){
		return Session.get("isProspect");
	},
	
	users: function(){
		return Users.find({});
	},
	
	serachResults: function(){
		var search = _search(Session.get("searchResults"), ["name"]);
		return Customers.find({$or: search}).fetch();
	},
	
	leases: function () {
		return Leases.find({customer_id: Session.get("leaseCustomerId")});
	}

});

Template.equipments_view.helpers({
	
	record: function() {
		return Equipments.findOne({_id: Session.get("recordId")});
	}
	
});

Template.equipments_list.record = function() {
	return Equipments.find({}, {sort: {number: 1}}).fetch();
}
Lease = function (doc) {
  _.extend(this, doc);
};

Lease.prototype = {
  constructor: Lease,
	
	listDisplay: function () {
		return this.customer().name + " " + this.payment + " " + this.lease_term;
	},
	
	owner: function () {
		user = Meteor.users.findOne({_id: this.user_id});
		return user.username || user.emails[0].address;
  }, 
	
	equipments: function () {
		if (this.record) {
			var self = this.record;
		} else {
			var self = this; 
		};
		return Equipments.find({lease_id: self._id}).fetch();
	},
	
	customer: function () {
		return Customers.findOne({_id: this.customer_id});
	},
	
	endDate: function () {
		// var start = new Date(this.start_date);
		// var end = new Date(start.setMonth(start.getMonth() + this.lease_term));
		// return moment(end).format("L");
		return moment(this.start_date).add("months" ,this.lease_term).format("L");
	}
	
};

Leases = new Meteor.Collection("leases", {
	transform: function (doc) {
		return new Lease(doc);
	}
});

//============================ Subscribe  

Meteor.subscribe("Leases");

Template.leases_form.helpers({
	
	record: function() {
		return Leases.findOne({_id: Session.get("recordId")});
	},
	
	users: function() {
		return Users.find({}).fetch();
	},
	
	customers: function() {
		return Customers.find();
	},
	
	vendors: function() {
		return Customers.find({vendor: true});
	}
	
})

Template.leases_form.rendered = function() {
	$('input#start_date').datepicker();
	$('input#end_date').datepicker();
}

Template.leases_list.record = function() {
	var leases = Leases.find({}).fetch();
	leases.sort(function(a,b) { 
		return Date.parse(a.endDate()) - Date.parse(b.endDate());
	});
	return leases;
}

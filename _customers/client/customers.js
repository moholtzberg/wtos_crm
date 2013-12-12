Customer = function (doc) {
  _.extend(this, doc);
};

Customer.prototype = {
  constructor: Customer,
	
  owner: function () {
		user = Meteor.users.findOne({_id: this.user_id});
		console.log(user.emails);
		return user.username || user.emails[0].address;
  }, 
	
	contacts: function () {
		return	Contacts.find({customer_id: this._id});
	},
	
	notContacted: function () {
		var contacts = this.contacts();
		for (var i=0; i < contacts.length; i++) {
			console.log(contacts[i].neverContacted());
		};
	},
	
	leases: function () {
		if (this.record) {
			var self = this.record;
		} else {
			var self = this; 
		};
		return Leases.find({customer_id: self._id}).fetch();
	}
	
};

Customers = new Meteor.Collection("customers", {
	transform: function (doc) {
		return new Customer(doc);
	}
});

Customers.prototype = {
	
	page: function(page, per_page) {
		if (!page || page === undefined || page === null) {
			page = 1;
			Session.set("page", page)
		};
		if (!per_page) {
			per_page = 10;
			Session.set("per_page", per_page)
		};
		return Customers.find({vendor: false}, {sort: {name: 1}, skip: (page - 1) * per_page, limit: per_page})
	},
	
	pages: function() {
		per_page = Session.get("per_page");
		result = Customers.find().count();
		tot_pages = Math.ceil(result/per_page);
		console.log(tot_pages);
		for (var i=0; i < tot_pages; i++) {
			console.log(tot_pages);
		};
		// return 
	}
	
}

//============================ Subscribe  

Meteor.subscribe("Customers");
Meteor.subscribe("Vendors");

Template.customers.selected = function() {
	return Session.get("currentModule") === "Customers";
}

Template.customers_list.record = function() {
	return Customers.prototype.page(Session.get("page"), Session.get("per_page"));
}

Template.customers_form.record = function() {
	return Customers.findOne({_id: Session.get("recordId")});
}

Template.customers_form.users = function() {
	return Users.find().fetch();
}

Template.customers_view.record = function() {
	return Customers.findOne({_id: Session.get("recordId")})
}

// Template.customers.helpers({
// 	
// 	list: function() {
// 		return Customers.find();
// 	},
// 	
// 	record: function() {
// 		return Customers.findOne({_id: Session.get("recordId")});
// 	},
// 	
// 	list_panel: function() {
// 		return new Handlebars.SafeString(Template._customers_list());
// 	},
// 	
// 	view_panel: function() {
// 		return new Handlebars.SafeString(Template._customers_view({
// 			record: Customers.findOne({_id: Session.get("customerId")}), 
// 			contacts: Contacts.find({customer_id: Session.get("customerId")}),
// 			tasks: Tasks.find({customer_id: Session.get("customerId")}, {sort: {complete: 1, due_date: 1}})
// 		}));
// 	},
// 		
// });

// Template.customers_view.helpers({
// 	
// 	record: function() {
// 		return Customers.findOne({_id: Session.get("customerId")});
// 	},
// 	
// 	contacts: function() {
// 		return new Handlebars.SafeString(
// 			Template._customer_contacts({
// 				contacts: Contacts.find({customer_id: Session.get("customerId")})
// 			})
// 		);
// 	},
// 	
// 	tasks: function() {
// 		return new Handlebars.SafeString(
// 			Template._customer_tasks({
// 				tasks: Tasks.find({customer_id: Session.get("customerId")}, {sort: {complete: 1, due_date: 1}})
// 			})
// 		);
// 	},
// 	
// 	equipments: function() {
// 		return new Handlebars.SafeString(
// 			Template._customer_equipments({
// 				equipments: Equipments.find({customer_id: Session.get("customerId")})
// 			})
// 		);
// 	}
// 	
// });
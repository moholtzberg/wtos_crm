Customer = function (doc) {
  _.extend(this, doc);
};

Customer.prototype = {
  constructor: Customer,
	
  owner: function () {
		user = Meteor.users.findOne({_id: this.user_id});
		// console.log(user);
		if(user) {
			return user.full_name();
		}
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
		return Customers.find({vendor: null}, {sort: {name: 1}, skip: (page - 1) * per_page, limit: per_page})
	},
	
	pages: function() {
		per_page = Session.get("per_page");
		result = Customers.find().count();
		tot_pages = Math.ceil(result/per_page);
		return tot_pages;
	},
	
	paginated: function() {
		var pages = parseInt(this.pages());
		var page = parseInt(Session.get("page"));
		var pagination = new Array();
		var range = parseInt(Session.get("range")) || 10;

		if (pages > range) {
			if (page === 1) {
				min = 1;
				max = range;
			} else if(page > 1 && page < pages) {
				min = Math.max(1, page - (Math.floor((range-1) /2)));
				max = Math.min(pages, page + (Math.ceil((range-1) /2)));
				if (range - (max-min) > 0) {
					var off = range - (max-min);
					if (min - off < 1) {
						max = max + off - 1;
					} else if(max + off > pages) {
						min = min - off + 1;
					};
				} 
			} else if(page === pages) { 
				min = ((pages - range) + 1);
				max = pages;
			};
			
		} else {
			min = 1;
			max = pages;
		}	
		
		for (var i = min; i < max+1; i++) {
			if (i >= min && i <= max) {
				pagination.push(i.toString())
			}
		};
		return pagination;	
	}
	
}

//============================ Subscribe  

Meteor.subscribe("Customers");
Meteor.subscribe("Vendors");


Template.customers_list.helpers({
	
	pagination: function() {
		return Customers.prototype.paginated();
	},
	
	page: function() {
		return Session.get("page");
	},
	
	record: function() {
		return Customers.prototype.page(Session.get("page"), Session.get("per_page"));
	}
	
});

Template.customers_view.helpers({
	
	record: function() {
		return Customers.findOne({_id: Session.get("recordId")});
	}
	
});

Template.customers_form.helpers({
	
	record: function() {
		return Customers.findOne({_id: Session.get("recordId")});
	},
	
	users: function() {
		return Users.find().fetch();
	}
	
});
Contact = function (doc) {
	_.extend(this, doc);
};

Contact.prototype = {
  constructor: Contact,
	
	owner: function() {
		// return Users.findOne({_id: this.user_id}).full_name();
	},
	
	customer: function () {
		return Customers.findOne({_id: this.customer_id});
	},
	
	messages: function () {
		if (this.record) {
			var self = this.record;
		} else {
			var self = this;
		};
		return Messages.find({to: self.email}).fetch();
	},
	
  fullName: function () {
		return this.first_name + " " + this.last_name;
  },
	
	neverContacted: function () {
		if (!Messages.findOne({email: this.email})) {
			return true;
		} else {
			return false;
		};
	}
	
};

Contacts = new Meteor.Collection("contacts", {
	transform: function (doc) {
		return new Contact(doc);
	}
});

Contacts.prototype = {
	
	page: function(page, per_page) {
		if (!page || page === undefined || page === null) {
			page = 1;
			Session.set("page", page)
		};
		if (!per_page) {
			per_page = 10;
			Session.set("per_page", per_page)
		};
		return Contacts.find({}, {sort: {last_name: 1, first_name: 1}, skip: (page - 1) * per_page, limit: per_page})
	},
	
	pages: function() {
		per_page = Session.get("per_page");
		result = Contacts.find().count();
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

Meteor.subscribe("Contacts");

Template.contacts_list.helpers({
	
	pagination: function() {
		return Contacts.prototype.paginated();
	},
	
	page: function() {
		return Session.get("page");
	},
	
	record: function() {
		return Contacts.prototype.page(Session.get("page"), Session.get("per_page"));
	}
	
});

Template.contacts_view.helpers({
	
	record: function() {
		return Contacts.findOne({_id: Session.get("recordId")});
	}
	
});

Template.contacts_form.helpers({
	
	record: function () {
		return Contacts.findOne({_id: Session.get("recordId")});
	},
	
	customers: function() {
		return Customers.find();
	}
	
});
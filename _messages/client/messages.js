Message = function (doc) {
  _.extend(this, doc);
};

Message.prototype = {
	constructor: Message,
	
	stage: function () {
		
		var obj = {};
		
		if (!this.sent) {
			obj.message = "Sending...";
			obj.label_class = "";
		
		} else if (this.sent) {
			
			if (this.delivered && this.delivered.status === true) {
				obj.message = "Delivered!";
				obj.label_class = "info";
				
				if (this.opened && this.opened.status === true) {
					obj.message = "Opened!";
					obj.label_class = "success";
					
				}	else if (this.spam) {
					obj.message = "Spam!";
					obj.label_class = "important";
					
				} else if (this.bounced) {
					obj.message = "Bounced!";
					obj.label_class = "warning";
				};
				
			} else if (this.bounced) {
				obj.message = "Bounced!";
				obj.label_class = "warning";
			} else {
				obj.message = "Failed!";
				obj.label_class = "inverse";
			}
		};
		return obj;	
	}
};

Messages = new Meteor.Collection("messages", {
	transform: function (doc) {
		return new Message(doc);
	}
});

Messages.prototype = {
	
	page: function(page, per_page) {
		if (!page || page === undefined || page === null) {
			page = 1;
			Session.set("page", page)
		};
		if (!per_page) {
			per_page = 10;
			Session.set("per_page", per_page)
		};
		return Messages.find({}, {sort: {sent_at: 1}, skip: (page - 1) * per_page, limit: per_page})
	},
	
	pages: function() {
		per_page = Session.get("per_page");
		result = Messages.find().count();
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

Meteor.subscribe("Messages");

Template.messages_list.helpers({
	
	pagination: function() {
		return Messages.prototype.paginated();
	},
	
	page: function() {
		return Session.get("page");
	},
	
	record: function() {
		return Messages.prototype.page(Session.get("page"), Session.get("per_page"));
	}
	
});

Template.messages_view.helpers({
	
	record: function() {
		return Messages.findOne({_id: Session.get("recordId")});
	}
	
});

Template.messages_form.helpers({

	contact: function() {
		return Contacts.findOne({_id: Session.get("contactId")});
	},
	
	template: function() {
		return Template.find('.template_text');
	}
	
});

Template.messages_create.rendered = function () {
	console.log("Rendered");
	var email_txt = $('#email_tmp_text').remove();
	console.log(email_txt.html());
	$('#body').html(email_txt.html());
}

Template.welcome_email.helpers({
	//methods need to be checked for compatability
	
	to: function() {
		return Contacts.findOne({_id: Session.get("contactId")});
	},
	
	from: function() {
		return Meteor.user().profile;
	},
	
	equipment: function(customer_id) {
		return Customers.findOne(customer_id);
	}
	
});
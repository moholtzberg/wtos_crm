Item = function (doc) {
	_.extend(this, doc);
};

Item.prototype = {
  constructor: Item,
	
	recordName: function () {
		return this.number;
	},
	
	make: function () {
		return Makes.findOne({_id: this.make_id});
	}
};

Items = new Meteor.Collection("items", {
	transform: function (doc) {
		return new Item(doc);
	}
});

Meteor.subscribe("Items");

Template.items.helpers({
	
	actions: function () {
		return ["new", "edit", "view", "delete"];
	}
	
});

Template.crud.record = function() {
	return Items.findOne({_id: Session.get("itemId")});
}

Template.items_list.record = function() {
	var qry = Session.get("currentFilter");
	if (qry) {
		searchQry = Search(qry, ["make", "model", "number", "description", "price"]);
		return Items.find({$or: searchQry}, {sort: {number: 1}});
	} else {
		return Items.find({}, {sort: {number: 1}});
	};
}

Template.items_form.record = function() {
	return Items.findOne({_id: Session.get("itemId")});
}

Template.items_form.makes = function() {
	return Makes.find().fetch();
}

Template.items_form.models = function() {
	return Models.find({make_id: Session.get("makeId")}).fetch();
}

Template.items_list.events({
  'click button#new_item' : function (event) {
		event.preventDefault();
		Session.set("currentAction", "new");
		Session.set("itemId", null);
		console.log("clicked" + new Date().toString());
	},
	
	'click button.view_item': function (event, template) {
		item_id = $("#" + event.currentTarget.id.toString()).attr("item_id");
		Session.set("currentAction", "view");
    Session.set("itemId", item_id);
  },
	
	'click button.edit_item': function (event, template) {
		item_id = $("#" + event.currentTarget.id.toString()).attr("item_id");
		Session.set("currentAction", "edit");
		Session.set("itemId", item_id);
  },
	
	'click button.delete_item': function (event, template) {
		item_id = $("#" + event.currentTarget.id.toString()).attr("item_id");
		Session.set("currentAction", "delete");
		Session.set("itemId", item_id);
	}
	
});

Template.crud.events({
	'click a#cancel_item, click button#close_item' : function(event) {
		event.preventDefault();
		Session.set("currentAction", false);
		Session.set("contactId", null);
	},
	
	'submit form#save_items, click a#save_items' : function (event) {
		
		if (Session.get("currentAction") === "new") {
			
			result = createRecord("Items", Session.get("currentAction"), event);
			
			if (result) {
				Session.set("currentAction", false);
			};
			
		} else if (Session.get("currentAction") === "edit") {
			
			result = createRecord("Items", Session.get("currentAction"), event, Session.get("itemId"));
			
			if (result) {
				Session.set("currentAction", false);
				Session.set("itemId", null);
			};
		} else if (Session.get("currentAction") === "delete") {
			
			result = createRecord("Items", Session.get("currentAction"), event, Session.get("itemId"));
			
			if (result) {
				Session.set("currentAction", false);
				Session.set("itemId", null);
			};
			
		}
	},
	
	'change select#make_id, rendered select#make_id' :function (event) {
		event.preventDefault();
		console.log($('select#make_id').val());
		Session.set("makeId", $('#make_id').val());
	},
	
	// 'change #equipment_is_competitor': function (event) {
	// 	var val = Session.get("isProspect");
	// 	if (val) {
	// 		Session.set("isProspect", false);
	// 	} else {
	// 		Session.set("isProspect", true);
	// 	};
	// },
	
	'click a#edit_contact' : function (event) {
		event.preventDefault();
		Session.set("currentAction", "edit");
	},
	
	'click a#message_contact': function (event) {
		console.log("Message Contact");
		Session.set("currentAction", "newMessage");
	},
	
	'click a#delete_contact, submit form#delete_contact' : function (event) {
		event.preventDefault();
		if (!Contacts.remove(Session.get("contactId"))) {
			Session.set("currentAction", false);
			Session.set("customerId", null);
		};
	}
	
});

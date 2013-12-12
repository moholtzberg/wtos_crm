//============================ Model definition
Order = function (doc) {
  _.extend(this, doc);
};

//============================ Model propery definition 
Order.prototype = {
	constructor: Order,
	
	customer: function () {
		return Customers.findOne({_id: this.customer_id});
	},
	
	lines: function () {
		return OrderLineItems.find({order_id: this._id}).fetch();
	},
	
	// recordNumber: function () {
	// 	var number = this.number;
	// 	console.log(number);
	// 	if (number == (null || undefined)) {
	// 		o = Orders.find({}, {sort: {_id: 1}}).fetch()[0];
	// 		console.log(o);
	// 	} else {
	// 		return number;
	// 	};
	// },
	
	total: function () {
		var tot = 0; 
		OrderLineItems.find({order_id: this._id}).forEach(
			function(line){
				tot += line.total();
				console.log(tot);
			}
		);
		return accounting.formatMoney(tot);
	}
};

//============================ Transform the collection
Orders = new Meteor.Collection("orders", {
	transform: function (doc) {
		return new Order(doc);
	}
});

//============================ Subscribe  
Meteor.subscribe("Orders");

Template.orders.helpers({
	
	actions: function () {
		return ["new", "edit", "view", "delete"];
	}
	
});

Template.crud.record = function() {
	return Orders.findOne({_id: Session.get("orderId")});
}

Template.orders.record = function() {
	return Orders.findOne({_id: Session.get("orderId")});
}

Template.orders_list.record = function() {
	// qry = Session.get("currentFilter") || "";
	// if (qry != "") {
	// 	return Orders.find({$or: [ {'name': {$regex: '^.*' + qry + '.*'}}, {'address': {$regex: '^.*' + qry + '.*'}}, {'city': {$regex: '^.*' + qry + '.*'}}, {'state': {$regex: '^.*' + qry + '.*'}}, {'zip': {$regex: '^.*' + qry + '.*'}}, {'zip': {$regex: '^.*' + qry + '.*'}}, {'phone': {$regex: '^.*' + qry + '.*'}}, {'eda_number': {$regex: '^.*' + qry + '.*'}}, {'notes': {$regex: '^.*' + qry + '.*'}} ] });
	// } else {
	// 	return Orders.find({});
	// };
	return Orders.find();
}

Template.orders_form.record = function() {
	return Orders.findOne({_id: Session.get("orderId")});
}

Template.orders_form.customers = function() {
	return Customers.find().fetch();
}

Template.orders_form.items = function() {
	return Items.find().fetch();
}

Template.orders_form.lineItems = function() {
	return OrderLineItems.find({order_id: Session.get("orderId")});
}

Template.orders_form.subTotal = function() {
	var tot = 0; 
	OrderLineItems.find({order_id: Session.get("orderId")}).forEach(
		function(line){
			tot += line.total();
			console.log(tot);
		}
	);
	return accounting.formatMoney(tot);
}

Template.orders_form.profit = function() {
	var total = 0;
	var costs = 0;
	OrderLineItems.find({order_id: Session.get("orderId")}).forEach(
		function(line){
			quantity = line.quantity;
			total = total + line.total();
			costs = costs + (quantity * line.item().cost);
		}
	);
	return accounting.formatMoney(total - costs);	
}

Template.orders_form.margin = function() {
	var total = 0;
	var costs = 0;
	OrderLineItems.find({order_id: Session.get("orderId")}).forEach(
		function(line){
			quantity = line.quantity;
			total = total + line.total();
			costs = costs + (quantity * line.item().cost);
		}
	);
	return (total - costs) / total * 100;	
}


Template.orders.events({
	'click button#new_order' : function(event) {
		event.preventDefault();
		Session.set("currentAction", "new");
		Session.set("orderId", new Meteor.Collection.ObjectID()._str);
		Session.set("lineItems", new Array());
		Meteor.Router.to("/orders/new/");
	},
	
	'change select#item_id, rendered select#item_id' :function (event) {
		event.preventDefault();
		console.log($('select#item_id').val());
		Session.set("itemId", $('select#item_id').val());
		console.log(Session.get("itemId"));
		item = Items.findOne({_id: Session.get("itemId")});
		console.log(item);
		// console.log(item.cost);
		console.log(item.price);
		$('input#cost').val(item.cost).prop("disabled", true);
		$('input#price').val(item.price);
	},
	
	'click a#add_item' : function(event) {
		event.preventDefault();
		quantity	= $("input#quantity").val();
		item_id		= Session.get("itemId");
		price			= $("input#price").val();
		var lineItem = {order_id:Session.get("orderId"), quantity: quantity, item_id: item_id, price: price};
		console.log(lineItem);

		if (quantity > 0 && item_id != null && price >= Items.findOne({_id: item_id}).cost) {
			OrderLineItems.insert(lineItem);
		} else {
			console.log(quantity);
			console.log(quantity > 0);
			console.log(item_id);
			console.log(item_id != null);
			console.log(price);
			console.log(price >= Items.findOne({_id: item_id}).cost);
		};
		$("input#quantity").val(null);
		$("select#item_id").val(null);
		$("input#cost").val(null);
		$("input#price").val(null);
	},
	
	'submit #save_order' : function(event) {
		if (Session.get("currentAction") === "new") {
			
			e = event.currentTarget;
			e.price.parentNode.removeChild(e.price);
			
			console.log(e);
			result = createRecord("Orders", Session.get("currentAction"), e);
			
			if (result) {
				Session.set("currentAction", false);
			};
			
		} else if (Session.get("currentAction") === "edit") {
			
			result = createRecord("Orders", Session.get("currentAction"), event, Session.get("orderId"));
			
			if (result) {
				Session.set("currentAction", false);
				Session.set("orderId", null);
			};
		} else if (Session.get("currentAction") === "delete") {
			
			result = createRecord("Orders", Session.get("currentAction"), event, Session.get("orderId"));
			
			if (result) {
				Session.set("currentAction", false);
				Session.set("orderId", null);
			};
			
		}
	}
});

Template.orders_list.events({
	'click a.record': function (event, template) {
		order_id = $("#" + event.currentTarget.id.toString()).attr("order_id");
		console.log(Session.get("currentModule"));
		console.log(Session.get("orderId"));
		Meteor.Router.to("/orders/" + order_id);
		Session.set("tabs", "view");
  },
	
	'click button#new_order' : function (event) {
		// lineItems = new Array();
		Session.set("lineItems", new Array());
		event.preventDefault();
		Session.set("currentAction", "new");
		// Session.set("orderId", null);
		console.log("clicked" + new Date().toString());
		Session.set("orderId", new Meteor.Collection.ObjectID()._str);
	},
	
	'click button#new_order' : function (event) {
		event.preventDefault();
		Session.set("currentAction", "new");
		console.log(Session.get("currentAction"));
	},
	
	'click button.view_order': function (event, template) {
		order_id = $("#" + event.currentTarget.id.toString()).attr("order_id");
		Session.set("currentAction", "view");
    Session.set("orderId", order_id);
  },
	
	'click button.edit_order': function (event, template) {
		order_id = $("#" + event.currentTarget.id.toString()).attr("order_id");
		Session.set("currentAction", "edit");
		Session.set("orderId", order_id);
  },
	
	'click button.delete_order': function (event, template) {
		order_id = $("#" + event.currentTarget.id.toString()).attr("order_id");
		Session.set("currentAction", "delete");
		Session.set("orderId", order_id);
	}
});

// Template.crud.events({
// 	'click a#cancel_order, click button#close_order' : function(event) {
// 		event.preventDefault();
// 		console.log("Order Has Been Canceled");
// 		console.log(Session.get("orderId"));
// 		var orderLines = OrderLineItems.find({order_id: Session.get("orderId")});
// 		console.log(orderLines.forEach(function(line){ OrderLineItems.remove({_id: line._id}) }))
// 		Session.set("orderId", null);
// 		Session.set("currentAction", false);
// 	},
// 	
// 	'change select#item_id, rendered select#item_id' :function (event) {
// 		event.preventDefault();
// 		console.log($('select#item_id').val());
// 		Session.set("itemId", $('#item_id').val());
// 		console.log(Session.get("itemId"));
// 		item = Items.findOne({_id: Session.get("itemId")});
// 		console.log(item._id);
// 		console.log(item.cost);
// 		console.log(item.price);
// 		$('input#cost').val(item.cost).prop("disabled", true);
// 		$('input#price').val(item.price);
// 	},
// 	
// 	'click a#add_item' : function(event) {
// 		event.preventDefault();
// 		quantity	= $("#quantity").val();
// 		item_id		= $("#item_id").val();
// 		price			= $("#price").val();
// 		var lineItem = {order_id:Session.get("orderId"), quantity: quantity, item_id: item_id, price: price};
// 		console.log(lineItem);
// 
// 		if (quantity > 0 && item_id != null && price >= Items.findOne({_id: item_id}).cost) {
// 			OrderLineItems.insert(lineItem);
// 		} else {
// 			console.log(quantity);
// 			console.log(quantity > 0);
// 			console.log(item_id);
// 			console.log(item_id != null);
// 			console.log(price);
// 			console.log(price >= Items.findOne({_id: item_id}).cost);
// 		};
// 		$("#quantity").val(null);
// 		$("#item_id").val(null);
// 		$("#cost").val(null);
// 		$("#price").val(null);
// 	},
// 	
// 	'submit form#save_orders' : function (event) {
// 		// console.log("Form Submitted");
// 		// alert("Form Submitted");
// 		// event.preventDefault();
// 		if (Session.get("currentAction") === "new") {
// 			
// 			result = createRecord("Orders", Session.get("currentAction"), event);
// 			
// 			if (result) {
// 				Session.set("currentAction", false);
// 			};
// 			
// 		} else if (Session.get("currentAction") === "edit") {
// 			
// 			result = createRecord("Orders", Session.get("currentAction"), event, Session.get("orderId"));
// 			
// 			if (result) {
// 				Session.set("currentAction", false);
// 				Session.set("orderId", null);
// 			};
// 		} else if (Session.get("currentAction") === "delete") {
// 			
// 			result = createRecord("Orders", Session.get("currentAction"), event, Session.get("orderId"));
// 			
// 			if (result) {
// 				Session.set("currentAction", false);
// 				Session.set("orderId", null);
// 			};
// 			
// 		}
// 	}
// });
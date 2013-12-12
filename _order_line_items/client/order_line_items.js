//============================ Model definition
OrderLineItem = function (doc) {
  _.extend(this, doc);
};

//============================ Model propery definition 
OrderLineItem.prototype = {
	constructor: OrderLineItem,
	
	order: function () {
		return Orders.findOne({_id: this.order_id});
	},
	
	total: function () {
		return (this.quantity * this.price);
	},
	
	item: function () {
		return Items.findOne({_id: this.item_id});
	}
	
};

//============================ Transform the collection
OrderLineItems = new Meteor.Collection("order_line_items", {
	transform: function (doc) {
		return new OrderLineItem(doc);
	}
});

//============================ Subscribe  
Meteor.subscribe("OrderLineItems");
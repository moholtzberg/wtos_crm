Meteor.methods({
	getCustomers: function () {
		res = Meteor.http.get("http://127.0.0.1:3000/customers.json");
		for (var i=0; i < res.data.length; i++) {
			c = Customers.findOne({number: res.data[i].CustomerNumber});
			if (!c) {
				console.log("Customer " + res.data[i].CustomerNumber + " not found in DB!");
				Customers.insert({user_id: Meteor.userId(), name: res.data[i].CustomerName, number: res.data[i].CustomerNumber, address: res.data[i].Address, city: res.data[i].City, state: res.data[i].Zip, phone: res.data[i].Phone1, fax: res.data[i].Fax,dgserver_id: res.data[i].CustomerID, active: res.data[i].Active, prospect: res.data[i].Prospect,last_updated: res.data[i].LastUpdate});
			} else {
				console.log("Customer " + res.data[i].CustomerNumber + " matches " + c.number + " " + c._id + " found in DB!");
			};
		};
	},
	
	updateCustomer: function (customer) {
		res = Meteor.http.get("http://127.0.0.1:3000/customers/" + customer.dgserver_id +".json");
		Customers.update({_id: customer._id}, {$set: {user_id: Meteor.userId(), name: res.data.CustomerName, number: res.data.CustomerNumber, address: res.data.Address, city: res.data.City, state: res.data.Zip, phone: res.data.Phone1, fax: res.data.Fax, dgserver_id: res.data.CustomerID, active: res.data.Active, prospect: res.data.Prospect,last_updated: res.data.LastUpdate}});
	}
	
});
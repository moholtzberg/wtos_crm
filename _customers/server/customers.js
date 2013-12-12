Customers = new Meteor.Collection("customers");

Meteor.startup(function(){
	if (!Modules.findOne({slug: "customers"})) {
		Modules.insert({name: "Customers", slug: "customers", icon: "fa-briefcase", admin_only: false, active: true});
	};
});

Meteor.publish("Customers", function (page_no) {
	user = Meteor.users.findOne({_id: this.userId});
	if (user.is_admin || user.profile.is_admin) {
		return Customers.find({vendor: false}, {sort: {name: 1}});
	} else {
		return Customers.find({user_id: this.userId, vendor: false});
	};
});

Meteor.publish("Vendors", function () {
  return Customers.find({vendor: true});
});

Customers.allow({
	insert: function (userId, d) {
		var url = "http://maps.googleapis.com/maps/api/geocode/json?address=+"+d.address+"+"+d.city+"+"+d.state+"+"+d.zip+"+"+"&sensor=false";
		HTTP.call("GET", url, function (e, r) {
			if (r.statusCode === 200) {
				Customers.update({_id: d._id}, {$set: {loc: {lat: r.data.results[0].geometry.location.lat, lng: r.data.results[0].geometry.location.lng}}});
			}
		});
		return userId === d.user_id || Meteor.users.findOne({_id: userId}).is_admin
	},
	
	update: function (userId, d) {
		var url = "http://maps.googleapis.com/maps/api/geocode/json?address=+"+d.address+"+"+d.city+"+"+d.state+"+"+d.zip+"+"+"&sensor=false";
		HTTP.call("GET", url, function (e, r) {
			if (r.statusCode === 200) {
				console.log(r);
				Customers.update({_id: d._id}, {$set: {loc: {lat: r.data.results[0].geometry.location.lat, lng: r.data.results[0].geometry.location.lng}}});
			}
		});
		return userId === d.user_id || Meteor.users.findOne({_id: userId}).is_admin
	}, 
	
	remove: function (userId, doc) {
		console.log(doc);
		return userId === doc.user_id || Meteor.users.findOne({_id: userId}).is_admin;
	}
});



// var isPresent = Match.Where(function(string){
// 	console.log(string);
// 	console.log(" - " + check(string, String) && string.length > 0 && string[0] !== " ");
// 	return check(string, String) && string.length > 0 && string[0] !== " ";
// });

// Meteor.methods({
// 	getRecords: function (id) {
// 		// console.log("FROM createRecord >>> " + EJSON.stringify(doc));
// 		Meteor.http.call("GET", "localhost:3000",
// 		                 {data: {some: "json", stuff: 1}},
// 		                 function (error, result) {
// 		                   if (result.statusCode === 200) {
// 		                     Session.set("twizzled", true);
// 		                   }
// 		                 });
// 		// check(doc, {
// 		// 	name: isPresent,
// 		// });
// 		
// 		// return Customers.insert({
// 		// 			user_id: this.userId,
// 		// 			name: doc.name,
// 		// 			address: doc.address,
// 		// 			city: doc.city,
// 		// 			state: doc.state,
// 		// 			zip: doc.zip,
// 		// 			phone: doc.phone,
// 		// 			fax: doc.fax,
// 		// 			eda_number: doc.eda_number,
// 		// 			duns_number: doc.duns_number,
// 		// 			notes: doc.notes
// 		// 			});
// 		// 	}
// });
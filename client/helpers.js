Handlebars.registerHelper("templateLogger", function (templateName) {
	console.log("Template Rendered " + templateName);
});

Handlebars.registerHelper("subModule", function (record) {
	console.log(record);
	if (Session.get("currentModule") !== "view") {
		if (Template[Session.get("currentAction") + "_stub"]()) {
			return new Handlebars.SafeString(Template[Session.get("currentAction") + "_stub"]({record: record}));
		};
		
	};
});

Handlebars.registerHelper("checkCurrentAction", function (action) {
	// console.log(JSON.stringify(action));
	if (action && action === null || action === undefined || action === false) {
		return false;
	} else {
		return Session.get("currentAction") === action;
	};
});

Handlebars.registerHelper("checkCurrentModule", function (action) {
	// console.log(action + " mod ==> " + Session.get("currentModule"));
	if (action && action === null || action === undefined || action === false) {
		return false;
	} else {
		return Session.get("currentModule") === action;
	};
});

Handlebars.registerHelper("checkCurrentId", function (id) {
	var module = _.singularize(Session.get("currentModule"));
	// console.log(id + " id ==> " + Session.get( module + "Id") );
	if (id && id === null || id === undefined || id === false) {
		return false;
	} else {
		// return Session.get(module + "Id") === id;
		return Session.get("recordId") === id;
	};
});

Handlebars.registerHelper("currentAction", function (options) {
	var options = options.hash || {};
	var output = Session.get("currentAction");
	
	if (options.capitalize) {
		output = capitalize(output);
	};
	
	if (options.singularize || options.pluralize === false) {
		output = _.singularize(output);
	};
	
	return output;
});

Handlebars.registerHelper("currentModule", function (options) {
	var options = options.hash || {};
	var output = Session.get("currentModule");
		
	if (options.capitalize) {
		output = capitalize(output);
	};
		
	if (options.singularize || options.pluralize === false) {
		// console.log(output);
		output = _.singularize(output);
		// console.log(output);
	};
	
	return output;
});

Handlebars.registerHelper("formatTime", function (time) {

});

Handlebars.registerHelper("moduleAction", function () {
	return Session.get("currentModule") + " - " + Session.get("currentAction");
});

Handlebars.registerHelper("form", function () {
	var module = Session.get("currentModule");
	var string = module + "_form";
	return Template[string]();
});

Handlebars.registerHelper("paginate", function () {
	var count = Modules.findOne({name: Session.get("selectedModule")}).size();
	var pages = Math.ceil(count / 10);
});

Handlebars.registerHelper("selected", function (val1, val2, string) {
	if (val1 === val2) {
		return string;
	}
});

Handlebars.registerHelper("selectedModule", function (module) {
	if (val1 === val2) {
		return string;
	}
});

Handlebars.registerHelper("mapView", function () {
	return Session.get("mapView");
});

Handlebars.registerHelper("formInput", function (type, options) {
	var options = options.hash || {}
	switch (type) {
		case "text":
			input = buildTextInput(options);
			break;
		case "password":
			input = buildPasswordInput(options);
			break;
		case "select":
			input = buildSelectInput(options);
			break;
		case "textarea":
			input = buildTextArea(options);
			break;
	}
	return new Handlebars.SafeString(input);
});

buildTextInput = function(options) {
	
	var output = "<input type=\"text\" ";
	var cls = false;
	
	for (var i=0; i < Object.keys(options).length; i++) {
		
		key = Object.keys(options)[i];
		val = options[key];
		
		if (val != null && key != "label") {
			output += key + "=\"" + val;
			if (key === "class") {
				output += " span12";
				cls = true;
			};
			output += "\" ";
		};
		
	};
	if (cls != true) {
		output += "class=\"span12\" ";
	};
	
	if (Session.equals("currentAction", "view")) {
		output += "disabled";
	};
	
	output += "/>";
	
	if (options.label !== null) {
		output = wrapInput(output, options.span, options.label);
	}
	
	return output;
}

buildPasswordInput = function(options) {
	
	var output = "<input type=\"password\" ";
	var cls = false;
	
	for (var i=0; i < Object.keys(options).length; i++) {
		
		key = Object.keys(options)[i];
		val = options[key];
		
		if (val != null && key != "label") {
			output += key + "=\"" + val;
			if (key === "class") {
				output += " span12";
				cls = true;
			};
			output += "\" ";
		};
		
	};
	if (cls != true) {
		output += "class=\"span12\" ";
	};
	
	if (Session.equals("currentAction", "view")) {
		output += "disabled";
	};
	
	output += "/>";
	
	if (options.label !== null) {
		output = wrapInput(output, options.span, options.label);
	}
	
	return output;
}

buildSelectInput = function(options) {
	
	var output = "<select ";
	var cls = false;
	var selectOptions = {};
	var selectDisplay = {};
	var selectValue 	= {};
	for (var i=0; i < Object.keys(options).length; i++) {
		
		key = Object.keys(options)[i];
		val = options[key];
		
		if (val != null && key != "label") {
			
			if (key === "selectOptions") {
				selectOptions = val;
			} else if (key === "selectDisplay") {
				selectDisplay = val;
			} else if (key === "selectValue") {
				selectValue = val;
			} else {
				
				output += key + "=\"" + val;
				if (key === "class") {
					output += " span12";
					cls = true;
				};
				
				output += "\" ";
				
			};
			
		};
		
	};
	if (cls != true) {
		output += "class=\"span12\" ";
	};
	
	if (Session.equals("currentAction", "view")) {
		output += "disabled";
	};
	
	output += ">";
	output += "<option>Select One</option>";
	selectOptions.forEach(function(opt){
		output += "<option value=\"" + opt._id + "\"";
		
		if (selectValue === opt._id) {
			console.log(selectValue === opt._id);
			
			output += " selected";
		};
		var evalString = eval("opt." + selectDisplay);
		output += ">" + evalString + "</option>";
	})
	
	output += "</select>"
	
	if (options.label !== null) {
		output = wrapInput(output, options.span, options.label);
	}
	
	return output;
}

buildTextArea = function(options) {
	
	var output = "<textarea ";
	var cls = false;
	var defaultText = options.value || "";
	
	for (var i=0; i < Object.keys(options).length; i++) {
		
		key = Object.keys(options)[i];
		val = options[key];
		
		if (val != null && key != "label") {
			output += key + "=\"" + val;
			
			if (key === "class") {
				output += " span12";
				cls = true;
			};
			
			output += "\" ";
		};
		console.log(output);
	};
	if (cls != true) {
		output += "class=\"span12\" ";
	};
	
	
	if (Session.equals("currentAction", "view")) {
		output += "disabled";
	};
	
	output += "/>";
	output += defaultText.toString();
	output += "</textarea>";
	
	if (options.label !== null) {
		output = wrapInput(output, options.span, options.label);
	}
	
	return output;
}

capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

wrapInput = function (field, span, label) {
	var output = "";
	output += "<div class=\"span" + span + "\">";
	output += "<label>" + label + "</label>";
	output += field.toString();
	output += "</div>";
	return output;
}

Template.mapPostsList.rendered = function() {
	// console.log("map rendered @ " + new Date());
	Session.set("myLat", 26.202535);
	Session.set("myLng", -80.184426);
	
	var parents = $("#map-canvas").parents();
	// for (var i=0; i < parents.length; i++) {
	// 	$(parents[i]).css("height", "100%");
	// };
	// $("#mapWrapper").parent().css("height", "89%");
	$("#map-canvas").height("400px");
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(p) {
			Session.set("myLat", p.coords.latitude);
			Session.set("myLng", p.coords.longitude);
		});
	}
	
	Deps.autorun(function(){
	
	var mapOptions = {
		center: new google.maps.LatLng(Session.get("myLat"), Session.get("myLng")),
		zoom: 13,
		zoomControl: true,
		zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL},
		streetViewControl: false,
		mapTypeControl: false,
		scaleControl: true,
		mapTypeId: google.maps.MapTypeId.SMALL
	}
	
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(Session.get("myLat"), Session.get("myLng")),
		title:'My Location',
		icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	});
	
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	// console.log(map);
		marker.setMap(map);
		
		Customers.find({}).forEach(function(customer) {
			// console.log(customer);
			
			var obj = {
				address: customer.address,
				city: customer.city,
				state: customer.state,
				zip: customer.zip
			};
			
			// geo = getGeolocation(address);
			
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(customer.loc.lat, customer.loc.lng),
				title: customer.name,
				icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
			});
			
			marker.setMap(map);
			
			google.maps.event.addListener(marker, 'click', function() {
				// Session.set("customerId", customer._id);
				Meteor.Router.to("/customers/" + customer._id);
			});
		
		});
		
		google.maps.event.addListener(map, 'bounds_changed', function() {
			// console.log(map.getBounds().ea,b);
		});
		
	});

};
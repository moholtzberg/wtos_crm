createRecord = function(collection, action, event, docId) {
	console.log(collection);
	console.log(action);
	console.log(event.currentTarget);
	console.log(docId);
	event.preventDefault();
	var formArray = $(event.currentTarget).serializeArray();
	var collection = eval(collection);
	var docObj = {}; 
	var docId  = docId || null;
	var returnval;
	
	for (var i=0; i < formArray.length; i++) {
		if (formArray[i].value.type !== Array) {
			docObj[formArray[i].name] = formArray[i].value;
		};
	};
	console.log(docObj);
	
	if (docObj.user_id === null) {
		docObj[user_id] = Meteor.userId();
	};
	
	if (action === "new" && docId === null) {
		docObj["created_at"] = new Date();
		docObj["updated_at"] = new Date();
		collection.insert(docObj, function(err) {
			console.log(err);
			returnval = false;
		});
		// console.log(returnval);
	} else if (action === "view" && docId !== null) {
		docObj["updated_at"] = new Date();
		collection.update({_id: docId}, {$set: docObj}, function(err){
			console.log(err);
			returnval = false;
		});
		// console.log(returnval);
	} else if (action === "delete" && docId !== null) {
		
		collection.remove({_id: docId}, function(err){
			console.log(err);
			returnval = false;
		});
		// console.log(returnval);
	};
	
	if (returnval !== false) {
		$(event.currentTarget)[0].reset();
		returnval = true;
	};
	console.log(returnval);
	return returnval;
}

// Handlebars.registerHelper('formBuilder', function(context, options) {
// 	var ret = "<form class=\"container-fluid\">";
// 	console.log(context);
// 	console.log(options.fn());
// 	for(var i=0, j=context.model.length; i<j; i++) {
// 		ret = ret + "<div class=\"span12\">" + options.fn(context.model[i]) + "</div>";
// 	}
// 	
// 	return ret + "</form>";
// });
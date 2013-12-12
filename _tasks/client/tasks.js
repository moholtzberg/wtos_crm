Task = function (doc) {
  _.extend(this, doc);
};

Task.prototype = {
  constructor: Task,
	
	customer: function () {
		return Customers.findOne({_id: this.customer_id});
	},
	
	contact: function () {
		return Contacts.findOne({_id: this.customer_id});
	},
	
	dueDateDisplay: function () {
		if (this.complete) {
			
			return "Complete";
			
		} else {
			
			var diff		= new Date(this.due_date).getTime() - new Date().getTime();
			var dueToday = (new Date(this.due_date).getDate() === new Date().getDate());
			var dueTommorow = (new Date(this.due_date).getDate() === (new Date().getDate() + 1))
			var dueYesterday = (new Date(this.due_date).getDate() === (new Date().getDate() - 1))
			
			var DAY 		= 1000 * 60 * 60 * 24;
			var msg = "";
			
			if (dueToday) {
				
				msg = "Due Today";
				
			} else if (dueTommorow) {
				
				msg = "Due Tommorow";
				
			} else if (dueYesterday) {
				
				msg = "Was Due Yesterday";
				
			} else {
				
				switch(true) {
					case (new Date(this.due_date).getDate() < new Date().getDate()):
						msg = "Was Due " + Math.abs(Math.floor(diff/DAY)) + " Days ago";
						break;
					default:
						msg = "Due " + Math.abs(Math.floor(diff/DAY)) + " Days from now";
						break;
				}
			
			};
			return msg;
		};
	},
	
	dueDateInput: function () {
		time = this.due_date;
		if (time && time != null || time && time != undefined) {
			return  pad(time.getMonth() + 1, 2) + "/" + pad(time.getDate(), 2) + "/" + time.getFullYear();
		}
	}
	
};

Tasks = new Meteor.Collection("tasks", {
	transform: function (doc) {
		return new Task(doc);
	}
});

Meteor.autorun(function() {
	Meteor.subscribe("Tasks");
});


Template.tasks.helpers({
	
	actions: function () {
		return ["new", "edit", "view", "delete"];
	}
	
});

Template.tasks_form.rendered = function() {
	$('#task_due_date').datepicker();
}

Template.tasks_list.record = function() {
	var qry = Session.get("currentFilter");
	if (qry) {
		return Tasks.find({$or: [ {'first_name': {$regex: '^.*' + qry + '.*'}}, {'last_name': {$regex: '^.*' + qry + '.*'}}, {'phone': {$regex: '^.*' + qry + '.*'}}, {'email': {$regex: '^.*' + qry + '.*'}} ] }, {sort: {due_date: 1, complete: -1}});
	} else {
		return Tasks.find({}, {sort: {complete: 1, due_date: 1}});
	};
}

Template.tasks_form.record = function() {
	return Tasks.findOne({_id: Session.get("taskId")});
}

Template.tasks_form.customers = function() {
	return Customers.find().fetch();
}

Template.tasks_stub.records = function() {
	var caller_module = "'" + _.singularize(Session.get("currentModule")) + "_id" + "'";
	console.log(caller_module);
	var caller_id = Session.get(_.singularize(Session.get("currentModule")) + "Id")
	console.log(caller_id);
	console.log(Tasks.find({caller_module: "'" + caller_id + "'"}).fetch());
}

Template.tasks_list.events({
  'click button#new_task' : function (event) {
		event.preventDefault();
		Session.set("currentAction", "new");
	},
	
	'click button.view_task': function (event, template) {
		task_id = $("#" + event.currentTarget.id.toString()).attr("task_id");
		Session.set("currentAction", "view");
    Session.set("taskId", task_id);
  },
	
	'click button.edit_task': function (event, template) {
		task_id = $("#" + event.currentTarget.id.toString()).attr("task_id");
		Session.set("currentAction", "edit");
		Session.set("taskId", task_id);
  },
	
	'click button.delete_task': function (event, template) {
		task_id = $("#" + event.currentTarget.id.toString()).attr("task_id");
		Session.set("currentAction", "delete");
		Session.set("taskId", task_id);
	},
	
	'change input[type="checkbox"]': function (event, template) {
		task_id = $("#" + event.currentTarget.id).attr("id");
		checked = $("#" + event.currentTarget.id).attr('checked');
		if (checked === "checked") {
			Tasks.update({_id: task_id}, {$set: {complete: true}});
		} else {
			Tasks.update({_id: task_id}, {$set: {complete: false}});
		};
		
	}
	
});

Template.crud.rendered = function(){
	if (Session.get("currentAction") === "newTask") {
		console.log(Session.get("currentAction"));
		console.log(Session.get("selectedModule"));
		Session.set("currentAction", "new");
		Session.set("selectedModule", "Tasks");
		console.log(Session.get("currentAction"));
		console.log(Session.get("selectedModule"));
	};
}

Template.crud.events({
	'click a#cancel_task, click button#close_task' : function(event) {
		event.preventDefault();
		Session.set("currentAction", false);
		Session.set("taskId", null);
	},
	
	'submit form#save_task, click a#save_task' : function (event) {
		console.log('clicked save task');
		if (event.type === 'click' || event.type === 'submit') {
			event.preventDefault();
			
			var description							= $("#task_description").val();
			var customer_id							= $("#task_customer_id").val();
			var due_date								= $("#task_due_date").val();
			var notes										= $("#task_notes").val();
			var complete								= $("#task_complete").val();
			if (Session.get("currentAction") === "new") {
				
				if(Tasks.insert(
					{user_id: Meteor.user()._id, description: description, customer_id: customer_id, due_date: new Date(due_date), notes: notes, complete: complete})) {
						
						$("#task_description").val(null);
						$("#task_customer_id").val(null);
						$("#task_due_date").val(null);
						$("#task_notes").val(null);
						$("#task_complete").val(null);
						Session.set("currentAction", false);
					};
				
				} else if (Session.get("currentAction") === "edit") {
				
					if (!Tasks.update(Session.get("taskId"), 
						{$set: {user_id: Meteor.user()._id, description: description, customer_id: customer_id, due_date: new Date(due_date), notes: notes, complete:complete}})) {
						
							$("#task_descriptione").val(null);
							$("#task_customer_id").val(null);
							$("#task_due_date").val(null);
							$("#task_notes").val(null);
							$("#task_complete").val(null);
							Session.set("currentAction", false);
							Session.set("taskId", null);
						};
				
					};
			
		};
	},
	
	'click a#edit_task' : function (event) {
		event.preventDefault();
		Session.set("currentAction", "edit");
	}
	
});

function pad (num, size) {
	var num = num.toString();
	var str = "";
	
	if (num.length < size) {
		console.log(size - num.length);
		
		for (var i=0; i < size - num.length; i++) {
			str += "0";
			console.log(str);
		};
		return str + num;
	};
	return num;
}

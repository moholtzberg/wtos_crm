Package.describe({
  summary: "underscore.inflection repackaged for Meteor 0.6.5+"
});

Package.on_use(function (api, where) {
	where = where || ['client', 'server'];
	api.use('underscore', where);
	api.add_files('lib/inflection.js', where);
});

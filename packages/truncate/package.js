Package.describe({
  summary: "My Package"
});

// Tell Meteor what to do with our package at bundle time
Package.on_use(function (api) {
	api.use(["underscore", "templating", "handlebars"], "client");

  // we can add files to the client, server, or both
  // in this case load both.js on the client AND the server
  api.add_files("both.js", ["client", "server"]);


  // Add templates.html and client.js files ONLY on
  // the client
  api.add_files(["template.html", "client.js"], "client");
});
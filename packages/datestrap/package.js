Package.describe({
  summary: "Package for bootstrap datepicker"
});

Package.on_use(function (api) {

  // The api.use method allows us to depend on other
  // packages that ship with meteor or are in our project's
  // package directory
  // api.use(["templating"], "client");

  // Add templates.html and client.js files ONLY on
  // the client
  api.add_files(["style.css", "client.js"], "client");
});
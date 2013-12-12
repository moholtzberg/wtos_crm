Package.on_use(function (api) {
	api.use(['templating']);
	api.add_files(['_search.js'], 'client');
	api.export("_search");
});
Package.on_use(function (api) {
	api.use(['deps', 'templating', 'jquery'], 'client');
	api.export("createRecord");
	api.add_files(['forms.js'], 'client');
});
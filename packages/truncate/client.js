Handlebars.registerHelper("truncate", function (str, options) {
  var truncatedOptions = options.hash || {};
  return str.truncate(truncatedOptions);
});
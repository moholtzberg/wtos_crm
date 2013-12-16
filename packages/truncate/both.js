String.prototype.truncate = function (options) {
  var length = (options && options.length) || 50;
  var ending = (options && options.ending) || "...";
  var truncated = this.slice(0, length);

  if (truncated.length < this.length)
    truncated += ending;

  return truncated;
};
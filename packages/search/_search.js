_search = function(qry, columns) {
	var res = [];
	
	for (var i=0; i < columns.length; i++) {
		
		q = buildQry(columns[i], qry);
		res.push(q);
		
	};
	
	return res;

}

function buildQry(column, qry) {
	var object = {};
	object[column] = new RegExp('^.*' + qry + '.*', 'i');
	return object;
};

function buildRegex(qry) {
	return {$regex: + " " + qry + " " };
};
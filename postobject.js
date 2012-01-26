var http = require('http');

console.log(process.argv);

if (process.argv.length === 4) {
	var url = process.argv[2];
	var originalJson = process.argv[3];
	console.log(originalJson);
	var obj = JSON.parse(originalJson);
	var json = JSON.stringify(obj);
	
	var headers = {
		'Host': 'localhost',
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(json, 'utf8')
	};
	
	var client = http.createClient(3000, 'localhost');
	
	var request = client.request('POST', url, headers);
	request.on('response', function(response) {
		var data = '';
		response.on('data', function(chunk) {
			data += chunk;
		});
		response.on('end', function() {
			console.log('OK\n' + data);
		});
	});
	request.write(json);
	request.end();
	
} else {
	console.log("Usage: node postobject.js <path> <json>");
}

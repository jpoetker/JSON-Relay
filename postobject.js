var http = require('http'),
	URL = require('url');

console.log(process.argv);

if (process.argv.length === 4) {
	var url = process.argv[2];
	var originalJson = process.argv[3];
	console.log(originalJson);
	var obj = JSON.parse(originalJson);
	var json = JSON.stringify(obj);
	
	var parsedUrl = URL.parse(url);
	
	var headers = {
		'Host': parsedUrl.hostname,
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(json, 'utf8')
	};
	
	console.log("creating client for: " + parsedUrl.hostname + ":" + (parsedUrl.port || 80));
	var client = http.createClient(parsedUrl.port || 80, parsedUrl.hostname);
	
	var request = client.request('POST', parsedUrl.path, headers);
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
	console.log("Usage: node postobject.js <url> <json>");
}

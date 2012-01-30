var connect = require("connect")
	, io = require("socket.io");

var CONTENT_TYPE_JSON = {'ContentType': 'application/json'};


var socket = null;
var objects = {};

function configureSocket(name) {
	if (!objects[name]) {
		console.log('configure: ' + name);
		socket.of(name).on('connection', function(client) {
			console.log("connect on " + name);
			client.emit('update', objects[name]);
		});
	}
}

var server = connect.createServer(
	connect.static(__dirname + '/public', {maxAge: 0}),
	connect.router(function(app) {

		app.get('*.json', function(req, res, next) {
			var url = req.url;
			var obj = objects[url];
			
			if (obj) {
				res.writeHead(200, CONTENT_TYPE_JSON);
				res.write(JSON.stringify(obj));
			} else {
				res.writeHead(404, CONTENT_TYPE_JSON);
				res.write(JSON.stringify({'__error__': 'Requested object not found.'}));
			}
			res.end();
		});
		app.post('*.json', function(req, res) {
			var data = '';
			
			console.log("receiving for " + req.url);
			req.on('data', function(chunk) {
				data += chunk;
			});
			req.on('end', function() {
				var obj = null;

				var url = req.url;
				if (data && (data.length > 0) && (url !== 'index.json')) {
					// do this first - if the namespace hasn't been set up
					configureSocket(url);	
									
					obj = JSON.parse(data);
					objects[url] = obj;					
					
					res.writeHead(200, CONTENT_TYPE_JSON);
					res.write(JSON.stringify(obj));
				} else {
					res.writeHead(400, CONTENT_TYPE_JSON);
					res.write(JSON.stringify({'__error__': 'No data was received.'}));
				}
				res.end();
				if (obj && socket) {
					console.log('notifying on ' + url);
					socket.of(url).emit('update', obj);
				}
			});
		});
	})
);

server.listen((process.argv.length === 3) ? process.argv[2] : 3000);

socket = io.listen(server);

socket.enable('browser client minification');
socket.enable('browser client etag');
socket.enable('browser client gzip');
socket.set('log level', 1);
socket.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

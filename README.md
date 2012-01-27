JSON Relay
==========
JSON Relay is a simple node service that can be used to relay JSON data. A process can use an HTTP POST to send JSON data to JSON Relay. JSON Relay will store the data in memory, allowing other processes to use HTTP GET to retrieve the JSON. JSON Relay also supports Socket.IO, which allows clients to subscribe to a JSON object, in which case JSON Relay will "push" updates to the clients when a JSON object has been updated.

Once running, the JSON Relay service will except posts to any URL ending in .json. The body of the POST should contain a JSON object. The services uses the URL path to store the object that is sent in the body. There is no history, only the latest object posted is kept.

To retrieve the object, use the same path the object was POSTed to, and issue an HTTP GET request.

Socket.IO
---------
To subscribe to update events, you'll need to use Socket.IO's namespaces. The namespace is just the path to the object you would like notifications about.

For example, if an object is stored at http://somedomain.io/foo/bar.json, then the following client side JavaScript would subscribe to updates for this object.

```javascript
var socket = io.connect('/foo/bar.json');
socket.on('connect', function() {
	// called on successful connection
	console.log("connected");
});
socket.on('update', function(data) {
	// message received when /foo/bar.json is updated
	console.log(data);
});
```
Be aware that subscribing to a path that does not contain an object, will not succeed. (the connect message will not fire, and you will not receive updates when/if the object is added to the store). It may be a good idea to test for the existence of the object using a standard HTTP GET request before subscribing via Socket.IO.

If an object does not exist, a GET request will return a 404.

Updating Data
-------------
Updates are simple, as described above. Just send the JSON in the body of a POST request sent to the path you would like the object to be stored. 

There is a JavaScript example of this in the repository - see postobject.js

Installing
----------
To install JSON Relay, you'll need node.js installed, and you'll probably want to install the Node Package Manager (npm).

Once you have those two applications, retrieve this repository, and from the root director of json-relay - do the following:

```
npm install connect
npm install socket.io
```

To start the JSON Relay service on port 3000:
```
node app.js
```

To specify a different port (let's say 8080), just add it as a command line argument like so:
```
node app.js 8080
```
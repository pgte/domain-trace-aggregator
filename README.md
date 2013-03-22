# domain-trace-aggregator

Domain Trace Aggregator.

Accepts a domain trace stream and aggregates it in interesting ways.


## Install

```bash
$ npm install domain-trace-aggregator
```

## Use

Pipe a domain trace stream to it:

```javascript
var Aggregator = require('domain-trace-aggregator');
var TraceStream = require('domain-trace-stream');

var aggregator = Aggregator();
var stream = TraceStream();

stream.pipe(aggregator);
```

Extract useful metrics from it:

```javascript

// Get overall server request frequency
var s =
aggregator.watch('http-server-request/frequency');
s.on('data', function(freq) {
  console.log('HTTP server request frequency is %d requests / sec', freq);
});

// Get overall server response latency
var s =
aggregator.watch('http-server-response::latency');
s.on('data', function(average, variance) {
  console.log('HTTP server ');
});

// Get server request frequency on path /logout
var s =
aggregator.watch('http-server-request/frequency?path=/logout');
s.on('data', function(freq) {
  console.log('HTTP server request frequency on path /logout is %d requests / sec', freq);
});
```
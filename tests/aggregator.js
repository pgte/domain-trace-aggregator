var test = require('tap').test;
var TrafficCreator = require('./traffic_creator');
var DomainTraceStream = require('domain-trace-stream');
var Aggregator = require('..');

test('http server frequency works', function(t) {
  var dts = DomainTraceStream();
  var a = Aggregator();
  dts.pipe(a);
  var count = 0;

  var s = a.watch('http-server-request/frequency');
  s.on('readable', function() {
    var freq;
    while(freq = s.read()) {
      t.type(freq, 'number');
      count ++;
    }
  });

  var tc = TrafficCreator();
  var server =
  tc.
    server().
      request('GET', '/logout', 100).
      request('POST', '/logout', 100).
      request('GET', '/users', 50);

  setTimeout(function() {
    t.ok(count > 0);
    server.end();
    t.end();
  }, 4000);
});
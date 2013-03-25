var test = require('tap').test;
var TrafficCreator = require('./traffic_creator');
var LatencyValidator = require('./latency_validator');

var DomainTraceStream = require('domain-trace-stream');
var Aggregator = require('..');

test('http server frequency works', function(t) {
  var dts = DomainTraceStream();
  var a = Aggregator();
  dts.pipe(a);

  var s = a.watch('http-server-response/latency/100');
  var validator = LatencyValidator(t, 0, 300);
  s.pipe(validator);

  var tc = TrafficCreator(300);
  var server =
  tc.
    server().
      request('GET', '/', 100);

  setTimeout(function() {
    // t.ok(validator.count >= 10, 'should have had at least 10 events');
    a.end();
    server.end();
    t.end();
  }, 3000);
});
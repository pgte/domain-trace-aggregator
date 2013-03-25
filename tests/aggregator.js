var test = require('tap').test;
var TrafficCreator = require('./traffic_creator');
var FrequencyValidator = require('./frequency_validator');

var DomainTraceStream = require('domain-trace-stream');
var Aggregator = require('..');

test('http server frequency works', function(t) {
  var dts = DomainTraceStream();
  var a = Aggregator();
  dts.pipe(a);

  var s = a.watch('http-server-request/frequency');

  var validator = FrequencyValidator(t, 30, 50);
  s.pipe(validator);

  var tc = TrafficCreator();
  var server =
  tc.
    server().
      request('GET', '/logout', 100).
      request('POST', '/logout', 100).
      request('GET', '/users', 50);

  setTimeout(function() {
    t.ok(validator.count > 0);
    server.end();
    t.end();
  }, 4000);
});

test('http server frequency filtered by URL works', function(t) {
  var dts = DomainTraceStream();
  var a = Aggregator();
  dts.pipe(a);

  var s = a.watch('http-server-request/frequency?path=/logout');
  var validator = FrequencyValidator(t, 30, 50);
  s.pipe(validator);

  var tc = TrafficCreator();
  var server =
  tc.
    server().
      request('GET', '/logout', 100).
      request('POST', '/logout', 100).
      request('GET', '/users', 50);

  setTimeout(function() {
    t.ok(s.count > 0);
    t.end();
    server.end();
  }, 4000);
});
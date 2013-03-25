var Transform = require('stream').Transform;

module.exports =
function LatencyValidator(t, min, max) {
  var s = new Transform({objectMode: true});

  s.count = 0;

  var expectedIntervalMessage = 'latency between ' + min + ' and ' + max;

  s._transform =
  function _transform(chunk, encoding, done) {
    var latency = chunk;
    t.type(latency, 'object');
    t.type(latency.average, 'number');
    t.type(latency.variance, 'number');
    t.ok(latency.average >= min && latency.average <= max, expectedIntervalMessage);
    s.count ++;
    done();
  };

  return s;
}
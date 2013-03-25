var Transform = require('stream').Transform;
var MA = require('moving-average');
var now = require('microtime').now;

var MAX_COUNT = 50;
var ONE_SECOND_IN_MILLIS = 1000000;

module.exports =
function HttpServerResponseLatency(qs, emitInterval) {

  function matchesQS(event) {
    var keys = Object.keys(qs);
    var match = true;
    var key;
    for(var i = 0 ; i < keys.length; i++) {
      key = keys[i];
      if (event[key] != qs[key]) {
        match = false;
      }
    };
    return match;
  }

  // emitInterval
  if (! emitInterval)
    emitInterval = 1000; // 1 second
  else
    emitInterval = parseInt(emitInterval, 10);

  var s = new Transform({objectMode: true});

  /// Moving average
  
  var ma = MA(emitInterval);

  var interval = setInterval(function() {
    s.push({
      average: (ma.movingAverage() || 0) / 1000,
      variance: ma.variance() / 1000
    });
  }, emitInterval);

  s._transform =
  function _transform(event, encoding, done) {
    if (event.event == 'http-server-response-end' && matchesQS(event)) {
      // console.log('pushing', event);
      ma.push(event.time, event.timeDiff);
    }
    done();
  };

  s.end =
  s.destroy =
  function destroy() {
    console.log('destroying');
    clearInterval(interval);
  };

  return s;
};
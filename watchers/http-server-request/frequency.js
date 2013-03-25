var Transform = require('stream').Transform;
var FM = require('frequency-meter');

var MAX_COUNT = 50;
var ONE_SECOND_IN_MILLIS = 1000000;

module.exports =
function HttpServerRequestFrequency(qs, emitInterval) {

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
  if (! emitInterval) {
    emitInterval = 1000; // 1 second
  } else {
    emitInterval = parseInt(emitInterval, 10);
  }

  var s = new Transform({objectMode: true});

  var fm = FM(emitInterval);

  fm.on('frequency', function(freq) {
    s.push(freq);
  });

  function process(event) {
    if (event.event == 'http-server-request-begin' && matchesQS(event))
      fm.happened();
  }

  s._transform =
  function _transform(d, encoding, done) {
    process(d);
    done();
  };

  s.destroy =
  function destroy() {
    fm.end();
  };

  return s;
};
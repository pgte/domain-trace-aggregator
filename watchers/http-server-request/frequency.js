var Transform = require('stream').Transform;
var microtime = require('microtime');

var MAX_COUNT = 50;
var ONE_SECOND_IN_MILLIS = 1000000;

module.exports =
function HttpServerRequestFrequency() {

  var s = new Transform({objectMode: true});

  var count = 0;
  var start = microtime.now();
  var frequency = 0;

  function happened() {
    count += 1;
    if (count == MAX_COUNT) {
      var end = microtime.now();
      var period = ((end - start) / MAX_COUNT) / ONE_SECOND_IN_MILLIS;
      frequency = 1 / period;
      count = 0;
      s.push(frequency);
    }
  }

  function process(event) {
    if (event.event == 'http-server-request-begin') happened();
  }

  s._transform =
  function _transform(d, encoding, done) {
    process(d);
    done();
  };

  return s;
};
var Transform = require('stream').Transform;

module.exports =
function FrequencyValidator(t, min, max) {
  var s = new Transform({objectMode: true});

  s.count = 0;

  var expectedIntervalMessage = 'freq between ' + min + ' and ' + max;

  s._transform =
  function _transform(chunk, encoding, done) {
    var freq = chunk;
    t.type(freq, 'number');
    t.ok(freq >= min && freq <= max, expectedIntervalMessage);
    s.count ++;
  };

  return s;
}
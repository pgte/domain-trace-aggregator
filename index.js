var PassThrough = require('stream').PassThrough;
var watchExpressionParser = require('./watch_expression_parser');

var watchers = [
  'http-server-request'
];

var watcherByEvent = {};
watchers.forEach(function(event) {
  watcherByEvent[event] = require('./watchers/' + event);
});


module.exports =
function Aggregator() {
  var s = new PassThrough({objectMode: true});

  s.watch =
  function watch(expr) {
    var spec = watchExpressionParser.parse(expr);
    var watcher = watcherByEvent[spec.event];
    var path = spec.path;
    if (path) {
      while(path.length) {
        var part = path.shift();
        if (watcher.hasOwnProperty(part)) {
          watcher = watcher[part];
        } else {
          path.unshift(part);
        }
      }
    }
    if (watcher) {
      path.unshift(spec.qs);
      var watcherStream = watcher.apply(watcher, path);
      s.pipe(watcherStream);
      return watcherStream;      
    }
  }  

  return s;
}
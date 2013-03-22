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
      for(var i = 0 ; i < path.length; i++) {
        watcher = watcher[path[i]];
        if (! watcher) break;
      }
    }
    var watcherStream = watcher();
    if (watcher) s.pipe(watcherStream);
    return watcherStream;
  }  

  return s;
}
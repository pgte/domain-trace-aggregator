var http = require('http');
var domain = require('domain');

var randomPort = function() {
  return Math.ceil(Math.random() * 8000) + 1024;
}

module.exports =
function TrafficCreator() {
  var ret = {};

  ret.server =
  function Server() {
    var intervals = [];
    var ret = {};
    
    /// Setup server

    var server = http.createServer();
    var port = randomPort();
    var isListening = false;
    
    server.once('listening', function() {
      isListening = true;
    });
    
    server.on('request', function(req, res) {
      var d = domain.create();
      d.add(req)
      d.add(res);
      d.run(function() {
        req.resume();
        setTimeout(function() {
          res.end();
        }, Math.ceil(Math.random() * 300));        
      });
    });

    server.listen(port);

    function listening(cb) {
      if (isListening) cb();
      else server.once('listening', cb);
    }


    ret.request =
    function requests(method, path, interval) {
      listening(function() {
        intervals.push(setInterval(function() {
          var d = domain.create();
          d.run(function() {
            var requestOptions = {
              hostname: 'localhost',
              port: port,
              method: method,
              path: path
            };
            http.request(requestOptions, function(res) {
              res.resume();
            }).end();
          });          
        }, interval));
      });

      return ret;
    };

    ret.end =
    function end() {
      while(intervals.length) {
        var interval = intervals.splice(0, 1)[0];
        if (interval) clearInterval(interval);
      }
      server.close();
      return ret;
    };

    return ret;
  }

  return ret;
}
function parseQueryString(qs) {
  var res = {};
  if (qs) {
    var parts = qs.split('&');
    parts.forEach(function(part) {
      var assignment = part.split('=');
      if (assignment.length < 2) assignment[1] = true;
      var left = decodeURIComponent(assignment[0]);
      var right = decodeURIComponent(assignment[1]);
      res[left] = right;
    });
  }
  return res;
}

function parsePath(path) {
  var parts = path.split('/');
  if (parts.length < 1) throw new Error('Invalid path in expression: ' + path);
  return {
    event: parts.splice(0, 1)[0],
    path: parts
  };
}

module.exports.parse =
function parse(expr) {
  // split query string
  var parts = expr.split('?');
  if (parts > 2) throw new Error('Parse Error: expression contains more that one ?: ' + expr);
  
  var qs = parts[1];
  var path = parts[0];

  var spec = parsePath(path);
  spec.qs = parseQueryString(qs);
  return spec;
}
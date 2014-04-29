var fs = require('fs');

var tplRE = /{{(.+)}}/g;
var tpl = {
  boot: fs.readFileSync(__dirname + '/tpl/boot.js', 'utf-8'),
  module: fs.readFileSync(__dirname + '/tpl/module.js', 'utf-8'),
  require: fs.readFileSync(__dirname + '/tpl/require.js', 'utf-8')
};

function template(tpl, values) {
  return tpl.replace(tplRE, function(m, key) {
    return values[key];
  });
}

module.exports = {
  define: function(module, contents) {
    return template(tpl.module, {
      module: module,
      js: contents
    });
  },
  boot: function(module, contents) {
    return template(tpl.boot, {
      module: module,
      js: contents,
      require: tpl.require
    });
  }
};

var gutil = require('gulp-util');
var path = require('path');
var requires = require('requires');
var es = require('event-stream');

module.exports = function() {
  var files = {};

  var resolver = es.map(function(file, done) {
    files[file.path] = file.relative;
    done(null, file);
  });

  var wrapper = es.map(function(file, done) {
    if (file.isNull()) return done();
    if (file.isStream()) return done(new gutil.PluginError('gulp-requirer', 'Streaming not supported'));

    var js = requires(file.contents.toString(), function(module) {
      return 'require("' + resolve(file.relative, module.path) + '")';
    });

    file.contents = new Buffer(wrap(file.relative, js));
    done(null, file);
  });

  return es.pipeline(
    es.through(),
    resolver,
    es.log(files),
    wrapper
  );
};

function removeExtension(file) {
  return gutil.replaceExtension(file, '');
}

function resolve(file, target) {
  if (/^\.\.?\//.test(target)) {
    return removeExtension(path.relative(path.dirname(file), target));
  } else {
    return target;
  }
}

function wrap(file, js) {
  return 'require.register("' + removeExtension(file) + '", function(exports, module) {\n'
    + js + '\n'
    + '});\n';
}

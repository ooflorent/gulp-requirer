var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var wrapper = require('./lib/wrapper');

var File = gutil.File;
var PluginError = gutil.PluginError;

function requirer(file, main) {
  if (!file) throw new PluginError('gulp-requirer', 'Missing file option for gulp-requirer');
  if (!main) throw new PluginError('gulp-requirer', 'Missing main option for gulp-requirer');

  var buffer = [];
  var firstFile;

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-requirer', 'Streaming not supported'));
      return cb();
    }

    if (file.path.slice(-3) !== '.js') {
      this.emit('error', new PluginError('gulp-requirer', 'File not supported'));
      return cb();
    }

    if (!firstFile) {
      firstFile = file;
    }

    var resolved = path.relative(path.resolve(file.base), file.path).slice(0, -3);
    buffer.push(new Buffer(wrapper.define(resolved, file.contents.toString())));
    return cb();
  }, function(cb) {
    if (firstFile) {
      this.push(new File({
        cwd: firstFile.cwd,
        base: firstFile.base,
        path: path.join(firstFile.base, file),
        contents: new Buffer(wrapper.boot(main, Buffer.concat(buffer).toString()))
      }));
    }
    return cb();
  });
}

requirer.compress = function() {
  var moduleRE = /_require\[["']([^"']+)["']\]/g;
  var requireRE = /require\(["']([^"']+)["']\)/g;

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-requirer', 'Streaming not supported'));
      return cb();
    }

    var modules = {};
    var contents = file.contents.toString();
    var index = 0;
    var res;

    while (res = moduleRE.exec(contents)) {
      modules[res[1]] = index++;
    }

    contents = contents.replace(moduleRE, function(s, module) {
      return '_require[' + modules[module] + ']';
    });

    contents = contents.replace(requireRE, function(s, module) {
      return 'require(' + modules[module] + ')';
    });

    file.contents = new Buffer(contents);
    this.push(file);
    return cb();
  });
};

module.exports = requirer;

var concat = require('gulp-concat');
var es = require('event-stream');

var runtime = require('./lib/runtime');
var standalone = require('./lib/standalone');
var wrap = require('./lib/wrap');

module.exports = function(opts) {
  if (!opts) opts = {};

  if (!opts.file) opts.file = 'build.js';
  if (!opts.main) opts.main = 'main';

  return es.pipeline(
    wrap(),
    concat(opts.file),
    runtime(),
    standalone(opts.main)
  );
};

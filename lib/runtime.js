var es = require('event-stream');
var fs = require('fs');

var runtime = new Buffer(fs.readFileSync(require.resolve('component-require2'), 'utf8'));

module.exports = function() {
  return es.map(function(file, done) {
    file.contents = Buffer.concat([
      runtime,
      file.contents,
    ]);
    done(null, file);
  });
};

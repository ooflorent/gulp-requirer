var es = require('event-stream');

module.exports = function(module) {
  return es.map(function(file, done) {
    file.contents = Buffer.concat([
      file.contents,
      new Buffer('require("' + module + '");\n')
    ]);
    done(null, file);
  });
};

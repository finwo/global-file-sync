const fs   = require('fs');
const path = require('path');

module.exports = {
  id      : path.basename(__dirname),
  shebang : [],
  header  : [],
  content : [],
};

const optional = name => {
  try {
    const data = fs.readFileSync(__dirname+path.sep+name).toString().split('\r\n').join('\n').split('\n');
    while(!data[data.length-1]) data.pop();
    module.exports[name] = data;
  } catch(e) {
    // Do nothing
  }
};

optional('shebang');
optional('header');
optional('content');

if (module.exports.header) {
  module.exports.header[0] = module.exports.header[0].replace('{{id}}',module.exports.id);
}

module.exports.match = [].concat(module.exports.shebang, module.exports.header);

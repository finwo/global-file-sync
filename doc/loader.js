const fs   = require('fs');
const path = require('path');

const optional = (out,id,name) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname,id,name)).toString().split('\r\n').join('\n').split('\n');
    out[name] = data;
  } catch(e) {
    // Do nothing
  }
};

module.exports = id => {
  const out = {
    id      : id,
    name    : fs.readFileSync(path.resolve(__dirname,id,'name')).toString().split('\r\n').join('\n').split('\n').shift(),
    shebang : [],
    header  : [],
    content : [],
  };

  optional(out,id,'shebang');
  optional(out,id,'header');
  optional(out,id,'content');

  // Remove tailing newlines from shebang + header
  if (out.shebang.length) while(!out.shebang[out.shebang.length-1]) out.shebang.pop();
  if (out.header.length) while(!out.header[out.header.length-1]) out.header.pop();

  // Replace ID marker in header
  if (out.header) {
    out.header[0] = out.header[0].replace('{{id}}',id);
  }

  out.match = [].concat(out.shebang, out.header);

  return out;
};

const fs   = require('fs');
const path = require('path');

module.exports = fs
  .readdirSync(__dirname)
  .map(entry => {
    const stat = fs.statSync(__dirname + path.sep + entry);
    if (!stat.isDirectory()) return null;
    return require(__dirname + path.sep + path.basename(entry));
  })
  .filter(entry => entry);

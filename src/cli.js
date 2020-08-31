const argv = require('minimist')(process.argv.slice(2));
const fs   = require('fs');
const path = require('path');

// Recursive scandir
const scandir = async (dir) => {
  const files     = [];
  const closedset = [];
  const openset   = [dir];
  while(openset.length) {
    const current = openset.shift();
    if (~closedset.indexOf(current)) continue;
    closedset.push(current);
    const stat = await new Promise((r,c) => fs.stat(current, (e,d)=>e?c(e):r(d)));
    if (!stat.isDirectory()) {
      files.push(current);
      continue;
    }
    const entries = await new Promise((r,c) => fs.readdir(current, (e,d)=>e?c(e):r(d)));
    for(const entry of entries) {
      if ('.' === entry.substr(0,1)) continue;
      if ('node_modules' === entry) continue;
      openset.push(path.resolve(current, entry));
    }
  }
  return files;
};

(async () => {
  const documents = require(path.resolve(__dirname,'..','doc'));
  const files     = await scandir(process.cwd());

  await Promise.all(files.map(async filename => {
    const stat = await new Promise((r,c) => fs.stat(filename,(e,d)=>e?c(e):r(d)));
    const data = await new Promise((r,c) => fs.readFile(filename,(e,d)=>e?c(e):r(d.toString().split('\r\n').join('\n').split('\n'))));
    for(const document of documents) {
      if (!document.match.length) continue;

      // Check if the file start matches
      let i;
      for(i=0;i<document.match.length;i++) {
        if (data[i] !== document.match[i]) break;
      }
      if (i !== document.match.length) {
        continue;
      }

      // Update the file
      const newData = [].concat(document.shebang, document.header, document.content).join('\n');
      await new Promise((r,c) => fs.writeFile(filename, newData, (e,d)=>e?c(e):r(d)));
    }
  }));
})();

#!/usr/bin/env node

const argv      = require('minimist')(process.argv.slice(2));
const fs        = require('fs');
const path      = require('path');
const documents = require(path.resolve(__dirname,'..','doc'));

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
      // if ('.' === entry.substr(0,1)) continue;
      if ('node_modules' === entry) continue;
      openset.push(path.resolve(current, entry));
    }
  }
  return files;
};

// Handle file init
if (argv.init) {
  for(const document of documents) {
    if (document.name !== argv.init) continue;
    fs.writeFileSync(document.name, [].concat(document.shebang,document.header,document.content).join('\n'));
    process.stdout.write(argv.init + ' written\n');
    process.exit(0);
  }
  process.stdout.write('No match found\n');
  process.exit(1);
}

(async () => {
  const files     = await scandir(process.cwd());

  await Promise.all(files.map(async filename => {
    const stat = await new Promise((r,c) => fs.stat(filename,(e,d)=>e?c(e):r(d)));
    const data = await new Promise((r,c) => fs.readFile(filename,(e,d)=>e?c(e):r(d.toString().split('\r\n').join('\n').split('\n'))));
    for(const document of documents) {
      if (!document.match.length) continue;

      // Check if the file is tracked
      let i;
      for(i=0;i<document.match.length;i++) {
        if (data[i] !== document.match[i]) break;
      }
      if (i !== document.match.length) {
        continue;
      }

      // Generate new content
      const newData = [].concat(document.shebang, document.header, document.content).join('\n');

      // Fetch old data to compare
      const oldData = fs.readFileSync(filename).toString();
      const fname   = filename.replace(process.cwd(), '.');

      // Update & notify user
      if (newData == oldData) {
        process.stdout.write('Up-to-date : ' + fname + '\n');
      } else {
        await new Promise((r,c) => fs.writeFile(filename, newData, (e,d)=>e?c(e):r(d)));
        process.stdout.write('Updated    : ' + fname + '\n');
      }

    }
  }));
})();

#!/usr/bin/env node

const argv      = require('minimist')(process.argv.slice(2));
const fs        = require('fs');
const path      = require('path');
const mkdirp    = require('mkdirp');
const documents = require(path.resolve(__dirname,'..','doc'));

// Recursive scandir
const scandir = async (dir) => {
  const files     = [];
  const closedset = [];
  const openset   = [dir];
  while(openset.length) {
    let stat;
    let entries;
    const current = openset.shift();
    if (~closedset.indexOf(current)) continue;
    closedset.push(current);
    try {
      stat = await new Promise((r,c) => fs.stat(current, (e,d)=>e?c(e):r(d)));
    } catch(e) {
      continue;
    }
    if (!stat.isDirectory()) {
      files.push(current);
      continue;
    }
    try {
      entries = await new Promise((r,c) => fs.readdir(current, (e,d)=>e?c(e):r(d)));
    } catch(e) {
      continue;
    }
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
    mkdirp.sync(path.dirname(document.name));
    fs.writeFileSync(document.name, [].concat(document.shebang,document.header,document.content).join('\n'));
    process.stdout.write(argv.init + ' written\n');
    process.exit(0);
  }
  process.stdout.write('No match found\n');
  process.exit(1);
}

const updateFile = async filename => {
  if (!filename) return;
  const stat = await new Promise((r,c) => fs.stat(filename,(e,d)=>e?c(e):r(d)));

  // Fetch largest document's size
  let largestDocument = 0;
  for(const document of documents) {
    const size = document.content.map(e => e.length).reduce((r,a)=>r+a,0);
    if (size > largestDocument) largestDocument = size;
  }

  // Skip if file > document*2 (safety & sanity)
  if (stat.size > (largestDocument*2)) {
    return;
  }

  // Read the file for checking
  const data = await new Promise((r,c) => fs.readFile(filename,(e,d)=>e?c(e):r(d.toString().split('\r\n').join('\n').split('\n'))));

  // Check which document is matching
  for(const document of documents) {
    if (!document.match.length) continue;
    const fname = filename.replace(process.cwd(), '.');
    process.stdout.write("\x1b[KChecking   : " + fname + "\r");

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

    // Update & notify user
    if (newData == oldData) {
      process.stdout.write('Up-to-date : ' + fname + '\n');
    } else {
      await new Promise((r,c) => fs.writeFile(filename, newData, (e,d)=>e?c(e):r(d)));
      process.stdout.write('Updated    : ' + fname + '\n');
    }

  }
};

(async () => {
  const files   = await scandir(process.cwd());
  const runners = [];

  // Start N runners
  for(let i=0; i<4; i++) {
    runners.push(updateFile(files.shift()));
  }

  // Run through files
  while(files.length) {
    await runners.shift();
    runners.push(updateFile(files.shift()));
  }

  // Await remaining runners
  while(runners.length) {
    await runners.shift();
  }

})();

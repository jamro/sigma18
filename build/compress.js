#!/usr/bin/env node
'use strict'

const fs = require('fs');
const compressNames = require('./compress/compressNames.js')
const compressText = require('./compress/compressText.js')

if(process.argv.length < 3) {
  console.error('Error: filename is required');
  process.exit(1);
}

var filename = process.argv[2];

fs.readFile(filename, function(err, data) {
  if(err) {
    console.error(err);
    process.exit(1);
  }
  let code = data.toString();
  let sizeBefore = code.length;

  code = compressNames(code);
  code = compressText(code);

  let sizeAfter = code.length;
  console.log(`Size reduction: ${sizeBefore}B -> ${sizeAfter}B\nCompression Ratio: ${(100*sizeBefore/sizeAfter).toFixed(1)}%\nSaved: ${sizeBefore-sizeAfter}B`);

  const fs = require('fs');
  fs.writeFile(filename, code, function(err) {
      if(err) {
          return console.error(err);
      }
      console.log("Compressed file was saved!");
  });

});

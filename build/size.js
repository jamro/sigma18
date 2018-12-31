#!/usr/bin/env node
'use strict'

const getSize = require('get-folder-size');

getSize('./dist', /gwgc201819_overlay\.png/, (err, size) => {
  if (err) { throw err; }
  let limit = 128000;
  let percentage = 100*(size/limit)
  console.log(`Size: ${size} bytes (${percentage.toFixed(1)}%)`);
  if(size > limit ) {
    console.error('The file exceeded the limit');
    process.exit(1);
  }
});

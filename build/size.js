#!/usr/bin/env node
'use strict'

const fs = require('fs');

function rightPad(txt, len, char) {
  char = char || " ";
  while (txt.length < len) txt += char;
  return txt;
}

function leftPad(txt, len, char) {
  txt = txt + "";
  char = char || " ";
  while (txt.length < len) txt = char + txt;
  return txt;
}

function getSize(path, exclude, total) {
  total = total ? total : 0;
  fs.readdirSync(path).forEach(file => {
    let subPath = path + '/' + file;
    if(exclude.test(subPath)) {
      return;
    }
    let stats = fs.lstatSync(subPath);
    console.log(`${rightPad(subPath, 40)} ${leftPad(stats.size, 10)} bytes`);
    total += stats.size;
    if(stats.isDirectory()) {
      total += getSize(subPath, exclude, total);
    }
  });
  return total;
}

let total = getSize('./dist', /gwgc201819_overlay\.png/);
let limit = 128000;
let percentage = 100*(total/limit);
console.log(rightPad("", 60, "="));
console.log(`${rightPad("TOTAL PACKAGE SIZE", 40)} ${leftPad(total, 10)} bytes`);
console.log(`${rightPad("PACKAGE SIZE LIMIT", 40)} ${leftPad(limit, 10)} bytes`);
console.log(`${rightPad("PERCENTAGE", 40)} ${leftPad(percentage.toFixed(2), 10)} %`);

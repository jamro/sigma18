import '../styles/reset.scss';
import '../styles/page.scss';
import '../styles/terminal.scss';
import '../styles/screen.scss';


import HelpCommand from './system/terminal/command/HelpCommand.js';
import ComCommand from './system/terminal/command/ComCommand.js';
import SfxCommand from './system/terminal/command/SfxCommand.js';
import DebugCommand from './system/terminal/command/DebugCommand.js';

import MapBuilder from './world/map/MapBuilder.js';
import Container from './Container.js';

let hasCorrectBrowser = (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor));
if(!hasCorrectBrowser) {
  alert("This game was created for Gynvael's Winter GameDev Challenge 2018/19 and should be played in latest Chrome! Browser support was limited to reduce file size and fit 125KB limit (see the challenge rules for more info). It may not work properly in your browser!");
}

let screenAElement, screenBElement, overlayElement;
screenAElement = document.createElement('DIV');
screenAElement.id = "screen-a";
document.body.appendChild(screenAElement);

screenBElement = document.createElement('DIV');
screenBElement.id = "screen-b";
document.body.appendChild(screenBElement);

overlayElement = document.createElement('IMG');
overlayElement.id = "overlay";
overlayElement.src = '../img/gwgc201819_overlay.png';
document.body.appendChild(overlayElement);


let screenA = new Container(screenAElement, overlayElement, 64, 185, 1025, 770);
let screenB = new Container(screenBElement, overlayElement, 1140, 77, 721, 482);

let builder = new MapBuilder();
builder.build$$(document);
let map = builder.getMap$$();
let sideSreen = builder.getSideScreen$$();
let terminal = builder.getTerminal$$();

terminal.view$$.attachToDOM$$(document.querySelector('#screen-a'));
sideSreen.view$$.attachToDOM$$(document.querySelector('#screen-b'));

terminal.installCommand$$(new HelpCommand());
terminal.installCommand$$(new SfxCommand(builder.getSoundPlayer$$()));
terminal.installCommand$$(new ComCommand(map));
if(DEBUG_MODE) {
  terminal.installCommand$$(new DebugCommand(builder));
}

let chromeInfo = hasCorrectBrowser ? '' : 'r{WARNING! Use Chrome web browser for the best gaming experience!}r';

if(!DEBUG_MODE) {
  terminal.view$$.disable$$();
  terminal.sequence$$(
    "",
    "-----------------------------",
    "SIGMA-18 GAME" + (DEBUG_MODE ? " (DEBUG MODE)" : ""),
    "-----------------------------",
    "Version of terminal: 1.1.0",
    "Have fun :)",
    "",
    chromeInfo,
    "",
    "s{PRESS ENTER TO BEGIN YOUR ADVENTURE :)}s",
    "",
    {c:'pause'},
    {c:'sound', d:'ok'},
    {c:'chat', d:[
      ['comander', 'This is commander of Sierra-23, Alex Decker speaking!!!'],
      ['comander', 'Sir! Two of our engines are damaged! Emergency landing at Sigma-18! Approaching DS003...'],
      ['comander', 'We cannot keep the approach path! We are too far on the left!'],
      ['comander', "Mayday, mayday, mayday..."],
      ['comander', "m{...}m"]
    ], t: 100},
    {c:'chat', d:[
      ['hacker', "Sierra-23, What is the status?"],
      ['commander', "Spaceship wrecked during landing. We cannot use it to get out from here anymore. We are at Sigma-18 Space Station. There seems to be not a soul in the whole location."],
      ['commander', "Sir! We need your help! Connect to Sigma-18 Space Station gateway and help us to get away from here!"]
    ], t: 500},
    {c:'pause'},
    {c: 'ln', d:'<div class="terminal-command">s{&gt;}s ssh hacker@sigma18.iss.gov</div>'},
    {c: 'ln', d:"Connecting to sigma18.iss.gov port 22...", t: 500},
    {c: 'ln', d:"Connection established", t: 500},
    "",
    "Enabling compatibility mode for protocol 2.0",
    "Remote protocol version 2.0, remote software version OpenSSH 7",
    "Authenticating to sigma18.iss.gov:22...",
    "Server accepts key",
    "Authentication succeeded (publickey)",
    "",
    "Floor plan streaming.",
    "Buffering...",
    {c: 'sound', d: 'ok', t:0},
    {c: (done) => {
      sideSreen.view$$.turnOn$$(() => {
        sideSreen.showMap$$(map);
        done();
      });
    }},
    "Map preview available.",
    "",
    "",
    "Welcome to Space Station Sigma-18",
    "Type s{help}s and press ENTER to see available commands.",
    {c: 'sound', d: 'ok', t:0},
    {c: 'on', t:0}
  );

  window.onbeforeunload = function(){
    return 'Are you sure you want to leave?';
  };
} else {
  sideSreen.view$$.turnOn$$(() => {
    sideSreen.showMap$$(map);
  });
}

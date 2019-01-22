import '../styles/reset.scss';
import '../styles/page.scss';
import '../styles/terminal.scss';
import '../styles/screen.scss';

import Intro from './Intro.js';
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
let system = builder.getSystem$$();
let sideScreen = builder.getSystem$$().getSideScreen$$();
let terminal = builder.getSystem$$().getTerminal$$();

terminal.view$$.attachToDOM$$(document.querySelector('#screen-a'));
sideScreen.view$$.attachToDOM$$(document.querySelector('#screen-b'));

system.installCommand$$(new HelpCommand());
system.installCommand$$(new SfxCommand());
system.installCommand$$(new ComCommand());

if(DEBUG_MODE) {
  system.installCommand$$(new DebugCommand(builder));
  sideScreen.showMap$$(map);
} else {
  let intro = new Intro(system);
  intro.play$$(hasCorrectBrowser);
}

window.onbeforeunload = function() {
  return 'Are you sure you want to leave?';
};

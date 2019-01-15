import TerminalView from './system/terminal/TerminalView.js';
import Terminal from './system/terminal/Terminal.js';
import ScreenView from './system/screen/ScreenView.js';
import Screen from './system/screen/Screen.js';
import ServiceDirectory from './world/ServiceDirectory.js';
import HelpCommand from './system/terminal/command/HelpCommand.js';
import ComCommand from './system/terminal/command/ComCommand.js';
import SfxCommand from './system/terminal/command/SfxCommand.js';
import SoundPlayer from './system/common/SoundPlayer.js';

import Squad from './world/Squad.js';
import MapBuilder from './world/map/MapBuilder.js';
import Container from './Container.js';

let screenA = new Container(document, '#screen-a', '#overlay', 64, 185, 1025, 770);
let screenB = new Container(document, '#screen-b', '#overlay', 1140, 77, 721, 482);

let services = new ServiceDirectory();
let player = new SoundPlayer();
let builder = new MapBuilder(services);
builder.build$$();
let map = builder.getMap$$();

let sideSreen = new Screen(new ScreenView(document), player);
let terminal = new Terminal(services, new TerminalView(document), player);

terminal.getView$$().attachToDOM$$(document.querySelector('#screen-a'));
sideSreen.getView$$().attachToDOM$$(document.querySelector('#screen-b'));

let squad = new Squad(map, terminal, sideSreen, player);
terminal.installCommand$$(new HelpCommand());
terminal.installCommand$$(new SfxCommand(player));
terminal.installCommand$$(new ComCommand(squad, map, terminal));
builder.placeItems$$(squad, map, map.getVirus$$());

terminal.getView$$().disable$$();
terminal.sequence$$(
  "",
  "-----------------------------",
  "SIGMA-18 GAME",
  "-----------------------------",
  "Version of terminal: 1.0.0",
  "Have fun :)",
  "",
  "",
  "s{PRESS ENTER TO BEGIN YOUR ADVENTURE :)}s",
  "",
  {c:'pause'},
  {c:'sound', d:'ok'},
  {c:'chat', d:[
    ['comander', 'This is commander of Sierra-23, Kate Decker speaking!!!'],
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
    sideSreen.getView$$().turnOn$$(() => {
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

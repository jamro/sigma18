import TerminalView from './system/TerminalView.js';
import Terminal from './system/Terminal.js';
import ScreenView from './system/ScreenView.js';
import Screen from './system/Screen.js';
import HelpCommand from './system/command/HelpCommand.js';
import ComCommand from './system/command/ComCommand.js';
import SfxCommand from './system/command/SfxCommand.js';
import SoundPlayer from './system/common/SoundPlayer.js';

import Squad from './Squad.js';
import MapBuilder from './map/MapBuilder.js';


let player = new SoundPlayer();
let builder = new MapBuilder();
builder.build();
let map = builder.getMap();

let sideSreen = new Screen(new ScreenView(document), player);
let terminal = new Terminal(new TerminalView(document), player);

terminal.getView().attachToDOM(document.querySelector('#screen-a'));
sideSreen.getView().attachToDOM(document.querySelector('#screen-b'));

let squad = new Squad(map, terminal, sideSreen, player);
terminal.installCommand(new HelpCommand());
terminal.installCommand(new SfxCommand(terminal, sideSreen));
terminal.installCommand(new ComCommand(squad, map, terminal));
builder.placeItems(squad, map, map.getVirus());

terminal.getView().disable();
terminal.sequence(
  "",
  "-----------------------------",
  "SIGMA-18 GAME",
  "-----------------------------",
  "Version of terminal: 1.0.0",
  "Have fun :)",
  "",
  "",
  "s{PRESS ANY KEY TO BEGIN YOUR ADVENTURE :)}s",
  "",
  {c:'pause'},
  {c:'sound', d: 'chat'},
  {c:'chat', d:'Sir, two of our engines are damaged! Emergency landing at Sigma-18! Approaching DS003...', f:'sierra-23', t: 100},
  {c:'chat', d:"I cannot keep the approach path! We are too far on the left!", f:'sierra-23', t: 2000},
  {c:'sound', d: 'chat', t: 0},
  {c:'chat', d:"Mayday, mayday, mayday...", f:'sierra-23', t: 1500},
  {c:'sound', d: 'chat', t: 0},
  {c:'chat', d:"...", f:'sierra-23', t: 1000},
  {c:'sound', d: 'chat', t: 0},
  {c:'pause'},
  {c:'sound', d: 'chat'},
  {c:'chat', d:"Sierra-23, What is the status?", f:'hacker'},
  {c:'chat', d:"Spaceship wrecked during landing. We cannot use it to get out from here anymore. We are at Sigma-18 Space Station. There seems to be not a soul in the whole location.", f:'commander', t: 1000},
  {c:'sound', d: 'chat'},
  {c:'chat', d:"Sir! We need your help! Connect to Sigma-18 Space Station gateway and help us to get away from here!", f:'commander', t: 1000},
  {c:'sound', d: 'chat'},
  {c:'pause'},
  {c: 'ln', d:'<div class="terminal-command">s{&gt;}s ssh hacker@sigma18.iss.gov</div>'},
  {c: 'sound', d: 'ok', t:0},
  {c: 'ln', d:"Connecting to sigma18.iss.gov port 22...", t: 500},
  {c: 'ln', d:"Connection established", t: 500},
  "",
  "Enabling compatibility mode for protocol 2.0",
  "Remote protocol version 2.0, remote software version OpenSSH 7",
  "Authenticating to sigma18.iss.gov:22...",
  "Server accepts key",
  "Authentication succeeded (publickey)",
  "Floor plan streaming started",
  {c: () => sideSreen.showMap(map)},
  "",
  "",
  "Welcome to Space Station Sigma-18",
  "Type s{help}s and press ENTER to see available commands.",
  {c: 'sound', d: 'ok', t:0},
  {c: 'on', t:0}
);

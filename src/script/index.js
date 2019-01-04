import TerminalView from './system/TerminalView.js';
import Terminal from './system/Terminal.js';
import ScreenView from './system/ScreenView.js';
import Screen from './system/Screen.js';
import HelpCommand from './system/command/HelpCommand.js';
import ComCommand from './system/command/ComCommand.js';
import SfxCommand from './system/command/SfxCommand.js';

import Squad from './Squad.js';
import MapBuilder from './map/MapBuilder.js';

let builder = new MapBuilder();
builder.build();
let map = builder.getMap();

let sideSreen = new Screen(new ScreenView(document));
let terminal = new Terminal(new TerminalView(document));

terminal.getView().attachToDOM(document.querySelector('#screen-a'));
sideSreen.getView().attachToDOM(document.querySelector('#screen-b'));

let squad = new Squad(map, terminal, sideSreen);
terminal.installCommand(new HelpCommand());
terminal.installCommand(new SfxCommand(terminal, sideSreen));
terminal.installCommand(new ComCommand(squad, map, terminal));

terminal.getView().println("Welcome at Space Station Sigma-18");
terminal.getView().println("Version of terminal: 1.0.0");
terminal.getView().println("\n\n");
terminal.getView().println("Type s|help|s and press ENTER to see available commands.");

sideSreen.showMap(map);

/*
terminal.sequence([
  () => { terminal.println("A")},
  () => { terminal.println("B")},
  {c: 'pass', d: 100, t: 300},
  () => { terminal.println("C")},
  () => { terminal.println("D")},
  {c: 'load', t: 300},
  () => { terminal.println("E")},
  {c: () => { terminal.println("LONG 1")}},
  "JULIA",
  {c: 'ln', d: "Hello", t: 400},
  {c: 'sound', d: "com", t: 1},
  {c: 'chat', d: "Hello", f: 'jmr', t: 100},
]);
*/

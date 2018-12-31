import TerminalView from './system/TerminalView.js';
import Terminal from './system/Terminal.js';
import ScreenView from './system/ScreenView.js';
import HelpCommand from './system/command/HelpCommand.js';
import ComCommand from './system/command/ComCommand.js';

import Squad from './Squad.js';
import Map from './map/Map.js';
import MapRenderer from './map/MapRenderer.js';

let map = new Map(10, 10);
let squad = new Squad(map);
map.setSquadPosition(3, 3);

map.addDoor(3, 3, 3, 4);
map.addDoor(3, 3, 3, 2);
map.addDoor(3, 2, 2, 2);
map.addDoor(3, 2, 4, 2);

let terminalView = new TerminalView(document);
let screenView = new ScreenView(document);
let terminal = new Terminal(terminalView);
document.querySelector('#screen-a').appendChild(terminalView.getDOM());
document.querySelector('#screen-b').appendChild(screenView.getDOM());
terminalView.enableAutoFocus();
screenView.rescale();

terminal.installCommand(new HelpCommand());
terminal.installCommand(new ComCommand(squad, map));

terminalView.println("Welcome at Space Station Sigma-18");
terminalView.println("Version of terminal: 1.0.0");
terminalView.println("\n\n");
terminalView.println("Type <strong>help</strong> and press ENTER to see available commands.");

let mapRenderer = new MapRenderer(map, screenView);

setInterval(() => {
  mapRenderer.render();
}, 250);

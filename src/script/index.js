import TerminalView from './terminal/TerminalView.js';
import Terminal from './terminal/Terminal.js';
import HelpCommand from './terminal/command/HelpCommand.js';
import ComCommand from './terminal/command/ComCommand.js';
import Squad from './Squad.js';
import Map from './map/Map.js';

let map = new Map(10, 10);
let squad = new Squad(map);
map.setSquadPosition(3, 3);

map.addDoor(3, 3, 3, 4);
map.addDoor(3, 3, 3, 2);
map.addDoor(3, 2, 2, 2);
map.addDoor(3, 2, 4, 2);

let terminalView = new TerminalView(document);
let terminal = new Terminal(terminalView);
document.querySelector('#screen-a').appendChild(terminalView.getDOM());
terminalView.enableAutoFocus();

terminal.installCommand(new HelpCommand());
terminal.installCommand(new ComCommand(squad, map));

terminalView.println("Welcome at Space Station Sigma-18");
terminalView.println("Version of terminal: 1.0.0");
terminalView.println("\n\n");
terminalView.println("Type <strong>help</strong> and press ENTER to see available commands.");

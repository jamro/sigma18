import TerminalView from './system/TerminalView.js';
import Terminal from './system/Terminal.js';
import ScreenView from './system/ScreenView.js';
import HelpCommand from './system/command/HelpCommand.js';
import ComCommand from './system/command/ComCommand.js';
import DoorCommand from './system/command/DoorCommand.js';
import Note from './item/Note.js';
import Disk from './item/Disk.js';

import Squad from './Squad.js';
import Map from './map/Map.js';
import MapRenderer from './map/MapRenderer.js';

let map = new Map(10, 10);
let squad = new Squad(map);
map.setSquadPosition(3, 3);
map.getRoom(3, 3).visit();

map.addDoor(3, 3, 3, 4).close();
map.addDoor(3, 3, 4, 3);
map.addDoor(3, 3, 3, 2);
map.addDoor(3, 2, 2, 2).close();
map.addDoor(3, 2, 4, 2);

map.getRoom(3, 3).addItem(new Note('Have a nice day :)'));
map.getRoom(3, 2).addItem(new Disk(new DoorCommand(map)));


map.getRoom(3, 3).describe('It is a dock station. There is a rescue capsule behind southern door. We could use it to escape from the space station.');

let terminalView = new TerminalView(document);
let screenView = new ScreenView(document);
let terminal = new Terminal(terminalView);
document.querySelector('#screen-a').appendChild(terminalView.getDOM());
document.querySelector('#screen-b').appendChild(screenView.getDOM());
terminalView.enableAutoFocus();
screenView.rescale();

terminal.installCommand(new HelpCommand());
terminal.installCommand(new ComCommand(squad, map, terminal));

terminalView.println("Welcome at Space Station Sigma-18");
terminalView.println("Version of terminal: 1.0.0");
terminalView.println("\n\n");
terminalView.println("Type <strong>help</strong> and press ENTER to see available commands.");

let mapRenderer = new MapRenderer(map, screenView);

mapRenderer.render();

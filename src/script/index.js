import TerminalView from './system/TerminalView.js';
import Terminal from './system/Terminal.js';
import ScreenView from './system/ScreenView.js';
import HelpCommand from './system/command/HelpCommand.js';
import ComCommand from './system/command/ComCommand.js';
import SfxCommand from './system/command/SfxCommand.js';

import Squad from './Squad.js';
import MapBuilder from './map/MapBuilder.js';
import MapRenderer from './map/MapRenderer.js';

let builder = new MapBuilder();
builder.build();
let map = builder.getMap();

let terminalView = new TerminalView(document);
let screenView = new ScreenView(document);
let terminal = new Terminal(terminalView);
document.querySelector('#screen-a').appendChild(terminalView.getDOM());
document.querySelector('#screen-b').appendChild(screenView.getDOM());
terminalView.enableAutoFocus();
screenView.rescale();

let squad = new Squad(map);
terminal.installCommand(new HelpCommand());
terminal.installCommand(new SfxCommand(terminal));
terminal.installCommand(new ComCommand(squad, map, terminal));

terminalView.println("Welcome at Space Station Sigma-18");
terminalView.println("Version of terminal: 1.0.0");
terminalView.println("\n\n");
terminalView.println("Type s|help|s and press ENTER to see available commands.");

let mapRenderer = new MapRenderer(map, screenView);

mapRenderer.render();

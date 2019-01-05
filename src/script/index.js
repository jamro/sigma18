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

terminal.println("Welcome at Space Station Sigma-18");
terminal.println("Version of terminal: 1.0.0");
terminal.println("\n\n");
terminal.println("Type s|help|s and press ENTER to see available commands.");

sideSreen.showMap(map);

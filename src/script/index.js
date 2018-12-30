import TerminalView from './terminal/TerminalView.js';
import Terminal from './terminal/Terminal.js';
import HelpCommand from './terminal/command/HelpCommand.js';
import ComCommand from './terminal/command/ComCommand.js';
import Squad from './Squad.js';

let squad = new Squad(3, 3);
let terminalView = new TerminalView(document);
let terminal = new Terminal(terminalView);
document.querySelector('#screen-a').appendChild(terminalView.getDOM());
terminalView.enableAutoFocus();

terminal.installCommand(new HelpCommand());
terminal.installCommand(new ComCommand(squad));

terminalView.println("Welcome at Space Station Sigma-18");
terminalView.println("Version of terminal: 1.0.0");
terminalView.println("\n\n");
terminalView.println("Type <strong>help</strong> and press ENTER to see available commands.");

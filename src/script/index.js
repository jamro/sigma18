import TerminalView from './terminal/TerminalView.js';
import Terminal from './terminal/Terminal.js';
import HelpCommand from './terminal/command/HelpCommand.js';


let terminalView = new TerminalView(document);
let terminal = new Terminal(terminalView);
document.querySelector('#screen-a').appendChild(terminalView.getDOM());
terminalView.enableAutoFocus();

terminal.installCommand(new HelpCommand());

terminalView.println("Welcome at Space Station Sigma-18");
terminalView.println("Version of terminal: 1.0.0");
terminalView.println("\n\n");
terminalView.println("Type <strong>anything</strong> and press ENTER to execute the command.");

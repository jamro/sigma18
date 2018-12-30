import TerminalView from './TerminalView.js';


let terminalView = new TerminalView(document);


document.querySelector('#screen-a').appendChild(terminalView.getDOM());
terminalView.enableAutoFocus();
terminalView.onSubmit((command) => console.log("COMMAND", command));

terminalView.println("Welcome at Space Station Sigma-18");
terminalView.println("Version of terminal: 1.0.0");
terminalView.println("\n\n");
terminalView.println("Type <strong>anything</strong> and press ENTER to execute the command.");

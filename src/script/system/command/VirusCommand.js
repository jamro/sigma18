import Command from '../Command.js';

export default class VirusCommand extends Command {

  constructor(virus) {
    super();
    this._virus = virus;
    this._header = `Virus Infector version 3.2.9`;
  }

  getName$$() {
    return 'virus';
  }

  getHelp$$() {
    return "Infect specified hosts and blocks communication in their newtwork";
  }

  execActivate() {
    let errorMessage = this._virus.validateActivate$$();
    let status = this._virus.getStatus$$();
    let queue = [
      {c: 'off', t: 0},
      this._header,
      ``,
      `Connecting to activation gateway...`,
      {c:'ln', d: 'Connection establlished', t:1000},
      '',
      `Current infection coverage: ${(status.stats.infection*100).toFixed(1)}%`,
    ];
    if(errorMessage) {
      queue = queue.concat([
        "Error: " + errorMessage,
        {c: 'sound', d: 'err', t: 0},
        {c: 'on', t: 0},
      ]);
    } else {
      queue = queue.concat([
        "Activating... ",
        {c: "load"},
        {c: () => { this._virus.activate$$(); }},
        "Completed",
        "",
        "Virus activation process started.",
        "Run s{virus status}s to check the progress",
        {c: 'sound', d: 'ok', t: 0},
        {c: 'on', t: 0},
      ]);
    }
    this._terminal.sequence$$(queue);
  }

  execInfect(command) {
    let ip = command.length >= 3 ? command[2] : '';
    let queue = [
      {c: 'off', t: 0},
      this._header,
      ``,
      `Connecting to host s{${ip}}s...`,
    ];
    let errorMessage = this._virus.validateInfection(ip);
    if(!errorMessage) {
      queue = queue.concat([
        {c:'ln', d: "Warning: Session key is required!", t:500},
        {c:'pass', d: 100, l: 'SessID'},
        'Connection established',
        "",
        "Uploading infected binaries...",
        {c:'load'},
        "Done",
        "",
        "Adding to Boot Loader...",
        {c: () => { this._virus.infect$$(ip); }},
        {c: 'ln', d:"Completed!", t: 1000},
        "",
        `Host s{${ip}}s infected.`,
        `Virus is s{inactive}s.`,
        ``,
        `Wait until it penetrates SIG-18 network before the activation.`,
        `Check status of infection by s{virus status}s`,
        {c:'sound', d:'ok'},
        {c:'on'}
      ]);
    } else {
      queue = queue.concat([
        {c:'ln', d: 'Error: ' + errorMessage, t:500},
        {c:'sound', d:'err'},
        {c:'on'}
      ]);
    }
    this._terminal.sequence$$(queue);
  }

  execStatus() {
    let data = this._virus.getStatus$$();

    let table = "<pre>| Host           | Status    |  | Host           | Status    |\n" +
                     "|----------------|-----------|  |----------------|-----------| \n";


    for(let i=0; i < data.hosts.length; i++) {
      let ip = " " + data.hosts[i].ip;
      let status;
      while(ip.length < 16) {
        ip += ' ';
      }
      status = data.hosts[i].active ? ' r{active}r    ' : ' inactive  ';
      table += '|' + ip + '|' + status + "|";
      table += (i % 2 != 0) ? "\n" : "  ";
    }
    table += "</pre>";

    if(data.hosts.length == 0) {
      table = "s{No infected hosts found!}s";
    }

    this._terminal.sequence$$(
      {c:'off'},
      this._header,
      "",
      "Querying infection coverage",
      {c: 'load'},
      "Infection data received",
      "",
      table,
      `Infection progress: ${(data.stats.infection*100).toFixed(1)}%`,
      `Activation progress: ${(data.stats.activation*100).toFixed(1)}%`,
      {c:'sound', d:'ok'},
      {c:'on'}
    );
  }

  execHelp() {
    this._terminal.sequence$$(
      "The virus attacks SIG-18 communication modules. It will disrupt incoming and outcoming traffic of infected host. The virus will spread across other SIG-18 that try to communicate with infected host, eventually making communication across whole SIG-18 netwoek impossible.",
      "r{WARNING! IT SPREADS VERY FAST! USE WITH CAUTION!}r",
      "",
      "Available commands are:",
      '',
      "s{virus status}s",
      "Show level of virus spreading",
      '',
      "s{virus infect [host]}s",
      "Infect provided [host] and stays inactive.",
      "After this stage, virus tries to spread as wide as possible.",
      "Run s{virus activate}s to run it on all infected hosts",
      "For example s{virus infect 20.43.53.112}s",
      "",
      "s{virus activate}s",
      "Activate virus on all infected hosts.",
      "The virus will disrupt communication of the host.",
      {c: 'sound', d: 'ok', t:0}
    );
  }
}

import Command from '../Command.js';

export default class VirusCommand extends Command {

  constructor() {
    super();
    this._virus = null;
    this._header = `Virus Infector version 3.2.9`;
    this.name$$ = 'virus';
    this.help$$ = 'Infect specified hosts and blocks communication in their newtwork';
  }

  setSystem$$(system) {
    super.setSystem$$(system);
    this._services$$ = this._map$$.getServiceDirectory$$();
    this._virus = this._map$$.getVirus$$();
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
    this._terminal$$.sequence$$(queue);
  }

  execInfect(command) {
    let ip = command.length >= 3 ? command[2] : '';
    if(!ip) {
      this._terminal$$.println$$(`Error: Host argument is required. Run s{virus help}s for more info.`);
      this._system$$.getSoundPlayer$$().play$$('err');
      return;
    }
    let queue = [
      {c: 'off', t: 0},
      this._header,
      ``,
      `Connecting to host s{${ip}}s...`,
    ];
    let errorMessage = this._virus.validateInfection$$(ip);
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
    this._terminal$$.sequence$$(queue);
  }

  execStatus() {
    this._terminal$$.sequence$$(
      {c:'off'},
      this._header,
      "",
      "Connecting to infection stats node...",
      {c:'ln',d:"Connection established", t:800},
      "",
      {t: 400, c:(done) => {
        let data = this._virus.getStatus$$();
        if(data.stats.infection == 0) {
          this._terminal$$.println$$('s{No infected hosts found!}s');
          return done();
        }
        this._terminal$$.println$$("Infection progress:");
        let infectionEl = this._terminal$$.showProgress$$();
        this._terminal$$.println$$("");
        this._terminal$$.println$$("Activation progress:");
        let activationEl = this._terminal$$.showProgress$$();
        this._terminal$$.println$$("");
        let loop = setInterval(() => {
          data = this._virus.getStatus$$();
          this._terminal$$.showProgress$$(data.stats.infection*100, infectionEl);
          this._terminal$$.showProgress$$(data.stats.activation*100, activationEl);
        }, 30);
        this._terminal$$.pause$$(() => {
          clearInterval(loop);
          done();
        });
      }},
      "Live update mode disabled",
      "Conection with stats node closed",
      {c:'sound', d:'ok'},
      {c:'on'}
    );
  }

  execHelp() {
    this._terminal$$.sequence$$(
      "The virus attacks SIG-18 communication modules disrupting incoming and outcoming traffic. The virus spreads across the network of SIG-18 and stays inactive. After achieving desired coverage a manual activation is required by running s{virus activate}s",
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
      "For example s{virus infect 20.43.53.112}s",
      "",
      "s{virus activate}s",
      "Activate virus on all infected hosts.",
      {c: 'sound', d: 'ok', t:0}
    );
  }
}

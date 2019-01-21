import Command from '../Command.js';

export default class PowerCommand extends Command {

  constructor() {
    super();
    this._serviceDirectory$$ = null;
    this.name$$ = 'power';
    this.help$$ = 'Manage power supply for space station';
  }

  setSystem$$(system) {
    super.setSystem$$(system);
    this._serviceDirectory$$ = this._map$$.getServiceDirectory$$();
  }

  execUp(command) {
    let name = command.length >= 3 ? command[2].toLowerCase() : '';
    this.setStatus$$(name, true);
  }

  execDown(command) {
    let name = command.length >= 3 ? command[2].toLowerCase() : '';
    this.setStatus$$(name, false);
  }

  auth$$(service, done) {
    if(!service.isSecured$$) {
      return done();
    }
    this._terminal$$.sequence$$(
      '',
      `WARNING! s{${service.name$$}}s is a critial service.`,
      `Multi factor authentication process is required`,
      {c:'sound', d:'ok'},
      '',
      's{Auth Level 1}s',
      's{============}s',
      'login: ngallegos',
      {c:'pass', d:100, l:'password'},
      "Password correct",
      {c:'sound', d:'ok'},
      "",
      's{Auth Level 2}s',
      's{============}s',
      'Sending auth code message to s{message-hub}s service...',
      {c:'load'},
      '',
      'An text message has been sent to user s{ngallegos}s.',
      'Enter the code to log in.',
      {c:'sound', d:'ok'},
      {c: () => {
        let code = Math.floor(Math.random()*0xffff).toString(16).toUpperCase();
        this._terminal$$.log$$('message-hub', 'MSG [to: ngallegos, authCode: ' + code + ']');
        this._terminal$$.prompt$$('Auth code:', (txt) => {
          txt = txt.toUpperCase();
          if(txt == code) {
            this._terminal$$.println$$('Auth code: ****** (correct)');
            this._terminal$$.println$$('');
            done();
          } else {
            this._terminal$$.println$$('Error: incorrect auth code');
            this._system$$.getSoundPlayer$$().play$$('err');
            this.enableInput$$();
          }
        });
      }}
    );
  }

  setStatus$$(name, status) {
    if(!name) {
      this._terminal$$.println$$(`Error: ServiceName argument is required. Run s{power help}s for more info.`);
      this._system$$.getSoundPlayer$$().play$$('err');
      return;
    }
    this._terminal$$.view$$.disable$$();
    let errorMessage = this._serviceDirectory$$.validateStateChange$$(name, status);
    this._terminal$$.connect$$('power-manager', [`${status ? "Starting" : "Stopping"} service ${name}...`], () => {
      if(errorMessage) {
        this._terminal$$.sequence$$(
          "",
          "Error: " + errorMessage,
          {c:'sound',d:'err'},
          {c:'on'}
        );
        return;
      }
      let service = this._serviceDirectory$$.getService$$(name);
      this.auth$$(service, () => {
        let queue = [
          `${service.name$$}: ${service.ip$$}`,
          {c:'load'},
          {c:'ln', d:`Service ${name} ${status ? "started" : "stopped"}`,s:'power-manager'},
          {c:'sound',d:'ok'},
          {c: () => {
            if(status) {
              this._serviceDirectory$$.on$$(name);
            } else {
              this._serviceDirectory$$.off$$(name);
            }
            this._terminal$$.println$$("");
            this._terminal$$.println$$(`Current power consumption: s{${this._serviceDirectory$$.getTotalPower$$().toFixed(2)}kW}s / ${this._serviceDirectory$$.getPowerSupply$$().toFixed(2)}kW`);
          }}
        ];
        if(service.name$$ == 'oxygen-generator' && !status) {
          queue = queue.concat([
            {c:'ln', d:"r{WARNING: Oxygen Generator is down. Threat to the life of the crew!}r", t:300},
            {c:'chat', d:'Oxygen level is low. Putting on the masks.', f:'commander', t:1500}
          ]);
        }
        if(service.name$$ == 'power-manager' && !status) {
          queue = queue.concat([
            "",
            {c:'ln', d:"Warning! s{power-manager}s is a core service and cannot be powered down!", t:1000},
            {c:'sound',d:'err', t:500},
            `Restoring service ${name}...`,
            {c:'load'},
            {c: () => {
              this._serviceDirectory$$.on$$(name);
              this._terminal$$.println$$("");
              this._terminal$$.println$$(`Current power consumption: s{${this._serviceDirectory$$.getTotalPower$$().toFixed(2)}kW}s / ${this._serviceDirectory$$.getPowerSupply$$().toFixed(2)}kW`);
            }},
            `Service restored`,
            {c:'sound',d:'ok'}
          ]);
        }
        queue.push({c:'on'});
        this._terminal$$.sequence$$(queue);
      });

    });
  }

  execHelp() {
    this._terminal$$.sequence$$(
      "Available commands are:",
      '',
      "s{power status}s",
      "Display status of power generators",
      '',
      "s{power list}s",
      "Display status and power consumption for all services",
      '',
      "s{power [up/down] [serviceName]}s",
      "Power up/down specified service",
      "For example: s{power up lab-services}s",
      {c: 'sound', d: 'ok', t:0}
    );
  }

  execList() {
    this._terminal$$.view$$.disable$$();
    let left = (txt, len) => {
      txt = txt || "";
      while(txt.length < len) {
        txt += " ";
      }
      return txt;
    };
    let right = (txt, len) => {
      txt = txt || "";
      while(txt.length < len) {
        txt = " " + txt;
      }
      return txt;
    };
    let data = this._serviceDirectory$$.getAllServices$$();
    let services = "<pre>Name             | Address       | Status | P.Consumption\n" +
                        "-----------------|---------------|--------|---------------\n";
    for(let service of data) {
      if(service.isRunning$$) {
        services += `${left(service.name$$, 17)}| ${left(service.ip$$, 14)}|     on | ${right(service.getPower$$().toFixed(2) + "kW", 13)}\n`;
      } else {
        services += `r{${left(service.name$$, 17)}}r| r{${left(service.ip$$, 14)}}r|    r{off}r |        r{0.00kW}r\n`;
      }
    }
    services += "</pre>";

    let total = this._serviceDirectory$$.getTotalPower$$();

    this._terminal$$.connect$$('power-manager', [
      services,
      `Total power consumption: s{${total.toFixed(2)}kW}s / ${this._serviceDirectory$$.getPowerSupply$$().toFixed(2)}kW`,
      {c:'sound', d: 'ok', t:0},
      {c:'on'}
    ], () => {

    });
  }

  execStatus() {
    this._terminal$$.view$$.disable$$();

    let generators = "<pre>Generator | Status  | Efficiency | Power Supply\n" +
                          "----------|---------|------------|--------------\n" +
                          "Alpha     | ok      |        97% |      48.51kW\n" +
                          "r{Beta}r      | r{damaged}r |         r{0%}r |       r{0.00kW}r\n" +
                          "Gamma     | ok      |        54% |      26.97kW</pre>";


    this._terminal$$.connect$$('power-manager', [
      generators,
      `Total power supply: s{${this._serviceDirectory$$.getPowerSupply$$().toFixed(2)}kW}s / 150.00kW`,
      {c:'sound', d: 'ok', t:0},
      {c:'on'}
    ], () => {

    });
  }



}

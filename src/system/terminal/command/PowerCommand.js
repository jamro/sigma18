import Command from '../Command.js';

export default class PowerCommand extends Command {

  constructor(serviceDirectory) {
    super();
    this._serviceDirectory$$ = serviceDirectory;
  }

  getName$$() {
    return 'power';
  }

  getHelp$$() {
    return "Manage power supply for space station";
  }

  execUp(command) {
    let name = command.length >= 3 ? command[2].toLowerCase() : '';
    this.setStatus$$(name, true);
  }

  execDown(command) {
    let name = command.length >= 3 ? command[2].toLowerCase() : '';
    this.setStatus$$(name, false);
  }

  setStatus$$(name, status) {
    if(!name) {
      this._terminal$$.println$$(`Error: ServiceName argument is required. Run s{power help}s for more info.`);
      this._terminal$$.soundPlayer$$.play$$('err');
      return;
    }
    this._terminal$$.view$$.disable$$();
    let errorMessage = this._serviceDirectory$$.validateStateChange$$(name, status);
    this._terminal$$.connect$$('power-manager', [
      `${status ? "Starting" : "Stopping"} service ${name}...`
    ], () => {
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
      let queue = [
        `${service.getName$$()}: ${service.getIp$$()}`,
        {c:'load'},
        `Service ${status ? "started" : "stopped"}`,
        {c:'sound',d:'ok'},
        {c: () => {
          if(status) {
            this._serviceDirectory$$.on$$(name);
          } else {
            this._serviceDirectory$$.off$$(name);
          }
        }}
      ];
      if(service.getName$$() == 'oxygen-generator' && !status) {
        queue = queue.concat([
          {c:'ln', d:"r{WARNING: Oxygen Generator is down. Threat to the life of the crew!}r", t:300},
          {c:'chat', d:'Oxygen level is low. Putting on the masks.', f:'commander', t:1500}
        ]);
      }
      if(service.getName$$() == 'power-manager' && !status) {
        queue = queue.concat([
          "",
          {c:'ln', d:"Warning! s{power-manager}s is a core service and cannot be powered down!", t:1000},
          {c:'sound',d:'err', t:500},
          `Restoring service ${name}...`,
          {c:'load'},
          {c: () => {
            this._serviceDirectory$$.on$$(name);
          }},
          `Service restored`,
          {c:'sound',d:'ok'}
        ]);
      }
      queue.push({c:'on'});
      this._terminal$$.sequence$$(queue);
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
      if(service.isRunning$$()) {
        services += `${left(service.getName$$(), 17)}| ${left(service.getIp$$(), 14)}|     on | ${right(service.getPower$$().toFixed(2) + "kW", 13)}\n`;
      } else {
        services += `r{${left(service.getName$$(), 17)}}r| r{${left(service.getIp$$(), 14)}}r|    r{off}r |        r{0.00kW}r\n`;
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

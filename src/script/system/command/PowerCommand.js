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
    let id = command.length >= 3 ? command[2].toUpperCase() : '';
    this.setStatus$$(id, true);
  }

  execDown(command) {
    let id = command.length >= 3 ? command[2].toUpperCase() : '';
    this.setStatus$$(id, false);
  }

  setStatus$$(id, status) {
    this._terminal.getView$$().disable$$();
    let errorMessage = this._serviceDirectory$$.validateStateChange$$(id, status);
    this._terminal.connect$$('power-manager', [
      `${status ? "Starting" : "Stopping"} service ${id}...`
    ], () => {
      if(errorMessage) {
        this._terminal.sequence$$(
          "Error: " + errorMessage,
          {c:'sound',d:'err'},
          {c:'on'}
        );
        return;
      }
      let service = this._serviceDirectory$$.getService$$(id);
      let queue = [
        `${service.getName$$()}: ${service.getIp$$()}`,
        {c:'load'},
        `Service ${status ? "started" : "stopped"}`,
        {c:'sound',d:'ok'},
        {c: () => {
          if(status) {
            this._serviceDirectory$$.on$$(id);
          } else {
            this._serviceDirectory$$.off$$(id);
          }
        }}
      ];
      if(service.getName$$() == 'oxygen-genertor' && !status) {
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
          `Restoring service ${id}...`,
          {c:'load'},
          {c: () => {
            this._serviceDirectory$$.on$$(id);
          }},
          `Service restored`,
          {c:'sound',d:'ok'}
        ]);
      }
      queue.push({c:'on'});
      this._terminal.sequence$$(queue);
    });
  }

  execHelp() {
    this._terminal.sequence$$(
      "Available commands are:",
      '',
      "s{power status}s",
      "Display status of power generators",
      '',
      "s{power list}s",
      "Display status and power consumption for all services",
      '',
      "s{power [up/down] [serviceId]}s",
      "Power up/down specified serive",
      "For example: s{power up S4}s",
      {c: 'sound', d: 'ok', t:0}
    );
  }

  execList() {
    this._terminal.getView$$().disable$$();
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
    let data = this._serviceDirectory$$.getServices$$();
    let services = "<pre>ID | Name            | Address       | Status | P.Consumption\n" +
                        "---|-----------------|---------------|--------|---------------\n";
    for(let service of data) {
      services += `${service.getId$$()} | ${left(service.getName$$(), 16)}| ${left(service.getIp$$(), 14)}| ${service.isRunning$$() ? '    on' : '   r{off}r'} | ${service.isRunning$$() ? right(service.getPower$$().toFixed(2) + "kW", 13) : '       r{0.00kW}r'}\n`;
    }
    services += "</pre>";

    let total = this._serviceDirectory$$.getTotalPower$$();

    this._terminal.connect$$('power-manager', [
      services,
      `Total power consumption: s{${total.toFixed(2)}kW}s / ${this._serviceDirectory$$.getPowerSupply$$().toFixed(2)}kW (${(100*total/this._serviceDirectory$$.getPowerSupply$$()).toFixed(1)}%)`,
      {c:'sound', d: 'ok', t:0},
      {c:'on'}
    ], () => {

    });
  }

  execStatus() {
    this._terminal.getView$$().disable$$();

    let generators = "<pre>Generator | Status  | Efficiency | Power Supply\n" +
                          "----------|---------|------------|--------------\n" +
                          "Alpha     | ok      |        97% |      48.51kW\n" +
                          "r{Beta}r      | r{damaged}r |         r{0%}r |       r{0.00kW}r\n" +
                          "Gamma     | ok      |        54% |      26.97kW</pre>";


    this._terminal.connect$$('power-manager', [
      generators,
      `Total power supply: s{${this._serviceDirectory$$.getPowerSupply$$().toFixed(2)}kW}s / 150.00kW (${(100*this._serviceDirectory$$.getPowerSupply$$()/150).toFixed(1)}%)`,
      {c:'sound', d: 'ok', t:0},
      {c:'on'}
    ], () => {

    });
  }



}

import Command from '../Command.js';

export default class SniffCommand extends Command {

  constructor() {
    super();
    this._services$$ = null;

    this.serviceName$$ = null;
    this.loop$$ = null;
    this.name$$ = 'sniff';
    this.help$$ = 'Sniff log messages of remote services';
  }

  setSystem$$(system) {
    super.setSystem$$(system);
    this._services$$ = this._map$$.getServiceDirectory$$();
  }

  execScan() {
    let queue = [
      {c: 'off'},
      "Sniffer v2.9.4",
      "",
      "Scanning of local area network... ",
      {c:'load'},
      "Completed",
      "",
    ];
    let serviceNames = this._services$$.getAllServices$$().filter((s) => s.isRunning$$).map((s) => ` - ${s.name$$}`);
    queue.push(`Items found: s{${serviceNames.length} services}s`);
    queue = queue.concat(serviceNames);
    queue = queue.concat([
      "",
      "Run s{sniff on [serviceName]}s to sniff service logs.",
      {c:'sound', d:'ok'},
      {c:'on'}
    ]);
    this._terminal$$.sequence$$(queue);
  }

  execOn(command) {
    if(this.serviceName$$) {
      this._terminal$$.println$$('Error: Sniffer already connected. Disconnect at first!');
      this._system$$.getSoundPlayer$$().play$$('err');
      return;
    }
    let name = command.length >= 3 ? command[2] : 'unknown';
    this.disableInput$$();
    this._terminal$$.connect$$(name, [
      `Encryping log file`,
      {c:'pass',d:20,l:'Password'},
      '',
      `streaming /var/log/${this.serviceName$$}.log`,
    ], () => {
      this.serviceName$$ = name;
      this._terminal$$.showPopup$$(true);
      this.loop$$ = setInterval(() => {
        let logs = this._services$$.getService$$(this.serviceName$$).logFile$$.join('<br/>\n');
        this._terminal$$.view$$.printPopup$$(`/var/log/${this.serviceName$$}.log`, logs);
      }, 30);
      this._terminal$$.sequence$$(
        "Done",
        {c:'on'}
      );
    });
  }

  execOff() {
    if(!this.serviceName$$) {
      this._terminal$$.println$$('Error: Sniffer is disabled');
      this._system$$.getSoundPlayer$$().play$$('err');
      return;
    }
    if(this.loop$$) {
      clearInterval(this.loop$$);
      this.loop$$ = null;
    }
    let name = this.serviceName$$;
    this.serviceName$$ = null;
    this._terminal$$.showPopup$$(false);
    this._terminal$$.sequence$$(
      {c:'off'},
      "Disconnecting from " + name,
      "Connection closed",
      {c:'sound', d:'ok'},
      {c:'on'}
    );
  }

  execHelp() {
    this._terminal$$.sequence$$(
      "The application runs in backgroud.",
      "Available commands are:",
      '',
      "s{sniff scan}s",
      "Scan possible services to sniff and list them",
      "IMPORTANT: powered down services cannot be found that way",
      '',
      "s{sniff on [service-name]}s",
      "Start sniffing of provided service",
      '',
      "s{sniff off}s",
      "Stop the sniffer",
      {c: 'sound', d: 'ok', t:0}
    );
  }

}

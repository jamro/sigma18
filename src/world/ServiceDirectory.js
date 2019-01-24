import Service from './Service.js';

export default class ServiceDirectory {

  constructor() {
    this._data$$ = [];
    this.totalPowerSuply$$ = 75.480;
    this.addService$$('power-manager', '40.32.125.1', 4);
    this.addService$$('message-hub', '40.32.125.68', 3);
    this.addService$$('docker', '40.32.125.120', 12);
    this.addService$$('lights-east', '40.32.125.231', 13).off$$();
    this.addService$$('lights-west', '40.32.125.232', 11);
    this.addService$$('monitoring', '40.32.125.12', 6);
    this.addService$$('oxygen-generator', '40.32.125.193', 13);
    this.addService$$('pump-station', '40.32.125.43', 20).off$$();
    this.addService$$('data-warehouse', '40.32.125.73', 14);
    this.addService$$('lab-services', '40.32.125.100', 19).off$$();
    this.addService$$('security', '40.32.125.87', 10).off$$().secure$$();
    this.addService$$('doors', '40.32.125.133', 11);

    [
      [543299, 'Security breach detected at [G:4]'],
      [542904, 'r{Unauthorized access to yellow restricted area}r'],
      [483843, 'Security breach detected at [F:8]'],
      [481275, 'r{Unauthorized access to blue restricted area}r'],
      [359939, 'Security breach detected at [F:8]'],
      [341905, 'The gateway not compromised.'],
      [340320, 'Red restricted area secured']
    ].forEach((row) => this.getService$$('monitoring').log$$(row[1], row[0]));

    [
      [692313, 'Starting launching sequence at DS001'],
      [687240, `Launching sequence completed`],
      [323955, `s{Sierra-23}s is approaching DS003`],
      [314980, `Error: docking station damaged during landing`],
    ].forEach((row) => this.getService$$('docker').log$$(row[1], row[0]));


    [
      [594312, 'r{WARNING! Power outage detected}r'],
      [582733, 'Reducing power consumption...'],
      [578269, 'Non critical services stopped']
    ].forEach((row) => this.getService$$('oxygen-generator').log$$(row[1], row[0]));

    [
      [594396, 'r{WARNING! Power outage detected}r'],
      [582734, 'Reducing power consumption...'],
      [581191, 'Power down lights-east service']
    ].forEach((row) => this.getService$$('lights-east').log$$(row[1], row[0]));


  }

  getPowerSupply$$() {
    return this.totalPowerSuply$$;
  }

  addService$$(name, ip, power) {
    let service = new Service(name, ip, power);
    this._data$$.push(service);
    return service;
  }

  getAllServices$$() {
    return this._data$$;
  }

  getService$$(name) {
    let result = this._data$$.filter((s) => s.name$$ == name);
    return result.length ? result[0] : null;
  }

  getTotalPower$$() {
    return this._data$$.reduce((sum, srv) => sum += srv.getPower$$(), 0);
  }

  validateStateChange$$(name, newState) {
    let service = this.getService$$(name);
    if(!service) {
      return `Service ${name} not found`;
    }
    if(service.isRunning$$ == newState) {
      return `Service ${name} (${service.name$$}) is already ${newState ? 'running' : 'stopped'}.`;
    }
    let missingPower = this.getTotalPower$$() + service.powerRequirements$$ - this.getPowerSupply$$();
    if(newState && missingPower > 0) {
      return `Not enough power: s{${missingPower.toFixed(2)}kW}s is missing.<br/>\nTry to turn off some services.<br/>\nRun s{power list}s to review available services.`;
    }
  }

  on$$(name) {
    let service = this.getService$$(name);
    service.on$$();
  }

  off$$(name) {
    let service = this.getService$$(name);
    service.off$$();
  }

}

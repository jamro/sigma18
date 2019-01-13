import Service from './Service.js';

export default class ServiceDirectory {

  constructor() {
    this._data$$ = [];
    this.addService$$('power-manager', '40.32.125.1', 3).on$$();
    this.addService$$('docker', '40.32.125.120', 10).on$$();
    this.addService$$('lights-east', '40.32.125.231', 6);
    this.addService$$('lights-west', '40.32.125.232', 8).on$$();
    this.addService$$('monitoring', '40.32.125.12', 5).on$$();
    this.addService$$('oxygen-genertor', '40.32.125.193', 13).on$$();
    this.addService$$('pump-station', '40.32.125.43', 20);
    this.addService$$('data-warehouse', '40.32.125.73', 14).on$$();
    this.addService$$('lab-services', '40.32.125.100', 50);
    this.addService$$('hvac', '40.32.125.87', 45);
    this.addService$$('doors', '40.32.125.133', 19).on$$();
  }

  getPowerSupply$$() {
    return 75.480;
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
    let result = this._data$$.filter((s) => s._name == name);
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
    if(service.isRunning$$() == newState) {
      return `Service ${name} (${service.getName$$()}) is already ${newState ? 'running' : 'stopped'}.`;
    }
    let missingPower = this.getTotalPower$$() + service.getRequiredPower$$() - this.getPowerSupply$$();
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

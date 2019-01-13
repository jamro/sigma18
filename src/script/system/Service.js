class Service {
  constructor(name, ip, power) {
    this._name = name;
    this._ip = ip;
    this._power = power;
    this._isRunning = false;
    this._onStatusChangeList$$ = [];
  }

  isRunning$$() {
    return this._isRunning;
  }

  getName$$() {
    return this._name;
  }

  getPower$$() {
    return this._isRunning ? this._power : 0;
  }

  getRequiredPower$$() {
    return this._power;
  }

  getIp$$() {
    return this._ip;
  }

  on$$() {
    if(!this._isRunning) {
      this._isRunning = true;
      this._onStatusChangeList$$.forEach((c) => c(true));
    }
  }

  off$$() {
    if(this._isRunning) {
      this._isRunning = false;
      this._onStatusChangeList$$.forEach((c) => c(false));
    }

  }

  onStatusChange$$(callback) {
    this._onStatusChangeList$$.push(callback);
  }

}

export default Service;

class Service {
  constructor(name, ip, power) {
    this._id = "S" + Service._nextId.toString(16).toUpperCase();
    Service._nextId++;
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

  getId$$() {
    return this._id;
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

Service._nextId = 1;
export default Service;

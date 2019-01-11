class Service {
  constructor(name, ip, power) {
    this._id = "S" + Service._nextId.toString(16).toUpperCase();
    Service._nextId++;
    this._name = name;
    this._ip = ip;
    this._power = power;
    this._isRunning = false;
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

  getIp$$() {
    return this._ip;
  }

  getId$$() {
    return this._id;
  }

  on$$() {
    this._isRunning = true;
  }

  off$$() {
    this._isRunning = false;
  }

}

Service._nextId = 1;
export default Service;

class Service {
  constructor(name, ip, power) {
    this.name$$ = name;
    this.ip$$ = ip;
    this.logFile$$ = [];
    this.log$$(`Reading /etc/${name}.conf`, 976601);
    this.log$$(`Configuration file loaded`, 870323);
    this.log$$(`Service ${name} started at ${ip}`, 732875);
    this.isRunning$$ = true;
    this.isSecured$$ = false;
    this.powerRequirements$$ = power;
    this._onStatusChangeList$$ = [];
  }

  getPower$$() {
    return this.isRunning$$ ? this.powerRequirements$$ : 0;
  }

  secure$$() {
    this.isSecured$$ = true;
    return this;
  }

  on$$() {
    if(!this.isRunning$$) {
      this.isRunning$$ = true;
      this.log$$(`Power up ${this.name$$} service`);
      this._onStatusChangeList$$.forEach((c) => c(true));
    }
    return this;
  }

  off$$() {
    if(this.isRunning$$) {
      this.isRunning$$ = false;
      this.log$$(`Power down ${this.name$$} service`);
      this._onStatusChangeList$$.forEach((c) => c(false));
    }
    return this;
  }

  onStatusChange$$(callback) {
    this._onStatusChangeList$$.push(callback);
  }

  log$$(msg, timeOffset) {
    timeOffset = timeOffset || 0;
    this.logFile$$.push((((new Date()).getTime() % (24*60*60*1000))-timeOffset+1000000) + " | " + msg);
    while(this.logFile$$.length > 8) this.logFile$$.shift();
  }

}

export default Service;

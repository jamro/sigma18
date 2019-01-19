class Service {
  constructor(name, ip, power) {
    this.name$$ = name;
    this.ip$$ = ip;
    this.logFile$$ = [];
    this.log$$(`Service ${name} started at ${ip}`);
    this.isRunning$$ = false;
    this.powerRequirements$$ = power;
    this._onStatusChangeList$$ = [];
  }

  getPower$$() {
    return this.isRunning$$ ? this.powerRequirements$$ : 0;
  }

  on$$() {
    if(!this.isRunning$$) {
      this.isRunning$$ = true;
      this.log$$(`Power up ${this.name$$} service`);
      this._onStatusChangeList$$.forEach((c) => c(true));
    }
  }

  off$$() {
    if(this.isRunning$$) {
      this.isRunning$$ = false;
      this.log$$(`Power down ${this.name$$} service`);
      this._onStatusChangeList$$.forEach((c) => c(false));
    }
  }

  onStatusChange$$(callback) {
    this._onStatusChangeList$$.push(callback);
  }

  log$$(msg) {
    this.logFile$$.push(((new Date()).getTime() % (24*60*60*1000)) + " | " + msg);
    while(this.logFile$$.length > 4) this.logFile$$.shift();
  }

}

export default Service;

class Service {
  constructor(name, ip, power) {
    this.name$$ = name;
    this.ip$$ = ip;
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
      this._onStatusChangeList$$.forEach((c) => c(true));
    }
  }

  off$$() {
    if(this.isRunning$$) {
      this.isRunning$$ = false;
      this._onStatusChangeList$$.forEach((c) => c(false));
    }

  }

  onStatusChange$$(callback) {
    this._onStatusChangeList$$.push(callback);
  }

}

export default Service;

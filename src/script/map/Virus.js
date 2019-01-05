export default class Virus {

  constructor() {
    this._isActive = false;
    this._infectLoop = null;
    this._activateLoop = null;
    this._hostList = [];
    this._hostLimit = 36;
    this._activationThreshold = 0.9;
  }

  isActive() {
    return this._isActive;
  }

  getUnitZero() {
    return '20.110.231.18';
  }

  validateInfection(ip) {
    if(ip != this.getUnitZero()) {
      return 'Unable to establish connection with the host!';
    }
    if(this.isInfected(ip)) {
      return 'Host already infected!';
    }
    return null;
  }

  validateActivate() {
    if(this.getStatus().stats.infection < this._activationThreshold) {
      return `Infection coverage must be at least ${Math.round(this._activationThreshold*100)}% to activate the virus`;
    }
    if(this._isActive) {
      return "Already activated";
    }
    return null;
  }

  isInfected(ip) {
    return this._hostList.filter((h) => (h.ip == ip)).length > 0;
  }

  infect(host) {
    let ip = this.getUnitZero();
    if(host != ip) {
      return false;
    }
    if(this._infectLoop) {
      clearInterval(this._infectLoop);
      this._infectLoop = null;
    }
    this._hostList.push({ip: ip, active: false});
    this._infectLoop = setInterval(() => {
      ip = this._generateHostAddress();
      if(!this.isInfected(ip)) {
        this._hostList.push({ip: ip, active: false});
      }
      if(this._hostList.length >= this._hostLimit) {
        clearInterval(this._infectLoop);
        this._infectLoop = null;
      }
    }, 700);
    return true;
  }

  getStatus() {
    return {
      hosts: this._hostList,
      stats: {
        infection: this._hostList.length / this._hostLimit,
        activation: this._hostList.filter((h) => h.active).length / this._hostLimit,
      }
    };
  }

  activate() {
    if(this.getStatus().stats.infection < this._activationThreshold) {
      return false;
    }
    if(this._activateLoop) {
      clearInterval(this._activateLoop);
      this._activateLoop = null;
    }
    this._activateLoop = setInterval(() => {
      this._hostList[Math.floor(Math.random()*this._hostList.length)].active = true;
    }, 500);
    this._isActive = true;
    return true;
  }

  _generateHostAddress() {
    let gen = () => Math.floor(18+Math.random()*(this._hostLimit+5));
    return `20.110.231.${gen()}`;
  }

}
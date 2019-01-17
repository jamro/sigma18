export default class Virus {

  constructor() {
    this.isActive$$ = false;
    this.unitZero$$ = '20.110.231.18';
    this._infectLoop$$ = null;
    this._activateLoop$$ = null;
    this._hostList$$ = [];
    this._hostLimit$$ = 36;
    this._activationThreshold$$ = 0.9;
    this._onActivatedList$$ = [];
  }

  onActivated$$(callback) {
    this._onActivatedList$$.push(callback);
  }

  validateInfection$$(ip) {
    if(ip != this.unitZero$$) {
      return 'Unable to establish connection with the host!';
    }
    if(this.isInfected$$(ip)) {
      return 'Host already infected!';
    }
    return null;
  }

  validateActivate$$() {
    if(this.getStatus$$().stats.infection < this._activationThreshold$$) {
      let msg = `Infection coverage must be at least ${Math.round(this._activationThreshold$$*100)}% to activate the virus.`;
      if(this.getStatus$$().stats.infection == 0) {
        msg += '<br />\nRun s{virus infect [host]}s at first';
      }
      return msg;
    }
    if(this.isActive$$) {
      return "Already activated";
    }
    return null;
  }

  isInfected$$(ip) {
    return this._hostList$$.filter((h) => (h.ip == ip)).length > 0;
  }

  infect$$(host) {
    let ip = this.unitZero$$;
    if(host != ip) {
      return false;
    }
    if(this._infectLoop$$) {
      clearInterval(this._infectLoop$$);
      this._infectLoop$$ = null;
    }
    this._hostList$$.push({ip: ip, active: false});
    this._infectLoop$$ = setInterval(() => {
      ip = this._generateHostAddress$$();
      if(!this.isInfected$$(ip)) {
        this._hostList$$.push({ip: ip, active: false});
      }
      if(this._hostList$$.length >= this._hostLimit$$) {
        clearInterval(this._infectLoop$$);
        this._infectLoop$$ = null;
      }
    }, 700);
    return true;
  }

  getStatus$$() {
    return {
      hosts: this._hostList$$,
      stats: {
        infection: this._hostList$$.length / this._hostLimit$$,
        activation: this._hostList$$.filter((h) => h.active).length / this._hostLimit$$,
      }
    };
  }

  activate$$() {
    if(this.getStatus$$().stats.infection < this._activationThreshold$$) {
      return false;
    }
    if(this._activateLoop$$) {
      clearInterval(this._activateLoop$$);
      this._activateLoop$$ = null;
    }
    this._activateLoop$$ = setInterval(() => {
      this._hostList$$[Math.floor(Math.random()*this._hostList$$.length)].active = true;
    }, 500);
    this.isActive$$ = true;
    this._onActivatedList$$.forEach((c) => c());
    return true;
  }

  _generateHostAddress$$() {
    let gen = () => Math.floor(18+Math.random()*(this._hostLimit$$+5));
    return `20.110.231.${gen()}`;
  }

}

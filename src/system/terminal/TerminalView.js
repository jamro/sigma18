import DigitalNoise from '../common/DigitalNoise.js';
import View from '../common/View.js';

export default class TerminalView extends View {

  constructor(document) {
    super(document);
    this._onSubmitCallbackList$$ = [];
    this._refId$$ = 0;
    this._disableLevel$$ = 0;
    this._historyFull$$ = [];
    try {
      let data = localStorage.getItem('history') || '[]';
      this._historyFull$$ = JSON.parse(data);
    } catch(err) {
      console.error(err);
    }
    this._history$$ = [''].concat(this._historyFull$$);
    this._historyIndex$$ = 0;
    this._keyDownHandler$$ = this.handleKeyDown$$;
    this._keyUpHandler$$ = this.handleKeyUp$$;

    this._eventBuffer$$ = null;
    this._eventBuffer$$Time$$ = 0;

    this._shortcuts$$ = [];
    this._shortcuts$$[38] = "com go n";
    this._shortcuts$$[40] = "com go s";
    this._shortcuts$$[37] = "com go w";
    this._shortcuts$$[39] = "com go e";

    this._view$$ = this.createElement$$("DIV", {
      cssClass: "terminal-root"
    });

    this._noise$$ = new DigitalNoise(document);
    this._view$$.element.appendChild(this._noise$$.getDOM$$());
    this._noise$$.start$$();

    this._view$$.output = this.createElement$$("DIV", {
      cssClass: "terminal-output",
      parent: this._view$$
    });

    this._view$$.popup = this.createElement$$("DIV", {
      cssClass: "terminal-popup",
      parent: this._view$$
    });

    this._view$$.input = this.createElement$$("DIV", {
      cssClass: "terminal-input",
      parent: this._view$$
    });

    this._view$$.input.table = this.createElement$$("TABLE", {
      parent: this._view$$.input
    });

    this._view$$.input.table.tr = this.createElement$$("TR", {
      parent: this._view$$.input.table
    });
    this._view$$.input.table.tr.prompt = this.createElement$$("TD", {
      cssClass: "terminal-prompt",
      parent: this._view$$.input.table.tr
    });

    this._view$$.input.table.tr.content = this.createElement$$("TD", {
      cssClass: "terminal-textfield-container",
      parent: this._view$$.input.table.tr
    });

    this._view$$.input.textField = this.createElement$$("INPUT", {
      parent: this._view$$.input.table.tr.content
    });

    this.setPromptText$$();

    this._view$$.input.textField.element.addEventListener("keydown", (e) => {
      this._keyDownHandler$$(e, this._view$$.input.textField.element.value);
      this._noise$$.prevent$$();
    });
    this._view$$.input.textField.element.addEventListener("keyup", (e) => {
      this._keyUpHandler$$(e, this._view$$.input.textField.element.value);
      this._noise$$.prevent$$();
    });
  }

  showPopup$$(value) {
    this._view$$.popup.element.style.display = 'block';
    this._view$$.popup.element.style.bottom = "100%";
    this._view$$.popup.element.style.overflow = 'hidden';
    let frameMax = 15;
    let frame = value ? 0 : frameMax;
    let loop = setInterval(() => {
      frame += value ? 1 : -1;
      this._view$$.popup.element.style.bottom = Math.round(100-50*frame/frameMax) + "%";
      if((value && frame >= frameMax) || (!value && frame <= 0)) {
        clearInterval(loop);
        this._view$$.popup.element.style.bottom = "";
        this._view$$.popup.element.style.overflow = "";
        this._view$$.popup.element.style.display = value ? 'block' : 'none';
      }
    }, 30);
  }

  setEventBuffer$$(event) {
    this._eventBuffer$$Time$$ = event ? (new Date()).getTime() : 0;
    this._eventBuffer$$ = event;
  }

  flushEventBuffer$$() {
    if(!this._eventBuffer$$) return;
    if((new Date()).getTime() - this._eventBuffer$$Time$$ > 500) return;
    if(this._keyDownHandler$$ != this.handleKeyDown$$) return;
    if(!this.isEnabled$$()) return;
    let event = this._eventBuffer$$;
    this._eventBuffer$$ = null;
    if(this._keyDownHandler$$) {
      this._keyDownHandler$$(event);
    }
    if(this.isEnabled$$() && event.key.toString().length == 1) {
      this._view$$.input.textField.element.value += event.key;
    }
  }

  setKeyHandler$$(downCallback, upCallback) {
    this._keyDownHandler$$ = downCallback ? downCallback : this.handleKeyDown$$;
    this._keyUpHandler$$ = upCallback ? upCallback : this.handleKeyUp$$;
    this.flushEventBuffer$$();
  }

  setInputText$$(txt) {
    this._view$$.input.textField.element.value = txt;
  }

  handleKeyUp$$(event, txt) {

  }

  handleKeyDown$$(event, txt) {
    let updateFromHistory = () => {
      this.setInputText$$(this._history$$[this._historyIndex$$]);
      setTimeout(() => { this._view$$.input.textField.element.selectionStart = this._view$$.input.textField.element.selectionEnd = 10000; }, 0);
    };

    event.stopImmediatePropagation();

    if(this._shortcuts$$[event.keyCode] && event.shiftKey) {
      this.setInputText$$(this._shortcuts$$[event.keyCode]);
      this.submit$$();
      return;
    }

    switch(event.keyCode) {
      case 13:
        this._history$$[this._historyIndex$$] = txt;
        this.submit$$();
        break;
      case 38: // key up
        this._historyIndex$$ = Math.min(this._history$$.length-1, this._historyIndex$$+1);
        updateFromHistory();
        break;
      case 40: // key down
        this._historyIndex$$ = Math.max(0, this._historyIndex$$-1);
        updateFromHistory();
        break;
      default:
        this._history$$[this._historyIndex$$] = txt;
        break;
    }
  }

  setPromptText$$(txt) {
    this._view$$.input.table.tr.prompt.element.innerHTML = (txt !== undefined) ? txt.replace(/ /g, '&nbsp;') : 'hacker@sigma18.iss.gov&nbsp;~$';
  }


  submit$$() {
    let command = this._view$$.input.textField.element.value.trim();
    if(command == '') {
      this._view$$.input.textField.element.value = '';
      return;
    }
    this._historyFull$$.unshift(command);
    while(this._historyFull$$.length > 100) {
      this._historyFull$$.pop();
    }
    this._history$$ = [''].concat(this._historyFull$$);
    this._historyIndex$$ = 0;
    try {
      localStorage.setItem('history', JSON.stringify(this._historyFull$$));
    } catch(err) {
      console.error(err);
    }

    this.clearInput$$();
    this._onSubmitCallbackList$$.forEach((callback) => callback(command));
  }

  clearInput$$() {
    this.setInputText$$('');
  }


  enableAutoFocus$$() {
    this._view$$.input.textField.element.addEventListener("focusout", () => {
      this._view$$.input.textField.element.focus();
    });
    this._view$$.input.textField.element.focus();
  }

  format$$(txt) {
    return txt
      .replace(/m{/g, '') // mute
      .replace(/}m/g, '') // mute
      .replace(/s{/g, '<strong>')
      .replace(/}s/g, '</strong>')
      .replace(/r{/g, '<span class="red">')
      .replace(/}r/g, '</span>');
  }

  print$$(txt) {
    txt = this.format$$(txt);
    let lengthLimit = 20000;
    let inputElement = this._view$$.output.element;
    let content = inputElement.innerHTML;
    content += txt;
    content = content.substring(content.length - lengthLimit);
    inputElement.innerHTML = content;
    inputElement.scrollTop = inputElement.scrollHeight;
    this._noise$$.prevent$$();
  }

  printPopup$$(title, txt) {
    txt = this.format$$(txt);
    this._view$$.popup.element.innerHTML = `<h1>${title}</h1>${txt}`;
  }

  printel$$(content) {
    content = content || "";
    let id = "ref-terminal-line-" + this._refId$$++;
    this.print$$(`<span id=\"${id}\">${content}</span><br/>\n`);
    return document.getElementById(id);
  }

  onSubmit$$(callback) {
    this._onSubmitCallbackList$$.push(callback);
  }

  isEnabled$$() {
    return this._disableLevel$$ <= 0;
  }

  disable$$() {
    this._disableLevel$$++;
    this._view$$.input.textField.element.disabled = true;
    this.setPromptText$$('...');
  }

  enable$$() {
    this._disableLevel$$--;
    this._disableLevel$$ = Math.max(0, this._disableLevel$$);
    if(this._disableLevel$$ == 0) {
      this._view$$.input.textField.element.disabled = false;
      this.setPromptText$$();
      this._view$$.input.textField.element.focus();
      this.flushEventBuffer$$();
    }
  }

  attachToDOM$$(parent) {
    super.attachToDOM$$(parent);
    this.enableAutoFocus$$();
    this._noise$$.rescale$$();
  }
}

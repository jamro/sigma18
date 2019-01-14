import DigitalNoise from './DigitalNoise.js';
import View from './common/View.js';
import '../../styles/terminal.scss';

export default class TerminalView extends View {

  constructor(document) {
    super(document);
    this._onSubmitCallbackList$$ = [];
    this._refId$$ = 0;
    this._disableLevel$$ = 0;
    let data = localStorage.getItem('history') || '[]';
    this._historyFull$$ = JSON.parse(data);
    this._history$$ = [''].concat(this._historyFull$$);
    this._historyIndex$$ = 0;
    this._keyHandler$$ = this.handleKeyDown$$;

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
    this._noise$$.start();

    this._view$$.output = this.createElement$$("DIV", {
      cssClass: "terminal-output",
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
      this._keyHandler$$(e, this._view$$.input.textField.element.value);
      this._noise$$.prevent();
    });
  }

  setEventBuffer$$(event) {
    this._eventBuffer$$Time$$ = event ? (new Date()).getTime() : 0;
    this._eventBuffer$$ = event;
  }

  flushEventBuffer$$() {
    if(!this._eventBuffer$$) return;
    if((new Date()).getTime() - this._eventBuffer$$Time$$ > 500) return;
    if(this._keyHandler$$ != this.handleKeyDown$$) return;
    if(!this.isEnabled$$()) return;
    let event = this._eventBuffer$$;
    this._eventBuffer$$ = null;
    if(this._keyHandler$$) {
      this._keyHandler$$(event);
    }
    if(this.isEnabled$$() && event.key.toString().length == 1) {
      this._view$$.input.textField.element.value += event.key;
    }
  }

  setKeyHandler$$(callback) {
    this._keyHandler$$ = callback ? callback : this.handleKeyDown$$;
    this.flushEventBuffer$$();
  }

  setInputText$$(txt) {
    this._view$$.input.textField.element.value = txt;
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
    let command = this._view$$.input.textField.element.value;
    if(command == '') {
      return;
    }
    this._historyFull$$.unshift(command);
    while(this._historyFull$$.length > 100) {
      this._historyFull$$.pop();
    }
    this._history$$ = [''].concat(this._historyFull$$);
    this._historyIndex$$ = 0;
    localStorage.setItem('history', JSON.stringify(this._historyFull$$));
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

  print$$(txt) {
    txt = txt
      .replace(/m{/g, '') // mute
      .replace(/}m/g, '') // mute
      .replace(/s{/g, '<strong>')
      .replace(/}s/g, '</strong>')
      .replace(/r{/g, '<span class="red">')
      .replace(/}r/g, '</span>');
    let lengthLimit = 20000;
    let inputElement = this._view$$.output.element;
    let content = inputElement.innerHTML;
    content += txt;
    content = content.substring(content.length - lengthLimit);
    inputElement.innerHTML = content;
    inputElement.scrollTop = inputElement.scrollHeight;
    this._noise$$.prevent();
  }

  printel$$() {
    let id = "ref-terminal-line-" + this._refId$$++;
    this.print$$(`<span id=\"${id}\"></span><br/>\n`);
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

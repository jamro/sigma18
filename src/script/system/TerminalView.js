import View from './common/View.js';
import '../../styles/terminal.scss';

export default class TerminalView extends View {

  constructor(document) {
    super(document);
    this._onSubmitCallbackList$$ = [];
    this._refId$$ = 0;
    let data = localStorage.getItem('history') || '[]';
    this._historyFull$$ = JSON.parse(data);
    this._history$$ = [''].concat(this._historyFull$$);
    this._historyIndex$$ = 0;
    this._keyHandler$$ = this.handleKeyDown$$;

    this._view$$ = this.createElement$$("DIV", {
      cssClass: "terminal-root"
    });

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

    this._view$$.input.textField.element.addEventListener("keydown", (e) => this._keyHandler$$(e, this._view$$.input.textField.element.value));
  }

  setKeyHandler$$(callback) {
    this._keyHandler$$ = callback ? callback : this.handleKeyDown$$;
  }

  handleKeyDown$$(event, txt) {
    let updateFromHistory = () => {
      this._view$$.input.textField.element.value = this._history$$[this._historyIndex$$];
      setTimeout(() => { this._view$$.input.textField.element.selectionStart = this._view$$.input.textField.element.selectionEnd = 10000; }, 0);
    };
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
    this._view$$.input.textField.element.value = '';
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
    return !this._view$$.input.textField.element.disabled;
  }

  disable$$() {
    this._view$$.input.textField.element.disabled = true;
    this.setPromptText$$('...');
  }

  enable$$() {
    this._view$$.input.textField.element.disabled = false;
    this.setPromptText$$();
    this._view$$.input.textField.element.focus();
  }

  attachToDOM$$(parent) {
    super.attachToDOM$$(parent);
    this.enableAutoFocus$$();
  }
}

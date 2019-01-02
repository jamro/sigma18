import View from './common/View.js';
import '../../styles/terminal.scss';

export default class TerminalView extends View {

  constructor(document) {
    super(document);

    this._okSound = new Audio('audio/ok.mp3');
    this._errSound = new Audio('audio/err.mp3');
    this._comSound = new Audio('audio/com.mp3');
    this._beepSound = new Audio('audio/beep.mp3');
    this._beepSound.loop = true;

    this._onSubmitCallbackList = [];
    this._refId = 0;
    let data = localStorage.getItem('history') || '[]';
    this._historyFull = JSON.parse(data);
    this._history = [''].concat(this._historyFull);
    this._historyIndex = 0;

    this._view = this.createElement("DIV", {
      cssClass: "terminal-root"
    });

    this._view.output = this.createElement("DIV", {
      cssClass: "terminal-output",
      parent: this._view
    });

    this._view.input = this.createElement("DIV", {
      cssClass: "terminal-input",
      parent: this._view
    });

    this._view.input.textField = this.createElement("INPUT", {
      parent: this._view.input
    });


    let updateFromHistory = () => {
      this._view.input.textField.element.value = this._history[this._historyIndex];
      setTimeout(() => { this._view.input.textField.element.selectionStart = this._view.input.textField.element.selectionEnd = 10000; }, 0);
    };

    this._view.input.textField.element.addEventListener("keydown", (event) => {
      switch(event.keyCode) {
        case 13:
          this._history[this._historyIndex] = this._view.input.textField.element.value;
          this.submit();
          break;
        case 38: // key up
          this._historyIndex = Math.min(this._history.length-1, this._historyIndex+1);
          updateFromHistory();
          break;
        case 40: //key down
          this._historyIndex = Math.max(0, this._historyIndex-1);
          updateFromHistory();
          break;
        default:
          this._history[this._historyIndex] = this._view.input.textField.element.value;
          break;
      }
    });
  }


  submit() {
    let command = this._view.input.textField.element.value;
    if(command == '') {
      return;
    }
    this._historyFull.unshift(command);
    while(this._historyFull.length > 100) {
      this._historyFull.pop();
    }
    this._history = [''].concat(this._historyFull);
    this._historyIndex = 0;
    localStorage.setItem('history', JSON.stringify(this._historyFull));
    this._view.input.textField.element.value = '';
    this._onSubmitCallbackList.forEach((callback) => callback(command));
  }

  enableAutoFocus() {
    this._view.input.textField.element.addEventListener("focusout", () => {
      this._view.input.textField.element.focus();
    });
    this._view.input.textField.element.focus();
  }

  print(txt) {
    let lengthLimit = 20000;
    let inputElement = this._view.output.element;
    let content = inputElement.innerHTML;
    content += txt;
    content = content.substring(content.length - lengthLimit);
    inputElement.innerHTML = content;
    inputElement.scrollTop = inputElement.scrollHeight;
  }

  println(txt) {
    this.print(txt + "<br/>\n");
  }

  printel() {
    let id = "ref-terminal-line-" + this._refId++;
    this.print(`<span id=\"${id}\"></span><br/>\n`);
    return document.getElementById(id);
  }

  onSubmit(callback) {
    this._onSubmitCallbackList.push(callback);
  }

  disable() {
    this._view.input.textField.element.disabled = true;
  }

  enable() {
    this._view.input.textField.element.disabled = false;
    this._view.input.textField.element.focus();
  }

  playOk() {
    this._okSound.play();
  }

  playErr() {
    this._errSound.play();
  }

  playCom() {
    this._comSound.playbackRate = 0.9 + 1.1*Math.random();
    this._comSound.play();
  }

  startBeepLoop() {
    this._beepSound.play();
  }

  stopBeepLoop() {
    this._beepSound.pause();
    this._beepSound.currentTime = 0;
  }


}

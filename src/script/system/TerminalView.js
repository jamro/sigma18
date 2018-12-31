import View from './common/View.js';
import '../../styles/terminal.scss';

export default class TerminalView extends View {

  constructor(document) {
    super(document);

    this._onSubmitCallbackList = [];

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

    this._view.input.textField.element.addEventListener("keydown", (event) => {
      if(event.keyCode == 13) {
        this.submit();
      }
    });
  }

  submit() {
    let command = this._view.input.textField.element.value;
    if(command == '') {
      return;
    }
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

}

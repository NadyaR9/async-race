import './Button.scss';
export class Button {
  title: string;
  name: string;
  className: string;
  constructor(title: string, name: string, className: string) {
    this.title = title;
    this.name = name;
    this.className = className;
  }

  render(): string {
    return `
      <button class="${this.name} btn ${this.className}" type="button" name="${this.name}">${this.title}</button>
    `;
  }
}

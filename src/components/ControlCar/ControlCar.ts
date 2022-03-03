import { Button } from '../Button';

export class ControlCar {
  name: string;
  disabled: string;
  constructor(name: string) {
    this.name = name;
    this.disabled = `${this.name === 'update' ? 'disabled' : ''}`;
  }

  renderNameControl = (): string => {
    return `
    <input class="form-control form-control-sm col-md-2" type="text" id="${this.name}-input" name="${this.name}" required ${this.disabled} minlength="4" maxlength="25" placeholder="Enter ${this.name}d car name">
    `;
  };
  renderColorControl = (): string => {
    return `<input class="form-control form-control-sm color-input" type="color" id="${this.name}-color" name="color" value="#ffffff" ${this.disabled}>`;
  };
  renderBtn = () => {
    return `
      <button class="${this.name}-btn btn action-btn" type="submit" ${this.disabled}>${this.name}</button>
    `;
  };
  render(): string {
    return `
      <form class="car-control__item">
        ${this.renderNameControl()}
        ${this.renderColorControl()}
        ${this.renderBtn()}
      </form>
    `;
  }
}

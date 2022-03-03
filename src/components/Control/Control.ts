import { ControlCar } from '../ControlCar';
import './Control.scss';
export class Control {
  render(): string {
    const createCarControl = new ControlCar('create');
    const updateCarControl = new ControlCar('update');
    return `
      <section class="car-control">
        <div class="car-control__form">
          ${createCarControl.render()}
          ${updateCarControl.render()}
        </div>
        <div class="car-control__action">
          <button class="race btn drive-btn" type="button">race</button>
          <button class="reset btn drive-btn" type="button">reset</button>
          <button class="generate btn action-btn" type="button">generate car</button>
        </div>
      </section>
    `;
  }
}

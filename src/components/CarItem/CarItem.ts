import { ICar } from '../../models/response';
import { Car } from '../Car/Car';
import { DriveControl } from '../DriveControl';
import './CarItem.scss';

export class CarItem {
  color: string;
  name: string;
  id: number | undefined;
  constructor(data: ICar) {
    this.color = data.color;
    this.name = data.name;
    this.id = data.id;
  }
  render(): string {
    const driveControl = new DriveControl();
    const carImg = new Car(this.color, '80', '40');
    return `
      <div class="car__item" id="${this.id}">
        <div class="car__item-control">
          <button class="select btn action-btn" type="button">select</button>
          <button class="remove btn action-btn" type="button">remove</button>
          ${this.name}
        </div>
        <div class="car__item-drive">
          ${driveControl.render()}
        </div>
        <div class="car">
          ${carImg.render()}
        </div>
        <div class="finish"></div>
      </div>
    `;
  }
}

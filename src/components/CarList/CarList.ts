import { ICar } from '../../models/response';
import { CarItem } from '../CarItem';
import './CarList.scss';

export class CarList {
  data: Array<ICar>;
  constructor(data: Array<ICar>) {
    this.data = data;
  }
  render(): string {
    return `
      <div class="car__list">
        ${this.data.map((item) => new CarItem(item).render()).join('')}
      </div>
    `;
  }
}

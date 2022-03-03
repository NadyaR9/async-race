import { ITable } from '../../models/pages';
import store from '../../utils/store';
import { Car } from '../Car/Car';
import './WinnerTable.scss';
export class WinnerTable {
  data: Array<ITable>;
  constructor(data: Array<ITable>) {
    this.data = data;
  }
  renderWinnerRow = (winner: ITable, index: number): string => {
    const { name, color, wins, time } = winner;
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${new Car(color, '60', '40').render()}</td>
        <td>${name}</td>
        <td>${wins}</td>
        <td>${time}</td>
      </tr>
    `;
  };
  render = () => {
    const winnersList: Array<string> = this.data.map((item, index) =>
      this.renderWinnerRow(item, index)
    );
    return `
    <table class="winners-table">
      <tr>
        <th>Number</th>
        <th class="car-ceil">Car</th>
        <th>Name</th>
        <th class="sort-by" data-sort="wins" data-current="${store.sortOrder
      }">Wins <span class="sort-by-img ${store.sortBy === 'wins' ? store.sortOrder : ''
      }"></span></th>
        <th class="sort-by" data-sort="time" data-current="${store.sortOrder
      }">Best times <span class="sort-by-img ${store.sortBy === 'time' ? store.sortOrder : ''
      }"></span></th>
      </tr>
        ${winnersList.join()}
    </table>
    `;
  };
}

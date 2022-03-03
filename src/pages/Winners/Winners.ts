import { PageInfo } from '../../components/PageInfo';
import { PaginationControl } from '../../components/PaginationPanel';
import { WinnerTable } from '../../components/WinnerTable/WinnerTable';
import { IComponent, ITable } from '../../models/pages';
import { ServiceCar } from '../../services/ServiceCar';
import { ServiceWinner } from '../../services/ServiceWinner';
import store from '../../utils/store';
import { getWonCars } from '../../utils/utils';
export class Winners implements IComponent {
  service = new ServiceWinner();
  car = new ServiceCar();
  async render() {
    store.pageName = 'Winner';
    return `
    <section id="winner"> 
        <section class="page-info" id="page-info"></section>
        <section id="winner-list"></section>
        <section class="pagination-list" id="pagination-list"></section>
      </section>
    `;
  }
  renderWinnersTable = (winners: Array<ITable>) => {
    const wrapper = document.querySelector<HTMLElement>('#winner-list')!;
    wrapper.innerHTML = '';
    wrapper.innerHTML = new WinnerTable(winners).render();
  };
  renderPage = async () => {
    const allWinners = await this.service.getAllWinners(
      store.currentWinnersPage,
      store.winnerPerPage,
      store.sortBy,
      store.sortOrder
    );
    store.winners = allWinners.response;
    store.winnersCount = Number.parseInt(allWinners.count!);
    store.cars = (await this.car.getAllCars()).response;
    new PaginationControl(store.winnersCount, store.winnerPerPage).render();
    new PageInfo(store.pageName, store.currentWinnersPage, store.winnersCount).render();
    const winnerCars = getWonCars();
    const wins = Promise.all(winnerCars);
    this.renderWinnersTable(await wins);
    this.bindListeners();
  };
  updateSort = async (element: HTMLElement) => {
    const order = element.dataset.current! === 'asc' ? 'desc' : 'asc';
    element.setAttribute('data-current', order);
    store.sortBy = element.dataset.sort!;
    store.sortOrder = element.dataset.current!;
    await this.renderPage();
  };
  bindListeners = () => {
    const paginationBtns = document.querySelectorAll<HTMLButtonElement>('.pagination-item');
    paginationBtns.forEach((item) => {
      item.addEventListener('click', async () => {
        store.currentWinnersPage = +item.innerHTML;
        await this.renderPage();
      });
    });
    const sortByWins = document.querySelectorAll<HTMLElement>('.sort-by')!;
    sortByWins.forEach((item) => {
      item.addEventListener('click', (e) => {
        this.updateSort(e.target as HTMLElement);
      });
    });
  };
  async after_render(): Promise<boolean> {
    this.renderPage();
    return true;
  }
}

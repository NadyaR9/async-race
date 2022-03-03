import { CarList } from '../../components/CarList';
import { Control } from '../../components/Control/Control';
import { Modal } from '../../components/Modal';
import { PageInfo } from '../../components/PageInfo';
import { PaginationControl } from '../../components/PaginationPanel';
import { IComponent, IStartCarResponse } from '../../models/pages';
import { ICar, ICarResponse } from '../../models/response';
import { ServiceCar } from '../../services/ServiceCar';
import { ServiceIEngine } from '../../services/ServiceEngine';
import { ServiceWinner } from '../../services/ServiceWinner';
import store from '../../utils/store';
import {
  animation,
  calcDistance,
  clearInputs,
  generateRandomCar,
  getCarId,
  raceAll,
  saveWinner,
  disabledBtnStyled,
  enabledBtnStyled,
  updateInputValues,
} from '../../utils/utils';

export class Garage implements IComponent {
  service = new ServiceCar();
  engine = new ServiceIEngine();
  controlCar = new Control();
  winner = new ServiceWinner();
  carListRender = async () => {
    const list = document.querySelector('#car-list')!;
    list.innerHTML = '';
    store.winners = (
      await this.winner.getAllWinners(
        store.currentWinnersPage,
        store.winnerPerPage,
        store.sortBy,
        store.sortOrder
      )
    ).response;
    const arrayCar = await this.service.getAllCars(store.currentCarPage, store.carPerPage);
    store.cars = arrayCar.response;
    store.carsCount = Number.parseInt(arrayCar.count!);
    const carArray = new CarList(arrayCar.response);
    list.innerHTML = carArray.render();
    new PaginationControl(store.carsCount, store.carPerPage).render();
    new PageInfo(store.pageName, store.currentCarPage, store.carsCount).render();
    updateInputValues();
    this.initValues();
    this.bindListeners();
  };

  createCar = async (): Promise<void> => {
    const createCarInput = <HTMLInputElement>document.getElementById('create-input')!;
    const createCarColor = <HTMLInputElement>document.getElementById('create-color')!;
    const color = createCarColor.value;
    const name = createCarInput.value;
    store.createInputName = createCarInput.value;
    store.createInputColor = createCarColor.value;
    if (name === '') {
      const modal = new Modal('Ошибка!', 'Введите название автомобиля');
      modal.render();
      modal.after_render();
    } else {
      const res = await this.service.createCar({ name, color });
      clearInputs(createCarInput, createCarColor);
      await this.carListRender();
    }
  };

  deleteCar = async (id: number): Promise<void> => {
    await this.service.deleteCar(id);
    await this.winner.deleteWinner(id);
    await this.carListRender();
  };
  initValues = () => {
    const createCarInput = <HTMLInputElement>document.getElementById('create-input')!;
    createCarInput.value = store.createInputName;
    const createCarColor = <HTMLInputElement>document.getElementById('create-color')!;
    createCarColor.value = store.createInputColor;
    if (store.selectedCarId !== 0) {
      this.selectCar(store.selectedCarId);
    }
  };
  updateCar = async () => {
    const colorInput = <HTMLInputElement>document.querySelector('#update-color');
    const updateInput = <HTMLInputElement>document.querySelector('#update-input');
    const res = await this.service.updateCar(store.selectedCarId, {
      name: updateInput.value,
      color: colorInput.value,
    });
    await this.carListRender();
    clearInputs(updateInput, colorInput);
    updateInput.disabled = true;
    colorInput.disabled = true;
  };

  selectCar = async (id: number) => {
    const updateCar: HTMLButtonElement = document.querySelector('.update-btn')!;
    const selectedCar = await this.service.getCarById(id);
    const updateInput = <HTMLInputElement>document.querySelector('#update-input');
    updateInput.value = selectedCar.name;
    updateInput.disabled = false;
    const colorInput = <HTMLInputElement>document.querySelector('#update-color');
    colorInput.value = selectedCar.color;
    colorInput.disabled = false;
    updateCar.disabled = false;
    store.selectedCarId = id;
  };

  renderGeneratedCar = async () => {
    const carsArray = generateRandomCar();
    carsArray.forEach(async (item) => await this.service.createCar(item));
    await this.carListRender();
  };

  race = async () => {
    const promises = store.cars.map((item) => this.startCar(item.id!));
    const winner = await raceAll(
      promises,
      store.cars.map((car) => car.id!)
    );
    return winner;
  };

  startCar = async (id: number): Promise<IStartCarResponse> => {
    if (id) {
      const parentElement = document.getElementById(`${id}`)!;
      const startBtn: HTMLButtonElement = parentElement.querySelector('.drive-btn')!;
      const car: HTMLElement = parentElement.querySelector('.car')!;
      const finish: HTMLElement = document.getElementById(`${id}`)!.querySelector('.finish')!;
      disabledBtnStyled(startBtn);
      const { velocity, distance } = await this.engine.startEngine(id);
      const time = Math.round(distance / velocity);
      const htmlDistance = Math.floor(calcDistance(car, finish)) + 50;
      store.animation[id] = animation(car, htmlDistance, time);
      const { success } = await this.engine.driveEngine(id);
      enabledBtnStyled(startBtn);
      if (!success) {
        window.cancelAnimationFrame(store.animation[id].id);
      }
      return { success, id, time };
    }
    return { success: false, id: 0, time: 0 };
  };
  stopCar = async (id: number) => {
    const parentElement = document.getElementById(`${id}`)!;
    const startBtn: HTMLButtonElement = parentElement.querySelector('.drive-btn')!;
    const stopBtn: HTMLButtonElement = parentElement.querySelector('.stop-btn')!;
    const car: HTMLElement = parentElement.querySelector('.car')!;
    disabledBtnStyled(stopBtn);
    await this.engine.stopEngine(id);
    enabledBtnStyled(stopBtn);
    enabledBtnStyled(startBtn);
    car.style.transform = `translateX(0)`;
    if (store.animation[id]) window.cancelAnimationFrame(store.animation[id].id);
  };

  startRace = async () => {
    disabledBtnStyled(document.querySelector('.race')!);
    disabledBtnStyled(document.querySelector('.reset')!);
    const winner = await this.race();
    enabledBtnStyled(document.querySelector('.reset')!);
    saveWinner(winner);
  };

  resetRace = async () => {
    enabledBtnStyled(document.querySelector('.race')!);
    disabledBtnStyled(document.querySelector('.reset')!);
    store.cars.map((item) => this.stopCar(item.id!));
    document.querySelector<HTMLElement>('.winner-message')!.innerHTML = '';
  };

  bindListeners = () => {
    const createCarBtn: HTMLButtonElement = document.querySelector('.create-btn')!;
    const startRaceBtn: HTMLButtonElement = document.querySelector('.race')!;
    const resetRaceBtn: HTMLButtonElement = document.querySelector('.reset')!;
    const generateCarBtn: HTMLButtonElement = document.querySelector('.generate')!;
    const deleteCarBtn = document.querySelectorAll<HTMLButtonElement>('.remove');
    const updateCarBtn = document.querySelectorAll<HTMLButtonElement>('.select');
    const paginationBtns = document.querySelectorAll<HTMLButtonElement>('.pagination-item');
    const startDriveBtns = document.querySelectorAll<HTMLButtonElement>('.drive-btn');
    const stopDriveBtns = document.querySelectorAll<HTMLButtonElement>('.stop-btn');
    createCarBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      await this.createCar();
    });
    deleteCarBtn.forEach((item) =>
      item.addEventListener('click', (e) => {
        this.deleteCar(getCarId(e.target as HTMLElement));
      })
    );
    updateCarBtn.forEach((item) =>
      item.addEventListener('click', (e) => {
        this.selectCar(getCarId(e.target as HTMLElement));
      })
    );
    generateCarBtn.addEventListener('click', this.renderGeneratedCar);
    paginationBtns.forEach((item) => {
      item.addEventListener('click', async () => {
        store.currentCarPage = +item.innerHTML;
        await this.carListRender();
      });
    });
    startDriveBtns.forEach((item) => {
      item.addEventListener('click', (e) => this.startCar(getCarId(e.target as HTMLElement)));
    });
    stopDriveBtns.forEach((item) => {
      item.addEventListener('click', (e) => this.stopCar(getCarId(e.target as HTMLElement)));
    });
    startRaceBtn.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      this.startRace();
    });
    resetRaceBtn.addEventListener('click', () => {
      this.resetRace();
    });

    const updateCar: HTMLButtonElement = document.querySelector('.update-btn')!;
    updateCar.addEventListener('click', (e) => {
      this.updateCar();
      store.selectedCarId = 0;
      e.preventDefault();
    });
  };
  async render(): Promise<string> {
    store.pageName = 'Garage';
    return `
      <section id="garage"> 
        ${this.controlCar.render()}
        <section class="page-info" id="page-info"></section>
        <section id="car-list"></section>
        <section class="pagination-list" id="pagination-list"></section>
        <div class="winner-message"></div>
        <dialog class="modal modal_hide"></dialog>
      </section>
    `;
  }
  async after_render(): Promise<boolean> {
    await this.carListRender();
    return true;
  }
}

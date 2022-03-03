import { IStartCarResponse, IState, ITable } from '../models/pages';
import { ICar, IDriveResponse, IWinner, IWinnerResponse } from '../models/response';
import { ServiceCar } from '../services/ServiceCar';
import { ServiceWinner } from '../services/ServiceWinner';
import store from './store';
const winnerService = new ServiceWinner();
const carService = new ServiceCar();
const brands = [
  'Volvo',
  'Toyota',
  'Skoda',
  'Kia',
  'Chevrolet',
  'Lada',
  'BMW',
  'Audi',
  'Tesla',
  'Mazda',
];
const models = [
  'Polo',
  'Priora',
  'Camry',
  'Octavia',
  'Rapid',
  'Model Y',
  'K5',
  'X5',
  'Jetta',
  'Passat',
];

const getRandomName = (): string => {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const model = models[Math.floor(Math.random() * models.length)];
  return `${brand} ${model}`;
};

const getRandomColor = (): string => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const color = ['#'];
  let i = 0;
  while (i <= 5) {
    color.push(letters[Math.floor(Math.random() * letters.length)]);
    i += 1;
  }
  return color.join('');
};

export const disabledBtnStyled = (active: HTMLButtonElement) => {
  active.disabled = true;
  active.classList.toggle('enabled', true);
};
export const enabledBtnStyled = (active: HTMLButtonElement) => {
  active.disabled = false;
  active.classList.toggle('enabled', false);
};

export const getCarId = (e: HTMLElement): number => {
  const parent = (e.parentNode as HTMLElement).parentNode as HTMLElement;
  return +parent.id;
};

export const clearInputs = (name: HTMLInputElement, color: HTMLInputElement) => {
  name.value = '';
  color.value = '#ffffff';
  store.createInputColor = '';
  store.createInputName = '';
  store.selectedCarId = 0;
  const updateCar: HTMLButtonElement = document.querySelector('.update-btn')!;
  updateCar.disabled = true;
};
export const generateRandomCar = (count = store.generatedCountCars): Array<ICar> => {
  const result: Array<ICar> = [];
  for (let i = 0; i < count; i += 1) {
    result.push({ name: getRandomName(), color: getRandomColor() });
  }
  return result;
};

export function animation(car: HTMLElement, distance: number, timeAnimation: number) {
  const state: IState = {
    id: 0,
  };
  let start = 0;
  let pass = 0;
  function step(timestamp: number) {
    if (!start) start = timestamp;
    const time = timestamp - start;
    pass = Math.round(time * (distance / timeAnimation));
    car.style.transform = `translateX(${Math.min(pass, distance)}px)`;
    if (pass < distance) {
      state.id = window.requestAnimationFrame(step);
    }
  }
  state.id = window.requestAnimationFrame(step);
  return state;
}

const getCenter = (elem: HTMLElement): number => {
  const { left, width } = elem.getBoundingClientRect();
  return left + width / 2;
};
export const calcDistance = (a: HTMLElement, b: HTMLElement) => {
  const positionA = getCenter(a);
  const positionB = getCenter(b);
  return Math.abs(positionA * 2 - positionB * 2);
};

export const showWinner = (winner: string, time: number): void => {
  const dialog = document.querySelector<HTMLElement>('.winner-message')!;
  dialog.innerHTML = `${winner} won for ${time}`;
};
export const raceAll = async (
  promises: Array<Promise<IStartCarResponse>>,
  ids: Array<number>
): Promise<ITable> => {
  const { success, id, time } = await Promise.race(promises).then((res) => res);
  if (!success) {
    const failedId = ids.findIndex((i) => i === id);
    const restPromises = [
      ...promises.slice(0, failedId),
      ...promises.slice(failedId + 1, promises.length),
    ];
    const restIds = [...ids.slice(0, failedId), ...ids.slice(failedId + 1, ids.length)];
    return raceAll(restPromises, restIds);
  }
  const winner = { ...store.cars.find((car) => car.id === id) };
  const winnerTime = +(time / 1000).toFixed(2);
  showWinner(winner.name!, winnerTime);
  return { id: winner.id!, name: winner.name!, color: winner.color!, time: winnerTime, wins: 0 };
};

export const saveWinner = async (winner: IWinner) => {
  const winnerStatus = await winnerService.getWinnerStatus(winner.id!);
  if (winnerStatus === 404) {
    const created = await winnerService.createWinner({ id: winner.id, wins: 1, time: winner.time });
  } else {
    const prevResult = await winnerService.getWinnerById(winner.id!);
    await winnerService.updateWinner(winner.id!, {
      id: winner.id!,
      wins: prevResult.wins + 1,
      time: Math.min(prevResult.time, winner.time),
    });
  }
};

export const getWonCars = () => {
  const cars = store.winners.map(async (winner) => {
    const res: ICar = await carService.getCarById(winner.id!);
    const car: ITable = {
      name: res.name,
      color: res.color,
      wins: winner.wins,
      time: winner.time,
      id: winner.id!,
    };
    return car;
  });
  return cars;
};

export const updateInputValues = () => {
  const createCarInput = <HTMLInputElement>document.getElementById('create-input')!;
  createCarInput.addEventListener('change', () => {
    store.createInputName = createCarInput.value;
  });
  const createCarColor = <HTMLInputElement>document.getElementById('create-color')!;
  createCarColor.addEventListener('change', () => {
    store.createInputColor = createCarColor.value;
  });
  const updateCarInput = <HTMLInputElement>document.getElementById('update-input')!;
  updateCarInput.addEventListener('change', () => {
    store.updateInputName = updateCarInput.value;
  });
  const updateCarColor = <HTMLInputElement>document.getElementById('update-color')!;
  updateCarColor.addEventListener('change', () => {
    store.updateInputColor = updateCarColor.value;
  });
};

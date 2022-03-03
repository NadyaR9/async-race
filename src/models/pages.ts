import { ICar, IWinner } from './response';

export interface IComponent {
  render(): Promise<string>;
  after_render(): Promise<boolean>;
}
interface IWinners extends IWinner {
  time: number;
}
interface IAnimation {
  id: number;
}
export interface IStore {
  animation: Array<IAnimation>;
  cars: Array<ICar>;
  carsCount: number;
  currentCarPage: number;
  carPerPage: number;
  winners: Array<IWinners>;
  winnersCount: number;
  currentWinnersPage: number;
  winnerPerPage: number;
  pageName: string;
  sortBy: string;
  sortOrder: string;
  createInputName: string;
  createInputColor: string;
  updateInputName: string;
  updateInputColor: string;
  selectedCarId: number;
  generatedCountCars: number;
}

export interface ITable {
  name: string;
  color: string;
  wins: number;
  time: number;
  id: number;
}
export interface IState {
  id: number;
}

export interface IStartCarResponse {
  success: boolean;
  id: number;
  time: number;
}

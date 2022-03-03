export interface ICar {
  name: string;
  color: string;
  id?: number;
}
export interface ICarResponse {
  response: Array<ICar>;
  count: string | null;
}

export interface IWinner {
  wins: number;
  time: number;
  id?: number;
}

export interface IWinnerResponse {
  response: Array<IWinner>;
  count: string | null;
}

export interface IEngine {
  id?: number;
  status: string;
  velocity: number;
  distance: number;
}

export interface IDriveResponse {
  success: boolean;
}

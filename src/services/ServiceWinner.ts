import { IWinner, IWinnerResponse } from '../models/response';
import Service from './Service';

export class ServiceWinner extends Service {
  _baseLink = 'http://127.0.0.1:3000/winners';
  setSortOrder = (sort: string, order: string): string => {
    return sort && order ? `&_sort=${sort}&_order=${order}` : '';
  };
  getAllWinners = async (
    page = 1,
    limit = 7,
    sort: string,
    order: string
  ): Promise<IWinnerResponse> =>
    await this.getResource(
      `${this._baseLink}?_page=${page}&_limit=${limit}${this.setSortOrder(sort, order)}`
    );

  getWinnerById = async (id: number): Promise<IWinner> => {
    const response = await fetch(`${this._baseLink}/${id}`);
    try {
      if (response.status === 404) {
        throw new Error(`${response.statusText}`);
      }
    } catch (err) {
      console.log(err);
    }
    return await response.json();
  };

  getWinnerStatus = async (id: number) => {
    const response = await fetch(`${this._baseLink}/${id}`);
    return response.status;
  };
  createWinner = async (data: IWinner) => {
    const response = await fetch(`${this._baseLink}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    try {
      if (response.status === 500) {
        throw new Error(`Insert failed, duplicate id`);
      }
    } catch (err) {
      console.log(err);
    }

    return await response.json();
  };

  deleteWinner = async (id: number) => {
    const response = await fetch(`${this._baseLink}/${id}`, {
      method: 'DELETE',
    });
    try {
      if (response.status === 404) {
        throw new Error(`${response.statusText}`);
      }
    } catch (err) {
      console.log(err);
    }
    return await response.json();
  };

  updateWinner = async (id: number, data: IWinner) => {
    const response = await fetch(`${this._baseLink}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    try {
      if (response.status === 404) {
        throw new Error(`${response.statusText}`);
      }
    } catch (err) {
      console.log(err);
    }
    return await response.json();
  };
}

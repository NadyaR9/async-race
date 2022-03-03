import { ICar, ICarResponse } from '../models/response';
import Service from './Service';

export class ServiceCar extends Service {
  _baseLink = 'http://127.0.0.1:3000/garage';

  getAllCars = async (page = 1, limit = 7): Promise<ICarResponse> =>
    await this.getResource(`${this._baseLink}?_page=${page}&_limit=${limit}`);

  // getCarById = async (id: number): Promise<ICar> =>
  //   (await this.getResource(`${this._baseLink}/${id}`)).response;

  getCarById = async (id: number): Promise<ICar> => {
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

  createCar = async (data: ICar) => {
    const response = await fetch(`${this._baseLink}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  deleteCar = async (id: number) => {
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

  updateCar = async (id: number, data: ICar) => {
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

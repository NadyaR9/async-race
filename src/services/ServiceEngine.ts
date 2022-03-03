import { IDriveResponse, IEngine } from '../models/response';
import Service from './Service';

export class ServiceIEngine extends Service {
  _baseLink = 'http://127.0.0.1:3000/engine';

  startEngine = async (id: number) => {
    const response = await fetch(`${this._baseLink}?id=${id}&status=started`, { method: 'PATCH' });
    try {
      if (response.status === 404) {
        throw new Error('Car with such id was not found in the garage.');
      }
      if (response.status === 400) {
        throw new Error(
          'Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"'
        );
      }
    } catch (err) {
      console.log(`${err}`);
    }
    return await response.json();
  };

  stopEngine = async (id: number) => {
    const response = await fetch(`${this._baseLink}?id=${id}&status=stopped`, { method: 'PATCH' });
    try {
      if (response.status === 404) {
        throw new Error('Car with such id was not found in the garage.');
      }
      if (response.status === 400) {
        throw new Error(
          'Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"'
        );
      }
    } catch (err) {
      console.log(`${err}`);
    }
    return await response.json();
  };

  driveEngine = async (id: number): Promise<IDriveResponse> => {
    const response = await fetch(`${this._baseLink}?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    try {
      if (response.status === 400) {
        throw new Error(
          'Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"'
        );
      }
      if (response.status === 404) {
        throw new Error(
          'Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?'
        );
      }
      if (response.status === 429) {
        throw new Error(
          'Drive already in progress. You cant run drive for the same car twice while its not stopped.'
        );
      }
      if (response.status === 500) {
        throw new Error('Car has been stopped suddenly. Its engine was broken down.');
      }
      return { ...(await response.json()) };
    } catch (err) {
      console.log(`${err}`);
      return { success: false };
    }
  };
}

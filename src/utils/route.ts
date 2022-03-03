import { IRequest } from '../models/spa';
export const route = {
  parseRequestURL: () => {
    const url = location.hash.slice(1).toLowerCase() || '/';

    const urlItem = url.split('/');

    const request: IRequest = {
      resource: null,
      id: null,
      verb: null,
    };

    request.resource = urlItem[1];
    request.id = urlItem[2];
    request.verb = urlItem[3];

    return request;
  },

  sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
};

export default route;

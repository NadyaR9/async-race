'use strict';

import './styles/style.scss';

import { Garage } from './pages/Garage';
import { Winners } from './pages/Winners';
import { Error404 } from './pages/Error404';
import { route } from './utils/route';

import { IComponent, IRoutes } from './models/spa';
import { Header } from './components/Header';

const headerInstance: IComponent = new Header();
const garageInstance: IComponent = new Garage();
const winnersInstance: IComponent = new Winners();
const error404Instance: IComponent = new Error404();

const routes: IRoutes = {
  '/': garageInstance,
  '/winners': winnersInstance,
};

const router = async () => {
  const header = document.getElementById('header_container') || null;
  const content = document.getElementById('page_container') || null;
  const request = route.parseRequestURL();
  header!.innerHTML = await headerInstance.render();
  await headerInstance.after_render();
  const parsedURL: string =
    (request.resource ? `/${request.resource}` : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? `/${request.verb}` : '');

  const page = routes[parsedURL] ? routes[parsedURL] : error404Instance;

  content!.innerHTML = await page.render();

  await page.after_render();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

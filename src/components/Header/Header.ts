import { IComponent } from '../../models/pages';
import './Header.scss';
export class Header implements IComponent {
  async render(): Promise<string> {
    return `
      <header class="header">
      <a href="#/"><button class="garage btn header-btn" type="button" name="garage" role="link">To Garage</button></a>
      <a href="#/winners"><button class="winners btn header-btn" type="button" name="winners" role="link">To Winners</button></a>
      </header>
    `;
  }

  async after_render(): Promise<boolean> {
    return true;
  }
}

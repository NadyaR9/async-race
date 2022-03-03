import { Button } from '../Button';

export class DriveControl {
  render(): string {
    const start = new Button('A', 'A', 'drive-btn');
    const stop = new Button('B', 'B', 'stop-btn');
    return `
      ${start.render()}
      ${stop.render()}
    `;
  }
}

import { Button } from '../Button';
import './PaginationPanel.scss';
export class PaginationControl {
  count: number;
  rowsPerPage: number;
  constructor(count: number, rowsPerPage: number) {
    this.count = count;
    this.rowsPerPage = rowsPerPage;
  }
  render(): void {
    const pages: number = Math.ceil(this.count / this.rowsPerPage);
    const wrapper: HTMLElement = document.querySelector('#pagination-list')!;
    wrapper.innerHTML = '';
    let result = ``;
    for (let i = 0; i < pages; i += 1) {
      result += new Button(`${i + 1}`, 'pagination-item', 'pagination-item').render();
    }
    wrapper.innerHTML = result;
  }
}

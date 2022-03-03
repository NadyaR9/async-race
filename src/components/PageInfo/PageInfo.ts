import './PageInfo.scss';
export class PageInfo {
  pageName: string;
  currentPage: number;
  totalCount: number;
  constructor(pageName: string, currentPage: number, totalCount: number) {
    this.pageName = pageName;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }

  render = (): void => {
    const wrapper: HTMLElement = document.querySelector('#page-info')!;
    wrapper.innerHTML = `
      <h1 class="page-name">${this.pageName} (${this.totalCount})</h1>
      <h4 class="pahe-count">Page #${this.currentPage}</h4>
    `;
  };
}

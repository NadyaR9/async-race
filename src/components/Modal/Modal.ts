import './Modal.scss';

export class Modal {
  title: string;
  text: string;
  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }

  render = () => {
    const modal = document.querySelector('.modal')!;
    modal.classList.toggle('modal_hide', false);
    modal.innerHTML = '';
    modal.innerHTML = `
			<div class="modal-close"></div>
			<h4>${this.title}</h4>
			<p>${this.text}</p>
		`;
  };

  after_render = () => {
    const close = document.querySelector('.modal-close');
    close?.addEventListener('click', () => {
      document.querySelector('.modal')?.classList.toggle('modal_hide', true);
    });
  };
}

export interface IRequest {
  resource: null | string;
  id: null | string;
  verb: null | string;
}

export interface IComponent {
  render(): Promise<string>;
  after_render(): Promise<boolean>;
}

export interface IRoutes {
  [route: string]: IComponent;
}

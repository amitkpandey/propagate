import * as RouteActions from './routes';
import * as BoardActions from './board';
import * as ModeActions from './mode';

export const ActionCreators = Object.assign(
  {},
  RouteActions,
  BoardActions,
  ModeActions,
);

import { all, fork } from 'redux-saga/effects';
import watchGame from './game';
import watchProfile from './profile';
import watchWelcome from './welcome';

export default function* root() {
  yield all([fork(watchProfile), fork(watchGame), fork(watchWelcome)]);
}

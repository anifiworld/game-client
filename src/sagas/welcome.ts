import { all, fork } from 'redux-saga/effects';

/***************************** Subroutines ************************************/

/******************************* WATCHERS *************************************/
function* watchGetFreeHero(): any {}

/***************************** EVENT CHANNEL **********************************/

export default function* watchAll() {
  yield all([fork(watchGetFreeHero)]);
}

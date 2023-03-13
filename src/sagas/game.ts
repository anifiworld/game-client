import { all, fork } from 'redux-saga/effects';

/***************************** Subroutines ************************************/

/******************************* WATCHERS *************************************/
function* watchInitGame(): any {}

/***************************** EVENT CHANNEL **********************************/

export default function* watchAll() {
  yield all([fork(watchInitGame)]);
}

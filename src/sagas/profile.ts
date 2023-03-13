import { all, fork, select, take } from 'redux-saga/effects';
import { setAxiosClient } from '../utils/axiosClient';
import { getToken } from './selectors';


/***************************** Subroutines ************************************/

/******************************* WATCHERS *************************************/
function* watchRehydrated(): any {
  while (
    yield take((action: any) => {
      return action.type === 'persist/REHYDRATE';
    })
  ) {
    const token: string | null = yield select(getToken);
    if (token) setAxiosClient(token);
  }
}

/****************************** EVENT CHANNEL ***********************************/

export default function* watchAll() {
  yield all([fork(watchRehydrated)]);
}
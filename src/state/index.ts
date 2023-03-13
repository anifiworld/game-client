import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import gameReducer from './game';
import profileReducer from './profile';
import welcomeReducer from './welcome';
import settingReducer from './setting';

const persistConfig = {
  key: 'rootV4',
  whitelist: ['profile', 'setting'],
  storage,
};

const rootReducer = combineReducers({
  profile: profileReducer,
  game: gameReducer,
  welcome: welcomeReducer,
  setting: settingReducer,
});

const sagaMiddleware = createSagaMiddleware();
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
sagaMiddleware.run(rootSaga);
export default store;

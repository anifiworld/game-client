import { State } from '../state/types';

export const getToken = (state: State) => state.profile.token;

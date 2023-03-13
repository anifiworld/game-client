import { GameStateData } from './manager/interface/DirectorData';
import { GameState } from './manager/interface/GameState';

export const mockState1: GameStateData[] = [
  {
    phase: GameState.StageNamePhase,
    data: {
      world: 'World 1-1',
      phase: 'Phase 1',
    },
    autoNext: true,
    transitionTime: 2000,
  },
  {
    phase: GameState.SetupPhase,
    autoNext: false,
  },
];

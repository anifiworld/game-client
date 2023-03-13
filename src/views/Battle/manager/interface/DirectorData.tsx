import { BattleType } from './BattleType';
import { GameState } from './GameState';
import { SlotLocation } from './SlotLocation';

export interface StageNamePhaseData {
  phase: GameState.StageNamePhase;
  data: {
    world: string;
    phase: string;
  };
  autoNext: boolean;
  transitionTime: number;
}

export interface SetupPhaseData {
  phase: GameState.SetupPhase;
  autoNext: false;
}

export interface BattlePhaseData {
  phase: GameState.BattlePhase;
  autoNext: true;
  data: BattlePhaseDataAttack | BattlePhaseDataCutScene;
}

export interface ActiveDamage {
  useSkill: boolean;
  to: SlotLocation;
  damage: number;
}

export interface DamageTo {
  to: SlotLocation;
  damage: number;
}

export interface BattlePhaseDataAttack {
  type: BattleType.Attack;
  from: SlotLocation;
  to?: SlotLocation;
  useSkill: boolean;
  damages: DamageTo[];
}

export interface BattlePhaseDataCutScene {
  type: BattleType.CutScene;
  image: string;
}

export interface ResultPhaseData {
  phase: GameState.ResultPhase;
  data: {
    win: boolean;
  };
  autoNext: false;
}

export type CurrentDamage = {
  [location in SlotLocation]: number;
};

export type GameStateData =
  | StageNamePhaseData
  | SetupPhaseData
  | BattlePhaseData
  | ResultPhaseData;

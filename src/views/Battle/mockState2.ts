import artemis from '../../assets/image/cutscene/artemis-cutscene.png';
import hugo from '../../assets/image/cutscene/hugo-cutscene.png';
import iris from '../../assets/image/cutscene/iris-cutscene.png';
import kane from '../../assets/image/cutscene/kane-cutscene.png';
import loki from '../../assets/image/cutscene/loki-cutscene.png';
import venus from '../../assets/image/cutscene/venus-cutesence.png';
import { BattleType } from './manager/interface/BattleType';
import { GameStateData } from './manager/interface/DirectorData';
import { GameState } from './manager/interface/GameState';
import { SlotLocation } from './manager/interface/SlotLocation';

export const mockState2: GameStateData[] = [
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.CutScene,
      image: iris,
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H1,
      useSkill: true,
      damages: [
        {
          to: SlotLocation.E2,
          damage: 35,
        },
        {
          to: SlotLocation.E4,
          damage: 35,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.CutScene,
      image: kane,
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H2,
      to: SlotLocation.E2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E2,
          damage: 48,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.CutScene,
      image: venus,
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H3,
      to: SlotLocation.E2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E2,
          damage: 48,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E1,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 14,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E2,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 16,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E3,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 18,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E4,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 50,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E4,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 22,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H1,
      to: SlotLocation.E4,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E4,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H2,
      to: SlotLocation.E4,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E4,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H3,
      to: SlotLocation.E1,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E1,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E1,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 24,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E3,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 26,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E4,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 30,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H1,
      to: SlotLocation.E1,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E1,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H2,
      to: SlotLocation.E1,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E1,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H3,
      to: SlotLocation.E1,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E1,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E3,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 32,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E4,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 34,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H1,
      to: SlotLocation.E3,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E3,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H2,
      to: SlotLocation.E3,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E3,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H3,
      to: SlotLocation.E3,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E3,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E4,
      to: SlotLocation.H2,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H2,
          damage: 40,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H1,
      to: SlotLocation.E4,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E4,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H3,
      to: SlotLocation.E4,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E4,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.E4,
      to: SlotLocation.H1,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.H1,
          damage: 14,
        },
      ],
    },
  },
  {
    phase: GameState.BattlePhase,
    autoNext: true,
    data: {
      type: BattleType.Attack,
      from: SlotLocation.H1,
      to: SlotLocation.E4,
      useSkill: false,
      damages: [
        {
          to: SlotLocation.E4,
          damage: 33,
        },
      ],
    },
  },
  {
    phase: GameState.ResultPhase,
    data: { win: true },
    autoNext: false,
  },
];

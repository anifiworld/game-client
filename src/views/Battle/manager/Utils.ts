import artemis from '../../../assets/image/cutscene/artemis-cutscene.png';
import hugo from '../../../assets/image/cutscene/hugo-cutscene.png';
import iris from '../../../assets/image/cutscene/iris-cutscene.png';
import kane from '../../../assets/image/cutscene/kane-cutscene.png';
import loki from '../../../assets/image/cutscene/loki-cutscene.png';
import venus from '../../../assets/image/cutscene/venus-cutesence.png';
import { BattleType } from './interface/BattleType';
import { GameStateData } from './interface/DirectorData';
import { GameState } from './interface/GameState';
import { ServerJson } from './interface/ServerJson';
import { SlotLocation } from './interface/SlotLocation';

const skillImage = {
  artemis,
  hugo,
  iris,
  kane,
  loki,
  venus,
};
const SlotXY = {
  [SlotLocation.E1]: [1, 1],
  [SlotLocation.E2]: [3, 1],
  [SlotLocation.E3]: [0, 0],
  [SlotLocation.E4]: [2, 0],
  [SlotLocation.E5]: [4, 0],
  [SlotLocation.H1]: [1, 2],
  [SlotLocation.H2]: [3, 2],
  [SlotLocation.H3]: [0, 3],
  [SlotLocation.H4]: [2, 3],
  [SlotLocation.H5]: [4, 3],
};

export const DAMAGE_XY: { [key: string]: { top: string; left: string } } = {
  [SlotLocation.E1]: {
    top: '20.7vw',
    left: '31.8vw',
  },
  [SlotLocation.E2]: {
    top: '20.7vw',
    left: '48.2vw',
  },
  [SlotLocation.E3]: {
    top: '15vw',
    left: '23.2vw',
  },
  [SlotLocation.E4]: {
    top: '15vw',
    left: '40.1vw',
  },
  [SlotLocation.E5]: {
    top: '15vw',
    left: '56.6vw',
  },
  [SlotLocation.H1]: {
    top: '30.7vw',
    left: '31.8vw',
  },
  [SlotLocation.H2]: {
    top: '30.7vw',
    left: '48.2vw',
  },
  [SlotLocation.H3]: {
    top: '36.4vw',
    left: '23.2vw',
  },
  [SlotLocation.H4]: {
    top: '36.4vw',
    left: '40.1vw',
  },
  [SlotLocation.H5]: {
    top: '36.4vw',
    left: '56.6vw',
  },
};

const calculateDistance = (from: SlotLocation, to: SlotLocation) => {
  const xyFrom = SlotXY[from];
  const xyTo = SlotXY[to];
  return [xyTo[0] - xyFrom[0], Math.abs(xyTo[1] - xyFrom[1])];
};
const DISTANCE_Y: any = {
  '1': '9vw',
  '2': '14vw',
  '3': '19vw',
};

export const getRealDistance = (from: SlotLocation, to: SlotLocation) => {
  const d = calculateDistance(from, to);
  return [`${d[0] * 8}vw`, DISTANCE_Y[d[1].toString()]];
};

export const getDirectorJson = (serverJson: ServerJson): GameStateData[] => {
  const result: GameStateData[] = [];
  for (const seq of serverJson.play_data.game_sequence) {
    if (seq.type === 'normal') {
      let damageTo: SlotLocation | undefined = seq.damages[0].to;
      // Group damage
      if (seq.damages.length > 1) {
        damageTo = undefined;
      }
      result.push({
        phase: GameState.BattlePhase,
        autoNext: true,
        data: {
          type: BattleType.Attack,
          from: seq.from,
          to: damageTo,
          useSkill: false,
          damages: seq.damages.map((d) => ({
            to: d.to,
            damage: d.damage,
          })),
        },
      });
    } else if (seq.type === 'skill') {
      if (seq.from.substr(0, 1) === 'h') {
        const slotNumber = ('slot' + seq.from.substr(1, 1)) as
          | 'slot1'
          | 'slot2'
          | 'slot3'
          | 'slot4'
          | 'slot5';
        result.push({
          phase: GameState.BattlePhase,
          autoNext: true,
          data: {
            type: BattleType.CutScene,
            image:
              skillImage[
                serverJson.play_data.hero[slotNumber]!.info.hero_type.name
              ],
          },
        });
      }
      let damageTo: SlotLocation | undefined = seq.damages[0].to;
      // Group damage
      if (seq.damages.length > 1) {
        damageTo = undefined;
      }
      result.push({
        phase: GameState.BattlePhase,
        autoNext: true,
        data: {
          type: BattleType.Attack,
          from: seq.from,
          to: damageTo,
          useSkill: true,
          damages: seq.damages.map((d) => ({
            to: d.to,
            damage: d.damage,
          })),
        },
      });
    }
  }
  result.push({
    phase: GameState.ResultPhase,
    autoNext: false,
    data: {
      win: serverJson.is_win,
    },
  });
  return result;
};

export const calculateHpPercent = (
  maxHp: number,
  startHp: number,
  damage: number,
) => {
  const currentHpValue = startHp - damage;
  const currentHpPercent = (currentHpValue / maxHp) * 100;
  return currentHpPercent;
};

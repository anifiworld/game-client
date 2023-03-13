import { SlotLocation } from './SlotLocation';

export interface HeroInfo {
  base_str: number;
  base_agi: number;
  base_int: number;
  base_vit: number;
  is_on_chain: boolean;
  is_deleted: boolean;
  info: {
    calculated_str: number;
    calculated_agi: number;
    calculated_int: number;
    calculated_vit: number;
    calculated_hp: number;
    calculated_atk: number;
    calculated_matk: number;
    calculated_def: number;
    calculated_aspd: number;
    level: number;
    rank: {
      value: number;
    };
    rarity: {
      name: string;
    };
    hero_type: {
      hero_class: string;
      name: 'artemis' | 'hugo' | 'iris' | 'kane' | 'loki' | 'venus';
    };
    nft_id: string;
    exp: number;
  };
}

export interface ServerJson {
  play_data: {
    hero: {
      slot1: HeroInfo | null;
      slot2: HeroInfo | null;
      slot3: HeroInfo | null;
      slot4: HeroInfo | null;
      slot5: HeroInfo | null;
    };
    game_sequence: {
      from: SlotLocation;
      type: 'normal' | 'skill';
      damages: {
        to: SlotLocation;
        damage: number;
        left: number;
      }[];
    }[];
  };
  start_hp: {
    slot1: number | null;
    slot2: number | null;
    slot3: number | null;
    slot4: number | null;
    slot5: number | null;
  };
  result_hp: {
    slot1: number | null;
    slot2: number | null;
    slot3: number | null;
    slot4: number | null;
    slot5: number | null;
  };
  skill_cool_down: {
    slot1: number | null;
    slot2: number | null;
    slot3: number | null;
    slot4: number | null;
    slot5: number | null;
  };
  phase: {
    id: number;
    phase_no: number;
    reward: {
      exp: number;
      gold: number;
      coin: number;
      items: {
        nft_id: string;
        amount: number;
      }[];
    };
    enemy: {
      slot1: number | null;
      slot2: number | null;
      slot3: number | null;
      slot4: number | null;
      slot5: number | null;
    };
    stage: number;
  };
  is_win: boolean;
  created_at: string;
  game_play_stage: {
    id: number;
    is_win: boolean;
    is_completed: boolean;
    is_cancelled: boolean;
    is_boosted: boolean;
    stage: number;
    player: number;
  };
  id: number;
  next_phase_id: number;
}

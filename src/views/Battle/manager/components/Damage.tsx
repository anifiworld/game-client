import { useSpring, animated } from '@react-spring/web';
import { useEffect } from 'react';
import useSound from 'use-sound';
import { SlotLocation } from '../interface/SlotLocation';
import { DAMAGE_XY } from '../Utils';
import { useSettings } from 'state/hooks';
import { SETTING_KEY } from 'state/types';
import battleEffect from 'assets/sounds/battleEffect.wav';

interface IDamage {
  useSkill: boolean;
  to: SlotLocation;
  damage: number;
}

export const Damage = (props: IDamage) => {
  const [styles, api] = useSpring(() => ({ opacity: 1, translateY: '0vw' }));

  const settings = useSettings();
  const [play] = useSound(battleEffect, {
    volume: Number(settings[SETTING_KEY.EFFECT_VOLUME]) / 100.0,
  });

  useEffect(() => {
    api.start({
      opacity: 0,
      translateY: '-2vw',
      config: { duration: 500 },
    });

    play();
  }, [api, play]);

  return (
    <animated.div
      style={{
        textAlign: 'center',
        fontSize: '2vw',
        position: 'absolute',
        zIndex: 4,
        width: '20vw',
        height: 100,
        color: '#ffffff',
        textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black',
        ...DAMAGE_XY[props.to],
        ...styles,
      }}
    >
      <img
        src={
          props.useSkill
          ? require('../../../../assets/image/battle/attack-skill.gif').default
          : require('../../../../assets/image/battle/attack-normal.gif').default
        }
        alt={''}
        width={'60%'}
        style={{
          position: 'absolute',
          zIndex: 3,
          transform: 'translate(-40%, -45%)',
        }}
      />
      {props.damage}
    </animated.div>
  );
};

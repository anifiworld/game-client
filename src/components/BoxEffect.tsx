import React, { useState } from 'react';
import Box from '@mui/material/Box';
import useSound from 'use-sound';
import soundClick from 'assets/sounds/sound-click.wav';
import { useSettings } from 'state/hooks';
import { SETTING_KEY } from 'state/types';

interface IBoxEffect {
  children?: any;
  className?: string;
  sx?: any;
  onClick?: () => void;
  isHoverEffect?: boolean;
}

const BoxEffect = (props: IBoxEffect) => {
  const { children, className, sx, onClick, isHoverEffect = true } = props;
  const settings = useSettings();
  const [play, { stop }] = useSound(
    soundClick,
    { volume: Number(settings[SETTING_KEY.EFFECT_VOLUME]) / 100.0 }
  );

  return (
    <Box
      onMouseEnter={() => {
        if (isHoverEffect) {
          play();
        }
      }}
      onMouseLeave={() => {
        if (isHoverEffect) {
          stop();
        }
      }}
      onClick={() => {
        play();
        if (onClick !== undefined) {
          onClick();
        }
      }}
      className={className}
      sx={sx}
    >
      {children}
    </Box>
  );
}

export default BoxEffect;

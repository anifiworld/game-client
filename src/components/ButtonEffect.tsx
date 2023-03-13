import Button from '@mui/material/Button';
import React from 'react';
import styled from 'styled-components';
import useSound from 'use-sound';
import { useSettings } from 'state/hooks';
import { SETTING_KEY } from 'state/types';
import soundClick from 'assets/sounds/sound-click.wav';


const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
`;

interface IButtonEffect {
  children?: any;
  className?: string;
  sx?: any;
  disabled?: boolean;
  variant?: any;
  disableRipple?: boolean;
  onClick?: () => void;
}

const ButtonEffect = (props: IButtonEffect) => {
  const { children, className, sx, disabled, variant, disableRipple, onClick } =
    props;
  const settings = useSettings();
  const [play, { stop }] = useSound(soundClick, {
    volume: Number(settings[SETTING_KEY.EFFECT_VOLUME]) / 100.0,
  });

  return (
    <Button
      onMouseEnter={() => {
        play();
      }}
      onMouseLeave={() => {
        stop();
      }}
      onClick={() => {
        play();
        if (onClick) onClick();
      }}
      className={className}
      sx={sx}
      disabled={disabled}
      variant={variant}
      disableRipple={disableRipple}
    >
      {children}
    </Button>
  );
};

export default ButtonEffect;
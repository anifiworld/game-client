import React, { useState } from 'react';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import useSound from 'use-sound';
import soundClick from 'assets/sounds/sound-click.wav';
import { useSettings } from 'state/hooks';
import { SETTING_KEY } from 'state/types';

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
`;

interface IFlexBoxEffect {
  children?: any;
  className?: string;
  onClick?: any;
  isHoverEffect?: boolean;
  isClickEffect?: boolean;
}

const FlexBoxEffect = (props: IFlexBoxEffect) => {
  const { children, className, onClick, isHoverEffect, isClickEffect } = props;
  const settings = useSettings();
  const [play, { stop }] = useSound(
    soundClick,
    { volume: Number(settings[SETTING_KEY.EFFECT_VOLUME]) / 100.0 }
  );

  return (
    <FlexBox
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
        if (isClickEffect) {
          play();
        }
        if (onClick !== undefined) {
          onClick();
        }
      }}
      className={className}
    >
      {children}
    </FlexBox>
  );
}

export default FlexBoxEffect;

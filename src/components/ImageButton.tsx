import React, { useState } from 'react';
import useSound from 'use-sound';
import soundClick from 'assets/sounds/sound-click.wav';
import { useSettings } from 'state/hooks';
import { SETTING_KEY } from 'state/types';

interface IImageButton {
  src?: string;
  alt?: string;
  style?: any;
  width?: any;
  height?: any;
  className?: any;
  onClick?: () => void;
  disabled?: boolean;
}

const ImageButton = (props: IImageButton) => {
  const { src, alt, style, width, height, className, onClick, disabled } = props;
  const settings = useSettings();
  const [play, { stop }] = useSound(
    soundClick,
    { volume: Number(settings[SETTING_KEY.EFFECT_VOLUME]) / 100.0 }
  );

  return (
    <img
      onMouseEnter={() => {
        play();
      }}
      onMouseLeave={() => {
        stop();
      }}
      onClick={() => {
        play();
        if (onClick !== undefined && !disabled) {
          onClick();
        }
      }}
      className={className}
      src={src}
      alt={alt}
      style={style}
      width={width}
      height={height}
    />
  );
}

export default ImageButton;

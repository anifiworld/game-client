import React from 'react';
import useSound from 'use-sound';
import soundClick from 'assets/sounds/sound-click.wav';
import { useSettings } from 'state/hooks';
import { SETTING_KEY } from 'state/types';

interface ICarouselControls {
  prev: any;
  next: any;
  currentSlide: number;
  totalSlide: number;
}

const CarouselControls = ({ prev, next, currentSlide, totalSlide }: ICarouselControls) => {
  const settings = useSettings();
  const [play, { stop }] = useSound(
    soundClick,
    { volume: Number(settings[SETTING_KEY.EFFECT_VOLUME]) / 100.0 }
  );

  return (
    <div>
      {
        currentSlide > 0 && (
          <button 
            className='carousel-control left' 
            onMouseEnter={() => {
              play();
            }}
            onMouseLeave={() => {
              stop();
            }}
            onClick={() => {
              play();
              prev();
            }}
          >
            <img
              alt={''}
              src={
                require('../../assets/image/ui/13e3941ce15a5f861a3dfbba73574c8f.png')
                  .default
              }
            />
          </button>
        )
      }
      {
        currentSlide < totalSlide - 1 && (
          <button 
            className='carousel-control right' 
            onMouseEnter={() => {
              play();
            }}
            onMouseLeave={() => {
              stop();
            }}
            onClick={() => {
              play();
              next();
            }}
          >
            <img
              alt={''}
              src={
                require('../../assets/image/ui/arrow-right.svg')
                  .default
              }
            />
          </button>
        )
      }
    </div>
  )
}

export default CarouselControls;
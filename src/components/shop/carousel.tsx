import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import soundClick from 'assets/sounds/sound-click.wav';
import { useSettings } from 'state/hooks';
import { SETTING_KEY } from 'state/types';
import './carousel.scss';

const Carousel = ({
  children,
  show,
  leftArrowStyle,
  rightArrowStyle,
  itemsContainerStyle,
  itemsContainerWrapperStyle,
  translateX,
}: {
  children: any;
  show: number;
  leftArrowStyle?: any;
  rightArrowStyle?: any;
  itemsContainerStyle?: any;
  itemsContainerWrapperStyle?: any;
  translateX?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState(children.length);

  const [touchPosition, setTouchPosition] = useState<number | null>(null);
  
  const settings = useSettings();
  const [play, { stop }] = useSound(
    soundClick,
    { volume: Number(settings[SETTING_KEY.EFFECT_VOLUME]) / 100.0 }
  );

  useEffect(() => {
    setLength(children.length);
  }, [children]);

  const next = () => {
    if (currentIndex < length - show) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      next();
    }

    if (diff < -5) {
      prev();
    }

    setTouchPosition(null);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {currentIndex > 0 && (
          <button
            className="left-arrow"
            style={leftArrowStyle && leftArrowStyle}
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
          ></button>
        )}
        <div
          className="carousel-content-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{
            ...itemsContainerWrapperStyle,
          }}
        >
          <div
            className={`carousel-content show-${show}`}
            style={{
              transform: translateX
                ? `translateX(-${currentIndex * translateX}px)`
                : `translateX(-${currentIndex * (100 / show)}%)`,
              ...itemsContainerStyle,
            }}
          >
            {children}
          </div>
        </div>
        {currentIndex < length - show && (
          <button
            className="right-arrow"
            style={rightArrowStyle && rightArrowStyle}
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
          ></button>
        )}
      </div>
    </div>
  );
};

export default Carousel;

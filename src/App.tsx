import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HashRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Routes from './Routes';
import BattleBGM from './assets/sounds/battleBgm.mp3';
import LoginBGM from './assets/sounds/loginBgm.mp3';
import SoundBGM from './assets/sounds/soundBgm.mp3';
import NavBar from './components/Navbar';
import { useCurrentLanguage, useIsBattle, useIsHome, useSettings } from './state/hooks';
import { SETTING_KEY } from './state/types';
import Battle from 'views/Battle';
import StageSelection from 'views/StageSelection';

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

function App() {
  // @ts-ignore
  const { i18n } = useTranslation();
  const language = useCurrentLanguage();
  const [sound, setSound] = useState<any>(null);
  const audioRef = useRef<any>();
  const settings = useSettings();
  const isHome = useIsHome();
  const isBattle = useIsBattle();
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    if (sm)
      window.addEventListener('load', function () {
        setTimeout(function () {
          // This hides the address bar:
          window.scrollTo(0, 1);
        }, 0);
      });
  }, [sm]);

  useEffect(() => {
    if (Number(settings[SETTING_KEY.BGM_VOLUME] > 0)) {
      const fadeAudio = setInterval(() => {
        try {
          audioRef.current.volume -= 0.1;
          if (audioRef.current.volume < 0.003) {
            clearInterval(fadeAudio);
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        } catch (e) {
          console.log(e);
        }
      }, 200);

      return () => {
        clearInterval(fadeAudio);
      };
    }
  }, [audioRef, settings, isBattle, isHome]);

  useEffect(() => {
    if (Number(settings[SETTING_KEY.BGM_VOLUME]) === 0) return;
    const playAttemp = setInterval(() => {
      try {
        audioRef.current.play();
        audioRef.current.volume =
          Number(settings[SETTING_KEY.BGM_VOLUME]) / 100.0;
      } catch (e) {
        console.log(e);
      }
    }, 100);

    return () => {
      clearInterval(playAttemp);
    };
  }, [audioRef, settings, isBattle, isHome]);

  useEffect(() => {
    try {
      if (Number(settings[SETTING_KEY.BGM_VOLUME]) === 0) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.volume = 1.0;
        audioRef.current.play();
      }
    } catch (e) {
      console.log(e);
    }
  }, [audioRef, settings, isBattle, isHome]);

  return (
    <>
      <ToastContainer
        autoClose={3000}
        transition={Slide}
        pauseOnFocusLoss
        pauseOnHover
        newestOnTop
      />
      {isHome && (
        <audio ref={audioRef} autoPlay loop>
          <source src={LoginBGM} />
        </audio>
      )}
      {isBattle && (
        <audio ref={audioRef} autoPlay loop>
          <source src={BattleBGM} />
        </audio>
      )}
      {!isHome && !isBattle && (
        <audio ref={audioRef} autoPlay loop>
          <source src={SoundBGM} />
        </audio>
      )}
      <HashRouter>
        <Box
          id="container"
          sx={{
            aspectRatio: '16/9',
            position: 'relative',
          }}
        >
          {/* @ts-ignore */}
          <Container maxWidth="false" sx={{ pt: '64px' }}>
            <NavBar />
            {/* <StageSelection /> */}
            {/* <Battle /> */}
            <Routes />
          </Container>
        </Box>
      </HashRouter>
    </>
  );
}

export default App;
import { Card, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { orderBy } from 'lodash';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import useSound from 'use-sound';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useSettings } from 'state/hooks';
import { SETTING_KEY } from 'state/types';
import loseEffect from 'assets/sounds/lose-effect.wav';
import winEffect from 'assets/sounds/win-effect.wav';
import ButtonEffect from './ButtonEffect';
import FlexBox from './FlexBox';

interface IModalBattle {
  onNextPhase: () => void;
  show: boolean;
  heros: any;
  data: any;
}

const ModalBattle = (props: IModalBattle) => {
  const { onNextPhase, show, heros, data } = props;
  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();

  const settings = useSettings();
  const [play] = useSound(data?.is_win ? winEffect : loseEffect, {
    volume: Number(settings[SETTING_KEY.EFFECT_VOLUME]) / 100.0,
  });

  const handleNextPhase = () => {
    onNextPhase();
  };

  useEffect(() => {
    play();
  }, [play]);

  return (
    <>
      <Modal show={show}>
        <Container>
          <ResultTitle
            src={
              data?.is_win
                ? require('../assets/image/ui/win.png').default
                : require('../assets/image/ui/lose.png').default
            }
            alt={''}
          />
          {data?.is_win ? (
            <>
              <FlexBox
                // @ts-ignore
                css={`
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  transform: translateY(-12%);
                `}
              >
                <Typography
                  className={'textshadow-black'}
                  sx={{
                    color: 'text.primary',
                    fontSize: xs ? '2vh' : '2vw',
                  }}
                >
                  Received
                </Typography>
                <FlexBox
                  // @ts-ignore
                  css={`
                    flex-direction: row;
                    justify-content: space-around;
                    width: 40%;
                  `}
                >
                  <FlexBox
                    // @ts-ignore
                    css={`
                      position: relative;
                      margin-top: 2%;
                      width: 20%;
                    `}
                  >
                    <RewardImg
                      src={
                        require('../assets/image/ui/eb2198d5ef8767dab873f50c5d5a4502.png')
                          .default
                      }
                      alt={''}
                    />
                    <TextImage
                      className={'textshadow'}
                      sx={{
                        color: 'text.primary',
                        fontSize: xs ? '2vh' : '2vw',
                      }}
                    >
                      {data.phase.reward.coin}
                    </TextImage>
                  </FlexBox>
                  <FlexBox
                    // @ts-ignore
                    css={`
                      position: relative;
                      margin-top: 2%;
                      width: 30%;
                    `}
                  >
                    <RewardImg
                      src={
                        require('../assets/image/ui/icon-gold.png')
                          .default
                      }
                      alt={''}
                    />
                    <TextImage
                      className={'textshadow'}
                      sx={{
                        color: 'text.primary',
                        fontSize: xs ? '2vh' : '2vw',
                      }}
                    >
                      {data.phase.reward.gold}
                    </TextImage>
                  </FlexBox>
                </FlexBox>
                
                <FlexBox
                  // @ts-ignore
                  css={`
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    margin-top: 1%;
                  `}
                >
                  <ExpImg
                    alt={''}
                    src={require('../assets/image/stage/exp-icon.png').default}
                  />
                  <Typography
                    className={'textshadow-black'}
                    sx={{
                      color: 'text.primary',
                      fontSize: xs ? '2vh' : '2vw',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {`+ ${data.phase.reward.exp} Each Hero`}
                  </Typography>
                </FlexBox>
                <SlotContainer>
                  {orderBy(heros, (h) => parseInt(h.slot), ['asc', 'desc']).map((hero: any, index: number) => {
                    if (index <= 4) {
                      return (
                        <SlotHolder key={index}>
                          <SlotBox
                            src={
                              require('../assets/image/ui/skill-slot.png')
                                .default
                            }
                            alt={''}
                          />
                          {hero.id ? (
                            <SlotImageHolder>
                              <SlotImage src={hero.icon} alt={''} />
                            </SlotImageHolder>
                          ) : null}
                        </SlotHolder>
                      );
                    }
                  })}
                </SlotContainer>
                <NextButton
                  className={'btn primary-sm'}
                  onClick={handleNextPhase}
                  disableRipple
                  sx={{
                    color: 'text.primary',
                    fontSize: xs ? '1.8vh' : '1.8vw',
                  }}
                >
                  {data?.next_phase_id ? 'Next Phase' : 'Finish'}
                </NextButton>
              </FlexBox>
            </>
          ) : (
            <BackButton
              className={'btn primary-sm'}
              onClick={() => navigate('/stage-selection')}
              disableRipple
              sx={{
                color: 'text.primary',
                fontSize: xs ? '1.8vh' : '1.8vw',
              }}
            >
              Back
            </BackButton>
          )}
        </Container>
      </Modal>
    </>
  );
};

interface IModalBattleStyleProps {
  show: boolean;
}

const Modal = styled.div<IModalBattleStyleProps>`
  aspect-ratio: 16 / 9;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 100;
  overflow: hidden;
  z-index: 2000;
`;

const Container = styled.div`
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  position: absolute;
  left: 25%;
  right: 25%;
  top: 25%;
  bottom: 25%;
  margin: auto;
  box-sizing: border-box;
`;

const ResultTitle = styled.img`
  width: 38vw;
`;

const RewardImg = styled.img`
  width: 100%;
`;

const TextImage = styled(Typography)`
  position: absolute;
  bottom: -13%;
  right: -18%;
`;

const ExpImg = styled.img`
  width: 6vw;
  margin-right: 5%;
`;

const SlotContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  margin-top: 1%;
`;

const SlotHolder = styled.div`
  position: relative;
`;

const SlotBox = styled.img`
  width: 8vw;
`;

const SlotImageHolder = styled.div`
  width: 5.5vw;
  height: 5.5vw;
  background-color: transparent;
  display: flex;
  position: absolute;
  top: 12%;
  left: 12.5%;
  border-radius: 15%;
`;

const SlotImage = styled.img`
  width: 100%;
  height: 100%;
`;

const NextButton = styled(ButtonEffect)`
  padding-left: 6%;
  padding-right: 6%;
  padding-top: 3%;
  padding-bottom: 4%;
  width: fit-content;
  white-space: nowrap;
`;

const BackButton = styled(ButtonEffect)`
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 1%;
  padding-bottom: 2%;
  width: fit-content;
  white-space: nowrap;
`;

export default ModalBattle;

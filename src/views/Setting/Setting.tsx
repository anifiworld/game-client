import { Button, Card, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from 'state';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { changeSetting } from 'state/actions';
import { useSettings } from 'state/hooks';
import { SETTING_KEY } from 'state/types';
import FlexBox from 'components/FlexBox';
import Slider from 'components/Slider';
import checkboxImg from 'assets/image/ui/check-box-purple.png';


const useStyles = makeStyles(
  ({
    xs,
    sm,
    md,
    lg,
  }: {
    xs: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
  }) => ({
    titleText: {
      top: '29.5%',
      position: 'absolute',
      fontSize: xs ? '2vh' : '2vw',
      zIndex: 2,
    },
    cardContainer: {
      width: '100%',
      height: '100%',
      overflow: 'inherit',
    },
  }),
);

interface ISetting {
  onClose: () => void;
  show: boolean;
}

const Setting = (props: ISetting) => {
  const { onClose, show } = props;
  const [isMute, setIsMute] = useState(false);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const settings = useSettings();

  useEffect(() => {
    if (
      settings[SETTING_KEY.BGM_VOLUME] === 0 &&
      settings[SETTING_KEY.EFFECT_VOLUME] === 0
    ) {
      setIsMute(true);
    } else {
      setIsMute(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    if (isMute) {
      dispatch(
        changeSetting({
          key: SETTING_KEY.BGM_VOLUME,
          value: 0,
        }),
      );
      dispatch(
        changeSetting({
          key: SETTING_KEY.EFFECT_VOLUME,
          value: 0,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMute]);

  const handleClose = () => {
    onClose();
  };

  const onChangeBGMVolume = useCallback(
    (value: number) => {
      dispatch(
        changeSetting({
          key: SETTING_KEY.BGM_VOLUME,
          value: value,
        }),
      );
    },
    [dispatch],
  );

  const onChangeEffectVolume = useCallback(
    (value: number) => {
      dispatch(
        changeSetting({
          key: SETTING_KEY.EFFECT_VOLUME,
          value: value,
        }),
      );
    },
    [dispatch],
  );

  return (
    <>
      <Modal show={show}>
        <Container>
          <BtnClose
            className="btn-close-dialog"
            onClick={handleClose}
          ></BtnClose>
          <Title
            className={`textshadow ${classes.titleText}`}
            gutterBottom
            sx={{
              color: 'text.primary',
            }}
          >
            {'Setting'}
          </Title>
          <Card
            className={`card-setting ${classes.cardContainer}`}
            elevation={0}
          >
            <FlexBox
              // @ts-ignore
              css={`
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 45%;
                left: 22%;
                width: 56%;
                height: 19%;
              `}
            >
              <Slider
                title={'Music'}
                value={settings[SETTING_KEY.BGM_VOLUME]}
                onChange={onChangeBGMVolume}
              />
              <Slider
                title={'Effect'}
                value={settings[SETTING_KEY.EFFECT_VOLUME]}
                onChange={onChangeEffectVolume}
              />
              <HolderSelectContainer>
                <HolderSelect onClick={() => setIsMute(!isMute)}>
                  {isMute ? (
                    <CheckedImg
                      src={
                        require('../../assets/image/ui/checked-purple.png')
                          .default
                      }
                      alt={'checkbox'}
                    />
                  ) : null}
                </HolderSelect>
                <Typography
                  sx={{
                    textAlign: 'left',
                    color: '#7B359B',
                    fontSize: xs ? '1.8vh' : '1.8vw',
                  }}
                >
                  Mute
                </Typography>
              </HolderSelectContainer>
            </FlexBox>
          </Card>
        </Container>
      </Modal>
    </>
  );
};

interface IModalStageStyleProps {
  show: boolean;
}

const Modal = styled.div<IModalStageStyleProps>`
  aspect-ratio: 16 / 9;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 2000;
`;

const Container = styled.div`
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  position: absolute;
  left: 25%;
  right: 25%;
  top: 0%;
  bottom: 25%;
  margin: auto;
  box-sizing: border-box;

  @media all and (display-mode: fullscreen) {
    top: 21%;
  }
`;

const Title = styled(Typography)`
  @media (min-width: 280px) and (max-width: 1279px) {
    top: 28%;
  }

  @media all and (display-mode: fullscreen) {
    top: 29.5%;
  }
`;

const Box = styled.div`
  width: 6vw;
  height: 6vw;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
`;

const BtnClose = styled(Button)`
  position: absolute;
  right: 8%;
  top: 23%;
  background-color: transparent;
  background-size: 100% auto;
  border: none;
  z-index: 1;
  height: 18% !important;
  width: 9%;

  @media (min-width: 280px) and (max-width: 1279px) {
    top: 22%;
    background-size: 80% auto;
  }

  @media all and (display-mode: fullscreen) {
  }
`;

const HolderSelectContainer = styled(FlexBox)`
  color: black;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
`;

const HolderSelect = styled.div`
  display: block;
  margin-right: 4%;
  box-sizing: border-box;
  background: url(${checkboxImg}) no-repeat;
  background-size: contain;
  cursor: pointer;
  height: 100%;
  width: 2vw;
  height: 2vw;
  position: relative;
`;

const CheckedImg = styled.img`
  width: 85%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  cursor: pointer;
  pointer-events: none;
`;

export default Setting;
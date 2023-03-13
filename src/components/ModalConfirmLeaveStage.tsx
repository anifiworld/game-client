import { Card, Typography, CardContent } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ButtonEffect from './ButtonEffect';
import FlexBox from './FlexBox';

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
      top: '26% !important',
      position: 'absolute',
      zIndex: 2,
    },
    cardContainer: {
      width: '100%',
      height: '100%',
    },
    cardGem: {
      position: 'relative',
      userSelect: 'none',
      background: `url(${
        require('../assets/image/ui/1114f97b356eead12a4f6785b9ecad39.png')
          .default
      })`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      justifyContent: 'flex-start',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    cardMedia: {
      width: 'auto',
      height: '39%',
      objectFit: 'fill',
      objectPosition: 'center center',
      marginBottom: '3%',
    },
    textContainer: {
      textAlign: 'center',
      color: '#8D1A39',
    },
    text: {
      fontSize: xs ? '3.5vh' : '3.5vw',
    },
  }),
);

interface IModalConfirmLeaveStage {
  onConfirm: () => void;
  onClose: () => void;
  show: boolean;
  textConfirm: string;
}

const ModalConfirmLeaveStage = (props: IModalConfirmLeaveStage) => {
  const { onConfirm, onClose, show, textConfirm } = props;
  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <>
      <Modal show={show}>
        <Container>
          <Title
            className={`textshadow ${classes.titleText}`}
            gutterBottom
            sx={{
              color: 'text.primary',
            }}
          >
            Confirmation
          </Title>
          <Card
            className={`card-confirm-equipments ${classes.cardContainer}`}
            elevation={0}
          >
            <Content>
              <CardContent className={classes.textContainer}>
                <Typography className={classes.text}>
                  {textConfirm}
                </Typography>
              </CardContent>
            </Content>
            <ButtonsContainer>
              <ButtonModal
                onClick={handleClose}
                className={'btn secondary-sm'}
                disableRipple
                sx={{
                  color: 'text.primary',
                }}
              >
                Cancel
              </ButtonModal>
              <ButtonModal
                className={'btn primary-sm'}
                onClick={handleConfirm}
                disableRipple
                sx={{
                  color: 'text.primary',
                }}
              >
                Confirm
              </ButtonModal>
            </ButtonsContainer>
          </Card>
        </Container>
      </Modal>
    </>
  );
};

interface IModalConfirmLeaveStageStyleProps {
  show: boolean;
}

const Modal = styled.div<IModalConfirmLeaveStageStyleProps>`
  aspect-ratio: 16 / 9;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 2000;
  overflow: hidden;
`;

const Container = styled.div`
  width: 55%;
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  position: absolute;
  left: 0;
  right: 0;
  top: -18%;
  bottom: 0;
  margin: auto;
  box-sizing: border-box;
`;

const Title = styled(Typography)`
  @media screen and (max-width: 1920px) {
    top: 26.2%;
  }

  @media screen and (max-width: 1279px) {
    top: 25.5%;
  }

  @media all and (display-mode: fullscreen) {
    top: 16%;
  }

  @media (orientation: portrait) {
    font-size: 2vh;
  }

  @media (orientation: landscape) {
    font-size: 2vw;
  }
`;

const Content = styled(FlexBox)`
  position: absolute;
  top: 35%;
  left: 7%;
  width: 86%;
  height: 36%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  grid-row: 5;
  column-gap: 3%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  bottom: 10%;
  column-gap: 2%;

  @media screen and (max-width: 1920px) {
    bottom: 15%;
  }

  @media screen and (max-width: 1279px) {
    bottom: 12%;
  }
`;

const ButtonModal = styled(ButtonEffect)`
  width: 20%;
  height: 100%;

  @media screen and (max-width: 1920px) {
    padding: 1%;
  }

  @media (orientation: portrait) {
    font-size: 1.8vh;
  }

  @media (orientation: landscape) {
    font-size: 1.8vw;
  }
`;

export default ModalConfirmLeaveStage;
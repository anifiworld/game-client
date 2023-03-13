import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import bg_dialog_confirm from '../assets/image/ui/dialog-confirm.png';
import FlexBox from './FlexBox';
import ButtonEffect from './ButtonEffect';

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
      top: '4%',
      position: 'absolute',
      fontSize: xs ? '2vh' : '2vw',
      zIndex: 2,
    },
    content: {
      width: '75%',
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '19%',
      boxSizing: 'border-box',
    },
    cancelButton: {
      fontSize: xs ? '1.8vh' : '1.8vw',
    },
    confirmButton: {
      fontSize: xs ? '1.8vh' : '1.8vw',
    },
  }),
);

interface IModalConfirm {
  onClose: () => void;
  onConfirm: () => void;
  show: boolean;
  success: boolean;
  title?: string;
  children?: any;
  disabledConfirm?: boolean;
  isLoading?: boolean;
}

const ModalConfirm = (props: IModalConfirm) => {
  const {
    onClose,
    onConfirm,
    show,
    success,
    title,
    disabledConfirm,
    isLoading,
    children,
  } = props;

  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [show]);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal show={show}>
        <Container>
          <Title
            className={`textshadow-secondary card-title ${classes.titleText}`}
            gutterBottom
            sx={{
              color: 'text.primary',
            }}
          >
            {title}
          </Title>
          <Content>{children}</Content>
          <ButtonsContainer>
            {success ? (
              <ButtonEffect
                onClick={handleClose}
                className={`btn secondary-sm ${classes.cancelButton}`}
                disableRipple
                sx={{
                  color: 'text.primary',
                  width: sm ? '90px' : '150px',
                  height: sm ? '50px' : '70px',
                }}
              >
                Close
              </ButtonEffect>
            ) : (
              <>
                <ButtonEffect
                  onClick={handleClose}
                  className={`btn secondary-sm ${classes.cancelButton}`}
                  disableRipple
                  sx={{
                    color: 'text.primary',
                    width: sm ? '90px' : '150px',
                    height: sm ? '50px' : '70px',
                  }}
                >
                  Cancel
                </ButtonEffect>
                <ButtonEffect
                  className={`btn primary-sm ${classes.confirmButton}`}
                  onClick={onConfirm}
                  disabled={disabledConfirm}
                  disableRipple
                  sx={{
                    color: 'text.primary',
                    width: sm ? '90px' : '150px',
                    height: sm ? '50px' : '70px',
                  }}
                >
                  {isLoading ? 'Confirming...' : 'Confirm'}
                </ButtonEffect>
              </>
            )}
          </ButtonsContainer>
        </Container>
      </Modal>
    </>
  );
};

interface IModalConfirmStyleProps {
  show: boolean;
}

const Modal = styled.div<IModalConfirmStyleProps>`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 100;
  overflow: hidden;
`;

const Container = styled.div`
  height: auto;
  width: 38%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  background: url(${bg_dialog_confirm}) no-repeat;
  background-size: contain;
  padding: 20px;
  position: absolute;
  left: 25%;
  right: 25%;
  top: 25%;
  bottom: 25%;
  margin: auto;
  box-sizing: border-box;
`;

const Title = styled(Typography)`
  @media (min-width: 0) and (max-width: 960px) {
    top: 2%;
  }
`;

const Content = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
  top: 34%;
  box-sizing: border-box;

  @media (min-width: 0) and (max-width: 960px) {
    top: 17%;
    height: 33%;
    padding-top: 4%;
  }

  @media all and (display-mode: fullscreen) {
    top: 28%;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  top: 100%;
  position: absolute;
  column-gap: 3%;
  box-sizing: border-box;

  @media (min-width: 0) and (max-width: 960px) {
    top: 57%;
  }

  @media all and (display-mode: fullscreen) {
    top: 80%;
  }
`;

export default ModalConfirm;

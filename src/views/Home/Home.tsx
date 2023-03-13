import { makeStyles } from '@mui/styles';
import React, { useEffect, useCallback } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FlexBoxEffect from 'components/FlexBoxEffect';
import { useAppDispatch } from 'state';
import { setIsHome, setShowModal } from 'state/actions';

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
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoLeftContainer: {
      position: 'absolute',
      bottom: sm ? '0px' : md ? '0px' : lg ? '0px' : '0px',
      left: 0,
      paddingTop: 0,
      paddingBottom: 0,
      display: 'flex',
      width: '30%',
    },
    logoLeftImage: {
      width: '100%',
    },
    logoRightContainer: {
      position: 'absolute',
      bottom: sm ? '0px' : md ? '0px' : lg ? '0px' : '0px',
      right: 0,
      display: 'flex',
      width: '30%',
    },
    logoRightImage: {
      width: '100%',
    },
    logoCenterContainer: {
      position: 'absolute',
      zIndex: 1,
      textAlign: 'center',
      width: '35%',
      top: '10%',
    },
    logoCenterImage: {
      marginBottom: !md ? '0px' : 'unset',
      width: '100%',
    },
    connectWalletContainer: {
      position: 'absolute',
      zIndex: 1,
      textAlign: 'center',
      width: '35%',
      height: '10%',
      bottom: '10%',
    },
    connectWalletButton: {
      backgroundSize: 'contain',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      fontSize: xs ? '2vh' : '2vw',
      cursor: 'pointer',
    },
  }),
);

const Home = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setIsHome(true)
    );
    return () => {
      dispatch(
        setIsHome(false)
      );
    };
  }, [dispatch]);

  // // wait for the component to be mounted
  // useEffect(() => {
  //   const rootStyle = document.getElementById('container')!.style;
  //   rootStyle.backgroundImage = `url(${
  //     require('../../assets/image/background/21826a0c3ddafed8ce29f4dd62644ea9.webp')
  //       .default
  //   })`;
  //   rootStyle.backgroundRepeat = 'no-repeat';
  //   rootStyle.backgroundColor = '#FAFAFA';
  //   rootStyle.backgroundPosition = 'center center';
  //   rootStyle.backgroundSize = 'cover';
  // }, []);

  const classes = useStyles({ xs, sm, md, lg });

  const handleShowModal = useCallback((value: number) => {
    dispatch(
      setShowModal(true),
    );
  }, [dispatch]);

  return (
    <>
      <div className={classes.container}>
        <div
          style={{
            marginTop: '-8%',
            paddingBottom:
              '56.25%' /* 16:9, for an aspect ratio of 1:1 change to this value to 100% */,
          }}
        >
          <video
            id="background-video"
            muted
            loop
            autoPlay
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <source
              src={require('../../assets/video/home.mp4').default}
              type="video/mp4"
            />
            <img
              alt="home"
              src={require('../../assets/image/home.png').default}
              title="Your browser does not support the <video> tag"
            />
          </video>
        </div>
        <div className={classes.logoLeftContainer}>
          <video
            id="preview-video"
            poster={
              require('../../assets/image/ui/banners/cover_left.png').default
            }
            muted={true}
            loop={true}
            autoPlay={true}
            className={classes.logoLeftImage}
          >
            <source
              src={
                require('../../assets/image/ui/banners/cover_left.webm').default
              }
              type="video/mp4"
            />
            <img
              alt="cover_left"
              src={
                require('../../assets/image/ui/banners/cover_left.png').default
              }
              title="Your browser does not support the <video> tag"
            />
          </video>
        </div>

        <div className={classes.logoRightContainer}>
          <video
            id="preview-video"
            poster={
              require('../../assets/image/ui/banners/cover_right.png').default
            }
            muted={true}
            loop={true}
            autoPlay={true}
            className={classes.logoRightImage}
          >
            <source
              src={
                require('../../assets/image/ui/banners/cover_right.webm')
                  .default
              }
              type="video/mp4"
            />
            <img
              alt="cover_right"
              src={
                require('../../assets/image/ui/banners/cover_right.png').default
              }
              title="Your browser does not support the <video> tag"
            />
          </video>
        </div>

        <div className={`position-center ${classes.logoCenterContainer}`}>
          <img
            src={
              require('../../assets/image/ui/052e38287ff1029cec589474967361bc.png')
                .default
            }
            alt="logo-home"
            className={classes.logoCenterImage}
          />
        </div>
        <div className={`position-center ${classes.connectWalletContainer}`}>
          <FlexBoxEffect
            className={`report-button ${classes.connectWalletButton}`}
            onClick={handleShowModal}
          >
            Connect Wallet
          </FlexBoxEffect>
        </div>
      </div>
    </>
  );
};

export default Home;

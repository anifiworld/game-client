import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ButtonEffect from 'components/ButtonEffect';
import useGetFreeHero from '../../hooks/useFreeHero';
import useGetPlayerInfo from '../../hooks/usePlayerInfo';


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
    stack: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: sm ? 1 : 2,
    },
    logoContainer: {
      top: '19%',
      position: 'absolute',
      width: '15%',
    },
    cardContainer: {
      position: 'absolute',
      top: '22%',
      marginTop: '0',
      paddingTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      width: '60%',
      height: '50%',
    },
    textContainer: {
      position: 'absolute',
      top: '35%',
      width: '100%',
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0',
      textAlign: 'center',
      color: '#8D1A39',
    },
    text1: {
      fontSize: xs ? '3.5vh' : '3.5vw',
    },
    text2: {
      fontSize: xs ? '2.5vh' : '2.5vw',
    },
    getFreeHeroContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    getFreeHeroButton: {
      top: '75%',
      position: 'absolute',
      paddingLeft: '10%',
      paddingRight: '10%',
      paddingTop: '1%',
      paddingBottom: '1%',
      fontSize: xs ? '2.5vh' : '2.5vw',
      '&:disabled': {
        color: 'white',
      },
    },
  }),
);

const Welcome = () => {
  const [disabledButton, setDisabledButton] = useState(false);
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));

  // wait for the component to be mounted
  useEffect(() => {
    const rootStyle = document.getElementById('container')!.style;
    rootStyle.backgroundImage = `url(${
      require('../../assets/image/background/2be23f72a3afd79ea4b94347fc60e590.webp')
        .default
    }
  )`;
    rootStyle.backgroundRepeat = 'no-repeat';
    rootStyle.backgroundPosition = 'center center';
    rootStyle.backgroundSize = 'cover';
  }, []);

  const navigate = useNavigate();
  const { onGetPlayerInfo } = useGetPlayerInfo();
  const { onGetFreeHero } = useGetFreeHero();

  useEffect(() => {
    (async () => {
      const playerInfo = await onGetPlayerInfo();
      if (playerInfo) {
        setDisabledButton(!playerInfo.is_newcomer);
      }
    })();
  }, [onGetPlayerInfo]);

  const handleGetHero = async () => {
    const playerInfo = await onGetPlayerInfo();
    if (playerInfo) {
      const response = await onGetFreeHero(playerInfo);
      if (response && response.message === 'Successfully get free heroes.') {
        navigate('/received-hero');
      }
    }
  };

  const classes = useStyles({ xs, sm, md, lg });
  return (
    <>
      <Grid container rowSpacing={sm ? 1 : 2}>
        <Grid item xs={12} className={classes.container}>
          <Stack spacing={0} className={classes.stack}>
            <img
              className={`logo ${classes.logoContainer}`}
              src={
                require('../../assets/image/ui/48578bf6533b59e262291c4f2f8f1e5d.png')
                  .default
              }
              alt="logo-full-name"
            />
            <Card
              className={`card-welcome ${classes.cardContainer}`}
              elevation={0}
            >
              <CardContent className={classes.textContainer}>
                <Typography className={classes.text1} gutterBottom>
                  {'Are you a new comer?'}
                </Typography>

                <Typography className={classes.text2}>
                  {'start with free hero to play'}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={12} className={classes.getFreeHeroContainer}>
          <ButtonEffect
            sx={{
              color: 'text.primary',
            }}
            className={`btn primary ${classes.getFreeHeroButton}`}
            onClick={handleGetHero}
            disabled={disabledButton}
            disableRipple
          >
            Get Free Hero
          </ButtonEffect>
        </Grid>
      </Grid>
    </>
  );
};

export default Welcome;
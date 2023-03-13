import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useHeroCard from 'hooks/useHeroCard';
import ButtonEffect from 'components/ButtonEffect';

type CardItem = {
  name: string;
  image: any;
};

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
    title: {
      top: '18.5%',
      position: 'absolute',
      fontSize: xs ? '3vh' : '3vw',
      zIndex: 2,
    },
    cardStarter: {
      position: 'absolute',
      top: '15%',
      marginTop: '0',
      paddingTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      width: '64%',
      height: '69%',
    },
    cardContent: {
      position: 'absolute',
      top: '35%',
      width: '90%',
      marginLeft: '5%',
      marginRight: '5%',
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0',
      textAlign: 'center',
      color: '#8D1A39',
    },
    cardMedia: {
      width: '100%',
      height: 'auto',
    },
    continueButton: {
      top: '85%',
      position: 'absolute',
      paddingLeft: '10%',
      paddingRight: '10%',
      paddingTop: '1%',
      paddingBottom: '1%',
      fontSize: xs ? '2.5vh' : '2.5vw',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stack: {
      marginTop: sm ? 1 : 2,
    },
  }),
);

const ReceivedHero = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  const [heros, setHeros] = useState<CardItem[]>([]);

  const navigate = useNavigate();

  const { onHeroCard } = useHeroCard();

  useEffect(() => {
    (async () => {
      setHeros(
        await Promise.all([
          {
            name: 'Gacha Heroes',
            image: await onHeroCard({ 
              id: null, 
              name: 'iris',
              level: '1',
              rarity: 'common',
              calculated_agi: 5,
              calculated_int: 5,
              calculated_str: 5,
              calculated_vit: 5,
              loading: false 
            }),
          },
          {
            name: 'Gacha Heroes2',
            image: await onHeroCard({ 
              id: null, 
              name: 'kane', 
              level: '1',
              rarity: 'common',
              calculated_agi: 5,
              calculated_int: 5,
              calculated_str: 5,
              calculated_vit: 5,
              loading: false 
            }),
          },
          {
            name: 'Gacha Heroes3',
            image: await onHeroCard({
              id: null,
              name: 'venus',
              level: '1',
              rarity: 'common',
              calculated_agi: 5,
              calculated_int: 5,
              calculated_str: 5,
              calculated_vit: 5,
              loading: false,
            }),
          },
        ]),
      );
    })();
    // eslint-disable-next-line
  }, [heros]);
  // url("${process.env.PUBLIC_URL + '/svg/bg.svg'}") no-repeat;

  // wait for the component to be mounted
  useEffect(() => {
    const rootStyle = document.getElementById('container')!.style;
    rootStyle.backgroundImage = `url(${
      require('../../assets/image/background/2be23f72a3afd79ea4b94347fc60e590.webp')
        .default
    })`;
    rootStyle.backgroundRepeat = 'no-repeat';
    rootStyle.backgroundColor = '#FAFAFA';
    rootStyle.backgroundPosition = 'center center';
    rootStyle.backgroundSize = 'cover';
  }, []);

  const classes = useStyles({ xs, sm });

  return (
    <React.Fragment>
      <Grid container rowSpacing={sm ? 1 : 2}>
        <Grid item xs={12} className={classes.container}>
          <Stack
            spacing={0}
            justifyContent="center"
            alignItems="center"
            className={classes.stack}
          >
            <Typography
              className={`textshadow-secondary card-title ${classes.title}`}
              gutterBottom
              sx={{
                color: 'text.primary',
              }}
            >
              {'Received Heroes'}
            </Typography>
            <Card
              className={`card-starter ${classes.cardStarter}`}
              elevation={0}
            >
              <CardContent className={classes.cardContent}>
                <Grid container columnSpacing={sm ? 1 : 2}>
                  {heros?.map(
                    (item: { image: string; name: string }, index) => (
                      <Grid key={index} item xs={4}>
                        <Box
                          sx={{
                            marginTop: -10,
                          }}
                        >
                          {item.image}
                        </Box>
                      </Grid>
                    ),
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <ButtonEffect
            className={`btn primary ${classes.continueButton}`}
            onClick={() => navigate('/team')}
            disableRipple
            sx={{
              color: 'text.primary',
            }}
          >
            Continue
          </ButtonEffect>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ReceivedHero;

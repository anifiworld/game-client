import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ButtonEffect from 'components/ButtonEffect';
import BoxEffect from 'components/BoxEffect';

type Cards = {
  title: string;
  image: string;
  avatar?: string;
  status: string;
};

const cards: Cards[] = [
  {
    title: 'world 1',
    image: require('../../assets/image/ui/world1-card.png').default,
    avatar: require('../../assets/image/ui/world1-avatar.svg').default,
    status: 'active',
  },
  {
    title: 'world 2',
    image: require('../../assets/image/ui/coming-soon-card.png').default,
    status: 'inactive',
  },
  {
    title: 'pvp',
    image: require('../../assets/image/ui/coming-soon-card.png').default,
    status: 'inactive',
  },
];

const useStyles = makeStyles(({ xs }: { xs: boolean }) => ({
  cardTitle: {
    position: 'absolute',
    left: '50%',
    bottom: '3.5%',
    transform: 'translateX(-50%)',
  },
  gridContainer: {
    left: '0%',
    top: '86%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  setTeamButton: {
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '1%',
    paddingBottom: '1%',
    fontSize: xs ? '2.25vh' : '2.25vw',
    display: 'flex',
    alignItems: 'center',
  },
  setTeamImage: {
    position: 'absolute',
    left: '-15%',
  },
  battleButton: {
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '1%',
    paddingBottom: '1%',
    fontSize: xs ? '2.25vh' : '2.25vw',
    display: 'flex',
    alignItems: 'center',
    width: '18%',
  },
  battleImage: {
    position: 'absolute',
    left: '-10%',
  },
}));

const ComingSoonIcon = () => {
  return (
    <React.Fragment>
      <img
        src={require('../../assets/image/ui/coming-soon.svg').default}
        width="50%"
        alt="coming-soon-card"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
    </React.Fragment>
  );
};

const AvatarImg = (src: string, title: string) => {
  return (
    <img
      src={src}
      alt={title + '-avatar'}
      width={'110%'}
      style={{
        position: 'absolute',
        bottom: '7%',
        left: '50%',
        transform: 'translateX(-54%)',
      }}
    />
  );
};

const SelectWorld = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  let classes = useStyles();

  const navigate = useNavigate();

  useEffect(() => {
    const rootStyle = document.getElementById('container')!.style;
    rootStyle.backgroundImage = `url(${
      require('../../assets/image/background/21826a0c3ddafed8ce29f4dd62644ea9.webp')
        .default
    })`;
    rootStyle.backgroundRepeat = 'no-repeat';
    rootStyle.backgroundColor = '#FAFAFA';
    rootStyle.backgroundPosition = 'center center';
    rootStyle.backgroundSize = 'cover';
  }, []);

  return (
    <React.Fragment>
      <Grid container rowSpacing={xs ? 0 : 0} sx={{ marginTop: '5%' }}>
        <Grid item xs={12} sx={{ paddingTop: '0', marginTop: '0' }}>
          <Stack
            direction="row"
            spacing={xs ? 3 : 5}
            justifyContent="center"
            alignItems="center"
          >
            {cards.map((card, index) => (
              <Grow
                key={index}
                in={true}
                {...(index === 0
                  ? { timeout: 500 }
                  : { timeout: index * 1000 })}
                onClick={() => {
                  if (card.status === 'active') {
                    navigate('/stage-selection')
                  }
                }}
                style={{
                  cursor: card.status === 'active' ? 'pointer' : 'not-allowed',
                }}
              >
                <Grid item xs={3}>
                  <BoxEffect className="position-relative zoom">
                    <CardMedia
                      component="img"
                      image={card.image}
                      alt={card.title}
                    />

                    {card.avatar ? AvatarImg(card.avatar, card.title) : <></>}

                    <img
                      src={
                        require('../../assets/image/ui/card-title.png').default
                      }
                      alt="card-title"
                      width={'70%'}
                      style={{
                        position: 'absolute',
                        bottom: '2.5%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    />
                    <Typography
                      sx={{ fontSize: xs ? '2vh' : '2vw' }}
                      className={`text-white border-sub-secondary-${
                        xs ? 'sm' : 'lg'
                      } ${classes.cardTitle}`}
                    >
                      {card.title}
                    </Typography>

                    {card.status === 'inactive' ? ComingSoonIcon() : <></>}
                  </BoxEffect>
                </Grid>
              </Grow>
            ))}
          </Stack>
        </Grid>
      </Grid>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          <Box className={classes.buttonsContainer}>
            <ButtonEffect
              className={`btn secondary ${classes.setTeamButton}`}
              sx={{ color: 'text.primary' }}
              onClick={() => navigate('/team')}
              disableRipple
            >
              <img
                alt="img-left-home"
                src={
                  require('../../assets/image/ui/aa4ea707fbbf8a1388362297a96a60ba.png')
                    .default
                }
                width="30%"
                className={classes.setTeamImage}
              />
              Set Team
            </ButtonEffect>
            <ButtonEffect
              sx={{
                color: 'text.primary',
              }}
              className={`btn primary ${classes.battleButton}`}
              onClick={() => navigate('/game')}
              disableRipple
            >
              Back
            </ButtonEffect>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default SelectWorld;

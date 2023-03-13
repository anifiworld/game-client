import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import { startCase } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useWeb3React } from '@web3-react/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useGetHeroSlots from 'hooks/useHeroSlots';
import useGetPlayerInfo from 'hooks/usePlayerInfo';
import ButtonEffect from 'components/ButtonEffect';
import useCollect from '../../hooks/useCollect';
import { useContract } from '../../hooks/useContract';
import { useIsLoggedIn, useUserBalances } from '../../state/hooks';
import { ContractName } from '../../utils/contractHelpers';
import { claimRewardTransaction, getClaimReward, getPlayerInfo } from '../../utils/callHelpers';
import useWeb3 from '../../hooks/useWeb3';
import { toast } from 'react-toastify';

const characters: {
  [key: string]: { webm: string; png: string; style: { width: string } };
} = {
  Iris: {
    webm: require('../../assets/video/hero/mar.webm').default,
    png: require('../../assets/image/hero/d9d28d3442e397718faec0f1941aa62f.png')
      .default,
    style: {
      width: '85%',
    },
  },
  Kane: {
    webm: require('../../assets/video/hero/cha_red.webm').default,
    png: require('../../assets/image/hero/kane.png').default,
    style: {
      width: '100%',
    },
  },
  Venus: {
    webm: require('../../assets/video/hero/exam.webm').default,
    png: require('../../assets/image/hero/4d3845cc415748c6186a475a9ea241ab.png')
      .default,
    style: {
      width: '95%',
    },
  },
  Hugo: {
    webm: require('../../assets/video/hero/greenboy.webm').default,
    png: require('../../assets/image/hero/529b68e49f4acb3ed74de04df835338e.png')
      .default,
    style: {
      width: '110%',
    },
  },
  Artemis: {
    webm: require('../../assets/video/hero/brown.webm').default,
    png: require('../../assets/image/hero/38913b9b4451c0ccc70816fc31c71a0a.png')
      .default,
    style: {
      width: '110%',
    },
  },
  Loki: {
    webm: require('../../assets/video/hero/loki.webm').default,
    png: require('../../assets/image/hero/f109b990b11469adb82a981151ab5d83.png')
      .default,
    style: {
      width: '100%',
    },
  },
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
    boxFixed: {
      backgroundImage: `url(${
        require('../../assets/image/ui/a98588acc7dd800f7560712609c7f558.png')
          .default
      })`,
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'transparent',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 4,
      position: 'absolute',
      top: '10%',
      right: '5%',
      width: '22%',
      height: '26%',
    },
    boxFixedBtn: {
      backgroundImage: `url(${
        require('../../assets/image/ui/62a73bef3579298c5e7d9c2bb59c3e46.png')
          .default
      })`,
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'transparent',
      backgroundPosition: 'center center',
      backgroundSize: 'contain',
      marginTop: '3%',
      letterSpacing: '0.5px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '50%',
      height: '15%',
      fontSize: xs ? '1.1vh' : '1.1vw',
    },
    pendingRewardsText: {
      marginTop: '5%',
      display: 'flex',
      alignItems: 'center',
      fontSize: xs ? '1.5vh' : '1.5vw',
    },
    gemContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '5%',
    },
    gemImage: {
      objectFit: 'cover',
      margin: '0 2%',
    },
    gemAmountText: {
      marginLeft: 0,
      marginRight: 0,
      display: 'flex',
      alignItems: 'center',
      fontSize: xs ? '1.25vh' : '1.25vw',
    },
    pendingAmountText: {
      marginTop: '3%',
      width: '75%',
      backgroundColor: 'rgba(211, 162, 153, 1)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1%',
      fontSize: xs ? '1.1vh' : '1.1vw',
      height: '15%',
    },
    heroesContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      width: '85%',
      marginTop: '4%',
      marginLeft: 'auto',
      marginRight: 'auto',
      left: '7.5%',
      top: '38%',
      position: 'absolute',
    },
    heroContainer: {
      display: 'flex',
      position: 'relative',
      marginLeft: '2%',
      marginRight: '2%',
    },
    heroImage: {
      objectFit: 'cover',
      zIndex: 2,
    },
    heroShadowImage: {
      objectFit: 'cover',
      position: 'absolute',
      zIndex: '1',
      bottom: '-4%',
      left: '0%',
    },
    shadowImage: {
      objectFit: 'cover',
      position: 'absolute',
      zIndex: '-1',
      bottom: sm ? '-10px' : '-20px',
      left: sm ? '12px' : md ? '5px' : lg ? '0px' : '30px',
      width: sm ? '110px' : md ? '180px' : lg ? '213px' : '213px',
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
  }),
);

const Game = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  const loggedIn = useIsLoggedIn();
  const { account } = useWeb3React();
  const web3 = useWeb3();
  const [heroSlots, setHeroSlots] = useState<any>([]);
  const [info, setInfo] = useState<any>({});

  const classes = useStyles({ xs, sm, md, lg });
  const navigate = useNavigate();
  const { onGetHeroSlots } = useGetHeroSlots();
  const { onGetPlayerInfo } = useGetPlayerInfo();
  const userBalances = useUserBalances();
  const tokenName = 'aniToken';
  const tokenBalance = useMemo(
    () =>
      new BigNumber(
        userBalances?.find((token) => token.name === tokenName)?.balance!,
      ).toNumber(),
    [tokenName, userBalances],
  );

  const handleCollect = useCallback(async () => {
    if(!account) return;
    const toastId = toast.loading('Claim reward...');
    try{
      const result = await getClaimReward();
      const signature = await web3.eth.personal.sign(
        result.message,
        account,
        '',
      );
      const claimResult = await claimRewardTransaction(result.transaction, signature);
      toast.update(toastId, {
        render: 'Claim reward success.',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
    }catch(e){
      toast.update(toastId, {
        render: 'Claim reward failed.\n' + e.message,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
    }
  },[info?.coin_pending, web3, account]);

  useEffect(() => {
    if (!loggedIn || !account) return;
    (async () => {
      const playerInfo = await onGetPlayerInfo();
      if (playerInfo) {
        console.log(playerInfo);
        setInfo(playerInfo);
      }
    })();
  }, [onGetPlayerInfo]);

  // wait for the component to be mounted
  useEffect(() => {
    const rootStyle = document.getElementById('container')!.style;
    rootStyle.backgroundImage = `url(${
      require('../../assets/image/bg/bg-main.webp').default
    })`;
    rootStyle.backgroundRepeat = 'no-repeat';
    rootStyle.backgroundColor = '#FAFAFA';
    rootStyle.backgroundPosition = 'center center';
    rootStyle.backgroundSize = 'cover';
  }, []);

  useEffect(() => {
    if (!loggedIn || !account) return;
    (async () => {
      const heroes = await onGetHeroSlots();
      let heroList = [];
      let data: any[] = Object.values(heroes);
      if (data.length > 0) {
        data.forEach((hero: any) => {
          if (hero) {
            heroList.push({
              name: hero.info.hero_type.name,
              webm: characters[startCase(hero.info.hero_type.name)].webm,
              style: characters[startCase(hero.info.hero_type.name)].style,
            });
          } else {
            heroList.push({
              name: '',
              webm: require('../../assets/video/hero/greenboy.webm').default,
              style: {
                width: '110%',
              },
            });
          }
        });
      } else {
        heroList = new Array(5).fill({
          name: '',
          webm: require('../../assets/video/hero/greenboy.webm').default,
          style: {
            width: '110%',
          },
        });
      }
      setHeroSlots(heroList);
    })();
  }, [onGetHeroSlots]);

  return (
    <>
      <Box
        className={classes.boxFixed}
        sx={{
          position: 'fixed',
          top: sm ? '65px' : md ? '90px' : lg ? '90px' : '90px',
          right: sm ? '12px' : md ? '90px' : lg ? '90px' : '90px',
          width: sm ? '177px;' : md ? '240px;' : lg ? '333px' : '333px',
          height: sm ? '117px' : md ? '155px' : lg ? '219px' : '219px',
        }}
      >
        <Typography
          className={`textshadow ${classes.pendingRewardsText}`}
          color="text.primary"
          sx={{
            fontSize: sm ? '12px' : md ? '18px' : lg ? '24px' : '22px',
          }}
        >
          Rewards
        </Typography>
        <Box
          className={classes.gemContainer}
          sx={{
            marginTop: sm ? 0 : md ? 0 : lg ? '20px' : '20px',
          }}
        >
          <img
            className={classes.gemImage}
            src={
              require('../../assets/image/ui/eb2198d5ef8767dab873f50c5d5a4502.png')
                .default
            }
            alt="gem"
            width="7%"
            height="auto"
          />
          <Typography
            color="text.secondary"
            sx={{
              fontSize: sm ? '16px' : md ? '18px' : lg ? '22px' : '24px',
            }}
            className={classes.gemAmountText}
          >
            {`${info?.coin_pending} (Tax : ${(parseFloat(info?.get_current_tax) * 100).toFixed(2)}%)`}
          </Typography>
        </Box>
        <Typography
          color="text.primary"
          className={`textshadow ${classes.pendingAmountText}`}
          sx={{
            fontSize: sm ? '12px' : md ? '16px' : lg ? '18px' : '18px',
            height: sm ? '18px' : md ? '28px' : '36px',
          }}
        >
          {`Processing ${info?.coin_processing} UNANIFI`}
        </Typography>
        <ButtonEffect
          disableRipple
          className={`textshadow-primary ${classes.boxFixedBtn}`}
          onClick={handleCollect}
          sx={{
            color: 'text.primary',
            height: sm ? '22px' : md ? '32px' : lg ? '38px' : '48px',
            fontSize: sm ? '12px' : md ? '18px' : lg ? '20px' : '20px',
          }}
        >
          Collect
        </ButtonEffect>
      </Box>
      <Box className={classes.heroesContainer}>
        {heroSlots.map((item: any, index: number) => (
          <Box key={index} className={classes.heroContainer}>
            <img
              src={
                require('../../assets/image/ui/abef7c2bb4ff2611fc7326970eafe736.png')
                  .default
              }
              alt={item.name}
              width="100%"
              className={classes.heroShadowImage}
              style={{
                ...item.style,
                visibility: item.name ? 'visible' : 'hidden',
              }}
            />
            <video
              id="preview-video"
              width="100%"
              height="auto"
              muted={true}
              loop={true}
              autoPlay={true}
              className={classes.heroImage}
              style={{
                ...item.style,
                visibility: item.name ? 'visible' : 'hidden',
              }}
            >
              <source src={item.webm} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        ))}
      </Box>
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
              onClick={() => navigate('/select-world')}
              disableRipple
            >
              <img
                alt="img-left-home"
                src={
                  require('../../assets/image/ui/c98cda49d96425c963bd40d0ae9fce15.png')
                    .default
                }
                onClick={() => navigate('/select-world')}
                width="30%"
                className={classes.battleImage}
              />
              Battle
            </ButtonEffect>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default Game;

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import MiddleEllipsis from 'react-middle-ellipsis';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useGetPlayerInfo from 'hooks/usePlayerInfo';
import { formatCommaSeparated } from 'utils/formatBalance';
import useAuth from '../hooks/useAuth';
import { useContract } from '../hooks/useContract';
import { useERC20ContractCall } from '../hooks/useERC20ContractCall';
import useHero from '../hooks/useHero';
import { useAppDispatch } from '../state';
import { logout as logoutAction, setShowModal, setStamina, setGold, setIsPlaying } from '../state/actions';
import { initGame } from '../state/game';
import {
  useAccount,
  useIsHome,
  useIsBattle,
  useIsLoggedIn,
  useShowModal,
  useUserBalances,
  useStamina,
  useGold,
  useIsPlaying,
} from '../state/hooks';
import { clearUserBalances, updateUserBalances } from '../state/profile';
import { ConnectorNames } from '../types/ConnectorNames';
import { setAxiosClient } from '../utils/axiosClient';
import { ContractName } from '../utils/contractHelpers';
import { connectorsByName } from '../utils/web3React';
import Setting from '../views/Setting';
import BoxEffect from './BoxEffect';
import ButtonEffect from './ButtonEffect';
import ImageButton from './ImageButton';
import { Modal } from './web3modal/components/Modal';
import { getThemeColors } from './web3modal/helpers';
import MetaMaskLogo from './web3modal/providers/logos/metamask.svg';
import WalletConnectLogo from './web3modal/providers/logos/walletconnect.svg';
import { themesList } from './web3modal/themes';
import useGetPlayStage from 'hooks/usePlayStage';


const useStyles = makeStyles(
  ({ xs, sm, md }: { xs: boolean; sm: boolean; md: boolean }) => ({
    appBar: {
      position: 'absolute',
      paddingLeft: '4.5%',
      paddingRight: '3%',
      display: 'flex',
      flexDirection: 'row',
      height: '8%',
      top: '-0.6%',
    },
    itemLeftContainer: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: '0.5%',
      paddingBottom: 0,
      position: 'absolute',
      width: '9%',
    },
    barItemRightContainer: {
      display: 'flex',
      justifyContent: 'right',
      alignItems: 'center',
      paddingBottom: 0,
    },
    itemRightContainer: {
      marginLeft: '2%',
      marginRight: '2%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '12%',
      height: '58%',
    },
    barItemLeftContainer: {
      display: 'flex',
      marginLeft: '20%',
      lineHeight: 0,
      paddingLeft: '10%',
      marginTop: '-12%',
    },
    barItemLeftButton: {
      display: 'block',
      marginLeft: 0,
      marginRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      lineHeight: 0,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    soundIcon: {
      left: '2%',
      bottom: '-70%',
      position: 'absolute',
      width: '2%',
      cursor: 'pointer',
    },
  }),
);
const BarItemLeft = ({ isHome }: { isHome: boolean }) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  let MenuItems = [
    {
      title: 'hero',
      path: '/hero',
    },
    {
      title: 'inventory',
      path: '/inventory',
    },
    {
      title: 'shop',
      path: '/shop',
    },
  ];
  if (isHome) {
    MenuItems = [
      {
        title: 'staking',
        path: '/staking',
      },
    ];
  }
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <Box className={classes.barItemLeftContainer}>
      {MenuItems.map((item) => (
        <ButtonEffect
          key={item.title}
          disableRipple
          className={`menu ${classes.barItemLeftButton}`}
          onClick={() => navigate(item.path)}
          sx={{
            color: 'white',
            minWidth: isHome ? '170px' : sm ? 'auto' : md ? '45px' : '65px',
            px: xs ? 0.5 : md ? 1 : 1,
          }}
        >
          <Typography
            sx={{
              my: 0,
              display: 'flex',
              alignItems: 'center',
              fontSize: xs ? '10px' : sm ? '14px' : md ? '18px' : '1.5rem',
            }}
          >
            {item.title}
          </Typography>
        </ButtonEffect>
      ))}
    </Box>
  );
};
const BarItemRight = ({
  isLoggedIn,
  handleClick,
  account,
  tokenBalance,
  currentStamina,
  gold,
  isPlaying,
  isBattle,
}: {
  isLoggedIn: boolean;
  handleClick: () => void;
  account: string | null | undefined;
  tokenBalance: string | number;
  currentStamina: string | number | undefined;
  gold: string | number | undefined;
  isPlaying: boolean;
  isBattle: boolean;
}) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <>
      <Box
        className={`brown-block ${classes.itemRightContainer}`}
        sx={{
          fontSize: xs ? '1.6vh' : '1.6vw',
        }}
      >
        <div style={{ marginTop: '6%' }}>
          {`${currentStamina ? currentStamina : 100} /100`}{' '}
        </div>
        <img
          className="left-side-box"
          style={{ left: '-4.5%' }}
          width={'18%'}
          src={
            require('../assets/image/ui/6c2320839283c1b9bb8eee52b64c9f5a.png')
              .default
          }
          alt="thunder"
        />
        <ImageButton
          className="plus-btn"
          style={{ 
            right: '-22%',
            cursor: isBattle && isPlaying ? 'not-allowed' : 'pointer',
          }}
          width={'33%'}
          src={require('../assets/image/ui/plus-btn.svg').default}
          alt="plus-btn"
          disabled={isBattle && isPlaying}
          onClick={() => navigate('/shop')}
        />
      </Box>
      <Box
        className={`brown-block ${classes.itemRightContainer}`}
        sx={{
          fontSize: xs ? '1.6vh' : '1.6vw',
        }}
      >
        <div style={{ marginTop: '6%' }}>
          {parseFloat(tokenBalance.toString()).toLocaleString()}
        </div>
        <img
          className="left-side-box"
          style={{ left: '-6%' }}
          width={'18%'}
          src={
            require('../assets/image/ui/eb2198d5ef8767dab873f50c5d5a4502.png')
              .default
          }
          alt="icon"
        />
        <ImageButton
          className="plus-btn"
          style={{ 
            right: '-22%',
            cursor: isBattle && isPlaying ? 'not-allowed' : 'pointer',
          }}
          width={'33%'}
          src={require('../assets/image/ui/plus-btn.svg').default}
          alt="plus-btn"
          disabled={isBattle && isPlaying}
          onClick={() => window.open('', '_blank')}
        />
      </Box>
      <Box
        className={`brown-block ${classes.itemRightContainer}`}
        sx={{
          fontSize: xs ? '1.6vh' : '1.6vw',
        }}
      >
        <div style={{ marginTop: '6%' }}>
          {formatCommaSeparated(gold ? gold : 0)}
        </div>
        <img
          className="left-side-box"
          style={{ left: '-8%' }}
          width={'26%'}
          src={require('../assets/image/ui/icon-gold.png').default}
          alt="icon"
        />
        <ImageButton
          className="plus-btn"
          style={{ 
            right: '-22%',
            cursor: isBattle && isPlaying ? 'not-allowed' : 'pointer',
          }}
          width={'33%'}
          src={require('../assets/image/ui/plus-btn.svg').default}
          alt="plus-btn"
          disabled={isBattle && isPlaying}
          onClick={() => navigate('/shop')}
        />
      </Box>
      <BoxEffect
        className="purple-block"
        sx={{
          mx: '1%',
          px: '1%',
          top: '1%',
          height: '100%',
          width: isLoggedIn ? '10%' : '11%',
          backgroundSize: '100% 60%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: xs ? '1.2vh' : '1.2vw',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={() => handleClick()}
      >
        {isLoggedIn ? (
          <MiddleEllipsis>
            <span>{account}</span>
          </MiddleEllipsis>
        ) : (
          'Connect Wallet'
        )}
      </BoxEffect>
    </>
  );
};
const NavItemHome = ({
  isLoggedIn,
  account,
  handleClick,
}: {
  isLoggedIn: boolean;
  account: string | null | undefined;
  handleClick: () => void;
}) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <BoxEffect
      className="purple-block"
      sx={{
        height: '100%',
        width: '13%',
        backgroundSize: '100% 60%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: xs ? '1.5vh' : '1.5vw',
        px: '1%',
        top: '1%',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => handleClick()}
    >
      {isLoggedIn ? (
        <MiddleEllipsis>
          <span>{account}</span>
        </MiddleEllipsis>
      ) : (
        'Connect Wallet'
      )}
    </BoxEffect>
  );
};
const NavBar = React.memo(() => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  const loggedIn = useIsLoggedIn();
  const { account, activate, connector } = useWeb3React();
  const [provider, setProvider] = useState<{ isWalletConnect: undefined }>();
  const [info, setInfo] = useState<any>({});
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const storedAccount = useAccount();
  const dispatch = useAppDispatch();
  const { login, logout } = useAuth();
  const { approve } = useERC20ContractCall();
  const { approve: approveWalletConnect } = useERC20ContractCall(provider);
  const navigate = useNavigate();
  const { onGotHero } = useHero();
  const { onGetPlayerInfo } = useGetPlayerInfo();
  const getHeroContract = useContract(ContractName.Hero);
  const isLoggedIn = useMemo(
    () => loggedIn !== null && account !== null && account !== undefined,
    [account, loggedIn],
  );
  const { pathname } = useLocation();
  const isHome = useIsHome();
  const isBattle = useIsBattle();
  const showModal = useShowModal();
  const stamina = useStamina();
  const gold = useGold();
  const isPlaying = useIsPlaying();

  const { onGetPlayStage } = useGetPlayStage();

  useEffect(() => {
    if (showSetting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showSetting]);

  useEffect(() => {
    (async () => setProvider(await connector?.getProvider()))();
  }, [connector]);
  useEffect(() => {
    // Change account
    if (account && storedAccount && account !== storedAccount) {
      dispatch(logoutAction());
    }
    // Reactive Web3 Login without re sign
    else if (storedAccount && !account && loggedIn) {
      activate(connectorsByName[loggedIn]);
    }
  }, [account, storedAccount, login, dispatch, activate, connector, loggedIn]);

  useEffect(() => {
    (async () => {
      if (loggedIn && account) {
        dispatch(setShowModal(false));
        const playStage = await onGetPlayStage();
        dispatch(
          setIsPlaying(playStage.is_playing)
        );
        try {
          if (
            matchPath(pathname, '/private-sale') ||
            matchPath(pathname, '/staking')
          )
            return;
          const playerInfo = await onGetPlayerInfo();
          setInfo(playerInfo);
          dispatch(
            setStamina(parseInt(playerInfo.get_current_stamina))
          );
          dispatch(
            setGold(parseInt(playerInfo.gold))
          );
          if (playStage.is_playing) {
            navigate('/battle', {
              state: { 
                isBoost: playStage.current_phase.game_play_stage?.isBoost ? playStage.current_phase.game_play_stage.isBoost : false,
                stageId: playStage.current_phase.phase.stage,
              },
            });
          } else {
            if (!playerInfo.is_newcomer) {
              navigate('/game');
            } else {
              navigate('/welcome');
            }
          }
        } catch (e) {
          navigate('/welcome');
        }
      } else {
        if (
          matchPath(pathname, '/private-sale') ||
          matchPath(pathname, '/staking')
        )
          return;
        navigate('/');
      }
    })();
    // eslint-disable-next-line
  }, [loggedIn, account, getHeroContract, onGetPlayerInfo, dispatch]);

  useLayoutEffect(() => {
    if (loggedIn && account) dispatch(initGame(undefined));
  }, [dispatch, loggedIn, account]);

  const handleLogin = () => {
    dispatch(setShowModal(true));
  };

  const handleLogout = () => {
    logout();
    dispatch(setShowModal(false));
    navigate('/');
  };

  const userBalances = useUserBalances();
  const tokenName = 'aniToken';
  const busdBalance = useMemo(
    () =>
      new BigNumber(
        userBalances?.find((token) => token.name === 'busd')?.balance!,
      ).toNumber(),
    [userBalances],
  );
  const tokenBalance = useMemo(
    () =>
      new BigNumber(
        userBalances?.find((token) => token.name === tokenName)?.balance!,
      ).toNumber(),
    [tokenName, userBalances],
  );

  useEffect(() => {
    const tokenName = 'aniToken';
    if (isLoggedIn && account) {
      dispatch(updateUserBalances(tokenName, account));
    }
  }, [isLoggedIn, account, dispatch]);
  // Clear user balances
  useEffect(() => {
    if (!isLoggedIn) dispatch(clearUserBalances());
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const onUnauthorized = () => {
      logout();
      login(ConnectorNames.Injected);
    };
    setAxiosClient(undefined, onUnauthorized);
  }, []);

  const classes = useStyles();
  
  return (
    <>
      <Modal
        showModal={showModal}
        userOptions={[
          {
            name: 'MetaMask',
            logo: MetaMaskLogo,
            description: 'Connect to your MetaMask Wallet',
            onClick: () => login(ConnectorNames.Injected),
          },
          {
            name: 'WalletConnect',
            logo: WalletConnectLogo,
            description: 'Scan with WalletConnect to connect',
            onClick: () => login(ConnectorNames.WalletConnect),
          },
        ]}
        onClose={() => logout()}
        resetState={() => {
          dispatch(setShowModal(false));
        }}
        lightboxOpacity={0.4}
        themeColors={getThemeColors(themesList.default.name)}
      />
      {showSetting && (
        <Setting onClose={() => setShowSetting(false)} show={showSetting} />
      )}
      <AppBar
        color={'transparent'}
        className={classes.appBar}
        sx={{
          height: '8%',
        }}
      >
        <Grid container>
          <img
            className={`${classes.soundIcon}`}
            alt="sound"
            src={require('../assets/image/ui/sound-icon.png').default}
            onClick={() => setShowSetting(true)}
          />
          <Grid item className={classes.itemLeftContainer}>
            <img
              className="navbar-logo"
              style={{ width: '100%' }}
              src={
                require('../assets/image/ui/48578bf6533b59e262291c4f2f8f1e5d.png')
                  .default
              }
              alt="logo"
              onClick={() => {
                if (!isBattle) {
                  navigate('/game')
                }
              }}
            />
            {
              !isBattle && (
                <BarItemLeft isHome={isHome} />
              )
            }
          </Grid>
          <Grid item xs className={classes.barItemRightContainer}>
            {!isHome ? (
              <BarItemRight
                isLoggedIn={isLoggedIn}
                handleClick={isLoggedIn ? handleLogout : handleLogin}
                account={account}
                tokenBalance={tokenBalance}
                currentStamina={stamina}
                gold={gold}
                isPlaying={isPlaying}
                isBattle={isBattle}
              />
            ) : (
              <NavItemHome
                isLoggedIn={isLoggedIn}
                account={account}
                handleClick={isLoggedIn ? handleLogout : handleLogin}
              />
            )}
          </Grid>
        </Grid>
      </AppBar>
    </>
  );
});
export default NavBar;
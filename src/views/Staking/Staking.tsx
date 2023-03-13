import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import staking from 'constants/Staking';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { find, isEmpty, isNull, isUndefined, map } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Draggable from 'react-draggable';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAppDispatch } from 'state';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { TypographyStyle, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useApprove from 'hooks/useApprove';
import { useContract } from 'hooks/useContract';
import useStaking from 'hooks/useStaking';
import { ContractName } from 'utils/contractHelpers';
import { formatNumber } from 'utils/formatBalance';
import { setIsHome } from 'state/actions';
import { useIsLoggedIn, useUserAllowances, useUserBalances } from 'state/hooks';
import { updateUserAllowances, updateUserBalances } from 'state/profile';
import FlexBox from 'components/FlexBox';


dayjs.extend(duration);

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
    titleText: {
      top: '21%',
      position: 'absolute',
      zIndex: 2,
    },
    gridCard: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stack: {
      marginTop: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContainer: {
      position: 'absolute',
      top: '17%',
      marginTop: '0',
      paddingTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      width: '65%',
      height: '70%',
    },
    buyButton: {
      height: '100%',
      width: '33%',
      padding: '0.5%',
      '&:disabled': {
        color: 'white',
      },
    },
    claimButton: {
      height: '100%',
      width: '33%',
      padding: '0.5%',
      '&:disabled': {
        color: 'white',
      },
    },
    approveButton: {
      height: '100%',
      width: '33%',
      padding: '0.5%',
      '&:disabled': {
        color: 'white',
      },
    },
    harvestButton: {
      height: '100%',
      width: '33%',
      padding: '0.5%',
      '&:disabled': {
        color: 'white',
      },
    },
    maxButton: {
      height: '80%',
      width: '20%',
      marginLeft: '4%',
      marginBottom: '2%',
      padding: '0.5%',
      '&:disabled': {
        color: 'white',
      },
    },
    statusButton: {
      height: '100%',
      width: '15%',
      padding: '0.5%',
      '&:disabled': {
        color: 'white',
      },
    },
    progressBar: {
      height: '100%',
      padding: '0.2% 0',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      '& .MuiLinearProgress-barColorPrimary': {
        background:
          'linear-gradient(0deg, rgba(21,127,14,1) 0%, rgba(68,176,27,1) 35%, rgba(120,217,78,1) 100%)',
      },
      '& .MuiLinearProgress-colorPrimary': {
        backgroundColor: 'transparent',
      },
    },
    progressBarFlare: {
      '& .MuiLinearProgress-barColorPrimary': {
        backgroundColor: '#78D94E',
      },
      '& .MuiLinearProgress-colorPrimary': {
        backgroundColor: 'transparent',
      },
    },
    dot: {
      height: '92%',
      width: '6.5%',
      background:
        'linear-gradient(180deg, rgba(21,127,14,1) 0%, rgba(68,176,27,1) 35%, rgba(120,217,78,1) 100%)',
      borderRadius: '50%',
      display: 'inline-block',
      borderColor: '#2A5219',
      borderWidth: 2,
      borderStyle: 'solid',
    },
  }),
);

const MetaText = (props: {
  title?: string;
  label?: string;
  xs?: boolean;
  keyTextStyle?: TypographyStyle;
  valueTextStyle?: TypographyStyle;
  loading: boolean;
}) => {
  return (
    <>
      <FlexBox
        // @ts-ignore
        css={`
          width: 100%;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <Typography
          className={'border-sub-secondary-md'}
          sx={{
            color: '#F4C01E',
            fontSize: props.xs ? '1.5vh' : '1.2vw',
            width: '50%',
            ...props.keyTextStyle,
          }}
        >
          {props.title}
        </Typography>
        {props.loading ? (
          <div
            style={{
              width: '50%',
            }}
          >
            <Skeleton baseColor="#FCE8C2" highlightColor="#E9BE84" />
          </div>
        ) : (
          <Typography
            className={'border-sub-secondary-md'}
            sx={{
              color: 'text.primary',
              fontSize: props.xs ? '1.5vh' : '1.5vw',
              ...props.valueTextStyle,
            }}
          >
            {props.label}
          </Typography>
        )}
      </FlexBox>
    </>
  );
};

const MetaBox = (props: {
  isLoggedIn: any;
  title?: string;
  available?: string;
  bought?: string;
  xs?: boolean;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onClick?: () => void;
}) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  const classes = useStyles({ xs, sm, md, lg });
  return (
    <FlexBox
      // @ts-ignore
      css={`
        flex-direction: column;
        width: 100%;
        border-radius: 15px;
        border: 2px solid #6f150b;
        box-sizing: border-box;
        overflow: hidden;
        height: 100%;
      `}
    >
      <FlexBox
        // @ts-ignore
        css={`
          width: 100%;
          height: 40%;
          background-color: #f7a21a;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 4%;
          padding-top: 1%;
          box-sizing: border-box;
          border-bottom: 2px solid #6f150b;
        `}
      >
        <Typography
          className={'border-sub-secondary-md'}
          sx={{
            color: 'text.primary',
            fontSize: props.xs ? '1.5vh' : '1.5vw',
          }}
        >
          {props.title}
        </Typography>
        {props.available !== '-1' && props.isLoggedIn ? (
          <Typography
            className={'border-sub-secondary-md'}
            sx={{
              color: 'text.primary',
              fontSize: props.xs ? '1.5vh' : '1.5vw',
            }}
          >
            {`Available: ${props.available}`}
          </Typography>
        ) : (
          <div
            style={{
              width: '50%',
            }}
          >
            <Skeleton baseColor="#FCE8C2" highlightColor="#E9BE84" />
          </div>
        )}
      </FlexBox>
      <FlexBox
        // @ts-ignore
        css={`
          width: 100%;
          height: 60%;
          background-color: #f7d9b5;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 4%;
          padding-top: 2%;
          box-sizing: border-box;
          overflow: hidden;
          padding-left: 2%;
        `}
      >
        <>
          <FlexBox
            // @ts-ignore
            css={`
              position: relative;
              transform: translateY(-10%);
              width: 60%;
              align-items: center;
              justify-content: center;
            `}
          >
            <TextValue
              className={'border-sub-secondary-md'}
              sx={{
                color: 'text.primary',
                fontSize: props.xs ? '2.5vh' : '2.5vw',
              }}
            >
              {props.value}
            </TextValue>
            <InputField
              type={'number'}
              defaultValue={props.value}
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              onKeyPress={(e) => {
                if ((e.target as HTMLInputElement).value.length === 10) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                props.onChange?.(e.target.value);
              }}
              disabled={props.disabled}
              // @ts-ignore
              css={`
                font-size: ${props.xs ? '2.5vh' : '2.5vw'};
              `}
            />
          </FlexBox>
          <FlexBox
            // @ts-ignore
            css={`
              width: fit-content;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              position: relative;
            `}
          >
            <CoinImg
              alt={''}
              src={
                require('../../assets/image/ui/eb2198d5ef8767dab873f50c5d5a4502.png')
                  .default
              }
            />
            <Typography
              className={'border-sub-secondary-md'}
              sx={{
                color: 'text.primary',
                fontSize: props.xs ? '2vh' : '2vw',
                marginLeft: '3%',
              }}
            >
              ANIFI
            </Typography>
          </FlexBox>
          <MaxButton
            className={`btn-staking-max ${classes.maxButton}`}
            onClick={props.onClick}
            disabled={props.disabled}
          >
            <Typography fontSize="1.2vw" color="text.primary">
              Max
            </Typography>
          </MaxButton>
        </>
      </FlexBox>
    </FlexBox>
  );
};

const Staking = () => {
  const [amount, setAmount] = useState<string>('0.0');
  const [pendingStakeTx, setPendingStakeTx] = useState<boolean>(false);
  const [pendingClaimTx, setPendingClaimTx] = useState<boolean>(false);
  const [pendingHarvestTx, setPendingHarvestTx] = useState<boolean>(false);
  const [pendingWithdrawTx, setPendingWithdrawTx] = useState<boolean>(false);
  const [pendingWithdrawId, setPendingWithdrawId] = useState(-1);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));

  const classes = useStyles({ xs, sm, md, lg });

  const loggedIn = useIsLoggedIn();
  const { account } = useWeb3React();
  const stakingContract = useContract(ContractName.Staking);
  const {
    onEnterStaking,
    onGetStakingData,
    onHarvest,
    onClaimReward,
    onWithdraw,
  } = useStaking();
  const dispatch = useAppDispatch();
  const userAllowances = useUserAllowances();
  const allowance = useMemo(() => {
    const allowance = find(
      userAllowances,
      ({ name }) => name === 'staking',
    )?.allowance;
    return new BigNumber(allowance || 0).toNumber();
  }, [userAllowances]);

  const needsApproval = !allowance;
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stakingData, setStakingData] = useState({
    totalStakedAmount: new BigNumber(0),
    userTotalStakedAmount: new BigNumber(0),
    userStakedTime: 0,
    userStakedAmount: [],
    userStakedStart: [],
    userStakedPeriod: [],
    singleReward: [],
    status: [],
    userReward: new BigNumber(0),
    claimable: new BigNumber(0),
    startStaking: '0',
    endStaking: '0',
    minDays: '15',
    maxDays: '90',
    maxMultiply: new BigNumber(0),
    rewardPerYear: new BigNumber(0),
    totalWeightedStakedAmount: new BigNumber(0),
  });
  const userBalances = useUserBalances();
  const aniBalance = useMemo(() => {
    const aniToken = userBalances?.find(
      (token) => token.name === 'aniToken',
    )?.balance;
    return aniToken ? formatNumber(new BigNumber(aniToken).toNumber()) : '-1';
  }, [userBalances]);
  const totalStakedAmount = useMemo(
    () =>
      stakingData?.totalStakedAmount &&
      formatNumber(
        new BigNumber(stakingData?.totalStakedAmount)
          .dividedBy(10 ** 18)
          .toNumber(),
      ),
    [stakingData?.totalStakedAmount],
  );
  const userStakedTime: number = useMemo(
    () => stakingData?.userStakedTime && Number(stakingData?.userStakedTime),
    [stakingData?.userStakedTime],
  );
  const userTotalStakedAmount = useMemo(
    () =>
      stakingData?.userTotalStakedAmount &&
      formatNumber(
        new BigNumber(stakingData?.userTotalStakedAmount)
          .dividedBy(10 ** 18)
          .toNumber(),
      ),
    [stakingData?.userTotalStakedAmount],
  );
  const userStakedAmount = useMemo(
    () =>
      stakingData?.userStakedAmount &&
      map(stakingData?.userStakedAmount, (amount) =>
        formatNumber(
          new BigNumber(amount).dividedBy(10 ** 18).toNumber(),
          2,
          2,
        ),
      ).reverse(),
    [stakingData?.userStakedAmount],
  );
  const userStakedStart = useMemo(
    () => stakingData?.userStakedStart?.slice(0)?.reverse(),
    [stakingData?.userStakedStart],
  );
  const userStakedPeriod = useMemo(
    () => stakingData?.userStakedPeriod?.slice(0)?.reverse(),
    [stakingData?.userStakedPeriod],
  );
  const singleReward = useMemo(
    () =>
      stakingData?.singleReward &&
      map(stakingData?.singleReward, (reward) =>
        formatNumber(
          new BigNumber(reward).dividedBy(10 ** 18).toNumber(),
          2,
          2,
        ),
      ).reverse(),
    [stakingData?.singleReward],
  );
  const status = useMemo(
    () => stakingData?.status?.slice(0)?.reverse(),
    [stakingData?.status],
  );
  const userReward = useMemo(
    () =>
      stakingData?.userReward &&
      formatNumber(
        new BigNumber(
          new BigNumber(stakingData?.userReward).dividedBy(10 ** 18),
        ).toNumber(),
      ),
    [stakingData?.userReward],
  );
  const claimable = useMemo(
    () =>
      stakingData?.claimable &&
      formatNumber(
        new BigNumber(stakingData?.claimable).dividedBy(10 ** 18).toNumber(),
      ),
    [stakingData?.claimable],
  );
  const startStaking = useMemo(
    () => stakingData?.startStaking || 0,
    [stakingData?.startStaking],
  );
  const endStaking = useMemo(
    () => stakingData?.endStaking || 0,
    [stakingData?.endStaking],
  );

  const [period, setPeriod] = useState(15);

  const apr = useCallback(() => {
    if (
      Number(stakingData?.maxMultiply) <= 0 ||
      Number(stakingData?.rewardPerYear) <= 0 ||
      Number(stakingData?.totalWeightedStakedAmount) <= 0
    )
      return 0;
    const apr =
      (Number(stakingData?.maxMultiply) * Number(stakingData?.rewardPerYear)) /
      Number(stakingData?.totalWeightedStakedAmount) /
      100 /
      2;
    return formatNumber(apr);
  }, [
    stakingData?.maxMultiply,
    stakingData?.rewardPerYear,
    stakingData?.totalWeightedStakedAmount,
  ]);

  const estApr = useCallback(() => {
    if (
      Number(stakingData?.maxMultiply) <= 0 ||
      Number(stakingData?.rewardPerYear) <= 0 ||
      Number(stakingData?.totalWeightedStakedAmount) <= 0
    )
      return 0;
    return formatNumber(
      ((20000 +
        ((Number(period) * 24 * 60 * 60 - Number(stakingData?.minDays)) /
          (Number(stakingData?.maxDays) - Number(stakingData?.minDays))) *
          (Number(stakingData?.maxMultiply) - 20000)) *
        Number(stakingData?.rewardPerYear)) /
        Number(stakingData?.totalWeightedStakedAmount) /
        100 /
        2,
    );
  }, [
    period,
    stakingData?.maxMultiply,
    stakingData?.rewardPerYear,
    stakingData?.totalWeightedStakedAmount,
  ]);

  const minDays = useMemo(
    () =>
      !isUndefined(stakingData?.minDays)
        ? dayjs.duration(Number(stakingData?.minDays) * 1000).asDays()
        : 15,
    [stakingData?.minDays],
  );
  const maxDays = useMemo(
    () =>
      !isUndefined(stakingData?.maxDays)
        ? dayjs.duration(Number(stakingData?.maxDays) * 1000).asDays()
        : 90,
    [stakingData?.maxDays],
  );
  const [currentTime, setCurrentTime] = useState(dayjs().unix());
  const isStarted = useMemo(
    () => currentTime > Number(startStaking),
    [currentTime, startStaking],
  );
  const endTime = useMemo(() => endStaking, [endStaking]);
  const isEnded = useMemo(() => currentTime > endTime, [endTime, currentTime]);

  const startingIn = useMemo(
    () =>
      dayjs
        .duration((Number(startStaking) - currentTime) * 1000)
        .format('D[d] H[h] m[m] s[s]'),
    [currentTime, startStaking],
  );
  const chainId = process.env.REACT_APP_CHAIN_ID;
  // @ts-ignore
  const stakingContractAddress = staking.address[chainId];
  const tokenContract = useContract(ContractName.AniToken);
  const { onApprove } = useApprove(tokenContract, stakingContractAddress);
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
    } catch (e) {
    } finally {
      setRequestedApproval(false);
    }
  }, [onApprove]);

  const handleStake = async (amount: number, period: number) => {
    setPendingStakeTx(true);
    const result = await onEnterStaking(stakingContract, amount, period);
    setPendingStakeTx(false);
    setAmount('0.0');
  };

  const handleClaim = async () => {
    setPendingClaimTx(true);
    const result = await onClaimReward(stakingContract);
    setPendingClaimTx(false);
  };

  const handleMax = async () => {
    const aniToken = userBalances
      ?.find((token) => token.name === 'aniToken')
      ?.balance.toString();
    if (!aniToken) return;
    setAmount(aniToken);
  };

  const handleHarvest = async () => {
    setPendingHarvestTx(true);
    const result = await onHarvest(stakingContract);
    setPendingHarvestTx(false);
  };

  const handleWithdraw = async (id: string) => {
    setPendingWithdrawTx(true);
    const result = await onWithdraw(stakingContract, id);
    setPendingWithdrawTx(false);
  };

  useEffect(() => {
    if (!account) return;
    const interval = setInterval(async () => {
      const data = await onGetStakingData(stakingContract);
      // @ts-ignore
      setStakingData(data);
      setLoading(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [account]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().unix());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(setIsHome(true));
    return () => {
      dispatch(setIsHome(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!account) return;
    dispatch(updateUserAllowances(account));
  }, [dispatch, account]);

  useEffect(() => {
    const tokenName = 'aniToken';
    if (account) {
      dispatch(updateUserBalances(tokenName, account));
    }
  }, [account, dispatch, pendingStakeTx, pendingWithdrawId]);

  useEffect(() => {
    if (!minDays) return;
    setPeriod(Number(minDays) < 1 ? 1 : minDays);
  }, [minDays]);

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
            poster={require('../../assets/image/home.png').default}
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
        <Grid container rowSpacing={0}>
          <Grid item xs={12} className={classes.gridCard}>
            <Stack spacing={0} className={classes.stack}>
              <TextTitle
                className={`textshadow-secondary card-title ${classes.titleText}`}
                gutterBottom
                sx={{
                  color: 'text.primary',
                }}
              >
                {'Staking'}
              </TextTitle>
              <Card
                className={`card-private-sale ${classes.cardContainer}`}
                elevation={0}
              >
                <FlexBox
                  // @ts-ignore
                  css={`
                    flex-direction: column;
                    position: absolute;
                    top: 22%;
                    left: 7%;
                    width: 85%;
                    height: 73%;
                  `}
                >
                  <Box
                    style={{
                      borderRadius: '15px',
                      backgroundImage:
                        'linear-gradient(to right, #e8b375, #e8c38b)',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#894242',
                        fontSize: xs ? '1vh' : '1vw',
                      }}
                    >
                      ANIFI staking program is here. Stake ANIFI to receive
                      ANIFI as rewards
                    </Typography>
                    <FlexBox
                      // @ts-ignore
                      css={`
                        width: 100%;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 8px;
                      `}
                    >
                      <Typography
                        className={'border-sub-secondary-md'}
                        sx={{
                          color: '#F4C01E',
                          fontSize: xs ? '1.5vh' : '1.5vw',
                        }}
                      >
                        APR:
                      </Typography>
                      {loading ? (
                        <div
                          style={{
                            width: '30%',
                          }}
                        >
                          <Skeleton
                            baseColor="#FCE8C2"
                            highlightColor="#E9BE84"
                          />
                        </div>
                      ) : (
                        <Typography
                          className={'border-sub-secondary-md'}
                          sx={{
                            fontSize: xs ? '1.5vh' : '1.5vw',
                          }}
                        >
                          {`${apr()} %`}
                        </Typography>
                      )}
                      <Typography
                        className={'border-sub-secondary-md'}
                        sx={{
                          color: '#F4C01E',
                          fontSize: xs ? '1.5vh' : '1.5vw',
                        }}
                      >
                        Total Amount Staked:
                      </Typography>
                      {loading ? (
                        <div
                          style={{
                            width: '25%',
                          }}
                        >
                          <Skeleton
                            baseColor="#FCE8C2"
                            highlightColor="#E9BE84"
                          />
                        </div>
                      ) : (
                        <Typography
                          className={'border-sub-secondary-md'}
                          sx={{
                            fontSize: xs ? '1.5vh' : '1.5vw',
                          }}
                        >
                          {`${totalStakedAmount} ANIFI`}
                        </Typography>
                      )}
                    </FlexBox>
                  </Box>
                  <FlexBox
                    // @ts-ignore
                    css={`
                      width: 100%;
                      height: 60%;
                      flex-direction: row;
                      column-gap: 2%;
                    `}
                  >
                    <FlexBox
                      // @ts-ignore
                      css={`
                        flex-direction: column;
                        width: 50%;
                      `}
                    >
                      <FlexBox
                        // @ts-ignore
                        css={`
                          width: 100%;
                          height: 60%;
                          flex-direction: column;
                          border-radius: 15px;
                          border: 2px solid #6f150b;
                          padding: 2%;
                          justify-content: space-between;
                          box-sizing: border-box;
                          margin-bottom: 16px;
                        `}
                      >
                        <MetaText
                          title={'Your Staked:'}
                          label={`${userTotalStakedAmount} ANIFI`}
                          xs={xs}
                          loading={loading}
                        />
                        <MetaText
                          title={'Lock:'}
                          label={`EST APR: ${estApr()} %`}
                          xs={xs}
                          keyTextStyle={{
                            width: '35%',
                          }}
                          loading={loading}
                        />
                        <BarHolder>
                          <div className={classes.progressBar} id="bar">
                            <LinearProgress
                              variant="determinate"
                              value={100}
                              style={{
                                width: '100%',
                                height: '80%',
                                borderRadius: 32,
                                borderColor: '#2A5219',
                                borderWidth: 2,
                                borderStyle: 'solid',
                              }}
                            />
                          </div>
                          <div className={classes.progressBarFlare}>
                            <LinearProgress
                              variant="determinate"
                              value={100}
                              style={{
                                position: 'absolute',
                                top: '20%',
                                left: '0%',
                                marginLeft: '2.5%',
                                width: '94%',
                                height: '18%',
                                borderRadius: 18,
                              }}
                            />
                          </div>
                          <Draggable
                            axis="x"
                            scale={1}
                            bounds="parent"
                            onDrag={(e: any) => {
                              const bar = document.getElementById('bar');
                              const dot = document.getElementById('dot');
                              if (isNull(bar) || isNull(dot)) return;
                              const barStart = bar.getBoundingClientRect().left;
                              const barEnd = bar.getBoundingClientRect().right;
                              const barWidth = bar.clientWidth;
                              const dotWidth = dot.clientWidth;
                              const dotStart = dot.getBoundingClientRect().left;
                              const dotEnd = dot.getBoundingClientRect().right;
                              const dotStep = barWidth / dotWidth;
                              const _minDays =
                                Number(minDays) < 1 ? 1 : Number(minDays);
                              const stepWidth =
                                (barWidth - dotWidth) /
                                (Number(maxDays) - Number(_minDays));
                              const period =
                                dotStart - stepWidth < barStart
                                  ? Number(_minDays)
                                  : dotEnd + stepWidth > barEnd
                                  ? Number(maxDays)
                                  : Number(_minDays) -
                                    1 +
                                    Math.ceil(
                                      (dotStart - barStart) / stepWidth,
                                    );
                              setPeriod(period);
                            }}
                            disabled={
                              pendingStakeTx ||
                              !isStarted ||
                              loading ||
                              isEnded ||
                              needsApproval
                            }
                          >
                            <span
                              id="dot"
                              className={classes.dot}
                              style={{
                                position: 'absolute',
                                top: '0%',
                                left: '0.8%',
                              }}
                            />
                          </Draggable>
                        </BarHolder>
                        <Typography
                          color="#894242"
                          textAlign="center"
                          fontSize="1.5vw"
                        >
                          {`Lock for ${period} days`}
                        </Typography>
                      </FlexBox>
                      <MetaBox
                        isLoggedIn={loggedIn}
                        title={'Stake'}
                        available={aniBalance}
                        xs={xs}
                        value={amount}
                        onChange={setAmount}
                        onClick={handleMax}
                        disabled={
                          needsApproval ||
                          isEnded ||
                          !stakingData ||
                          !isStarted ||
                          requestedApproval ||
                          (!needsApproval &&
                            (pendingStakeTx || !(loggedIn && account)))
                        }
                      />
                    </FlexBox>
                    <FlexBox
                      // @ts-ignore
                      css={`
                        width: 50%;
                        flex-direction: column;
                        box-sizing: border-box;
                        align-items: center;
                        row-gap: 1%;
                      `}
                    >
                      <FlexBox
                        // @ts-ignore
                        css={`
                          width: 100%;
                          height: 38%;
                          flex-direction: column;
                          border-radius: 15px;
                          border: 2px solid #6f150b;
                          padding-left: 2%;
                          padding-right: 2%;
                          justify-content: space-between;
                          box-sizing: border-box;
                        `}
                      >
                        <FlexBox
                          // @ts-ignore
                          css={`
                            flex-direction: row;
                            padding: 2%;
                            justify-content: space-between;
                          `}
                        >
                          <Typography
                            textAlign="center"
                            className={'border-sub-secondary-md'}
                            sx={{
                              color: '#F4C01E',
                              fontSize: xs ? '1.2vh' : '0.82vw',
                              width: '25%',
                            }}
                          >
                            Locked Amount
                          </Typography>
                          <Typography
                            textAlign="center"
                            className={'border-sub-secondary-md'}
                            sx={{
                              color: '#F4C01E',
                              fontSize: xs ? '1.2vh' : '0.85vw',
                              width: '25%',
                            }}
                          >
                            Unlock Date
                          </Typography>
                          <Typography
                            className={'border-sub-secondary-md'}
                            sx={{
                              color: '#F4C01E',
                              fontSize: xs ? '1.2vh' : '0.85vw',
                              width: '15%',
                            }}
                          >
                            Rewards
                          </Typography>
                          <Typography
                            textAlign="center"
                            className={'border-sub-secondary-md'}
                            sx={{
                              color: '#F4C01E',
                              fontSize: xs ? '1.2vh' : '0.85vw',
                              width: '15%',
                            }}
                          >
                            Status
                          </Typography>
                        </FlexBox>
                        <Box
                          style={{
                            overflow: 'scroll',
                            position: 'relative',
                            display: 'list-item',
                          }}
                        >
                          {userStakedTime > 0 &&
                            map(new Array(userStakedTime), (_, i) => (
                              <FlexBox
                                key={i}
                                // @ts-ignore
                                css={`
                                  flex-direction: row;
                                  justify-content: space-between;
                                `}
                              >
                                <Typography
                                  width="25%"
                                  textAlign="end"
                                  color="#894242"
                                >{`${userStakedAmount[i]} ANIFI`}</Typography>
                                <Typography textAlign="end" color="#894242">
                                  {dayjs(
                                    (Number(userStakedStart[i]) +
                                      Number(userStakedPeriod[i])) *
                                      1000,
                                  ).format('D/M/YY, HH:mm')}
                                </Typography>
                                <Typography
                                  textAlign="end"
                                  color="#894242"
                                >{`${singleReward[i]} ANIFI`}</Typography>
                                <StatusButton
                                  className={`btn-staking-status ${classes.statusButton}`}
                                  sx={{
                                    color: 'text.primary',
                                  }}
                                  onClick={() => {
                                    setPendingWithdrawId(i);
                                    return handleWithdraw(
                                      (userStakedTime - i).toString(),
                                    );
                                  }}
                                  disabled={
                                    pendingWithdrawTx ||
                                    status[i] !== 'Withdraw'
                                  }
                                >
                                  <Typography fontSize="0.6vw">
                                    {pendingWithdrawTx &&
                                    i === pendingWithdrawId
                                      ? 'Withdrawing...'
                                      : status[i]}
                                  </Typography>
                                </StatusButton>
                              </FlexBox>
                            ))}
                        </Box>
                      </FlexBox>
                      <HarvestButton
                        className={`btn-private-sale ${classes.harvestButton}`}
                        sx={{
                          color: 'text.primary',
                        }}
                        onClick={handleHarvest}
                        disabled={pendingHarvestTx || isEmpty(userStakedAmount)}
                      >
                        {pendingHarvestTx ? 'Harvesting...' : 'Harvest'}
                      </HarvestButton>
                      <FlexBox
                        // @ts-ignore
                        css={`
                          width: 100%;
                          height: 50%;
                          flex-direction: column;
                          border-radius: 15px;
                          border: 2px solid #6f150b;
                          padding: 2%;
                          justify-content: space-between;
                          box-sizing: border-box;
                        `}
                      >
                        <MetaText
                          title={'Your Rewards:'}
                          label={`${userReward} ANIFI`}
                          xs={xs}
                          loading={loading}
                        />
                        <Typography
                          sx={{
                            color: '#894242',
                            textAlign: 'center',
                            fontSize: xs ? '1vh' : '1vw',
                          }}
                        >
                          Staking rewards will enter a 7 days vesting period
                        </Typography>
                        <MetaText
                          title={'Claimable Rewards:'}
                          label={`${claimable} ANIFI`}
                          xs={xs}
                          loading={loading}
                        />
                      </FlexBox>
                    </FlexBox>
                  </FlexBox>
                  {(needsApproval ||
                    requestedApproval ||
                    startStaking === 0 ||
                    !isStarted ||
                    isEnded) && (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      width="100%"
                      height="100%"
                    >
                      <ApproveButton
                        onClick={handleApprove}
                        className={`btn-private-sale ${classes.approveButton}`}
                        disabled={
                          isEnded ||
                          startStaking === 0 ||
                          !isStarted ||
                          !(loggedIn && account) ||
                          requestedApproval
                        }
                        disableRipple
                        sx={{
                          color: 'text.primary',
                        }}
                      >
                        {startStaking > 0
                          ? isEnded
                            ? 'Sale Ended'
                            : !isStarted
                            ? `${startingIn}`
                            : needsApproval
                            ? requestedApproval
                              ? 'Approving...'
                              : 'Approve'
                            : ''
                          : 'Loading...'}
                      </ApproveButton>
                    </Box>
                  )}
                  {isStarted &&
                    !isEnded &&
                    startStaking > 0 &&
                    !needsApproval &&
                    !requestedApproval && (
                      <ButtonsContainer>
                        <StakeButton
                          onClick={() =>
                            handleStake(Number(amount), Number(period))
                          }
                          className={`btn-private-sale ${classes.buyButton}`}
                          disabled={
                            isEnded ||
                            startStaking === 0 ||
                            !isStarted ||
                            !(loggedIn && account) ||
                            pendingStakeTx ||
                            !Number(amount) ||
                            period > maxDays ||
                            aniBalance === '0.00'
                          }
                          disableRipple
                          sx={{
                            color: 'text.primary',
                          }}
                        >
                          {pendingStakeTx ? 'STAKING...' : 'STAKE'}
                        </StakeButton>
                        <ClaimButton
                          onClick={handleClaim}
                          className={`btn-private-sale ${classes.claimButton}`}
                          disabled={
                            isEnded ||
                            startStaking === 0 ||
                            !isStarted ||
                            !(loggedIn && account) ||
                            pendingClaimTx ||
                            stakingData?.userReward <= new BigNumber(0)
                          }
                          disableRipple
                          sx={{
                            color: 'text.primary',
                          }}
                        >
                          {pendingClaimTx ? 'CLAIMING...' : 'CLAIM'}
                        </ClaimButton>
                      </ButtonsContainer>
                    )}
                </FlexBox>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

const BarHolder = styled.div`
  position: relative;
  height: 40px;
  width: 100%;
  margin-top: 1%;
  margin-bottom: 1%;
  border-radius: 50px;
  background-color: rgba(214, 178, 122, 255);
  // background-image: linear-gradient(to right, #e8c28b, #e8c48c);
  padding: 0 1%;
  box-sizing: border-box;
`;

const CoinImg = styled.img`
  height: 88%;
  width: 38%;
  position: absolute;
  left: -55%;
  top: -9%;
`;

const InputField = styled.input`
  font-family: 'LuckiestGuy', 'OpenSans', sans-serif;
  font-weight: 400;
  width: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  -webkit-appearance: none;
  line-height: 1.6;

  color: transparent;
  caret-color: rgb(112 10 10);

  z-index: 1;
  padding-left: 2%;
  box-sizing: border-box;
`;

const TextValue = styled(Typography)`
  position: absolute;
  left: 0;
  top: 10%;
  padding-left: 2%;
  width: 96%;
  overflow: hidden;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 20%;
  box-sizing: border-box;
  margin-top: 1%;
`;

const TextTitle = styled(Typography)`
  @media (orientation: portrait) {
    font-size: 2.5vh;
  }

  @media (orientation: landscape) {
    font-size: 2.5vw;
  }
`;

const StakeButton = styled(Button)`
  @media (orientation: portrait) {
    font-size: 2.25vh;
  }

  @media (orientation: landscape) {
    font-size: 2.25vw;
  }
`;

const ClaimButton = styled(Button)`
  @media (orientation: portrait) {
    font-size: 2.25vh;
  }

  @media (orientation: landscape) {
    font-size: 2.25vw;
  }
`;

const ApproveButton = styled(Button)`
  @media (orientation: portrait) {
    font-size: 2.25vh;
  }

  @media (orientation: landscape) {
    font-size: 2.25vw;
  }
`;

const HarvestButton = styled(Button)`
  @media (orientation: portrait) {
    font-size: 1vh;
  }

  @media (orientation: landscape) {
    font-size: 1vw;
  }
`;

const MaxButton = styled(Button)`
  @media (orientation: portrait) {
    font-size: 1vh;
  }

  @media (orientation: landscape) {
    font-size: 1vw;
  }
`;

const StatusButton = styled(Button)`
  @media (orientation: portrait) {
    font-size: 0.8vh;
  }

  @media (orientation: landscape) {
    font-size: 0.8vw;
  }
`;

export default Staking;
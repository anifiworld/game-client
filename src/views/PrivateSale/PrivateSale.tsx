import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import privateSale from 'constants/PrivateSale';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAppDispatch } from 'state';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useApprove from 'hooks/useApprove';
import { useContract } from 'hooks/useContract';
import usePrivateSale from 'hooks/usePrivateSale';
import { ContractName } from 'utils/contractHelpers';
import { formatNumber } from 'utils/formatBalance';
import { setIsHome } from 'state/actions';
import { useIsLoggedIn, useUserAllowances, useUserBalances } from 'state/hooks';
import { updateUserAllowances } from 'state/profile';
import FlexBox from 'components/FlexBox';


interface IPrivateSaleData {
  totalSale: BigNumber;
  hardCap: BigNumber;
  currentPrice: BigNumber;
  minBuy: BigNumber;
  maxBuy: BigNumber;
  privateSaleTimestamp: BigNumber;
  tgeTimestamp: BigNumber;
  STEPUP_PERIOD: BigNumber;
  TOTAL_STEP: BigNumber;
}

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
  }),
);

const MetaText = (props: { title?: string; label?: string; xs?: boolean }) => {
  const initialValue = props.label?.split(' ')[0];
  return (
    <>
      <FlexBox
        // @ts-ignore
        css={`
          width: 100%;
          flex-direction: row;
          align-items: center;
        `}
      >
        <Typography
          className={'border-sub-secondary-md'}
          sx={{
            color: '#F4C01E',
            fontSize: props.xs ? '1.5vh' : '1.5vw',
            width: '50%',
          }}
        >
          {props.title}
        </Typography>
        {initialValue === '0.00' ||
        initialValue === '0.0000' ||
        initialValue === '0.0001' ? (
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
}) => {
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
        {props.available ? (
          props.available.split(' ')[0] !== '-1' && props.isLoggedIn ? (
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
          )
        ) : props.bought?.split(' ')[0] !== '-1' && props.isLoggedIn ? (
          <Typography
            className={'border-sub-secondary-md'}
            sx={{
              color: 'text.primary',
              fontSize: props.xs ? '1.5vh' : '1.5vw',
            }}
          >
            {`Bought: ${props.bought}`}
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
          ${props.title === 'From' && 'padding-left: 2%'};
        `}
      >
        {props.title === 'From' ? (
          <>
            <FlexBox
              // @ts-ignore
              css={`
                position: relative;
                transform: translateY(-10%);
                width: 60%;
                border-radius: 10px;
                background: #e8b375;
                align-items: center;
                justify-content: center;
                height: 100%;
                border: 1px solid #6f150b;
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
                position: relative;
              `}
            >
              <CoinImg
                alt={''}
                src={require('../../assets/image/ui/cute-busd.png').default}
              />
              <Typography
                className={'border-sub-secondary-md'}
                sx={{
                  color: 'text.primary',
                  fontSize: props.xs ? '2vh' : '2vw',
                  marginLeft: '3%',
                }}
              >
                BUSD
              </Typography>
            </FlexBox>
          </>
        ) : (
          <>
            <Typography
              className={'border-sub-secondary-md'}
              sx={{
                color: 'text.primary',
                fontSize: props.xs ? '2.5vh' : '2.5vw',
              }}
            >
              {props.value}
            </Typography>
            <FlexBox
              // @ts-ignore
              css={`
                width: fit-content;
                flex-direction: row;
                align-items: center;
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
          </>
        )}
      </FlexBox>
    </FlexBox>
  );
};

const PrivateSale = () => {
  const [valueFrom, setValueFrom] = useState<string>('0.0');
  const [pendingTx, setPendingTx] = useState<boolean>(false);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));

  const classes = useStyles({ xs, sm, md, lg });

  const loggedIn = useIsLoggedIn();
  const { account } = useWeb3React();
  const privateSaleContract = useContract(ContractName.PrivateSale);
  const {
    onBuyPrivateSale,
    onGetPrivateSaleData,
    onGetUserWallet,
    onGetQuoteTokenAmount,
  } = usePrivateSale();
  const dispatch = useAppDispatch();
  const userAllowances = useUserAllowances();
  const allowance = useMemo(() => {
    const allowance = _.find(
      userAllowances,
      ({ name }) => name === 'privateSale',
    )?.allowance;
    return new BigNumber(allowance || 0).toNumber();
  }, [userAllowances]);

  const needsApproval = !allowance;
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [privateSaleData, setPrivateSaleData] = useState<IPrivateSaleData>({
    totalSale: new BigNumber(0),
    hardCap: new BigNumber(0),
    currentPrice: new BigNumber(0),
    minBuy: new BigNumber(0),
    maxBuy: new BigNumber(0),
    privateSaleTimestamp: new BigNumber(0),
    tgeTimestamp: new BigNumber(0),
    STEPUP_PERIOD: new BigNumber(0),
    TOTAL_STEP: new BigNumber(0),
  });
  const [boughtAni, setBoughtAni] = useState('-1');
  const [quoteAmount, setQuoteAmount] = useState('0');
  const userBalances = useUserBalances();
  const busdBalance = useMemo(
    () =>
      formatNumber(
        new BigNumber(
          userBalances?.find((token) => token.name === 'busd')?.balance!,
        ).toNumber(),
      ) || '-1',
    [userBalances],
  );
  const totalSale = useMemo(
    () =>
      privateSaleData?.totalSale &&
      formatNumber(
        new BigNumber(privateSaleData?.totalSale)
          .dividedBy(10 ** 18)
          .toNumber(),
      ),
    [privateSaleData?.totalSale],
  );
  const hardCap = useMemo(
    () =>
      privateSaleData?.hardCap &&
      formatNumber(
        new BigNumber(privateSaleData?.hardCap).dividedBy(10 ** 18).toNumber(),
      ),
    [privateSaleData?.hardCap],
  );
  const currentPrice = useMemo(
    () =>
      privateSaleData?.currentPrice &&
      formatNumber(
        new BigNumber(privateSaleData?.currentPrice)
          .dividedBy(10 ** 18)
          .toNumber(),
        4,
        4,
      ),
    [privateSaleData?.currentPrice],
  );
  const nextPrice = useMemo(
    () =>
      privateSaleData?.currentPrice &&
      formatNumber(
        new BigNumber(privateSaleData?.currentPrice)
          .dividedBy(10 ** 18)
          .toNumber() + 0.0001,
        4,
        4,
      ),
    [privateSaleData?.currentPrice],
  );
  const minBuy = useMemo(
    () =>
      privateSaleData?.minBuy &&
      formatNumber(
        new BigNumber(privateSaleData?.minBuy).dividedBy(10 ** 18).toNumber(),
      ),
    [privateSaleData?.minBuy],
  );
  const maxBuyValue = useMemo(
    () =>
      privateSaleData?.maxBuy &&
      new BigNumber(privateSaleData?.maxBuy).dividedBy(10 ** 18).toNumber(),
    [privateSaleData?.maxBuy],
  );
  const maxBuy = useMemo(
    () =>
      privateSaleData?.maxBuy &&
      formatNumber(
        new BigNumber(privateSaleData?.maxBuy).dividedBy(10 ** 18).toNumber(),
      ),
    [privateSaleData?.maxBuy],
  );
  const privateSaleTimestamp = useMemo(
    () =>
      privateSaleData?.privateSaleTimestamp &&
      new BigNumber(privateSaleData?.privateSaleTimestamp).toNumber(),
    [privateSaleData?.privateSaleTimestamp],
  );
  const tgeTimestamp = useMemo(
    () =>
      privateSaleData?.tgeTimestamp &&
      new BigNumber(privateSaleData?.tgeTimestamp).toNumber(),
    [privateSaleData?.tgeTimestamp],
  );
  const STEPUP_PERIOD = useMemo(
    () =>
      privateSaleData?.STEPUP_PERIOD &&
      new BigNumber(privateSaleData?.STEPUP_PERIOD).toNumber(),
    [privateSaleData?.STEPUP_PERIOD],
  );
  const TOTAL_STEP = useMemo(
    () =>
      privateSaleData?.TOTAL_STEP &&
      new BigNumber(privateSaleData?.TOTAL_STEP).toNumber(),
    [privateSaleData?.TOTAL_STEP],
  );

  const [currentTime, setCurrentTime] = useState(dayjs().unix());
  const isStarted = useMemo(
    () => currentTime > privateSaleTimestamp,
    [currentTime, privateSaleTimestamp],
  );
  const endTime = useMemo(
    () => privateSaleTimestamp + STEPUP_PERIOD * TOTAL_STEP,
    [privateSaleTimestamp, STEPUP_PERIOD, TOTAL_STEP],
  );
  const isEnded = useMemo(() => currentTime > endTime, [endTime, currentTime]);

  const startingIn = useMemo(
    () =>
      dayjs
        .duration((privateSaleTimestamp - currentTime) * 1000)
        .format('D[d] H[h] m[m] s[s]'),
    [currentTime, privateSaleTimestamp],
  );
  const nextPriceIn = useMemo(
    () =>
      dayjs
        .duration(
          (STEPUP_PERIOD -
            ((currentTime - privateSaleTimestamp) % STEPUP_PERIOD)) *
            1000,
        )
        .format('D[d] H[h] m[m] s[s]'),
    [privateSaleTimestamp, currentTime],
  );
  const chainId = process.env.REACT_APP_CHAIN_ID;
  // @ts-ignore
  const privateSaleContractAddress = privateSale.address[chainId];
  const tokenContract = useContract(ContractName.USDToken);
  const { onApprove } = useApprove(tokenContract, privateSaleContractAddress);
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
    } catch (e) {
    } finally {
      setRequestedApproval(false);
    }
  }, [onApprove]);

  const handleBuy = async (amount: number) => {
    setPendingTx(true);
    const bought = await onBuyPrivateSale(privateSaleContract, amount);
    setPendingTx(false);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await onGetPrivateSaleData(privateSaleContract);
      setPrivateSaleData(data);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    if (!account) return;
    (async () => {
      const boughtAni = await onGetUserWallet(privateSaleContract);
      setBoughtAni(
        formatNumber(new BigNumber(boughtAni).dividedBy(10 ** 18).toNumber()),
      );
    })();
  }, [account, pendingTx]);

  useEffect(() => {
    (async () => {
      const quoteAmount = await onGetQuoteTokenAmount(
        privateSaleContract,
        Number(valueFrom),
      );
      setQuoteAmount(formatNumber(new BigNumber(quoteAmount).toNumber()));
    })();
  }, [valueFrom]);
  const progress = useMemo(
    () =>
      privateSaleData?.totalSale &&
      privateSaleData?.hardCap &&
      Math.fround(
        (new BigNumber(privateSaleData?.totalSale).toNumber() /
          10 ** 18 /
          (new BigNumber(privateSaleData?.hardCap).toNumber() / 10 ** 18)) *
          100,
      ),
    [privateSaleData?.totalSale, privateSaleData?.hardCap, boughtAni],
  );

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
                {'Private Sale'}
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
                  <FlexBox
                    // @ts-ignore
                    css={`
                      width: 100%;
                      flex-direction: row;
                      justify-content: space-between;
                      align-items: center;
                    `}
                  >
                    {_.isString(privateSaleData?.totalSale) ? (
                      <Typography
                        className={'border-sub-secondary-md'}
                        sx={{
                          color: '#F4C01E',
                          fontSize: xs ? '1.5vh' : '1.5vw',
                        }}
                      >
                        {`Sold: ${totalSale} ANIFI`}
                      </Typography>
                    ) : (
                      <FlexBox
                        // @ts-ignore
                        css={`
                          width: 50%;
                          flex-direction: row;
                          justify-content: flex-start;
                          align-items: center;
                        `}
                      >
                        <Typography
                          className={'border-sub-secondary-md'}
                          sx={{
                            color: '#F4C01E',
                            fontSize: xs ? '1.5vh' : '1.5vw',
                          }}
                        >
                          {'Sold: '}
                        </Typography>
                        <div
                          style={{
                            width: '20%',
                            height: '25px',
                            marginLeft: 12,
                            marginRight: 12,
                          }}
                        >
                          <Skeleton
                            baseColor="#FCE8C2"
                            highlightColor="#E9BE84"
                          />
                        </div>
                        <Typography
                          className={'border-sub-secondary-md'}
                          sx={{
                            color: '#F4C01E',
                            fontSize: xs ? '1.5vh' : '1.5vw',
                          }}
                        >
                          {' ANIFI'}
                        </Typography>
                      </FlexBox>
                    )}
                    {_.isString(privateSaleData?.hardCap) ? (
                      <Typography
                        className={'border-sub-secondary-md'}
                        sx={{
                          color: '#F4C01E',
                          fontSize: xs ? '1.5vh' : '1.5vw',
                          textAlign: 'right',
                        }}
                      >
                        {`Hard cap: ${hardCap} ANIFI`}
                      </Typography>
                    ) : (
                      <FlexBox
                        // @ts-ignore
                        css={`
                          width: 50%;
                          flex-direction: row;
                          justify-content: flex-end;
                          align-items: center;
                        `}
                      >
                        <Typography
                          className={'border-sub-secondary-md'}
                          sx={{
                            color: '#F4C01E',
                            fontSize: xs ? '1.5vh' : '1.5vw',
                          }}
                        >
                          {'Hard cap: '}
                        </Typography>
                        <div
                          style={{
                            width: '20%',
                            height: '25px',
                            marginLeft: 12,
                            marginRight: 12,
                          }}
                        >
                          <Skeleton
                            baseColor="#FCE8C2"
                            highlightColor="#E9BE84"
                          />
                        </div>
                        <Typography
                          className={'border-sub-secondary-md'}
                          sx={{
                            color: '#F4C01E',
                            fontSize: xs ? '1.5vh' : '1.5vw',
                          }}
                        >
                          {' ANIFI'}
                        </Typography>
                      </FlexBox>
                    )}
                  </FlexBox>
                  <BarHolder>
                    <div className={classes.progressBar}>
                      <LinearProgress
                        variant="determinate"
                        value={100}
                        style={{
                          width: `${progress < 1 ? 1 : progress}%`,
                          height: '80%',
                          borderRadius: 32,
                          borderColor: progress > 0 ? '#2A5219' : 'transparent',
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
                          width: `${progress < 7 ? 0 : progress - 4}%`,
                          height: '18%',
                          borderRadius: 18,
                        }}
                      />
                    </div>
                  </BarHolder>
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
                        width: 50%;
                        flex-direction: column;
                        border-radius: 15px;
                        background-image: linear-gradient(
                          to right,
                          #e8b375,
                          #e8c38b
                        );
                        padding: 2%;
                        justify-content: space-between;
                        box-sizing: border-box;
                      `}
                    >
                      <MetaText
                        title={'Current Price:'}
                        label={`${currentPrice} Busd/ANIFI`}
                        xs={xs}
                      />
                      <MetaText
                        title={'Next Price:'}
                        label={
                          currentPrice >= '0.0055'
                            ? 'End of Sale'
                            : `${nextPrice} Busd/ANIFI`
                        }
                        xs={xs}
                      />
                      {isStarted && !isEnded && (
                        <Typography
                          className={'border-sub-secondary-md'}
                          sx={{
                            color: '#F4C01E',
                            fontSize: xs ? '1.5vh' : '1.5vw',
                          }}
                        >
                          {`In ${nextPriceIn}`}
                        </Typography>
                      )}
                      <MetaText
                        title={'Min buy:'}
                        label={`${minBuy} Busd`}
                        xs={xs}
                      />
                      <MetaText
                        title={'Max buy:'}
                        label={`${maxBuy} Busd`}
                        xs={xs}
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
                      <MetaBox
                        isLoggedIn={loggedIn}
                        title={'From'}
                        available={busdBalance}
                        xs={xs}
                        value={valueFrom}
                        onChange={setValueFrom}
                        disabled={
                          isEnded ||
                          !privateSaleData ||
                          !isStarted ||
                          requestedApproval ||
                          (!needsApproval &&
                            (pendingTx || !(loggedIn && account)))
                        }
                      />
                      <img
                        src={
                          require('../../assets/image/ui/arrow-down.png')
                            .default
                        }
                        alt={''}
                        width={'10%'}
                      />
                      <MetaBox
                        isLoggedIn={loggedIn}
                        title={'To'}
                        bought={boughtAni}
                        xs={xs}
                        value={quoteAmount}
                      />
                    </FlexBox>
                  </FlexBox>
                  <ButtonsContainer>
                    <BuyButton
                      onClick={() =>
                        needsApproval
                          ? handleApprove()
                          : handleBuy(Number(valueFrom))
                      }
                      className={`btn-private-sale ${classes.buyButton}`}
                      disabled={
                        isEnded ||
                        privateSaleTimestamp === 0 ||
                        !isStarted ||
                        !(loggedIn && account) ||
                        requestedApproval ||
                        (!needsApproval && (pendingTx || !Number(valueFrom))) ||
                        Number(valueFrom) > maxBuyValue
                      }
                      disableRipple
                      sx={{
                        color: 'text.primary',
                      }}
                    >
                      {privateSaleTimestamp > 0
                        ? isEnded
                          ? 'Sale Ended'
                          : !isStarted
                          ? `Starting in ${startingIn}`
                          : needsApproval
                          ? 'Approve'
                          : requestedApproval
                          ? 'Approving...'
                          : pendingTx
                          ? 'BUYING...'
                          : 'BUY'
                        : 'Loading...'}
                    </BuyButton>
                  </ButtonsContainer>
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
  height: 8%;
  width: 100%;
  margin-top: 1%;
  margin-bottom: 1%;
  border-radius: 50px;
  background-image: linear-gradient(to right, #e8c28b, #e8c48c);
  padding: 0 1%;
  box-sizing: border-box;
`;

const CoinImg = styled.img`
  width: 50%;
  position: absolute;
  left: -66%;
  top: 0;
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
  line-height: 1.8;

  color: transparent;
  text-shadow: none;
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
  justify-content: center;
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

const BuyButton = styled(Button)`
  @media (orientation: portrait) {
    font-size: 2.25vh;
  }

  @media (orientation: landscape) {
    font-size: 2.25vw;
  }
`;

export default PrivateSale;
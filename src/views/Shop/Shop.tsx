import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import assets from 'constants/GameAssets';
import tokens from 'constants/Tokens';
import vendor from 'constants/Vendor';
import _, { filter, isEmpty, map } from 'lodash';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'state';
import { useWeb3React } from '@web3-react/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useApprove from 'hooks/useApprove';
import { useContract } from 'hooks/useContract';
import useGacha from 'hooks/useGacha';
import useHeroCard from 'hooks/useHeroCard';
import useGetHeroList from 'hooks/useHeroList';
import useItems from 'hooks/useItems';
import usePrice from 'hooks/usePrice';
import useVendor from 'hooks/useVendor';
import { ContractName } from 'utils/contractHelpers';
import { useUserAllowances } from 'state/hooks';
import { updateUserAllowances } from 'state/profile';
import ButtonEffect from 'components/ButtonEffect';
import DialogItem from 'components/DialogViewItem';
import Carousel from 'components/shop/carousel';
import { formatNumber } from '../../utils/formatBalance';

const ShopMenu = ({
  category,
  onChange,
}: {
  category: string;
  onChange: Dispatch<SetStateAction<string>>;
}) => {
  const theme = useTheme();
  const Menu = [
    {
      id: 0,
      key: 'Packs',
      title: 'Packs',
    },
    {
      id: 2,
      key: 'Rentals',
      title: 'Rentals',
    },
    {
      id: 3,
      key: 'Gems',
      title: 'Gems',
    },
  ];
  const [selected, setSelected] = useState(new Array(Menu.length).fill(false));

  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <Grid
      container
      sx={{
        position: 'absolute',
        bottom: 0,
        left: '58%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '60%',
        height: '10%',
        overflow: 'hidden',
      }}
    >
      <Grid
        container
        sx={{
          position: 'relative',
          mb: '-1.8%',
        }}
      >
        {Menu.map((item) => (
          <Grid
            key={item.title}
            item
            xs={3}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 0,
            }}
          >
            <ButtonEffect
              onClick={() => {
                const newArr = new Array(Menu.length).fill(false);
                newArr[item.id] = !selected[item.id];
                setSelected(newArr);
                category === item.key ? onChange('') : onChange(item.key);
              }}
              className={`btn-shop ${selected[item.id] ? 'btn-selected' : ''}`}
              sx={{
                color: 'text.primary',
                fontSize: xs ? '1.5vh' : '1.5vw',
                width: '100%',
                height: 'auto',
                py: '6%',
              }}
              key={item.title}
              disableRipple
            >
              {item.title}
            </ButtonEffect>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
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
    overlay: {
      backgroundColor: 'black',
      width: '100vw',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      opacity: '50%',
    },
    stack: {
      marginTop: sm ? 1 : 2,
    },
    cardShop: {
      position: 'relative',
      userSelect: 'none',
      background: `url(${
        require('../../assets/image/ui/1114f97b356eead12a4f6785b9ecad39.png')
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
      // width: 'auto',
    },
    customInput: {
      background: `url(${
        require('../../assets/image/ui/d22a1892b142cb444669ecba7cdee0e3.png')
          .default
      })`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'contain',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      textAlign: 'center',
      color: '#8E1B1B',
      fontSize: xs ? '1.5vh' : '1.5vw',
      width: '80%',
    },
    btnCard: {
      background: `url(${
        require('../../assets/image/ui/a2280d0a9e8bb1b509fbd5b4738cfa84.png')
          .default
      })`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'contain',
      backgroundColor: 'transparent',
      position: 'absolute',
      bottom: '5%',
      height: '10%',
      width: '80%',
      '&:hover': { backgroundColor: 'transparent' },
      fontSize: xs ? '1.5vh' : '1.5vw',
      '&:disabled': {
        color: 'rgba(255, 255, 255, 0.692)',
        background: `url(${
          require('../../assets/image/ui/db04ff30924719e791085dd40b241d88.png')
            .default
        })`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
        backgroundColor: 'transparent',
      },
    },
    shop: {
      top: '12.5%',
      position: 'absolute',
      textAlign: 'center',
      cursor: 'default',
      fontSize: xs ? '3vh' : '3vw',
    },
    shopContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'start',
      paddingTop: 0,
      paddingBottom: 0,
    },
    carouselContainer: {
      display: 'block',
      textAlign: 'center',
      marginTop: 0,
      left: '10%',
      top: '22%',
      position: 'absolute',
      width: '80%',
      height: '60%',
    },
    item: {
      marginTop: sm ? '16px' : md ? '16px' : '32px',
      fontSize: xs ? '1.75vh' : '1.75vw',
      minHeight: sm ? '1em' : md ? '1.2em' : lg ? '1.6em' : '1.6em',
    },
    cardMedia: {
      width: 'auto',
      height: '45%',
      objectFit: 'fill',
      objectPosition: 'center center',
    },
    price: {
      marginTop: '5%',
      fontSize: xs ? '1.55vh' : '1.55vw',
    },
    buttonsContainer: {
      top: '70%',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      position: 'absolute',
      width: '80%',
      height: '10%',
    },
    minusButton: {
      minWidth: '22%',
      height: '100%',
      paddingLeft: 0,
      paddingRight: 0,
      '&:hover': { backgroundColor: 'transparent' },
    },
    plusButton: {
      minWidth: '22%',
      height: '100%',
      paddingLeft: 0,
      paddingRight: 0,
      '&:hover': { backgroundColor: 'transparent' },
    },
    backButton: {
      paddingLeft: '3%',
      paddingRight: '3%',
      paddingTop: '1%',
      paddingBottom: '1%',
      fontSize: xs ? '2.25vh' : '2.25vw',
      width: '18%',
    },
    backButtonContainer: {
      display: 'flex',
      justifyContent: 'right',
      width: '100%',
      paddingLeft: '5%',
      paddingRight: '5%',
    },
    gridItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
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
    title: {
      top: '18.5%',
      position: 'absolute',
      fontSize: xs ? '3vh' : '3vw',
      zIndex: 2,
    },
    cardStarter: {
      zIndex: 1,
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
    cardMediaContainer: {
      marginTop: '20%',
      height: '30%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

interface IData {
  title?: string;
  image?: any;
  img?: any;
  images?: any;
  imageComponents?: any;
  imageLabel?: string;
}

interface IAssetData {
  id: number;
  itemId: string;
  value: number;
  name: string;
  image: string;
  price: string;
  category: string;
  title: string;
  description: string;
  active: boolean;
}

const Shop = () => {
  const navigate = useNavigate();
  const chainId = process.env.REACT_APP_CHAIN_ID;
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));

  const [data, setData] = useState<any>([]);
  const [selectedData, setSelectedData] = useState<{
    id: number;
    amount: number;
    category: string;
  }>();
  const [category, setCategory] = useState('');
  const vendorContract = useContract(ContractName.Vendor);
  // @ts-ignore
  const vendorContractAddress = vendor.address[chainId];
  const tokenContract = useContract(ContractName.AniToken);
  // @ts-ignore
  const tokenAddress = tokens.aniToken.address[chainId].address;
  const { onBuyItem, onOpenGachaHero } = useVendor();
  const { onItems } = useItems();
  const [totalPacks, setTotalPacks] = useState(0);
  const [pendingTx, setPendingTx] = useState(
    new Array(data.length).fill(false),
  );
  const handleBuyItem = async (item: IAssetData, amount: number) => {
    try {
      let newArr: any[];
      newArr = [...pendingTx];
      newArr[item.id] = true;
      setPendingTx(newArr);
      _.startCase(item.category) === 'Packs' ? setOpen(true) : setOpen(false);
      const bought = await onBuyItem(vendorContract, item.itemId, amount);
      const _data = {
        title: 'Received ' + item.name,
        img: item.image,
        imageLabel: `X${amount}`,
        description: item.description,
      };
      setDialogData(_data);
      setOpenDialog(bought);
    } catch (e) {
    } finally {
      const newArr = [...pendingTx];
      newArr[item.id] = false;
      setPendingTx(newArr);
    }
  };
  const userAllowances = useUserAllowances();
  const vendorAllowance = useMemo(() => {
    const allowance = _.find(
      userAllowances,
      ({ name }) => name === 'vendor',
    )?.allowance;
    return new BigNumber(allowance || 0).toNumber();
  }, [userAllowances]);
  const allowance = useMemo(() => vendorAllowance, [vendorAllowance]);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  useEffect(() => {
    if (!account) return;
    dispatch(updateUserAllowances(account));
  }, [dispatch, account]);
  const needsApproval = !allowance;
  const [requestedApproval, setRequestedApproval] = useState(false);

  const { onApprove: onVendorApprove } = useApprove(
    tokenContract,
    vendorContractAddress,
  );
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      if (!vendorAllowance) await onVendorApprove();
    } catch (e) {
    } finally {
      setRequestedApproval(false);
    }
  }, [onVendorApprove]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<IData | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setDialogData({
      title: '',
      img: '',
      image: '',
      imageLabel: '',
    });
    setGetGachaHero(false);
    setClaimable(false);
    setOpenDialog(false);
  };

  const { onHeroCard } = useHeroCard();
  const [openGachaHero, setOpenGachaHero] = useState(false);
  const onOpen = async (type: number, _amount: number = 1) => {
    try {
      const bought = await onOpenGachaHero(vendorContract, type, _amount);
      setOpenGachaHero(bought);
      setOpenDialog(false);
      if (!bought) return;
      setOpen(false);
      setTimeout(async () => {
        const data = {
          title: 'Randomize Hero',
          subtitle: '',
          image: await onHeroCard({ id: null, claimHero: true }),
          imageLabel: '',
        };
        setGetGachaHero(true);
        setDialogData(data);
        setOpenDialog(bought);
      }, 500);
    } catch (e) {}
  };

  const onClaim = async () => {
    const _data = {
      title: 'Received Hero',
      subtitle: '',
      image: await onHeroCard({ id: null, claimHero: true, claiming: true }),
      imageLabel: '',
    };
    setDialogData(_data);
    const gachaId = await onClaimGacha();
    // @ts-ignore
    setGachaClaimId(gachaId);
    // @ts-ignore
    setClaimable(gachaId);
  };

  const handleClickItem = (item: IAssetData) => {
    category === 'Packs' ? setOpen(true) : setOpen(false);
    const _data = {
      title: 'Received ' + item.name,
      img: item.image,
      imageLabel: '',
      description: item.description,
    };
    setDialogData(_data);
    setOpenDialog(true);
  };

  const { onGetPrice } = usePrice();
  const { onGetUserHeroList } = useGetHeroList();
  const [finishedRandom, setFinishedRandom] = useState(false);
  const [gachaClaimId, setGachaClaimId] = useState('');
  const { onFinishedRandom, onClaimGacha } = useGacha(vendorContract);
  const [claimable, setClaimable] = useState(false);
  const [getGachaHero, setGetGachaHero] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await onFinishedRandom();
      setFinishedRandom(result);
      setClaimable(result);
    }, 1000);
    return () => clearInterval(interval);
  }, [openGachaHero]);

  useEffect(() => {
    if (!finishedRandom) return;
    (async () => {
      const _data = {
        title: 'Claim Hero',
        subtitle: '',
        image: await onHeroCard({ id: null, loading: false, claimHero: true }),
        imageLabel: '',
      };
      setGetGachaHero(true);
      setDialogData(_data);
    })();
    setClaimable(true);
    setOpenDialog(true);
    setDialogData({});
  }, [finishedRandom]);

  useEffect(() => {
    if (isEmpty(gachaClaimId)) return;
    setClaimable(false);
    (async () => {
      if (dialogData) {
        const heroes = await onGetUserHeroList();
        if (!heroes) return;
        let claimedHeroes = filter(heroes, ({ info: { nft_id } }) =>
          gachaClaimId.includes(nft_id),
        );
        let interval: any;
        while (isEmpty(claimedHeroes)) {
          interval = setInterval(async () => {
            const heroes = await onGetUserHeroList();
            if (!heroes) return;
            claimedHeroes = filter(heroes, ({ info: { nft_id } }) =>
              gachaClaimId.includes(nft_id),
            );
          }, 300);
        }
        clearInterval(interval);
        if (claimedHeroes.length === 1) {
          const {
            info: {
              nft_id,
              hero_type: { name },
              rarity: { name: rarity },
              ...rest
            },
          } = claimedHeroes[0];
          setDialogData({
            ...dialogData,
            image: await onHeroCard({
              ...rest,
              loading: false,
              id: nft_id,
              name,
              rarity,
            }),
          });
          return setOpenDialog(true);
        }
        const imageComponents = (
          <Grid
            container
            direction="row"
            columnGap={1}
            rowGap={2}
            marginLeft={-12}
            marginTop={-10}
            width="200%"
            height="120%"
          >
            {await Promise.all(
              map(
                claimedHeroes,
                async ({
                  info: {
                    nft_id,
                    hero_type: { name },
                    rarity: { name: rarity },
                    ...rest
                  },
                }) => (
                  <Grid key={nft_id} item xs={3}>
                    {await onHeroCard({
                      ...rest,
                      id: nft_id,
                      name,
                      rarity,
                      loading: false,
                    })}
                  </Grid>
                ),
              ),
            )}
          </Grid>
        );
        setDialogData({
          ...dialogData,
          image: undefined,
          imageLabel: '',
          imageComponents,
        });
      }
      setOpenDialog(true);
    })();
  }, [gachaClaimId]);

  useEffect(() => {
    if (selectedData) {
      if (!open && selectedData.category === 'Packs') return;
      const _data = {
        title: 'Received ' + data[selectedData.id].name,
        img: data[selectedData.id].image,
        imageLabel: `X${data[selectedData.id].value}`,
        description: data[selectedData.id].description,
      };
      setDialogData(_data);
    }
  }, [data, selectedData, open]);

  useEffect(() => {
    (async () => {
      const assetGroups = Object.entries(assets);
      let index = 0;
      const initialData: any[] = await Promise.all(
        _.map(assetGroups, async (asset: any[]) => {
          const category = asset[0];
          const items = asset[1];
          return await Promise.all(
            _.map(items, async (item) => {
              let price = await onGetPrice(vendorContract, item.id);
              price = formatNumber(
                new BigNumber(price).dividedBy(10 ** 18).toNumber(),
              );
              return {
                id: index++,
                itemId: item.id,
                value: 1,
                name: item.name,
                image: item.image,
                price,
                category: _.startCase(category),
                title: item.name,
                description: item.description,
                active: item.onsale,
              };
            }),
          );
        }),
      );
      const data = [].concat.apply([], initialData);
      setData(data);
    })();
    // eslint-disable-next-line
  }, []);

  // wait for the component to be mounted
  useEffect(() => {
    const rootStyle = document.getElementById('container')!.style;
    rootStyle.backgroundImage = `url(${
      require('../../assets/image/background/f30c84572124ab4565b9fda0190896da.webp')
        .default
    })`;
    rootStyle.backgroundRepeat = 'no-repeat';
    rootStyle.backgroundColor = '#FAFAFA';
    rootStyle.backgroundPosition = 'center center';
    rootStyle.backgroundSize = 'cover';
  }, []);

  const classes = useStyles({ xs, sm, md, lg });

  return (
    <>
      {isEmpty(data) && (
        <CircularProgress
          color="secondary"
          sx={{
            width: 40,
            height: 40,
            position: 'absolute',
            top: '48.5%',
            left: '48.5%',
            zIndex: 99,
          }}
        />
      )}
      <DialogItem
        open={openDialog}
        onClose={handleClose}
        amount={totalPacks}
        onOpen={onOpen}
        onClaim={onClaim}
        hero={open}
        claimable={claimable}
        getGachaHero={getGachaHero}
        {...dialogData}
      />
      <Grid container sx={{ mt: 0 }}>
        <Grid item xs={12} className={classes.shopContainer}>
          <Typography
            className={`textshadow ${classes.shop}`}
            gutterBottom
            component="div"
            sx={{
              color: 'text.primary',
            }}
          >
            Shop
          </Typography>
        </Grid>
      </Grid>
      <Box className={classes.carouselContainer}>
        <Carousel show={4}>
          {data
            .filter((item: IAssetData) => item.active)
            .filter((item: IAssetData) =>
              category ? item.category === category : true,
            )
            .map((item: IAssetData, index: number) => (
              <Box
                key={index}
                className={classes.cardShop}
                sx={{
                  color: '$text-secondary',
                }}
              >
                <Typography
                  className={`textshadow ${classes.item}`}
                  display="block"
                  gutterBottom
                  sx={{
                    color: 'text.primary',
                  }}
                >
                  {item.name}
                </Typography>
                <CardMedia
                  className={classes.cardMedia}
                  component="img"
                  image={item.image}
                  alt={item.name}
                  onClick={() =>
                    !pendingTx.includes(true) && handleClickItem(item)
                  }
                  style={{
                    cursor: 'pointer',
                  }}
                />
                <Typography
                  className={classes.price}
                  display="block"
                  gutterBottom
                  sx={{
                    color: '#8E1B1B',
                  }}
                >
                  Price: {item.price} ANIFI
                </Typography>
                <Box className={classes.buttonsContainer}>
                  {item.category != 'Rentals' ? (
                    <ButtonEffect
                      className={classes.minusButton}
                      onClick={() => {
                        const newArr = [...data];
                        if (data[item.id].value > 0)
                          newArr[item.id].value = data[item.id].value - 1;
                        setData(newArr);
                      }}
                      variant="text"
                      disableRipple
                    >
                      <img
                        width={'85%'}
                        src={
                          require('../../assets/image/ui/4ef6eede10d432137b93f44d7e94797d.png')
                            .default
                        }
                        alt="minus-btn"
                      />
                    </ButtonEffect>
                  ) : (
                    <ButtonEffect
                      className={classes.minusButton}
                    ></ButtonEffect>
                  )}
                  <input
                    type="number"
                    className={classes.customInput}
                    value={data[item.id].value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newArr = [...data];
                      newArr[item.id].value = parseInt(e.target.value);
                      setData(newArr);
                    }}
                    disabled={item.category === 'Rentals'}
                  ></input>
                  {item.category != 'Rentals' ? (
                    <ButtonEffect
                      className={classes.plusButton}
                      onClick={() => {
                        const limit = item.category === 'Packs' ? 10 : 9999;
                        const newArr = [...data];
                        if (data[item.id].value < limit)
                          newArr[item.id].value = data[item.id].value + 1;
                        setData(newArr);
                      }}
                      variant="text"
                      disableRipple
                    >
                      <img
                        width={'85%'}
                        src={
                          require('../../assets/image/ui/97e904d8428149bd936a5315d18bd264.png')
                            .default
                        }
                        alt="plus-btn"
                      />
                    </ButtonEffect>
                  ) : (
                    <ButtonEffect className={classes.plusButton}></ButtonEffect>
                  )}
                </Box>
                <ButtonEffect
                  className={`${classes.btnCard} ${
                    item.active ? 'textshadow-primary' : 'textshadow-grey'
                  }
                `}
                  onClick={() => {
                    const amount = data[item.id].value;
                    setTotalPacks(amount);
                    const category = data[item.id].category;
                    setSelectedData({ id: item.id, amount, category });
                    return needsApproval
                      ? handleApprove()
                      : handleBuyItem(item, amount);
                  }}
                  variant="text"
                  disabled={
                    !item.active ||
                    requestedApproval ||
                    !data[item.id].value ||
                    pendingTx.includes(true)
                  }
                  disableRipple
                  sx={{
                    color: 'text.primary',
                  }}
                >
                  {needsApproval
                    ? requestedApproval
                      ? 'Approving'
                      : 'Approve'
                    : !item.active
                    ? 'WAITING'
                    : pendingTx[item.id]
                    ? 'BUYING...'
                    : 'BUY'}
                </ButtonEffect>
              </Box>
            ))}
        </Carousel>
      </Box>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          <Box className={classes.backButtonContainer}>
            <ButtonEffect
              className={`btn primary ${classes.backButton}`}
              onClick={() => navigate('/game')}
              disableRipple
              sx={{
                color: 'text.primary',
              }}
            >
              Back
            </ButtonEffect>
          </Box>
        </Grid>
      </Grid>
      <ShopMenu category={category} onChange={setCategory} />
    </>
  );
};

export default Shop;

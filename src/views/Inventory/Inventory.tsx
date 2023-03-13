import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import assets from 'constants/GameAssets';
import _, { isEmpty, map } from 'lodash';
import React, { useEffect, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useNavigate } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useContract } from 'hooks/useContract';
import useGacha from 'hooks/useGacha';
import useHeroCard from 'hooks/useHeroCard';
import useGetHeroList from 'hooks/useHeroList';
import useItems from 'hooks/useItems';
import useVendor from 'hooks/useVendor';
import { ContractName } from 'utils/contractHelpers';
import ButtonEffect from 'components/ButtonEffect';
import DialogItem from 'components/DialogViewItem';


interface IItems {
  type: string;
  name: string;
  description: string;
  image: string;
  imageWidth: string | number;
  amount: {
    value: string;
  };
  category: string;
}

interface IData {
  title?: string;
  subtitle?: string;
  image?: any;
  img?: any;
  imageLabel?: string;
  category?: string;
  description?: string;
}

interface IAssetData {
  id: number;
  itemId: string;
  name: string;
  image: string;
  category: string;
  title: string;
  description: string;
}

let itemList: IAssetData[] = [];
const assetGroups = Object.entries(assets);
let index = 0;
_.forEach(assetGroups, (asset: any[]) => {
  const category = asset[0];
  const items = asset[1];
  itemList = [
    ...itemList,
    ..._.map(items, (item) => ({
      id: index++,
      itemId: item.id,
      name: item.name,
      image: item.image,
      category: _.startCase(category),
      title: item.name,
      description: item.description,
    })),
  ];
});

const GridLayout = WidthProvider(RGL);

const useStyles = makeStyles(
  ({ xs }: { xs: boolean; sm: boolean; md: boolean; lg: boolean }) => ({
    tabMenu: {
      background: `url(${
        require('../../assets/image/ui/80516ecdf78581933d8b54071834b508.png')
          .default
      })`,
      backgroundRepat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      // padding-top: 15px;
      cursor: 'pointer',
      '&.active': {
        background: `url(${
          require('../../assets/image/ui/3847df5f256b5076bc8ee7a9aba06702.png')
            .default
        })`,
        backgroundRepat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        display: 'flex',
      },
    },
    inventory: {
      background: `url(${
        require('../../assets/image/ui/8ab9c4277a7396318145d35bb619c4a5.png')
          .default
      })`,
      backgroundRepeat: 'no-repeat',
      // background: url("/image/ui/inventory.svg") no-repeat,
      backgroundPosition: 'center center',
      backgroundSize: 'contain',
      // width: 1280px,
      // height: 64vh,
      // position: relative,
      // margin-top: 150px,
      zIndex: 1,
      width: '83%',
      height: '64%',
      position: 'absolute',
      left: '8%',
      top: '22%',
    },
    inventoryRoot: {
      display: 'grid',
      gridTemplateAreas: 'actions items',
      gridTemplateColumns: '1fr',
      lineHeight: 1,
    },
    inventoryContainer: {
      display: 'grid',
      gridArea: 'items',
      gridTemplateColumns: 'repeat(5, 1fr)',
      marginBottom: '10px',
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
      height: '100%',
    },
    inventoryItem: {
      marginBottom: '2px',
      position: 'relative',
      display: 'grid',
      gridTemplateAreas: 'actions items',
      gridTemplateColumns: '1fr',
      lineHeight: 1,
      borderRadius: '15px',
      '&:hover': {
        transform: 'scale(1.02)',
        transition: 'transform 100ms linear',
      },
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    potionButtonContainer: {
      display: 'flex',
      position: 'absolute',
      top: '-10.5%',
      left: '6%',
      width: '50%',
      height: '12%',
      zIndex: 0,
    },
    potionButton: {
      padding: 0,
      paddingTop: '3%',
      width: '33%',
      height: '100%',
      fontSize: xs ? '2vh' : '2vw',
    },
    equipmentsButton: {
      padding: 0,
      paddingTop: '3%',
      width: '33%',
      height: '100%',
      fontSize: xs ? '2vh' : '2vw',
    },
    othersButton: {
      padding: 0,
      paddingTop: '3%',
      width: '33%',
      height: '100%',
      fontSize: xs ? '2vh' : '2vw',
    },
    scrollContainer: {
      paddingLeft: '5%',
      paddingRight: '5%',
      paddingTop: '4%',
      height: '100%',
    },
    scroll: {
      overflowX: 'hidden',
      height: '82%',
      position: 'relative',
      display: 'list-item',
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
      zIndex: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }),
);

const Inventory = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));

  const [filter, setFilter] = useState<string | undefined>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<IData | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);
  const { onOpenGachaHero } = useVendor();
  const vendorContract = useContract(ContractName.Vendor);

  const { onItems } = useItems();

  const navigate = useNavigate();
  const [finishedRandom, setFinishedRandom] = useState(false);
  const [gachaClaimId, setGachaClaimId] = useState('');
  const { onFinishedRandom, onClaimGacha } = useGacha(vendorContract);
  const [claimable, setClaimable] = useState(false);
  const [getGachaHero, setGetGachaHero] = useState(false);
  const [openGachaHero, setOpenGachaHero] = useState(false);
  const { onGetUserHeroList } = useGetHeroList();
  const [totalPacks, setTotalPacks] = useState(0);

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

  useEffect(() => {
    (async () => {
      const items = await onItems();
      if (_.isUndefined(items)) return;

      const _items = map(items, ({ balance: amount, resource: id }) => ({
        amount,
        id: new BigNumber(id, 16).toString(),
      }));
      const inventoryItems = map(_items, ({ id, amount }) => {
        const item = itemList.find(
          ({ itemId, category }) =>
            itemId === id &&
            (filter === category || !filter) &&
            category !== 'Rentals',
        );
        const inventoryItem = {
          ...item,
          amount,
          imageWidth: item && item.category === 'Packs' ? '75%' : null,
        };
        if (inventoryItem.itemId && Number(amount)) return inventoryItem;
      })
        .filter((item) => item)
        .sort((a, b) => Number(a?.itemId) - Number(b?.itemId));

      let col = 0;
      let row = 0;

      let points = Array(30)
        .fill(undefined)
        .map((_, index) => {
          const item: any = {
            i: String(index),
            x: col,
            y: row,
            w: 1,
            h: 1,
            static: true,
            data: undefined,
          };
          col++;
          if (col === 5) {
            col = 0;
            row++;
          }
          if (inventoryItems.length && inventoryItems.length >= index + 1) {
            item.data = inventoryItems[index];
          }
          return item;
        });
      setItems(points);
    })();
  }, [filter, onItems]);

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
        // @ts-ignore
        let claimedHeroes = heroes.filter(({ info: { nft_id } }) =>
          gachaClaimId.includes(nft_id),
        );
        let interval: any;
        while (isEmpty(claimedHeroes)) {
          interval = setInterval(async () => {
            const heroes = await onGetUserHeroList();
            if (!heroes) return;
            claimedHeroes = _.filter(heroes, ({ info: { nft_id } }) =>
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
          // @ts-ignore
          imageComponents,
        });
      }
      setOpenDialog(true);
    })();
  }, [gachaClaimId]);

  const handleClickOpen = (item: IItems) => {
    if (item.category === 'Packs') setOpen(true);
    const data = {
      title: item.name,
      subtitle: '',
      img: item.image,
      imageLabel: item.amount ? `X${item.amount}` : '',
      category: item.category,
      description: item.description,
    };
    setTotalPacks(Number(item.amount) >= 10 ? 10 : Number(item.amount));
    setDialogData(data);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setDialogData({
      title: '',
      subtitle: '',
      img: '',
      image: '',
      imageLabel: '',
    });
    setGetGachaHero(false);
    setClaimable(false);
    setOpenDialog(false);
  };

  const { onHeroCard } = useHeroCard();

  const onOpen = async (type: number, amount: number = 1) => {
    try {
      const bought = await onOpenGachaHero(vendorContract, type, amount);
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

  const CreateItem = ({ item }: { item: IItems }) => {
    return (
      <Box
        sx={{ position: 'relative', textAlign: 'center' }}
        onClick={() => handleClickOpen(item)}
      >
        <img
          style={{ objectFit: 'cover', cursor: 'pointer' }}
          width={item.imageWidth ? item.imageWidth : sm ? '100%' : '100%'}
          height={sm ? '100%' : '100%'}
          src={`${process.env.PUBLIC_URL + item.image}`}
          alt={item.name}
        />
        <Typography
          className="textshadow"
          fontSize={sm ? '14px' : md ? '18px' : lg ? '1.8em' : '1.8em'}
          sx={{
            color: 'text.primary',
            position: 'absolute',
            bottom: sm ? 0 : 2,
            right: sm ? 5 : 10,
          }}
        >
          {item.amount ? item.amount : ''}
        </Typography>
      </Box>
    );
  };

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

  const classes = useStyles();

  const [rowHeight, setRowHeight] = useState<number>(0);

  // set item height when screen width is changed
  useEffect(() => {
    const listener = () => {
      const items = document.getElementsByClassName(
        'react-grid-item',
      ) as HTMLCollectionOf<HTMLElement>;
      if (!items.length) return;
      // forEach(
      //   items,
      //   // @ts-ignore
      //   (item) => (item.style.height = sm ? 80 : md ? 130 : '16%'),
      // );
      const itemWidth = items[0].clientWidth;
      setRowHeight(itemWidth);
    };
    listener();
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [items]);

  return (
    <>
      {isEmpty(items) && (
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
      <Container className={classes.container}>
        <Box sx={{ mt: 0 }}>
          <Box className={classes.inventory}>
            <Box className={classes.potionButtonContainer}>
              <ButtonEffect
                className={`${classes.tabMenu} textshadow ${
                  filter === 'Packs' ? 'active' : null
                } ${classes.equipmentsButton}`}
                sx={{
                  color:
                    filter === 'Packs'
                      ? 'text.primary'
                      : 'rgba(255, 255, 255, 0.75)',
                }}
                onClick={() => {
                  if (filter === 'Packs') return setFilter(undefined);
                  setFilter('Packs');
                }}
                disableRipple
              >
                PACKS
              </ButtonEffect>
              <ButtonEffect
                className={`${classes.tabMenu} textshadow ${
                  filter === 'Shards' ? 'active' : null
                } ${classes.equipmentsButton}`}
                sx={{
                  color:
                    filter === 'Shards'
                      ? 'text.primary'
                      : 'rgba(255, 255, 255, 0.75)',
                }}
                onClick={() => {
                  if (filter === 'Shards') return setFilter(undefined);
                  setFilter('Shards');
                }}
                disableRipple
              >
                SHARDS
              </ButtonEffect>
              <ButtonEffect
                className={`${classes.tabMenu} textshadow ${
                  filter === 'Gems' ? 'active' : null
                } ${classes.othersButton}`}
                sx={{
                  color:
                    filter === 'Gems'
                      ? 'text.primary'
                      : 'rgba(255, 255, 255, 0.75)',
                }}
                onClick={() => {
                  if (filter === 'Gems') return setFilter(undefined);
                  setFilter('Gems');
                }}
                disableRipple
              >
                GEMS
              </ButtonEffect>
            </Box>
            <Box className={classes.scrollContainer}>
              <Box
                className={`scroll ${classes.scroll}`}
                sx={{
                  height: sm ? '180px' : md ? '280px' : '430px',
                }}
              >
                <GridLayout
                  className="layout"
                  layout={items}
                  cols={5}
                  width={sm ? 470 : md ? 680 : 1070}
                  rowHeight={rowHeight}
                >
                  {items.map((item: any) => (
                    <div className="item" key={item.i}>
                      {item?.data ? <CreateItem item={item.data} /> : false}
                    </div>
                  ))}
                </GridLayout>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          <Box className={classes.backButtonContainer}>
            <ButtonEffect
              className={`btn primary ${classes.backButton}`}
              sx={{
                color: 'text.primary',
              }}
              onClick={() => navigate('/game')}
              disableRipple
            >
              Back
            </ButtonEffect>
          </Box>
        </Grid>
      </Grid>
      <DialogItem
        open={openDialog}
        onClose={handleClose}
        amount={totalPacks}
        onOpen={onOpen}
        onClaim={onClaim}
        inventory={open}
        claimable={claimable}
        getGachaHero={getGachaHero}
        {...dialogData}
      />
    </>
  );
};

export default Inventory;
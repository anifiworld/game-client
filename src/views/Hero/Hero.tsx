import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { filter, forEach, isEmpty, map, reduce, startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useContract } from 'hooks/useContract';
import useHero from 'hooks/useHero';
import useHeroCard from 'hooks/useHeroCard';
import useGetHeroList from 'hooks/useHeroList';
import { ContractName } from 'utils/contractHelpers';
import { useAccount } from 'state/hooks';
import BoxEffect from 'components/BoxEffect';
import ButtonEffect from 'components/ButtonEffect';
import DialogItem from 'components/DialogViewItem';


interface IHero {
  id: string;
  image: any;
  select: boolean;
  name: string;
}

interface IRarity {
  id: string;
  name: string;
}

const Rarity: { [key: string]: number } = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legend: 5,
};

interface IHeroList {
  id: string | null;
  info: {
    nft_id: string;
    name?: string;
    lvl?: string;
    rarity?: IRarity;
    calculated_agi: number;
    calculated_aspd: number;
    calculated_atk: number;
    calculated_def: number;
    calculated_hp: number;
    calculated_int: number;
    calculated_matk: number;
    calculated_str: number;
    calculated_vit: number;
  };
}

interface IDialogData {
  title: string;
  subtitle: string;
  description: string;
  imageLabel?: string;
  image?: any;
  images?: any[];
}

const Heroes = {
  1: 'Iris',
  2: 'Kane',
  3: 'Venus',
  4: 'Hugo',
  5: 'Artemis',
  6: 'Loki',
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
    heroesText: {
      top: '14.2%',
      position: 'absolute',
      fontSize: xs ? '3vh' : '3vw',
      zIndex: 2,
    },
    cardHero: {
      position: 'absolute',
      top: '11%',
      marginTop: '0',
      paddintTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      width: '75%',
      height: '70%',
    },
    cardContent: {
      overflowY: 'scroll',
      position: 'relative',
      top: '1',
      left: '5%',
      width: '90%',
      height: '100%',
      paddingLeft: '0',
      paddingRight: '17px',
      paddingTop: '0',
      paddingBottom: '0',
      textAlign: 'center',
      color: '#8D1A39',
    },
    breakDownButton: {
      paddingLeft: '3%',
      paddingRight: '3%',
      paddingTop: '1%',
      paddingBottom: '1%',
      fontSize: xs ? '2.25vh' : '2.25vw',
    },
    backButton: {
      paddingLeft: '3%',
      paddingRight: '3%',
      paddingTop: '1%',
      paddingBottom: '1%',
      fontSize: xs ? '2.25vh' : '2.25vw',
      width: '18%',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
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
    cardMedia: {
      width: '100%',
      height: 'auto',
    },
  }),
);

const isTradable = (item: IHero) => item.id.length !== 29;

const Hero = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const [heroList, setHeroList] = useState<any>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogData, setDialogData] = useState<IDialogData>();
  const [openDialog, setOpenDialog] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  const [breakdownHiddenFreeHeroes, setBreakdownHiddenFreeHeroes] = useState(
    [],
  );

  const navigate = useNavigate();
  const { onDecomposeHero, onDecomposeHeroBatch } = useHero();
  const heroContract = useContract(ContractName.Hero);
  const account = useAccount();

  const onSelect = (index: number) => {
    if (!heroList.length) return;
    const newHero = [...heroList];
    newHero[index] = { ...newHero[index], select: !newHero[index].select };
    setHeroList(newHero);
    const selectedHeroes = newHero.filter((hero) => hero.select);
    setSelected(selectedHeroes.map((hero) => `0x${hero.id}`));
  };

  const handleDecomposeHero = async () => {
    if (!selected.length) return;
    if (selected.length === 1) {
      const hero = selected[0];
      const done = await onDecomposeHero(heroContract, hero);
      const selectedList = filter(heroList, ({ id }) =>
        selected.includes(`0x${id}`),
      );
      const { name, rarity } = selectedList[0];
      const dust = 2 ** (Rarity[rarity] - 1);
      const data = {
        title: '',
        subtitle: `Shards of ${name} x${dust}`,
        description: '',
        img: require(`../../assets/image/item/hero_dust/Dust-Character-${startCase(
          name,
        )}.png`).default,
        imageLabel: `x${dust}`,
      };
      setDialogData(data);
      return setOpenDialog(done);
    }
    const done = await onDecomposeHeroBatch(heroContract, selected);
    const selectedList = filter(heroList, ({ id }) =>
      selected.includes(`0x${id}`),
    );
    const rarities = map(selectedList, ({ name, rarity }) => ({
      name,
      rarity: Rarity[rarity],
    }));
    const dust = reduce(
      map(rarities, ({ rarity }) => rarity),
      (sum, rarity) => (sum += 2 ** (Number(rarity) - 1)),
      0,
    );
    const dustByHero: { [key: string]: number } = {};
    forEach(rarities, ({ name, rarity }: { name: string; rarity: number }) => {
      dustByHero[name] =
        (dustByHero[name] ? dustByHero[name] : 0) + 2 ** (Number(rarity) - 1);
    });
    const heroNames: string[] = map(selectedList, ({ name }) => name);
    const images = map(
      // @ts-ignore
      [...new Set(heroNames)],
      (heroName) =>
        require(`../../assets/image/item/hero_dust/Dust-Character-${startCase(
          heroName,
        )}.png`).default,
    );
    const data = {
      title: '',
      subtitle:
        images.length === 1
          ? `Shards of ${selectedList[0].name} x${dust}`
          : `Shards of heroes x${dust}`,
      description: '',
      imageLabels: images.length === 1 ? [dust] : Object.values(dustByHero),
      images,
    };
    setDialogData(data);
    setOpenDialog(done);
  };

  const onBreakdown = () => {
    if (!account) return;
    if (!breakdown) {
      const _breakdownHiddenFreeHeroes = heroList.filter(
        ({ id }: { id: string }) =>
          id.startsWith(account.split('0x')[1].toLowerCase()),
      );
      setBreakdownHiddenFreeHeroes(_breakdownHiddenFreeHeroes);
      const newHeroList = heroList.filter(
        ({ id }: { id: string }) =>
          !_breakdownHiddenFreeHeroes
            .map(({ id }: { id: string }) => id)
            .includes(id),
      );
      setHeroList(
        newHeroList.sort(
          (a: { id: any }, b: { id: any }) => Number(a.id) - Number(b.id),
        ),
      );
    }
    if (breakdown) {
      if (breakdownHiddenFreeHeroes.length) {
        setHeroList(
          [...heroList, ...breakdownHiddenFreeHeroes].sort(
            (a, b) => Number(a.id) - Number(b.id),
          ),
        );
        setBreakdownHiddenFreeHeroes([]);
      }
    }
    if (selected.length !== 0) {
      setHeroList(
        heroList
          .map((hero: IHero) => ({
            ...hero,
            select: false,
          }))
          .sort(
            (a: { id: any }, b: { id: any }) => Number(a.id) - Number(b.id),
          ),
      );
      handleDecomposeHero();
    }
    setSelected([]);
    setBreakdown(!breakdown);
  };

  const handleClose = () => {
    setOpenDialog(false);
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

  const { onHeroCard } = useHeroCard();
  const { onGetUserHeroList } = useGetHeroList();
  useEffect(() => {
    (async () => {
      const heroes = await onGetUserHeroList();
      if (!heroes || !heroes.length) return;
      const heroList = await Promise.all(
        heroes.map(
          async ({
            info: {
              nft_id,
              hero_type: { name },
              rarity: { name: rarity },
              ...rest
            },
          }: any) => ({
            id: nft_id,
            name,
            image: await onHeroCard({
              id: nft_id,
              name,
              loading: false,
              rarity,
              ...rest,
            }),
            rarity,
            select: false,
          }),
        ),
      );
      // @ts-ignore
      setHeroList(heroList.sort((a, b) => Number(a.id) - Number(b.id)));
    })();
    // eslint-disable-next-line
  }, [onGetUserHeroList, openDialog]);

  const classes = useStyles();
  return (
    <>
      {isEmpty(heroList) && (
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
      <Grid container rowSpacing={0}>
        <Grid item xs={12} className={classes.gridCard}>
          <Stack spacing={0} className={classes.stack}>
            <Typography
              className={`textshadow-secondary card-title ${classes.heroesText}`}
              gutterBottom
              sx={{
                color: 'text.primary',
              }}
            >
              {'Heroes'}
            </Typography>
            <Card className={`card-hero ${classes.cardHero}`} elevation={0}>
              <Box overflow="hidden" mt="10%" height="77%">
                <CardContent className={classes.cardContent}>
                  <Grid container columnSpacing={sm ? 1 : 2} rowSpacing={0}>
                    {heroList.map((item: IHero, index: number) => (
                      <Grid key={index} item xs={2}>
                        <BoxEffect
                          isHoverEffect={false}
                          key={index}
                          sx={{
                            opacity:
                              breakdown && isTradable(item) && !item.select
                                ? 0.5
                                : 1,
                            filter:
                              breakdown && !isTradable(item)
                                ? 'grayscale(100%)'
                                : '',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            breakdown && isTradable(item)
                              ? onSelect(index)
                              : !breakdown &&
                                navigate('/view-hero', {
                                  state: { id: item.id },
                                });
                          }}
                        >
                          {item.image}
                        </BoxEffect>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Box>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          <Box className={classes.buttonsContainer}>
            <ButtonEffect
              onClick={onBreakdown}
              className={`btn secondary ${classes.breakDownButton}`}
              disableRipple
              sx={{
                color: 'text.primary',
              }}
            >
              Break Down
            </ButtonEffect>
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
      <DialogItem
        selected={selected}
        open={openDialog}
        onClose={handleClose}
        {...dialogData}
      />
    </>
  );
};

export default Hero;
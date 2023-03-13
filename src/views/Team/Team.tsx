import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useHeroCard from 'hooks/useHeroCard';
import useGetHeroList from 'hooks/useHeroList';
import useGetHeroSlots from 'hooks/useHeroSlots';
import useGetPlayerInfo from 'hooks/usePlayerInfo';
import useUpdateHeroSlots from 'hooks/useUpdateHeroSlots';
import BoxEffect from 'components/BoxEffect';
import ButtonEffect from 'components/ButtonEffect';
import Carousel from 'components/shop/carousel';


interface IHero {
  id: string;
  image: any;
  select: boolean;
}

interface ISelectHero {
  hero: IHero | null;
  isLock: boolean;
}

const useStyles = makeStyles(({ xs }: { xs: boolean }) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setTeamContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    paddingTop: 0,
    paddingBottom: 0,
  },
  setTeam: {
    top: '12.5%',
    position: 'absolute',
    textAlign: 'center',
    cursor: 'default',
    fontSize: xs ? '3vh' : '3vw',
  },
  cardHeroSelect: {
    backgroundColor: '#000000',
    position: 'absolute',
    top: '20%',
    left: '9%',
    marginTop: '0',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '0',
    paddingRight: '0',
    width: '100%',
    height: '70%',
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContentHeroSelect: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    marginLeft: '0',
    marginRight: '0',
    paddingLeft: '0',
    paddingRight: '0',
    paddingTop: '0',
    paddingBottom: '0',
    textAlign: 'center',
    color: '#8D1A39',
  },
  heroSelectContainer: {
    marginTop: '0%',
    height: '30%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  rent: {
    color: '#FFD506',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: xs ? '2.5vh' : '2.5vw',
  },
  empty: {
    color: '#EA8021',
    textAlign: 'center',
    cursor: 'default',
    fontSize: xs ? '2.5vh' : '2.5vw',
  },
  cardMedia: {
    width: '100%',
    height: 'auto',
  },
  cardTeam: {
    position: 'absolute',
    top: '58%',
    paddingBottom: '0',
    width: '65%',
    height: '30%',
    marginTop: '0',
    paddingTop: '0',
    paddingLeft: '0',
    paddingRight: '0',
  },
  yourHero: {
    color: 'white',
    zIndex: 1,
    position: 'absolute',
    paddingBottom: 0,
    top: '12%',
    fontSize: xs ? '2.25vh' : '2.25vw',
  },
  yourHeroContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
  },
  cardTeamContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContentTeam: {
    paddingLeft: '0',
    paddingRight: '0',
    textAlign: 'center',
    marginTop: '10%',
    width: '100%',
    height: '30%',
    position: 'absolute',
  },
  buttonArrowLeft: {
    height: '40%',
    marginRight: '-30%',
  },
  buttonArrowLeftContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-1%',
  },
  heroCardMediaContainer: {
    backgroundColor: '#000000',
    marginTop: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 1,
  },
  heroCardMedia: {
    width: '100%',
    height: '100%',
  },
  addHeroCardMedia: {
    width: '100%',
    height: 'auto',
    cursor: 'pointer',
  },
  addHeroCardMediaContainer: {
    marginTop: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  buttonArrowRight: {
    height: '40%',
    marginLeft: '-30%',
  },
  buttonArrowRightContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
    marginTop: '-1%',
  },
  continueButton: {
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '1.5%',
    paddingButton: '1.5%',
    fontSize: xs ? '2.5vh' : '2.5vw',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  confirmButton: {
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
  footer: {
    left: '0%',
    top: '86%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    maringLeft: 'auto',
    maringRight: 'auto',
  },
}));

const Team = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));

  const { flag } = useParams<{ flag: string }>();
  const [heroSelect, setHeroSelect] = useState<ISelectHero[]>([
    {
      hero: null,
      isLock: false,
    },
    {
      hero: null,
      isLock: false,
    },
    {
      hero: null,
      isLock: false,
    },
    {
      hero: null,
      isLock: false,
    },
    {
      hero: null,
      isLock: false,
    },
  ]);
  const [heroList, setHeroList] = useState<any>([]);
  const [isHeroListLoaded, setIsHeroListLoaded] = useState(false);

  const navigate = useNavigate();

  const handleSelectCard = (item: IHero) => {
    const select = [...heroSelect];
    if (select.find(({ hero, isLock }) => hero === null && isLock === false)) {
      const index = select.findIndex(({ hero }) => hero === null);
      select[index].hero = item;
      setHeroSelect(select);
      const list = heroList.filter((hero: IHero) => hero.id !== item.id);
      setHeroList(list);
    }
  };

  const handleRemoveCard = (item: IHero) => {
    const select = [...heroSelect];
    const index = select.findIndex((select) => select?.hero?.id === item.id);
    setHeroSelect(select);
    const hero = select[index].hero;
    if (hero) setHeroList([...heroList, hero]);
    select[index].hero = null;
    select.splice(index, 1);
    select.splice(select.length - 1, 0, { hero: null, isLock: false });
  };

  const { onHeroCard } = useHeroCard();
  const { onGetUserHeroList } = useGetHeroList();
  const { onGetHeroSlots } = useGetHeroSlots();
  const { onUpdateHeroSlots } = useUpdateHeroSlots();
  const { onGetPlayerInfo } = useGetPlayerInfo();

  useEffect(() => {
    (async () => {
      const playerInfo = await onGetPlayerInfo();
      const heroSlots = await onGetHeroSlots();
      setIsHeroListLoaded(false);
      const heroes = await onGetUserHeroList();
      setIsHeroListLoaded(true);
      let select = [...heroSelect];
      let heroList = [];
      let slots: any = [];

      let heroSlotData = Object.fromEntries(
        Object.entries(heroSlots).filter(([_, v]) => v != null),
      );
      if (heroSlots) {
        await Promise.allSettled(
          Object.values(heroSlotData).map(
            async (
              {
                info: {
                  nft_id,
                  hero_type: { name },
                  rarity: { name: rarity },
                  ...rest
                },
              }: any,
              index,
            ) => {
              const heroSlot = {
                id: nft_id,
                image: await onHeroCard({
                  id: nft_id,
                  name,
                  loading: false,
                  rarity,
                  ...rest,
                }),
                select: false,
              };
              slots.push(heroSlot);
              select[index].hero = heroSlot;
            },
          ),
        );
      }
      if (heroes.length > 0) {
        for (const {
          info: {
            nft_id,
            hero_type: { name },
            rarity: { name: rarity },
            ...rest
          },
        } of heroes) {
          let select = slots.some((s: any) => s.id === nft_id);
          if (!select) {
            heroList.push({
              id: nft_id,
              image: await onHeroCard({
                id: nft_id,
                name,
                loading: false,
                rarity,
                ...rest,
              }),
              select: false,
            });
          }
        }
      }
      // if (playerInfo) {
      //   select[heroSelect.length - 1].isLock = !playerInfo.is_hero_slot5_active;
      // }
      setHeroSelect(select);
      setHeroList(heroList);
    })();
    // eslint-disable-next-line
  }, [onGetUserHeroList, onGetHeroSlots, onGetPlayerInfo]);

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

  const cardRef = useRef();
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    if (cardRef && cardRef.current) {
      // @ts-ignore
      setTranslateX(cardRef.current.width + 8);
    }
  }, [cardRef]);

  const classes = useStyles({ xs });

  const handleConfirm = async () => {
    let results: any = {};
    heroSelect.forEach((hero, index) => {
      results[`slot${index + 1}`] = hero.hero ? hero.hero.id : null;
    });

    const response = await onUpdateHeroSlots(results);
    if (response && response.status === 200) {
      navigate('/game');
    }
  };

  return (
    <React.Fragment>
      {!isHeroListLoaded && (
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
      <Grid container sx={{ mt: 0 }}>
        <Grid item xs={12} className={classes.setTeamContainer}>
          <Typography
            className={`textshadow ${classes.setTeam}`}
            gutterBottom
            component="div"
            sx={{
              color: 'text.primary',
            }}
          >
            Set Team
          </Typography>
        </Grid>
      </Grid>
      <Grid container className={classes.container}>
        <Grid item xs={12} className={classes.gridItem}>
          <Stack spacing={0} justifyContent="center" alignItems="center">
            <Card className={classes.cardHeroSelect} elevation={0}>
              <CardContent className={classes.cardContentHeroSelect}>
                <Grid container columnSpacing={2}>
                  {heroSelect?.map(
                    (
                      item: {
                        hero: IHero | null;
                        isLock: boolean;
                      },
                      index,
                    ) => (
                      <Grid key={index} item xs={2}>
                        <BoxEffect
                          isHoverEffect={false}
                          className={classes.heroSelectContainer}
                          onClick={() => {
                            if (item.hero) return handleRemoveCard(item.hero);
                            if (item.isLock) return navigate('/shop');
                          }}
                        >
                          <div
                            className="card-text-team"
                            style={{
                              visibility: item.isLock ? 'initial' : 'hidden',
                            }}
                          >
                            <img
                              alt="lock"
                              width={sm ? 20 : 40}
                              src={
                                require('../../assets/image/639c269e68182d5f124a2916c0351a01.png')
                                  .default
                              }
                            ></img>
                            <Typography
                              className={`textshadow ${classes.rent}`}
                              gutterBottom
                              component="div"
                            >
                              Rent
                            </Typography>
                          </div>
                          <div
                            className="card-text-team"
                            style={{
                              visibility: item.isLock
                                ? 'hidden'
                                : !item.hero
                                ? 'initial'
                                : 'hidden',
                            }}
                          >
                            <Typography
                              className={`textshadow ${classes.empty}`}
                              gutterBottom
                              component="div"
                            >
                              Empty
                            </Typography>
                          </div>
                          {item.hero ? (
                            item.hero.image
                          ) : (
                            <CardMedia
                              component="img"
                              image={
                                require('../../assets/image/ui/1c082fe84500487a94f3d60d47a43c61.png')
                                  .default
                              }
                              className={classes.cardMedia}
                            />
                          )}
                        </BoxEffect>
                      </Grid>
                    ),
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      <Grid container rowSpacing={0}>
        <Grid item xs={12} className={classes.cardTeamContainer}>
          <Card className={`card-team ${classes.cardTeam}`} elevation={0}>
            <Box className={classes.yourHeroContainer}>
              <Typography
                className={`textshadow-secondary ${classes.yourHero}`}
                gutterBottom
              >
                {'Your Hero'}
              </Typography>
            </Box>
            <CardContent className={classes.cardContentTeam}>
              <Grid container justifyContent="center">
                <Grid item xs={10}>
                  <Carousel
                    show={12}
                    leftArrowStyle={{
                      top: '45%',
                      left: '-42px',
                      width: '62px',
                      height: '45%',
                    }}
                    rightArrowStyle={{
                      top: '45%',
                      right: '-70px',
                      width: '62px',
                      height: '45%',
                    }}
                    itemsContainerStyle={{
                      columnGap: '8px',
                      width: '89%',
                    }}
                    translateX={translateX}
                  >
                    {heroList?.map(
                      (item: IHero, index: number) => (
                        // item.type === 'add-hero' ? (
                        <Grid key={index} item xs={1}>
                          <BoxEffect
                            isHoverEffect={false}
                            className={classes.addHeroCardMediaContainer}
                            onClick={() => handleSelectCard(item)}
                          >
                            {item.image}
                          </BoxEffect>
                        </Grid>
                      ),
                      // )
                      // : (
                      //   <Grid key={index} item xs={1}>
                      //     <Box
                      //       onClick={() => onSetHero(item, index)}
                      //       key={index}
                      //       className={classes.heroCardMediaContainer}
                      //     >
                      //       <CardMedia
                      //         // @ts-ignore
                      //         ref={index === 0 ? cardRef : null}
                      //         className={classes.heroCardMedia}
                      //         component="img"
                      //         image={item.image}
                      //         alt={item.name}
                      //       />
                      //     </Box>
                      //   </Grid>
                      // ),
                    )}
                  </Carousel>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container className={classes.footer}>
        <Grid item xs={12} className={classes.buttonContainer}>
          {flag === 'new' ? (
            <ButtonEffect
              className={`btn disabled ${classes.continueButton}`}
              disableRipple
            >
              Continue
            </ButtonEffect>
          ) : (
            <Box className={classes.buttonsContainer}>
              <ButtonEffect
                className={`btn secondary ${classes.confirmButton}`}
                disableRipple
                sx={{
                  color: 'text.primary',
                }}
                onClick={handleConfirm}
              >
                Confirm
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
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Team;
import { Box, Card, CardContent, Grid, Stack, Typography, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import assets from 'constants/GameAssets';
import _, { find, forEach, isNull, startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useContract } from 'hooks/useContract';
import useGetGemSlots from 'hooks/useGemSlots';
import useHeroCard from 'hooks/useHeroCard';
import useGetHeroList from 'hooks/useHeroList';
import useItems from 'hooks/useItems';
import useGetPlayerInfo from 'hooks/usePlayerInfo';
import useUpgradeHero from 'hooks/useUpgradeHero';
import useGetUserGemList from 'hooks/useUserGemList';
import { ContractName } from 'utils/contractHelpers';
import ButtonEffect from 'components/ButtonEffect';
import FlexBox from 'components/FlexBox';
import ModalConfirm from 'components/ModalConfirm';
import ModalConfirmEquipment from 'components/ModalConfirmEquipment';
import ModalSelectGems from 'components/ModalSelectGems';
import { useAccount } from '../../state/hooks';


const Rarity: { [key: string]: number } = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legend: 5,
};

const characters: { [key: string]: { webm: string; png: string } } = {
  Iris: {
    webm: require('../../assets/video/hero/mar.webm').default,
    png: require('../../assets/image/hero/d9d28d3442e397718faec0f1941aa62f.png')
      .default,
  },
  Kane: {
    webm: require('../../assets/video/hero/cha_red.webm').default,
    png: require('../../assets/image/hero/kane.png').default,
  },
  Venus: {
    webm: require('../../assets/video/hero/exam.webm').default,
    png: require('../../assets/image/hero/4d3845cc415748c6186a475a9ea241ab.png')
      .default,
  },
  Hugo: {
    webm: require('../../assets/video/hero/greenboy.webm').default,
    png: require('../../assets/image/hero/529b68e49f4acb3ed74de04df835338e.png')
      .default,
  },
  Artemis: {
    webm: require('../../assets/video/hero/brown.webm').default,
    png: require('../../assets/image/hero/38913b9b4451c0ccc70816fc31c71a0a.png')
      .default,
  },
  Loki: {
    webm: require('../../assets/video/hero/loki.webm').default,
    png: require('../../assets/image/hero/f109b990b11469adb82a981151ab5d83.png')
      .default,
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
    heroText: {
      top: '12.6%',
      position: 'absolute',
      fontSize: xs ? '2vh' : '2vw',
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
    cardContentLeft: {
      position: 'absolute',
      left: '6%',
      top: '17%',
      width: '40%',
      height: '67%',
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0',
      textAlign: 'center',
      color: '#8D1A39',
    },
    cardContentRight: {
      position: 'absolute',
      right: '8%',
      top: '17%',
      width: '38%',
      height: '67%',
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '0',
      paddingBottom: '0 !important',
      textAlign: 'center',
      color: '#8D1A39',
    },
    gridContent: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    heroContainer: {
      width: '60%',
    },
    heroContent: {
      display: 'flex',
      position: 'relative',
      marginLeft: '2%',
      marginRight: '2%',
      height: '100%',
    },
    heroStageImage: {
      objectFit: 'cover',
      position: 'absolute',
      zIndex: '1',
      bottom: '5%',
      left: '0%',
    },
    heroImage: {
      objectFit: 'cover',
      zIndex: 2,
      position: 'absolute',
      bottom: '18%',
      left: '10%',
    },
    heroDetail: {
      width: '40%',
      display: 'flex',
      paddingTop: '6%',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    topic: {
      color: '#FFD506',
      fontSize: xs ? '1.5vh' : '1.5vw',
      paddingLeft: '6%',
    },
    topicBottom: {
      color: '#FFD506',
      fontSize: xs ? '1.5vh' : '1.5vw',
      paddingLeft: '6%',
      marginRight: '30%',
    },
    label: {
      fontSize: xs ? '1.5vh' : '1.5vw',
    },
    name: {
      paddingLeft: '6%',
      paddingBottom: '4%',
      fontSize: xs ? '2.5vh' : '2.5vw',
      lineHeight: 'normal',
    },
    starContainer: {
      paddingLeft: '6%',
      display: 'flex',
      justifyContent: 'flex-start',
      width: '100%',
    },
    star: {
      paddingRight: '4%',
    },
    detailBottom: {
      marginTop: '22%',
    },
    confirmButton: {
      fontSize: xs ? '1vh' : '1vw',
    },
    modalText: {
      fontSize: xs ? '1.8vh' : '1.8vw',
    },
    successText: {
      color: '#FFD506',
      fontSize: xs ? '2.25vh' : '2.25vw',
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

const skills: {
  [key: string]: {
    name: string;
    description: string;
  };
} = {
  iris: {
    name: 'Magical guns',
    description: 'Damage 150% to the 2 nearest enemies',
  },
  kane: {
    name: 'Bash',
    description: 'Damage 200% to the 1 nearest enemies',
  },
  venus: {
    name: 'Deflect Force',
    description:
      'Block 1 time of attack and reflect the damage to the attacking enemy',
  },
  hugo: {
    name: 'Heal',
    description: 'Recover HP to the 1 lowest HP hero',
  },
  artemis: {
    name: 'Arrow Storm',
    description: 'Damage 100% to all enemies',
  },
  loki: {
    name: 'Darkness Fields',
    description:
      'Create darkness field to damage 100% to all enemies and stun all enemies to stop attacking 1 time',
  },
};

const BoxDetail = (props: {
  title?: string;
  children?: any;
  height?: string;
  style?: any;
  gutterBottom?: boolean;
  transparent?: boolean;
  xs?: boolean;
  sm?: boolean;
}) => {
  return (
    <FlexBox
      style={props.style}
      // @ts-ignore
      css={`
        width: 100%;
        height: ${props.height}%;
        position: relative;
        background: ${props.transparent ? 'transparent' : '#F9E3CB'};
        border: ${props.sm && !props.transparent
          ? '1px solid #E9C19D'
          : props.transparent
          ? 'transparent'
          : '2px solid #E9C19D'};
        border-radius: 10px;
        padding: 10%;
        padding-top: ${props.gutterBottom && props.sm
          ? '7%'
          : props.gutterBottom && !props.sm
          ? '6%'
          : '12%'};
        padding-bottom: 0;
        box-sizing: border-box;
      `}
    >
      <FlexBox
        // @ts-ignore
        css={`
          position: absolute;
          background-color: #b2622b;
          border: none;
          border-radius: 20px;
          width: ${props.title === 'Equipment' ? '32%' : '65%'};
          top: ${props.sm ? '-8px' : '-13px'};
          left: ${props.title === 'Equipment' ? '4%' : '6%'};
          padding-bottom: ${props.title === 'Equipment' ? '0.5%' : '1%'};
          padding-top: ${props.title === 'Equipment' ? '0.5%' : '1%'};
        `}
      >
        <Typography
          className={'border-sub-secondary-sm'}
          sx={{
            color: 'text.primary',
            fontSize: props.xs ? '1vh' : '1vw',
          }}
        >
          {props.title}
        </Typography>
      </FlexBox>
      {props.children}
    </FlexBox>
  );
};

const MetaDetail = (props: {
  title: string;
  label: string;
  gutterBottom?: boolean;
  xs?: boolean;
  sm?: boolean;
}) => {
  return (
    <FlexBox
      // @ts-ignore
      css={`
        flex-direction: row;
        margin-bottom: ${props.gutterBottom ? '0px' : '6%'};
      `}
    >
      <Typography
        className={'border-sub-secondary-sm'}
        sx={{
          color: '#FFD506',
          fontSize: props.xs ? '1vh' : '1vw',
          width: '50%',
          textAlign: 'left',
        }}
      >
        {props.title}
      </Typography>
      <Typography
        sx={{
          color: '#AF6731',
          fontSize: props.xs ? '1vh' : '1vw',
        }}
      >
        {props.label}
      </Typography>
    </FlexBox>
  );
};

const MetaItem = (props: {
  source?: string;
  label?: string;
  isLock?: boolean;
  xs?: boolean;
  sm?: boolean;
  onClickItem?: () => void;
}) => {
  return (
    <FlexBox
      onClick={props.onClickItem}
      // @ts-ignore
      css={`
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: ${props.sm ? '3px' : '5px'};
        cursor: pointer;
      `}
    >
      <FlexBox
        // @ts-ignore
        css={`
          border-radius: 25%;
          border: ${props.sm ? '1px solid #E9C19D' : '2px solid #E9C19D'};
          background: #f9e3cb;
          width: 2.5vw;
          height: 2.5vw;
          box-sizing: border-box;
          margin-right: 10px;
          justify-content: center;
          align-items: center;
        `}
      >
        {props.isLock ? (
          <img
            src={require('../../assets/image/ui/lock.png').default}
            width={'60%'}
            alt={''}
          />
        ) : (
          props.source && <img src={props.source} alt={''} width={'100%'} />
        )}
      </FlexBox>
      <Typography
        className={'border-sub-secondary-sm'}
        sx={{
          color: 'text.primary',
          fontSize: props.xs ? '1vh' : '1vw',
        }}
      >
        {props.label}
      </Typography>
    </FlexBox>
  );
};

interface IGem {
  id: string;
  name: string;
  hero: string | null;
  source: string;
  nft_id: string;
  level_needed: boolean;
  attribute: {
    name: string;
  };
  attribute_value: number;
  attribute_is_percentage: boolean;
}

interface IGemList {
  id: number;
  gem?: IGem;
  gem_slot: number;
  hero?: string;
  source: string;
}

type ISelectGem = {
  [key: string]: {
    id: number;
    gem_slot: number;
    gem: IGem | null;
    hero: string;
  } | null;
};

const ViewHero = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { state } = useLocation();
  const [hero, setHero] = useState<any>();
  const [shards, setShards] = useState();
  const [cost, setCost] = useState(0);
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [shardImage, setShardImage] = useState('');
  const [emptyBox, setEmptyBox] = useState<JSX.Element[]>([]);
  const [showModalSelectGem, setShowModalSelectGem] = useState<boolean>(false);
  const [showModalConfirmEquipment, setShowModalConfirmEquipment] =
    useState<boolean>(false);
  const [slot, setSlot] = useState<number | null>(null);
  const [gemSlot, setGemSlot] = useState<ISelectGem>({
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
    slot5: null,
  });
  const [equipment, setEquipment] = useState<JSX.Element[]>([]);
  const [gemList, setGemList] = useState<IGemList[] | []>([]);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const heroContract = useContract(ContractName.Hero);
  const { onUpgradeHero } = useUpgradeHero();
  const { onGetUserHeroList } = useGetHeroList();
  const { id } = state as { id: string };

  const navigate = useNavigate();
  const classes = useStyles();

  const { onGetGemSlots } = useGetGemSlots();
  const { onGetPlayerInfo } = useGetPlayerInfo();
  const { onGetUserGemList } = useGetUserGemList();
  const { onItems } = useItems();
  const { onHeroCard } = useHeroCard();
  const account = useAccount();

  const handleUpgradeHero = async (id: string) => {
    setUpgrading(true);
    const upgraded = await onUpgradeHero(
      heroContract,
      new BigNumber(id, 16).toString(),
    );
    setUpgraded(upgraded);
    setUpgrading(false);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      const heroes = await onGetUserHeroList();
      const items = await onItems();
      const _hero: any = find(
        heroes,
        ({ info: { nft_id } }: { info: { nft_id: string } }) => nft_id === id,
      );
      const shard = assets.shards.find((shard) => {
        return shard.name.includes(startCase(_hero.info.hero_type.name));
      });
      const shardImage = shard?.image;
      const shards = find(
        items,
        ({ resource: itemId }) =>
          new BigNumber(itemId, 16).toString() === shard?.id,
      )?.balance;
      const cost = 2 ** _hero.info.rank.value * Rarity[_hero.info.rarity.name];
      setShards(shards);
      setShardImage(shardImage || '');
      setCost(cost);
      
      const hero = {
        name: _hero.info.hero_type.name,
        rarity: _hero.info.rarity.name,
        star: _hero.info.rank.value,
        level: _hero.info.level,
        class: _hero.info.hero_type.hero_class,
        exp: _hero.info.exp,
        currentExp: _hero.info.current_exp,
        needExp: _hero.info.need_exp,
        attributes: {
          hp: _hero.info.calculated_hp,
          atk: _hero.info.calculated_atk,
          matk: _hero.info.calculated_matk,
          def: _hero.info.calculated_def,
          aspd: _hero.info.calculated_aspd,
        },
        status: {
          str: _hero.info.calculated_str,
          int: _hero.info.calculated_int,
          vit: _hero.info.calculated_vit,
          agi: _hero.info.calculated_agi,
        },
        skill: {
          name: skills[_hero.info.hero_type.name].name,
          description: skills[_hero.info.hero_type.name].description,
        },
        webm: characters[_.startCase(_hero.info.hero_type.name)].webm,
        image: characters[_.startCase(_hero.info.hero_type.name)].png,
        style: {
          width: '77%',
        },
      };
      setHero(hero);
    })();
    // eslint-disable-next-line
  }, [upgraded, showModalConfirmEquipment]);

  useEffect(() => {
    setIsSuccess(upgraded);
    // eslint-disable-next-line
  }, [hero]);

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
    if (_.isEmpty(hero)) return;
    const max = 5;
    const emptyBox = [];
    for (let i = 0; i < max - hero.star; i++) {
      emptyBox.push(
        <img
          key={i}
          src={require('../../assets/image/ui/star-bg.png').default}
          alt={''}
          width="15%"
        />,
      );
    }
    setEmptyBox(emptyBox);
    // eslint-disable-next-line
  }, [hero]);

  const handleClose = () => {
    setShowModal(false);
    setIsSuccess(false);
    setUpgraded(false);
  };

  useEffect(() => {
    (async () => {
      const gemSlots = await onGetGemSlots(id);
      const _gemSlots = {};
      forEach(gemSlots, (gem, i) => {
        // @ts-ignore
        const _gem = (_gemSlots[i] = { gem });
        if (isNull(gem)) return;
        const source = find(
          itemList,
          ({ itemId, category }) =>
            category === 'Gems' &&
            itemId === new BigNumber(gem.nft_id, 16).toString(),
        )?.image;
        // @ts-ignore
        _gemSlots[i] = { ..._gem, source };
      });
      setGemSlot(_gemSlots);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let items: any = [];
      const playerInfo = await onGetPlayerInfo();
      if (!hero) return;
      Object.values(gemSlot).forEach(async (gem, i) => {
        const slot = i + 1;
        const lock =
          hero &&
          (slot === 2 && parseInt(hero.level) < 10
            ? true
            : slot === 3 && parseInt(hero.level) < 20
            ? true
            : slot === 4 && parseInt(hero.level) < 30
            ? true
            : slot === 5 && !playerInfo.is_gem_slot5_active
            ? true
            : false);
        let name = '';
        if (slot === 2 && hero && parseInt(hero.level) < 20) {
          name = 'Unlock lv 10';
        } else if (slot === 3 && hero && parseInt(hero.level) < 20) {
          name = 'Unlock lv 20';
        } else if (slot === 4 && hero && parseInt(hero.level) < 30) {
          name = 'Unlock lv 30';
        } else if (slot === 5 && !playerInfo.is_gem_slot5_active) {
          name = 'Rental Slot';
        } else if (!gem?.gem) {
          name = 'Empty';
        } else {
          name = gem?.gem?.name || '';
        }
        // @ts-ignore
        const source = gem?.source || '';
        items.push(
          <MetaItem
            key={slot}
            sm={sm}
            label={name}
            source={source}
            onClickItem={() => handleSelectGem(slot, lock)}
            isLock={lock}
          />,
        );
      });
      setEquipment(items);
    })();
  }, [gemSlot, assets, hero]);

  useEffect(() => {
    (async () => {
      const gemList = await onGetUserGemList();
      // @ts-ignore
      const availableGems = [];
      await forEach(
        gemList,
        ({ resource: { nft_id, ...rest }, balance: amount }) => {
          for (let i = 0; i < amount; i++) {
            availableGems.push({
              gem: {
                nft_id: new BigNumber(nft_id, 16).toString(),
                ...rest,
              },
            });
          }
        },
      );
      await forEach(
        // @ts-ignore
        availableGems,
        (gem) =>
          // @ts-ignore
          (gem['source'] = find(
            itemList,
            ({ itemId, category }) =>
              category === 'Gems' && itemId === gem.gem.nft_id,
          )?.image),
      );
      // @ts-ignore
      setGemList(availableGems);
    })();
  }, []);
  
  const handleSelectGem = (slot: number, isLock: boolean) => {
    if (isLock) return;
    setShowModalSelectGem(true);
    setSlot(slot);
  };

  if (_.isEmpty(hero)) return (
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
  );

  return (
    <>
      <Grid container rowSpacing={0}>
        <Grid item xs={12} className={classes.gridCard}>
          <Stack spacing={0} className={classes.stack}>
            <Typography
              className={`textshadow-secondary card-title ${classes.heroText}`}
              gutterBottom
              sx={{
                color: 'text.primary',
              }}
            >
              {'Hero'}
            </Typography>

            <Card
              className={`card-view-hero ${classes.cardHero}`}
              elevation={0}
            >
              <CardContent className={classes.cardContentLeft}>
                <Box className={classes.gridContent}>
                  <Box className={classes.heroContainer}>
                    <Box className={classes.heroContent}>
                      <img
                        src={
                          require('../../assets/image/ui/chara-stage.png')
                            .default
                        }
                        alt={hero.name}
                        width="100%"
                        className={classes.heroStageImage}
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
                          ...hero.style,
                        }}
                        // poster={hero.image}
                      >
                        <source src={hero.webm} type="video/mp4" />
                        <img
                          alt={'hero'}
                          src={hero.image}
                          title="Your browser does not support the video tag."
                        />
                      </video>
                    </Box>
                  </Box>
                  <Box className={classes.heroDetail}>
                    <Typography
                      className={`border-sub-secondary-sm ${classes.topic}`}
                      component="div"
                    >
                      {hero.rarity}
                    </Typography>
                    <Typography
                      className={`border-sub-secondary-sm ${classes.name}`}
                      component="div"
                      sx={{
                        color: 'text.primary',
                        paddingLeft: '6%',
                      }}
                    >
                      {hero.name}
                    </Typography>
                    <Box className={classes.starContainer}>
                      {[...Array(Number(hero.star))].map((a, index) => {
                        return (
                          <img
                            key={index}
                            src={
                              require('../../assets/image/ui/star.png').default
                            }
                            alt={''}
                            width="15%"
                            className={classes.star}
                          />
                        );
                      })}
                    </Box>

                    <Box className={classes.detailBottom}>
                      <FlexBox
                        // @ts-ignore
                        css={`
                          flex-direction: row;
                          padding-left: 6%;
                        `}
                      >
                        <Typography
                          className={`border-sub-secondary-sm ${classes.topicBottom}`}
                          component="div"
                        >
                          Level
                        </Typography>
                        <Typography
                          className={`border-sub-secondary-sm ${classes.label}`}
                          component="div"
                          sx={{
                            color: 'text.primary',
                          }}
                        >
                          {hero && hero.level}
                        </Typography>
                      </FlexBox>
                      <FlexBox
                        // @ts-ignore
                        css={`
                          flex-direction: row;
                          padding-left: 6%;
                        `}
                      >
                        <Typography
                          className={`border-sub-secondary-sm ${classes.topicBottom}`}
                          component="div"
                        >
                          Class
                        </Typography>
                        <Typography
                          className={`border-sub-secondary-sm ${classes.label}`}
                          component="div"
                          sx={{
                            color: 'text.primary',
                          }}
                        >
                          {hero.class}
                        </Typography>
                      </FlexBox>
                      <FlexBox
                        // @ts-ignore
                        css={`
                          padding-left: 6%;
                          align-items: flex-start;
                        `}
                      >
                        <Typography
                          className={`border-sub-secondary-sm ${classes.topic}`}
                          component="div"
                        >
                          Exp
                        </Typography>
                        <Typography
                          className={`border-sub-secondary-sm ${classes.label}`}
                          component="div"
                          sx={{
                            color: 'text.primary',
                            paddingLeft: '6%',
                          }}
                        >
                          {`${hero.currentExp} / ${hero.needExp}`}
                        </Typography>
                      </FlexBox>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
              <CardContent className={classes.cardContentRight}>
                <Grid
                  container
                  columnSpacing={sm ? 1 : 2}
                  rowSpacing={0}
                  style={{ height: '50%' }}
                >
                  <Grid item xs={6}>
                    <BoxDetail
                      title={'Attributes'}
                      height={sm ? '102' : '100'}
                      xs={xs}
                      sm={sm}
                    >
                      <MetaDetail
                        xs={xs}
                        sm={sm}
                        title={'Hp :'}
                        label={hero.attributes.hp}
                      />
                      <MetaDetail
                        xs={xs}
                        sm={sm}
                        title={'Atk :'}
                        label={hero.attributes.atk}
                      />
                      <MetaDetail
                        xs={xs}
                        sm={sm}
                        title={'Matk :'}
                        label={hero.attributes.matk}
                      />
                      <MetaDetail
                        xs={xs}
                        sm={sm}
                        title={'Def :'}
                        label={hero.attributes.def}
                      />
                      <MetaDetail
                        xs={xs}
                        sm={sm}
                        title={'Aspd :'}
                        label={hero.attributes.aspd}
                      />
                    </BoxDetail>
                  </Grid>
                  <Grid item xs={6}>
                    <BoxDetail
                      gutterBottom
                      title={'Status'}
                      xs={xs}
                      sm={sm}
                      height={sm ? '58' : '55'}
                      style={{
                        marginBottom: sm ? '7%' : '8%',
                      }}
                    >
                      <MetaDetail
                        xs={xs}
                        sm={sm}
                        title={'Str :'}
                        label={hero.status.str}
                        gutterBottom
                      />
                      <MetaDetail
                        xs={xs}
                        sm={sm}
                        title={'Int :'}
                        label={hero.status.int}
                        gutterBottom
                      />
                      <MetaDetail
                        xs={xs}
                        sm={sm}
                        title={'Vit :'}
                        label={hero.status.vit}
                        gutterBottom
                      />
                      <MetaDetail
                        xs={xs}
                        sm={sm}
                        title={'Agi :'}
                        label={hero.status.agi}
                        gutterBottom
                      />
                    </BoxDetail>
                    <BoxDetail
                      title={'Skill'}
                      height={'40'}
                      style={{
                        paddingTop: '8%',
                      }}
                      xs={xs}
                      sm={sm}
                    >
                      <Typography
                        className={'border-sub-secondary-sm'}
                        sx={{
                          color: '#FFD506',
                          fontSize: xs ? '1vh' : '1vw',
                          textAlign: 'left',
                        }}
                      >
                        {hero.skill.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#AF6731',
                          fontSize: xs ? '0.75vh' : '0.75vw',
                          textAlign: 'left',
                        }}
                      >
                        {hero.skill.description}
                      </Typography>
                    </BoxDetail>
                  </Grid>
                </Grid>
                <Grid
                  container
                  columnSpacing={sm ? 1 : 2}
                  rowSpacing={0}
                  style={{ height: '50%' }}
                >
                  <Grid item xs={12}>
                    <BoxDetail
                      transparent
                      title={'Equipment'}
                      xs={xs}
                      sm={sm}
                      height={'60'}
                      style={{
                        marginTop: '7%',
                        flexWrap: 'wrap',
                        paddingLeft: '3%',
                        paddingTop: '5%',
                        columnGap: '5%',
                      }}
                    >
                      {equipment}
                    </BoxDetail>
                    <FlexBox
                      // @ts-ignore
                      css={`
                        width: 100%;
                        position: absolute;
                        bottom: ${xs ? '-5%' : '-3%'};
                        align-items: center;
                      `}
                    >
                      <ButtonEffect
                        onClick={() => setShowModalConfirmEquipment(true)}
                        className={`btn-confirm ${classes.confirmButton}`}
                        sx={{
                          color: 'text.primary',
                        }}
                      >
                        Confirm Equipment
                      </ButtonEffect>
                    </FlexBox>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          <Box
            className={classes.buttonsContainer}
            style={{
              justifyContent: hero.star >= 5 ? 'flex-end' : '',
            }}
          >
            {hero.star < 5 && (
              <ButtonEffect
                onClick={() => setShowModal(true)}
                className={`btn secondary ${classes.breakDownButton}`}
                disableRipple
                sx={{
                  color: 'text.primary',
                }}
                disabled={Boolean(
                  account &&
                    id.startsWith(account.split('0x')[1].toLowerCase()),
                )}
              >
                Rank Up
              </ButtonEffect>
            )}
            <ButtonEffect
              className={`btn primary ${classes.backButton}`}
              onClick={() => navigate('/hero')}
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
      <ModalConfirm
        show={showModal}
        success={isSuccess}
        isLoading={upgrading}
        onConfirm={() => handleUpgradeHero(id)}
        disabledConfirm={
          !id ||
          _.isUndefined(shards) ||
          Number(shards) < cost ||
          upgrading ||
          id.startsWith('83f8f6836f31992db89643cba19682170e98ed3c')
        }
        onClose={handleClose}
        title={'Rank Level Up'}
      >
        <FlexBox
          // @ts-ignore
          css={`
            flex-direction: row;
            justify-content: space-around;
          `}
        >
          {[...Array(Number(hero.star))].map((a, index) => {
            return (
              <img
                key={index}
                src={require('../../assets/image/ui/star.png').default}
                alt={''}
                width="15%"
              />
            );
          })}
          {emptyBox}
        </FlexBox>
        {isSuccess ? (
          <FlexBox
            // @ts-ignore
            css={`
              align-items: center;
              margin-top: 3%;
            `}
          >
            <Typography
              className={`border-sub-secondary-sm ${classes.successText}`}
              component="div"
            >
              Successful
            </Typography>
          </FlexBox>
        ) : (
          <FlexBox>
            <FlexBox
              // @ts-ignore
              css={`
                flex-direction: row;
                justify-content: center;
                align-items: center;
              `}
            >
              <>
                <Typography
                  className={`border-sub-secondary-sm ${classes.modalText}`}
                  component="div"
                  sx={{
                    color: 'text.primary',
                  }}
                >
                  Cost
                </Typography>
                <img src={shardImage} alt={''} width={'15%'} />
                <Typography
                  className={`border-sub-secondary-sm ${classes.modalText}`}
                  component="div"
                  sx={{
                    color: '#FFD506',
                  }}
                >
                  {`x${cost}`}
                </Typography>
              </>
            </FlexBox>
            <Typography
              component="div"
              sx={{
                color: '#7B359B',
                textAlign: 'center',
                fontSize: xs ? '1.3vh' : '1.3vw',
              }}
            >
              {`Available ${shards ? shards : '0'} ea`}
            </Typography>
          </FlexBox>
        )}
      </ModalConfirm>
      <ModalSelectGems
        onClose={() => setShowModalSelectGem(false)}
        show={showModalSelectGem}
        // @ts-ignore
        data={gemList}
        // @ts-ignore
        setData={setGemList}
        setGemSlot={setGemSlot}
        // @ts-ignore
        gemSlot={gemSlot}
        slot={slot}
        setSlot={() => setSlot(null)}
        hero={hero}
      />
      <ModalConfirmEquipment
        id={id}
        onClose={() => setShowModalConfirmEquipment(false)}
        show={showModalConfirmEquipment}
        // @ts-ignore
        data={gemSlot}
      />
    </>
  );
};

export default ViewHero;
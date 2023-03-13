import { Box, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { animated, useSpring } from '@react-spring/web';
import _ from 'lodash';
import { orderBy } from 'lodash';
import React, { Dispatch, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAppDispatch } from 'state';
import styled from 'styled-components';
import useSound from 'use-sound';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useCancelStage from 'hooks/useCancelStage';
import useHeroCard from 'hooks/useHeroCard';
import useGetHeroSlots from 'hooks/useHeroSlots';
import useGetPhaseData from 'hooks/usePhaseData';
import useGetPlayStage from 'hooks/usePlayStage';
import useGetPlayerInfo from 'hooks/usePlayerInfo';
import useGetStateData from 'hooks/useStageData';
import useStartPlayStage from 'hooks/useStartPlayStage';
import { setIsBattle, setStamina, setGold, setIsPlaying } from 'state/actions';
import { useSettings, useIsPlaying } from 'state/hooks';
import { SETTING_KEY } from 'state/types';
import FlexBox from 'components/FlexBox';
import ModalBattle from 'components/ModalBattle';
import ModalConfirmLeaveStage from 'components/ModalConfirmLeaveStage';
import Game from 'views/Game';
import ribbon_stage from 'assets/image/ui/ribbon-stage.png';
import soundCutScene01 from 'assets/sounds/cut-scene-01.wav';
import { getDirectorJson, calculateHpPercent } from './manager/Utils';
import { Damage } from './manager/components/Damage';
import { HP } from './manager/components/Hp';
import useGameDirector from './manager/hooks/useGameDirector';
import { BattleType } from './manager/interface/BattleType';
import { GameState } from './manager/interface/GameState';
import { ServerJson } from './manager/interface/ServerJson';
import monsters from './monsters.json';
import mockServer from './mockServer.json';
import { mockState1 } from './mockState1';

const characters: {
  [key: string]: { image: string };
} = {
  Iris: {
    image: require('../../assets/image/battle/icon-battle-iris.png').default,
  },
  Kane: {
    image: require('../../assets/image/battle/icon-battle-kane.png').default,
  },
  Venus: {
    image: require('../../assets/image/battle/icon-battle-venus.png').default,
  },
  Hugo: {
    image: require('../../assets/image/battle/icon-battle-hugo.png').default,
  },
  Artemis: {
    image: require('../../assets/image/battle/icon-battle-artemis.png').default,
  },
  Loki: {
    image: require('../../assets/image/battle/icon-battle-loki.png').default,
  },
};

const enemys: {
  [key: number]: { image: string };
} = {
  1: {
    image: require('../../assets/image/battle/enemy/mystery-dog.png').default,
  },
  2: {
    image: require('../../assets/image/battle/enemy/bomber-goat.png').default,
  },
  3: {
    image: require('../../assets/image/battle/enemy/warrior-goat.png').default,
  },
  4: {
    image: require('../../assets/image/battle/enemy/shadow-mask.png').default,
  },
  5: {
    image: require('../../assets/image/battle/enemy/dark-witch.png').default,
  },
  6: {
    image: require('../../assets/image/battle/enemy/fluffy-wolf.png').default,
  },
  7: {
    image: require('../../assets/image/battle/enemy/flaming-dog.png').default,
  },
  8: {
    image: require('../../assets/image/battle/enemy/shiny-goat.png').default,
  },
  9: {
    image: require('../../assets/image/battle/enemy/fairy-dog.png').default,
  },
  10: {
    image: require('../../assets/image/battle/enemy/gunner-dog.png').default,
  },
  11: {
    image: require('../../assets/image/battle/enemy/robodog.png').default,
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
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    gridItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
    },
    gridContainer: {
      left: '0',
      bottom: '0',
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
    stand: {
      backgroundSize: 'contain !important',
      paddingTop: '1.5%',
      paddingLeft: '3.5%',
      paddingRight: '3.5%',
      paddingBottom: '1.5%',
    },
  }),
);

const useOutsideClick = (callback: any) => {
  const ref = useRef<any>();
  useEffect(() => {
    const handleClick = (e: any) => {
      if ((ref.current && e.target.contains(ref.current)) || !ref.current) {
        callback();
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [callback, ref]);
  return ref;
};

const RibbonStage = (props: {
  world?: string;
  phase?: string;
  xs?: boolean;
  show: boolean;
  onClick: () => void;
}) => {
  useOutsideClick(props.onClick);
  return (
    <FlexBox
      // @ts-ignore
      css={`
        width: 100%;
        height: calc(100% - 64px);
        background-color: transparent;
        background: url(${ribbon_stage}) no-repeat;
        background-size: 100%;
        background-position: center;
        display: ${props.show ? 'flex' : 'none'};
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        top: 3%;
        z-index: 100;
      `}
    >
      <Typography
        className={'textshadow'}
        sx={{
          color: '#FFD506',
          fontSize: props.xs ? '3.5vh' : '3.5vw',
        }}
      >
        {`${props.world}`}
      </Typography>
      <Typography
        className={'textshadow'}
        sx={{
          color: '#FFD506',
          margin: '0 1%',
          fontSize: props.xs ? '3.5vh' : '3.5vw',
        }}
      >
        :
      </Typography>
      <Typography
        className={'textshadow'}
        sx={{
          color: 'text.primary',
          fontSize: props.xs ? '3.5vh' : '3.5vw',
        }}
      >
        {props.phase}
      </Typography>
    </FlexBox>
  );
};

const Battle = () => {
  const { gameState, start, next, animateProps, activeDamages, currentDamage } =
    useGameDirector();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const { state } = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const isPlaying = useIsPlaying();
  const { isBoost, stageId } = state as { isBoost: boolean; stageId: number };

  const settings = useSettings();
  const [play] = useSound(soundCutScene01, {
    volume: Number(settings[SETTING_KEY.EFFECT_VOLUME]) / 100.0,
  });

  useEffect(() => {
    if (
      gameState?.phase === GameState.BattlePhase &&
      gameState?.data?.type === BattleType.CutScene
    ) {
      play();
    }
  }, [gameState, play]);

  useEffect(() => {
    dispatch(setIsBattle(true));
    return () => {
      dispatch(setIsBattle(false));
    };
  }, [dispatch]);

  // wait for the component to be mounted
  useEffect(() => {
    const rootStyle = document.getElementById('container')!.style;
    rootStyle.backgroundImage = `url(${
      require('../../assets/image/bg/bg-battle.png').default
    })`;
    rootStyle.backgroundRepeat = 'no-repeat';
    rootStyle.backgroundColor = '#FAFAFA';
    rootStyle.backgroundPosition = 'center center';
    rootStyle.backgroundSize = 'cover';
  }, []);

  const { onGetHeroSlots } = useGetHeroSlots();
  const { onHeroCard } = useHeroCard();
  const { onGetStageData } = useGetStateData();
  const { onGetPhaseData } = useGetPhaseData();
  const { onGetPlayStage } = useGetPlayStage();
  const { onStartPlayStage } = useStartPlayStage();
  const { onCancelStage } = useCancelStage();
  const { onGetPlayerInfo } = useGetPlayerInfo();

  const [heroList, setHeroList] = useState<any>([]);
  const [enemyList, setEnemyList] = useState<any>([]);
  const [dataModal, setDataModal] = useState<any>();
  const [phaseData, setPhaseData] = useState<any>(null);
  const [disabledButton, setDisabledButton] = useState<boolean>(false);
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);

  const zoomInitialState = useMemo(() => {
    const result: { [x: string]: boolean | undefined } = {};
    for (let i = 1; i <= 5; i++) {
      result[`h${i}`] = false;
      result[`e${i}`] = false;
    }
    return result;
  }, []);
  const [_isZoom, setIsZoom] = useState(zoomInitialState);
  const isZoom =
    gameState?.phase === GameState.SetupPhase ? _isZoom : zoomInitialState;
  const zoom = useSpring<any>({
    scaleE1: isZoom.e1 ? 3 : 1,
    translateXE1: isZoom.e1 ? '8vw' : '0vw',
    translateYE1: isZoom.e1 ? '9.3vw' : '0vw',
    scaleE2: isZoom.e2 ? 3 : 1,
    translateXE2: isZoom.e2 ? '-8.6vw' : '0vw',
    translateYE2: isZoom.e2 ? '9.3vw' : '0vw',
    scaleE3: isZoom.e3 ? 3 : 1,
    translateXE3: isZoom.e3 ? '16.3vw' : '0vw',
    translateYE3: isZoom.e3 ? '15vw' : '0vw',
    scaleE4: isZoom.e4 ? 3 : 1,
    translateXE4: isZoom.e4 ? '-0.3vw' : '0vw',
    translateYE4: isZoom.e4 ? '15vw' : '0vw',
    scaleE5: isZoom.e5 ? 3 : 1,
    translateXE5: isZoom.e5 ? '-16.9vw' : '0vw',
    translateYE5: isZoom.e5 ? '15vw' : '0vw',
    scaleH1: isZoom.h1 ? 3 : 1,
    translateXH1: isZoom.h1 ? '8vw' : '0vw',
    translateYH1: isZoom.h1 ? '5.3vw' : '0vw',
    scaleH2: isZoom.h2 ? 3 : 1,
    translateXH2: isZoom.h2 ? '-8.6vw' : '0vw',
    translateYH2: isZoom.h2 ? '5.3vw' : '0vw',
    scaleH3: isZoom.h3 ? 3 : 1,
    translateXH3: isZoom.h3 ? '16.3vw' : '0vw',
    translateYH3: isZoom.h3 ? '11vw' : '0vw',
    scaleH4: isZoom.h4 ? 3 : 1,
    translateXH4: isZoom.h4 ? '-0.3vw' : '0vw',
    translateYH4: isZoom.h4 ? '11vw' : '0vw',
    scaleH5: isZoom.h5 ? 3 : 1,
    translateXH5: isZoom.h5 ? '-16.9vw' : '0vw',
    translateYH5: isZoom.h5 ? '11vw' : '0vw',
  });

  const isEnemyTop =
    isZoom.e1 || isZoom.e2 || isZoom.e3 || isZoom.e4 || isZoom.e5;

  useEffect(() => {
    (async () => {
      try {
        const stageData = await onGetStageData(stageId);
        const playStage = await onGetPlayStage();
        let phaseId = null;
        if (playStage.is_playing) {
          let phase = stageData.phases.find(
            (phase: any) => phase.id === playStage.current_phase.next_phase_id,
          );
          phaseId = phase.id;
          start([
            {
              phase: GameState.ResultPhase,
              data: { win: playStage.current_phase.is_win },
              autoNext: false,
            },
          ]);
          setPhaseData(phase);
          setDataModal(playStage.current_phase);
          dispatch(
            setIsPlaying(true)
          );
          let heroSlot = Object.fromEntries(
            Object.entries(playStage.current_phase.play_data.hero).filter(
              ([_, v]) => v != null,
            ),
          );
          let heroList: any = [];
          heroList = Object.values(heroSlot).map(
            (
              {
                info: {
                  nft_id,
                  hero_type: { name },
                  rarity: { name: rarity },
                  calculated_hp,
                  ...rest
                },
              }: any,
              index: number,
            ) => {
              let slot = `${index + 1}`;
              const maxHp = calculated_hp;
              const startHp = playStage.current_phase.result_hp[`slot${slot}`];
              const damage = 0;
              return {
                id: nft_id,
                name,
                slot: slot,
                image: onHeroCard({
                  id: nft_id,
                  name,
                  loading: false,
                  rarity,
                  ...rest,
                }),
                hp: calculateHpPercent(maxHp, startHp, damage),
                maxHp: maxHp,
                startHp: startHp,
                skill: false,
                skillCooldown: playStage.current_phase.skill_cool_down[`slot${slot}`],
                icon: characters[_.startCase(name)].image,
              };
            },
          );
          if (heroList.length < 5) {
            [...Array(5 - heroList.length)].forEach((_, i) => {
              let index = i === 0 ? 1 : i;
              heroList.push({
                id: '',
                name: '',
                slot: `${heroList.length + index}`,
                image: <div></div>,
                hp: '',
                maxHp: '',
                startHp: '',
                skill: false,
                skillCooldown: 0,
                icon: '',
              });
            });
          }
          let newHeroList = [
            heroList[2], // slot 3
            heroList[0], // slot 1
            heroList[3], // slot 4
            heroList[1], // slot 2
            heroList[4], // slot 5
          ];
          setHeroList(newHeroList);
        } else {
          let phase = stageData.phases.find(
            (phase: any) => phase.phase_no === 1,
          );
          phaseId = phase.id;
          setPhaseData(phase);
          start([
            {
              phase: GameState.StageNamePhase,
              data: {
                world: `World 1-${stageData.id}`,
                phase: `Phase ${phase.phase_no}`,
              },
              autoNext: true,
              transitionTime: 2000,
            },
            {
              phase: GameState.SetupPhase,
              autoNext: false,
            },
          ]);
          dispatch(
            setIsPlaying(false)
          );
        }
        const data = await onGetPhaseData(phaseId);
        let enemyList: any = [];
        Object.entries(data.enemy).forEach(([key, value], index: number) => {
          const monster = monsters.find((m) => m.id === value);
          let slot = `${index + 1}`;
          enemyList.push({
            id: key,
            slot: slot,
            enemyId: value,
            hp: '100',
            startHp: monster?.calculated_hp,
          });
        });
        if (enemyList.length < 5) {
          [...Array(5 - enemyList.length)].forEach((_, i) => {
            let index = i === 0 ? 1 : i;
            enemyList.push({
              id: '',
              slot: `${enemyList.length + index}`,
              enemyId: '',
              hp: '',
              startHp: '',
            });
          });
        }
        let newEnemyList = [
          enemyList[2], // slot 3
          enemyList[0], // slot 1
          enemyList[3], // slot 4
          enemyList[1], // slot 2
          enemyList[4], // slot 5
        ];
        setEnemyList(newEnemyList);
      } catch (e: any) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onGetPhaseData, onGetPlayStage, onGetStageData, stageId, start]);

  useEffect(() => {
    (async () => {
      const playStage = await onGetPlayStage();
      if (!playStage.is_playing) {
        try {
          const heroes = await onGetHeroSlots();
          let heroSlot = Object.fromEntries(
            Object.entries(heroes).filter(([_, v]) => v != null),
          );
          let heroList: any = [];
          heroList = Object.values(heroSlot).map(
            (
              {
                info: {
                  nft_id,
                  hero_type: { name },
                  rarity: { name: rarity },
                  calculated_hp,
                  ...rest
                },
              }: any,
              index: number,
            ) => {
              return {
                id: nft_id,
                name,
                slot: `${index + 1}`,
                image: onHeroCard({
                  id: nft_id,
                  name,
                  loading: false,
                  rarity,
                  ...rest,
                }),
                hp: '100',
                maxHp: calculated_hp,
                startHp: calculated_hp,
                skill: false,
                skillCooldown: 0,
                icon: characters[_.startCase(name)].image,
              };
            },
          );
          if (heroList.length < 5) {
            [...Array(5 - heroList.length)].forEach((_, i) => {
              let index = i === 0 ? 1 : i;
              heroList.push({
                id: '',
                name: '',
                slot: `${heroList.length + index}`,
                image: <div></div>,
                hp: '',
                maxHp: '',
                startHp: '',
                skill: false,
                skillCooldown: 0,
                icon: '',
              });
            });
          }
          let newHeroList = [
            heroList[2], // slot 3
            heroList[0], // slot 1
            heroList[3], // slot 4
            heroList[1], // slot 2
            heroList[4], // slot 5
          ]
          setHeroList(newHeroList);
        } catch (e: any) {
          console.error(e);
        }
      }
    })();
    // eslint-disable-next-line
  }, [onGetHeroSlots]);

  useEffect(() => {
    (async () => {
      if (dataModal && gameState?.phase === GameState.ResultPhase) {
        let newHeroList = heroList.map((hero: any) => {
          return {
            ...hero,
            startHp: dataModal.result_hp[`slot${hero.slot}`],
            skillCooldown: dataModal.skill_cool_down[`slot${hero.slot}`],
          };
        });
        setHeroList(newHeroList);

        if (dataModal.next_phase_id) {
          const data = await onGetPhaseData(dataModal.next_phase_id);
          let newEnemyList = enemyList.map((enemy: any) => {
            const monster = monsters.find((m) => m.id === data.enemy[`slot${enemy.slot}`]);
            return {
              ...enemy,
              hp: '100',
              startHp: monster?.calculated_hp,
              enemyId: data.enemy[`slot${enemy.slot}`]
            }
          })
          setEnemyList(newEnemyList);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.phase, onGetPhaseData]);

  useEffect(() => {
    (async () => {
      if (gameState?.phase === GameState.BattlePhase && gameState.data.type === BattleType.Attack) {
        let newHeroList = heroList.map((hero: any) => {
          const damages = currentDamage as { [key: string]: number };
          const damage = damages[`h${hero.slot}`];
          const startHp = hero.startHp - damage;
          let currentHpPercent = 0
          if (damage > 0) {
            currentHpPercent = calculateHpPercent(hero.maxHp, hero.startHp, damage)
          } else {
            currentHpPercent = hero.hp
          }
          return {
            ...hero,
            hp: currentHpPercent > 0 ? currentHpPercent : 0,
            startHp: startHp > 0 ? startHp : 0,
          }
        })
        setHeroList(newHeroList);

        let newEnemyList = enemyList.map((enemy: any) => {
          const damages = currentDamage as { [key: string]: number };
          const damage = damages[`e${enemy.slot}`];
          const startHp = enemy.startHp - damage;
          let currentHpPercent = 0
          if (damage > 0) {
            currentHpPercent = calculateHpPercent(enemy.startHp, enemy.startHp, damage)
          } else {
            currentHpPercent = enemy.hp
          }
          return {
            ...enemy,
            hp: currentHpPercent > 0 ? currentHpPercent : 0,
            startHp: startHp > 0 ? startHp : 0,
          }
        })
        setEnemyList(newEnemyList);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.phase, currentDamage]);

  const handleClickOutside = () => {
    next();
  };

  const handleNextPhase = async () => {
    setDisabledButton(false);
    const playerInfo = await onGetPlayerInfo();
    dispatch(
      setGold(parseInt(playerInfo.gold)),
    );
    if (dataModal.next_phase_id) {
      let nextPhaseNo = dataModal.phase.phase_no + 1;
      start([
        {
          phase: GameState.StageNamePhase,
          data: {
            world: `World 1-${dataModal.phase.stage}`,
            phase: `Phase ${nextPhaseNo}`,
          },
          autoNext: true,
          transitionTime: 2000,
        },
        {
          phase: GameState.SetupPhase,
          autoNext: false,
        },
      ]);
    } else {
      navigate('/stage-selection');
    }
  };

  const toggleSkill = (id: string) => {
    const hero = heroList.find((hero: any) => hero.id === id);
    if (hero) {
      hero.skill = !hero.skill;
    }
    setHeroList([...heroList]);
  };

  return (
    <div className={'noselect'}>
      <Grid container rowSpacing={0}>
        <Grid item xs={12} className={classes.gridCard}>
          <Stack spacing={0} className={classes.stack}>
            <AnimatedContentBox
              style={{
                ...animateProps.eRoot,
                ...(isEnemyTop && { zIndex: 2 }),
              }}
              position={'top'}
            >
              {enemyList.map((enemy: any, index: number) => {
                const tranform = index % 2 === 1;
                return (
                  <>
                    <FlexBox
                      key={index}
                      style={{
                        width: '16%',
                        height: '8.75vw',
                        border: '2px solid #A0643C',
                        borderRadius: '5%',
                        background: 'rgba(206, 149, 106, 0.5)',
                        marginTop: tranform ? '5.6vw' : 0,
                        position: 'relative',
                      }}
                    >
                      <AnimatedCardHolder
                        key={index}
                        style={{
                          width: '100%',
                          height: 'auto',
                          position: 'absolute',
                          bottom: '-3.5%%',
                          ...(gameState?.phase === GameState.BattlePhase && 
                            animateProps['e' + (enemy.slot)]),
                          ...(gameState?.phase === GameState.SetupPhase && {
                            translateX: zoom[`translateXE${enemy.slot}`],
                            translateY: zoom[`translateYE${enemy.slot}`],
                          }),
                          ...(isZoom[`e${enemy.slot}`] && { 
                            zIndex: 99,
                            mixBlendMode: 'normal',
                          }),
                          scale: zoom[`scaleE${enemy.slot}`],
                        }}
                        isDead={enemy.hp === 0}
                        onClick={
                          !!enemy.enemyId
                            ? () => {
                                setIsZoom({
                                  ...zoomInitialState,
                                  [`e${enemy.slot}`]: !isZoom[`e${enemy.slot}`],
                                });
                              }
                            : undefined
                        }
                      >
                        {!!enemy.enemyId && (
                          <>
                            <HPSlot position={'top'}>
                              <HP position={'top'} hp={enemy.hp} />
                            </HPSlot>
                            <HeroCard
                              position={'top'}
                              // @ts-ignore
                              css={`
                                cursor: pointer;
                              `}
                            >
                              <img
                                src={enemys[enemy.enemyId].image}
                                alt={''}
                                width={'100%'}
                              />
                            </HeroCard>
                          </>
                        )}
                      </AnimatedCardHolder>
                    </FlexBox>
                  </>
                );
              })}
            </AnimatedContentBox>
            <VSText
              sx={{
                fontSize: xs ? '3vh' : '3vw',
              }}
            >
              VS
            </VSText>
            <AnimatedContentBox
              style={{
                ...animateProps.hRoot,
                ...(!isEnemyTop && { zIndex: 2 }),
              }}
              position={'bottom'}
            >
              {heroList.map((hero: any, index: number) => {
                const tranform = index % 2 === 1;
                return (
                  <>
                    <FlexBox
                      key={index}
                      style={{
                        width: '16%',
                        height: '8.75vw',
                        border: '2px solid #A0643C',
                        borderRadius: '5%',
                        background: 'rgba(206, 149, 106, 0.5)',
                        marginTop: tranform ? '5.6vw' : 0,
                        position: 'relative',
                      }}
                    >
                      <AnimatedCardHolder
                        key={index}
                        style={{
                          width: '100%',
                          height: 'auto',
                          position: 'absolute',
                          bottom: '0',
                          ...(gameState?.phase === GameState.BattlePhase &&
                            animateProps['h' + (hero.slot)]),
                          ...(gameState?.phase === GameState.SetupPhase && {
                            translateX: zoom[`translateXH${hero.slot}`],
                            translateY: zoom[`translateYH${hero.slot}`],
                          }),
                          ...(isZoom[`h${hero.slot}`] && { 
                            zIndex: 99,
                            mixBlendMode: 'normal',
                          }),
                          scale: zoom[`scaleH${hero.slot}`],
                        }}
                        isDead={hero.hp === 0}
                        onClick={
                          !!hero.id
                            ? () => {
                                setIsZoom({
                                  ...zoomInitialState,
                                  [`h${hero.slot}`]: !isZoom[`h${hero.slot}`],
                                });
                              }
                            : undefined
                        }
                      >
                        {!!hero.id && (
                          <>
                            <HPSlot position={'bottom'}>
                              <HP position={'bottom'} hp={hero.hp}/>
                            </HPSlot>
                            <HeroCard position={'bottom'}>
                              {hero.image}
                            </HeroCard>
                          </>
                        )}
                      </AnimatedCardHolder>
                    </FlexBox>
                  </>
                );
              })}
            </AnimatedContentBox>
          </Stack>
        </Grid>
      </Grid>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          <Box className={classes.buttonsContainer}>
            <StandContainer visible={gameState?.phase === GameState.SetupPhase}>
              <StandImage
                src={
                  require('../../assets/image/ui/left-button-stand.png').default
                }
                alt={''}
              />
              <ButtonGame
                onClick={() => setShowModalConfirm(true)}
                className={'btn-game-secondary'}
              >
                <Typography
                  className={'textshadow-purple'}
                  sx={{
                    color: 'text.primary',
                    fontSize: xs ? '2.2vh' : '2.2vw',
                    paddingTop: '9%',
                  }}
                >
                  Leave
                </Typography>
              </ButtonGame>
            </StandContainer>
            <SlotContainer>
              {orderBy(heroList, (h) => parseInt(h.slot), ['asc', 'desc']).map((hero: any, index: number) => {
                return (
                  <SlotHolder
                    key={index}
                    blending={hero.hp === 0 || hero.skillCooldown > 0}
                    useSkill={hero.skill}
                  >
                    <SlotBox
                      src={
                        require('../../assets/image/ui/skill-slot.png').default
                      }
                      alt={''}
                    />
                    {hero.id ? (
                      <SlotImageHolder
                        onClick={() => toggleSkill(hero.id)}
                        disabled={hero.hp === 0 || hero.skillCooldown > 0}
                      >
                        <SlotImage src={hero.icon} alt={''} />
                        <SlotHPHolder>
                          <SlotHPBlank>
                            <HP hp={hero.hp} isBottom position={''}/>
                          </SlotHPBlank>
                        </SlotHPHolder>
                        <SlotSkillCooldown visible={hero.skillCooldown > 0}>
                          <Typography
                            className={'textshadow'}
                            sx={{
                              color: 'text.primary',
                              fontSize: xs ? '3.5vh' : '3.5vw',
                            }}
                          >
                            {hero.skillCooldown}
                          </Typography>
                        </SlotSkillCooldown>
                      </SlotImageHolder>
                    ) : null}
                  </SlotHolder>
                );
              })}
            </SlotContainer>
            <StandContainer
              style={{ zIndex: 999 }}
              right
              visible={gameState?.phase === GameState.SetupPhase}
            >
              <StandImage
                src={
                  require('../../assets/image/ui/right-button-stand.png')
                    .default
                }
                alt={''}
              />
              <ButtonGame
                right
                onClick={async () => {
                  if (disabledButton) return;

                  setDisabledButton(true);
                  let data = {
                    phase: phaseData.id,
                    slot1_skill: heroList[1].skill,
                    slot2_skill: heroList[3].skill,
                    slot3_skill: heroList[0].skill,
                    slot4_skill: heroList[2].skill,
                    slot5_skill: heroList[4].skill,
                    boost: isBoost,
                  };

                  try {
                    let response = await onStartPlayStage(data);

                    const playerInfo = await onGetPlayerInfo();
                    dispatch(
                      setStamina(parseInt(playerInfo.get_current_stamina)),
                    );
                    dispatch(
                      setIsPlaying(playerInfo.is_playing),
                    );
                    setDataModal(response);
                    setPhaseData({
                      id: response.next_phase_id,
                      phase_no: response.phase.phase_no + 1,
                    });
                    start(getDirectorJson(response as ServerJson));
                  } catch (e: any) {
                    console.error(e);
                  }
                }}
                className={'btn-game-primary'}
              >
                <Typography
                  className={'textshadow-green'}
                  sx={{
                    color: 'text.primary',
                    fontSize: xs ? '2.2vh' : '2.2vw',
                    paddingTop: '9%',
                  }}
                >
                  Fight
                </Typography>
              </ButtonGame>
            </StandContainer>
          </Box>
        </Grid>
      </Grid>
      {activeDamages.map((activeDamage, i: number) => (
        <Damage key={i} {...activeDamage} />
      ))}
      {gameState?.phase === GameState.BattlePhase &&
        gameState.data.type === BattleType.CutScene && (
          <animated.div
            style={{
              position: 'absolute',
              width: '100vw',
              height: '56.25vw',
              top: 0,
              left: 0,
              backgroundImage: `url(${gameState.data.image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat',
              ...animateProps.cutscene,
            }}
          />
        )}
      {gameState?.phase === GameState.ResultPhase && (
        <ModalBattle
          show={true}
          heros={heroList}
          data={dataModal}
          onNextPhase={handleNextPhase}
        />
      )}
      {gameState?.phase === GameState.StageNamePhase && (
        <RibbonStage
          onClick={handleClickOutside}
          show={gameState?.phase === GameState.StageNamePhase}
          world={gameState.data.world}
          phase={gameState.data.phase}
          xs={xs}
        />
      )}
      {showModalConfirm && (
        <ModalConfirmLeaveStage
          show={showModalConfirm}
          textConfirm={'Do you want to leave the stage ?'}
          onClose={() => setShowModalConfirm(false)}
          onConfirm={async () => {
            if (isPlaying) {
              await onCancelStage();
            }
            navigate('/stage-selection');
          }}
        />
      )}
    </div>
  );
};

interface IContentBoxStyleProps {
  position?: string;
}

const ContentBox = styled(FlexBox)<IContentBoxStyleProps>`
  width: 40%;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  top: ${(props) => (props.position === 'top' ? '15%' : '54%')};
  transform: ${(props) =>
    props.position === 'bottom' ? 'rotateX(180deg)' : 'none'};
`;

const AnimatedContentBox = animated(ContentBox);

interface ICardHolderStyleProps {
  isDead?: boolean;
}

const CardHolder = styled(FlexBox)<ICardHolderStyleProps>`
  ${(props) => props.isDead && 
    `
      filter: grayscale(100%);
      -o-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -webkit-filter: grayscale(100%);
      filter: gray;
    `
  }
`;

const AnimatedCardHolder = animated(CardHolder);

interface IStandContainerStyleProps {
  right?: boolean;
  visible?: boolean;
}

const StandContainer = styled(FlexBox)<IStandContainerStyleProps>`
  width: fit-content;
  position: relative;
  display: flex;
  align-items: ${(props) => (props.right ? 'flex-end' : 'flex-start')};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const StandImage = styled.img`
  width: 70%;

  @media (min-width: 280px) and (max-width: 1279px) {
    width: 45%;
  }
`;

interface IButtonGameStyleProps {
  right?: boolean;
}

const ButtonGame = styled.div<IButtonGameStyleProps>`
  position: absolute;
  top: -17%;
  height: 100%;
  left: ${(props) => (props.right ? '37.3%' : '9%')};
  width: 54%;
  background-size: 100% 100% !important;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &:active {
    transform: translateY(5px);
    transition: transform 100ms linear;
    background-color: transparent !important;
  }

  @media (min-width: 280px) and (max-width: 1279px) {
    width: 34%;
    top: -20%;
    left: ${(props) => (props.right ? '60.2%' : '6%')};
  }
`;

const SlotContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  position: absolute;
  left: 0;
  right: 0;
  margin-right: auto;
  margin-left: auto;
  bottom: 0;
`;

interface ISlotHolderStyleProps {
  blending?: boolean;
  useSkill?: boolean;
}

const SlotHolder = styled.div<ISlotHolderStyleProps>`
  position: relative;
  display: flex;
  transform: ${(props) =>
    props.useSkill && !props.blending ? 'scale(0.95)' : 'scale(1)'};
  ${(props) => props.blending && 'mix-blend-mode: luminosity;'}
`;

const SlotBox = styled.img`
  width: 10vw;
`;

interface ISlotImageHolderStyleProps {
  disabled?: boolean;
}

const SlotImageHolder = styled.div<ISlotImageHolderStyleProps>`
  width: 7vw;
  height: 7vw;
  background-color: transparent;
  display: flex;
  position: absolute;
  top: 12%;
  left: 12.5%;
  border-radius: 15%;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const SlotHPHolder = styled.div`
  width: 100%;
  height: 18%;
  position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SlotHPBlank = styled.div`
  width: 83%;
  height: 0.7vw;
  background-color: transparent;
  border-radius: 50px;
  border: 1px solid #fff;
  overflow: hidden;
`;

const SlotImage = styled.img`
  width: 100%;
  height: 100%;
`;

interface ISlotSkillCooldownStyleProps {
  visible: boolean;
}

const SlotSkillCooldown = styled.div<ISlotSkillCooldownStyleProps>`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const VSText = styled(Typography)`
  background: -webkit-linear-gradient(#f7ec13, #ffae00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1.5px #a65e31;
  position: absolute;
  top: 42%;
`;

interface IHPSlotStyleProps {
  position?: string;
}

const HPSlot = styled.div<IHPSlotStyleProps>`
  background-color: #e4a26d;
  border: 1px solid #000000;
  border-radius: 50px;
  width: 93%;
  height: 3%;
  ${(props) => props.position === 'top' && 'top: -9%;'}
  ${(props) => props.position === 'bottom' && 'bottom: -12%;'}
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;

  @media (min-width: 280px) and (max-width: 1279px) {
    ${(props) => props.position === 'top' && 'top: -10%;'}
    ${(props) => props.position === 'bottom' && 'bottom: -16%;'}
  }

  @media all and (display-mode: fullscreen) {
    ${(props) => props.position === 'bottom' && 'bottom: -13%;'}
  }
`;

interface IHeroCardStyleProps {
  position?: string;
}

const HeroCard = styled.div<IHeroCardStyleProps>`
  transform: ${(props) =>
    props.position === 'bottom' ? 'rotateX(180deg)' : 'none'};
`;

export default Battle;

import {useSpring, easings} from '@react-spring/web';
import {useCallback, useRef, useState} from 'react';
import {getRealDistance} from '../Utils';
import {BattleType} from '../interface/BattleType';
import {
  BattlePhaseDataAttack,
  BattlePhaseDataCutScene,
  CurrentDamage,
  ActiveDamage,
  GameStateData,
} from '../interface/DirectorData';
import {GameState} from '../interface/GameState';
import {SlotLocation} from '../interface/SlotLocation';

export default (): {
  currentDamage: CurrentDamage;
  gameState: GameStateData | null;
  start: any;
  stop: any;
  next: any;
  activeDamages: ActiveDamage[];
  animateProps: {
    [x: string]: any;
    e1: any;
    e2: any;
    e3: any;
    e4: any;
    e5: any;
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    eRoot: any;
    cutscene: any;
  };
} => {
  const [animatePropsERoot, apiERoot] = useSpring(() => ({
    zIndex: 1,
  }));
  const [animatePropsHRoot, apiHRoot] = useSpring(() => ({
    zIndex: 1,
  }));
  const [animatePropsH1, apiH1] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));
  const [animatePropsH2, apiH2] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));
  const [animatePropsH3, apiH3] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));
  const [animatePropsH4, apiH4] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));
  const [animatePropsH5, apiH5] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));
  const [animatePropsE1, apiE1] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));
  const [animatePropsE2, apiE2] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));
  const [animatePropsE3, apiE3] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));
  const [animatePropsE4, apiE4] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));
  const [animatePropsE5, apiE5] = useSpring(() => ({
    translateY: '0vw',
    translateX: '0vw',
    zIndex: 1,
    scale: 1,
  }));

  const [cutscene, apiCutscene] = useSpring(() => ({
    translateX: '-100vw',
    zIndex: 0,
    opacity: 1,
  }));

  const directorState = useRef<{
    isBusy: boolean;
    cancelling: boolean;
    gameStates: GameStateData[];
    currentCursor: number;
  }>({
    isBusy: false,
    cancelling: false,
    gameStates: [],
    currentCursor: 0,
  });

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const getAccumulatedDamage = useCallback(
    (data: GameStateData[], cursor: number) => {

    },
    [],
  );
  const [activeDamages, setActiveDamages] = useState<ActiveDamage[]>([]);
  const [currentDamage, setCurrentDamage] = useState<CurrentDamage>({
    e1: 0,
    e2: 0,
    e3: 0,
    e4: 0,
    e5: 0,
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0
  });
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const _runBattleCutScene = useCallback(
    async (data: BattlePhaseDataCutScene) => {
      /* START Init State*/
      apiCutscene.set({
        translateX: '-100vw',
        zIndex: 0,
        opacity: 1,
      });
      /* END Init State*/

      apiCutscene.start({
        zIndex: 100,
        config: {duration: 0},
      });
      apiCutscene.start({
        translateX: '-2vw',
        config: {duration: 400, easing: easings.easeInOutSine},
      });
      await sleep(400);
      apiCutscene.start({
        translateX: '0vw',
        config: {duration: 1200},
      });
      await sleep(900);
      apiCutscene.start({
        opacity: 0,
        config: {duration: 300},
      });
      await sleep(300);

      /* START Reset State*/
      apiCutscene.set({
        translateX: '-100vw',
        zIndex: 0,
        opacity: 1,
      });
      /* END Reset State*/
    },
    [apiCutscene],
  );
  const _runBattleNormalAttack = useCallback(
    async (data: BattlePhaseDataAttack) => {
      let apiFrom: any;
      let heroPhase = true;
      switch (data.from) {
        case SlotLocation.E1:
          apiFrom = apiE1;
          heroPhase = false;
          break;
        case SlotLocation.E2:
          apiFrom = apiE2;
          heroPhase = false;
          break;
        case SlotLocation.E3:
          apiFrom = apiE3;
          heroPhase = false;
          break;
        case SlotLocation.E4:
          apiFrom = apiE4;
          heroPhase = false;
          break;
        case SlotLocation.E5:
          apiFrom = apiE5;
          heroPhase = false;
          break;
        case SlotLocation.H1:
          apiFrom = apiH1;
          break;
        case SlotLocation.H2:
          apiFrom = apiH2;
          break;
        case SlotLocation.H3:
          apiFrom = apiH3;
          break;
        case SlotLocation.H4:
          apiFrom = apiH4;
          break;
        case SlotLocation.H5:
          apiFrom = apiH5;
          break;
      }
      let apiFromRoot = heroPhase ? apiHRoot : apiERoot;
      let apiToRoot = !heroPhase ? apiHRoot : apiERoot;

      apiFromRoot.set({
        zIndex: 2,
      });
      apiToRoot.set({
        zIndex: 1,
      });
      apiFrom.set({
        zIndex: 99,
      });

      let newData: ActiveDamage[] = [];
      if (data.to) {
        const distance = getRealDistance(data.from, data.to);
        apiFrom.start({
          translateY: distance[1],
          translateX: distance[0],
          config: {duration: 400},
        });
        await sleep(400);
      } else {
        for (let i = 0; i < 4; i++) {
          apiFrom.start({
            translateX: '1vw',
            config: {duration: 70},
          });
          await sleep(70);
          apiFrom.start({
            translateX: '-1vw',
            config: {duration: 70},
          });
          await sleep(70);
        }
      }
      data.damages.forEach((damage) => {
        newData.push({
          useSkill: data.useSkill,
          ...damage,
        });
      });
      setActiveDamages((prev) => [...prev, ...newData]);
      setCurrentDamage((prev) => {
        const newDamage = {...prev};
        for (const damage of data.damages) {
          newDamage[damage.to] += damage.damage;
        }
        return newDamage;
      });

      apiFrom.start({
        translateY: '0vw',
        translateX: '0vw',
        config: {duration: 400},
      });
      await sleep(400);

      /* START Reset State*/
      apiFrom.set({
        zIndex: 1,
      });
      apiFromRoot.set({
        zIndex: 1,
      });
      apiToRoot.set({
        zIndex: 1,
      });
      /* END Reset State*/
      await sleep(200);
      setActiveDamages([]);
    },
    [
      apiE1,
      apiE2,
      apiE3,
      apiE4,
      apiE5,
      apiH1,
      apiH2,
      apiH3,
      apiH4,
      apiH5,
      apiERoot,
      apiHRoot,
      setActiveDamages,
      setCurrentDamage,
    ],
  );
  const run = useCallback(
    async (data: GameStateData) => {
      console.log('run', data);
      setCurrentDamage({
        e1: 0,
        e2: 0,
        e3: 0,
        e4: 0,
        e5: 0,
        h1: 0,
        h2: 0,
        h3: 0,
        h4: 0,
        h5: 0
      });
      let duration = 0;
      if ('transitionTime' in data) {
        duration = data.transitionTime;
      }
      if (data.phase === GameState.BattlePhase) {
        switch (data.data.type) {
          case BattleType.Attack:
            await _runBattleNormalAttack(data.data);
            break;
          case BattleType.CutScene:
            await _runBattleCutScene(data.data);
            break;
        }
      } else await sleep(duration);
    },
    [_runBattleCutScene, _runBattleNormalAttack, setCurrentDamage],
  );
  const resume = useCallback(async () => {
    if (directorState.current.isBusy) return;
    directorState.current.isBusy = true;
    for (
      ;
      directorState.current.currentCursor <
      directorState.current.gameStates.length &&
      !directorState.current.cancelling;
      directorState.current.currentCursor++
    ) {
      try {
        const i = directorState.current.currentCursor;
        setGameState(directorState.current.gameStates[i]);
        await run(directorState.current.gameStates[i]);
        if (!directorState.current.gameStates[i].autoNext) break;
      } catch (e) {
      }
    }
    directorState.current.isBusy = false;
    directorState.current.cancelling = false;
  }, [directorState, setGameState]);
  const start = useCallback(
    async (data: GameStateData[], initialCursor: number | undefined) => {
      if (initialCursor === undefined) directorState.current.currentCursor = 0;
      else directorState.current.currentCursor = initialCursor;
      directorState.current.gameStates = data;
      await resume();
    },
    [directorState, resume],
  );
  const stop = useCallback(() => {
    if (directorState.current.isBusy) {
      directorState.current.cancelling = true;
    }
  }, [directorState]);
  const next = useCallback(async () => {
    if (directorState.current.isBusy) return;
    directorState.current.currentCursor++;
    await resume();
  }, [directorState, resume]);

  return {
    start,
    stop,
    next,
    gameState,
    activeDamages,
    currentDamage,
    animateProps: {
      e1: animatePropsE1,
      e2: animatePropsE2,
      e3: animatePropsE3,
      e4: animatePropsE4,
      e5: animatePropsE5,
      h1: animatePropsH1,
      h2: animatePropsH2,
      h3: animatePropsH3,
      h4: animatePropsH4,
      h5: animatePropsH5,
      eRoot: animatePropsERoot,
      hRoot: animatePropsHRoot,
      cutscene,
    },
  };
};

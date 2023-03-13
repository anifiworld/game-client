import { Card, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useGetStageData from 'hooks/useStageData';
import { formatCommaSeparated } from 'utils/formatBalance';
import boxEnemy from '../assets/image/stage/box-enemy.png';
import checkboxImg from '../assets/image/ui/check-box.png';
import ButtonEffect from './ButtonEffect';
import FlexBox from './FlexBox';

const enemys: {
  [key: number]: { image: string };
} = {
  1: {
    image: require('../assets/image/enemy/mystery-dog.png').default,
  },
  2: {
    image: require('../assets/image/enemy/bomber-goat.png').default,
  },
  3: {
    image: require('../assets/image/enemy/warrior-goat.png').default,
  },
  4: {
    image: require('../assets/image/enemy/shadow-mask.png').default,
  },
  5: {
    image: require('../assets/image/enemy/dark-witch.png').default,
  },
  6: {
    image: require('../assets/image/enemy/fluffy-wolf.png').default,
  },
  7: {
    image: require('../assets/image/enemy/flaming-dog.png').default,
  },
  8: {
    image: require('../assets/image/enemy/shiny-goat.png').default,
  },
  9: {
    image: require('../assets/image/enemy/fairy-dog.png').default,
  },
  10: {
    image: require('../assets/image/enemy/gunner-dog.png').default,
  },
  11: {
    image: require('../assets/image/enemy/robodog.png').default,
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
    titleText: {
      top: '20%',
      position: 'absolute',
      fontSize: xs ? '2vh' : '2vw',
      zIndex: 2,
    },
    cardContainer: {
      width: '100%',
      height: '100%',
      overflow: 'inherit',
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
    startButton: {
      fontSize: xs ? '2.25vh' : '2.25vw',
    },
  }),
);

const MetaBox = (props: {
  top?: boolean;
  title?: string;
  xs?: boolean;
  data: any;
}) => {
  return (
    <BoxContainer istop={props.top}>
      <FlexBox
        // @ts-ignore
        css={`
          flex-direction: row;
        `}
      >
        <Text
          istop={props.top}
          className={'textshadow'}
          gutterBottom
          sx={{
            fontSize: props.xs ? '1.5vh' : '1.5vw',
          }}
        >
          {props.title}
        </Text>
        {props.top && (
          <>
            <Thunder
              src={
                require('../assets/image/ui/6c2320839283c1b9bb8eee52b64c9f5a.png')
                  .default
              }
              alt={'thunder'}
            />
            <ThunderText
              sx={{
                fontSize: props.xs ? '1.5vh' : '1.5vw',
              }}
            >
              {`-${props.data?.stamina_cost}`}
            </ThunderText>
          </>
        )}
      </FlexBox>
      <BoxContent istop={props.top}>
        {props.top ? (
          <>
            {props.data?.monsters.map((monster: any, index: number) => {
              return (
                <ImageBox key={index}>
                  {enemys[monster] && (
                    <EnemyImg alt={''} src={enemys[monster].image} />
                  )}
                </ImageBox>
              );
            })}
            {props.data?.monsters.length < 3 &&
              [...Array(3 - props.data?.monsters.length)].map((_, index) => {
                return <ImageBox key={index} />;
              })}
          </>
        ) : (
          <>
            <Box>
              <img
                alt={''}
                src={
                  require('../assets/image/ui/eb2198d5ef8767dab873f50c5d5a4502.png')
                    .default
                }
                width={'55%'}
              />
              <TextImage
                className={'textshadow'}
                gutterBottom
                sx={{
                  color: 'text.primary',
                  fontSize: props.xs ? '1.5vh' : '1.5vw',
                  bottom: '-20%',
                  right: '7%',
                }}
              >
                {`${props.data?.reward.coin}`}
              </TextImage>
            </Box>
            <Box>
              <img
                alt={''}
                src={require('../assets/image/ui/icon-gold.png').default}
                width={'88%'}
              />
              <TextImage
                className={'textshadow'}
                gutterBottom
                sx={{
                  color: 'text.primary',
                  fontSize: props.xs ? '1.5vh' : '1.5vw',
                  bottom: '-20%',
                  right: '-25%',
                }}
              >
                {`${props.data?.reward.gold}`}
              </TextImage>
            </Box>
            <Box>
              <img
                alt={''}
                src={require('../assets/image/stage/exp-icon.png').default}
                width={'88%'}
              />
              <TextImage
                className={'textshadow'}
                gutterBottom
                sx={{
                  color: 'text.primary',
                  fontSize: props.xs ? '1.5vh' : '1.5vw',
                  bottom: '-20%',
                  right: '-25%',
                }}
              >
                {`${props.data?.reward.exp}`}
              </TextImage>
            </Box>
          </>
        )}
      </BoxContent>
    </BoxContainer>
  );
};

interface IModalStage {
  onClose: () => void;
  show: boolean;
  stageId: number;
  scrollPosition: number;
}

const ModalStage = (props: IModalStage) => {
  const { onClose, show, stageId, scrollPosition } = props;

  const { onGetStageData } = useGetStageData();

  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const [isBoost, setIsBoost] = useState(false);
  const [stage, setStage] = useState<any>();

  const navigate = useNavigate();
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    (async () => {
      let stageData = await onGetStageData(stageId);
      setStage(stageData);
    })();
  }, [onGetStageData, stageId]);

  if (_.isEmpty(stage)) return <></>;
  return (
    <>
      <Modal show={show}>
        <Container scrollPosition={scrollPosition}>
          <BtnClose
            className="btn-close-dialog"
            onClick={handleClose}
          ></BtnClose>
          <Title
            className={`textshadow ${classes.titleText}`}
            gutterBottom
            sx={{
              color: 'text.primary',
            }}
          >
            {`World 1 - ${stage?.name}`}
          </Title>
          <Card
            className={`card-select-world ${classes.cardContainer}`}
            elevation={0}
          >
            <MetaBox top xs={xs} title={'Monster'} data={stage} />
            <MetaBox xs={xs} title={'Reward'} data={stage} />
            <HolderSelectContainer>
              <HolderSelect onClick={() => setIsBoost(!isBoost)}>
                {isBoost && (
                  <CheckedImg
                    src={
                      require('../assets/image/ui/checked-green.png').default
                    }
                    alt={'checkbox'}
                  />
                )}
              </HolderSelect>
              <Typography
                className={'textshadow'}
                sx={{
                  color: 'text.primary',
                  fontSize: xs ? '1.3vh' : '1.3vw',
                }}
              >
                Boost reward
              </Typography>
              <img
                src={require('../assets/image/ui/icon-gold.png').default}
                style={{
                  transform: 'translateY(-15%)',
                  marginLeft: '3%',
                  marginRight: '1%',
                  width: '8%',
                  height: 'min-content',
                }}
                alt={'gold'}
              />
              <ThunderText
                sx={{
                  fontSize: xs ? '1.3vh' : '1.3vw',
                }}
              >
                {`-${formatCommaSeparated(stage ? stage.boost_cost : 0)}`}
              </ThunderText>
            </HolderSelectContainer>
            <ButtonsContainer>
              <StartBtn
                className={`btn primary ${classes.startButton}`}
                onClick={() => {
                  navigate('/battle', {
                    state: {
                      isBoost: isBoost,
                      stageId: stage ? stage.id : null,
                    },
                  });
                }}
                disableRipple
                sx={{
                  color: 'text.primary',
                }}
              >
                Start
              </StartBtn>
            </ButtonsContainer>
          </Card>
        </Container>
      </Modal>
    </>
  );
};

interface IModalStageStyleProps {
  show: boolean;
}

const Modal = styled.div<IModalStageStyleProps>`
  aspect-ratio: 16 / 9;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 2000;
`;

interface IContainerStyleProps {
  scrollPosition: number;
}

const Container = styled.div<IContainerStyleProps>`
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  position: absolute;
  left: 25%;
  right: 25%;
  top: ${({ scrollPosition }) => (scrollPosition >= 70 ? '-10%' : '0%')};
  bottom: 25%;
  margin: auto;
  box-sizing: border-box;

  @media all and (display-mode: fullscreen) {
    top: 21%;
  }
`;

const Title = styled(Typography)`
  @media (min-width: 280px) and (max-width: 1279px) {
    top: 16.3%;
  }

  @media all and (display-mode: fullscreen) {
    top: 20%;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  bottom: 7%;

  @media (min-width: 280px) and (max-width: 1279px) {
    bottom: 2%;
  }
`;

interface ITextStyleProps {
  istop?: boolean;
}

const Text = styled(Typography)<ITextStyleProps>`
  color: #ffd506;
  margin-bottom: 2%;
`;

interface IBoxContainerStyleProps {
  istop?: boolean;
}

const BoxContainer = styled(FlexBox)<IBoxContainerStyleProps>`
  width: 56%;
  left: 22%;
  position: absolute;
  top: ${(props) => (props.istop ? '29%' : '51%')};

  @media (min-width: 280px) and (max-width: 1279px) {
    top: ${(props) => (props.istop ? '27%' : '51%')};
  }
`;

interface IBoxContentStyleProps {
  istop?: boolean;
}

const BoxContent = styled(FlexBox)<IBoxContentStyleProps>`
  width: 100%;
  height: 15%;
  border-radius: 10px;
  flex-direction: row;
  justify-content: ${(props) => (props.istop ? 'center' : 'flex-start')};
  align-items: center;
  column-gap: ${(props) => (props.istop ? '5%' : '8%')};
  background-color: #e7c18b;
  padding: 3% 0;
  box-sizing: border-box;
  ${(props) => !props.istop && 'padding-left: 6%;'}
`;

const Box = styled.div`
  width: 6vw;
  height: 6vw;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
`;

const ImageBox = styled(Box)`
  background-color: transparent;
  background: url(${boxEnemy}) no-repeat;
  background-size: contain;
`;

const EnemyImg = styled.img`
  width: 80%;
  transform: translateX(-3px);

  @media (min-width: 280px) and (max-width: 1279px) {
    transform: translateX(0px);
  }
`;

const TextImage = styled(Typography)`
  position: absolute;
`;

const BtnClose = styled(ButtonEffect)`
  position: absolute;
  right: 16%;
  top: 16%;
  background-color: transparent;
  background-size: 100% auto;
  border: none;
  z-index: 1;
  height: 18% !important;
  width: 11%;

  @media (min-width: 280px) and (max-width: 1279px) {
    top: 13%;
    right: 13%;
    background-size: 60% auto;
  }

  @media all and (display-mode: fullscreen) {
    top: 16%;
  }
`;

const StartBtn = styled(ButtonEffect)`
  width: 100%;
  height: 5vw;
`;

const Thunder = styled.img`
  width: auto !important;
  height: 2vw;
  margin: 0 3%;
`;

const ThunderText = styled(Typography)`
  color: #700a0a;
`;

const HolderSelectContainer = styled(FlexBox)`
  height: 6%;
  flex-direction: row;
  width: 56%;
  position: absolute;
  left: 22%;
  top: 73%;

  @media (min-width: 280px) and (max-width: 1279px) {
    top: 76%;
  }
`;

const HolderSelect = styled.div`
  position: relative;
  margin-left: 2%;
  margin-right: 4%;
  box-sizing: border-box;
  height: 100%;
  width: 7%;
  background-color: red;
  background: url(${checkboxImg}) no-repeat;
  background-size: contain;
  cursor: pointer;
`;

const CheckedImg = styled.img`
  width: 85%;
  position: absolute;
  top: 5%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
  pointer-events: none;
`;

export default ModalStage;

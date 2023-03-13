import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import styled from 'styled-components';
import FlexBox from 'components/FlexBox';
import FlexBoxEffect from 'components/FlexBoxEffect';


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
    thunderText: {
      color: '#FFD506',
      marginLeft: '10%',
      fontSize: xs ? '2vh' : '2vw',
    },
    stageNumber: {
      fontSize: xs ? '2.2vh' : '2.2vw',
      position: 'absolute',
      top: '7%',
      left: '0',
      right: '0',
      bottom: '0',
    },
  }),
);

interface IStage {
  id: string;
  image: string;
  stages: {
    id: number;
    number: string;
    staminaCost: string;
    status: string;
    boostCost: number;
    phases: {
      id: number;
      phase_no: number;
    }[];
    monsters: number[];
  }[];
}

interface ICarouselItem {
  stage: IStage;
  onClickItem: (data: any) => void;
}

const CarouselItem = (props: ICarouselItem) => {
  const { stage, onClickItem } = props;

  const classes = useStyles();

  return (
    <div className="carousel-item">
      <img alt={''} src={stage.image} />
      {stage.stages.map((item, index) => {
        const stateIdxNum = `${index + 1}`;
        return (
          <Stage
            key={item.number}
            number={stateIdxNum}
            isHoverEffect={item.status === 'clear' || item.status === 'current'}
            isClickEffect={item.status === 'clear' || item.status === 'current'}
          >
            <FlexBox
              // @ts-ignore
              css={`
                flex-direction: row;
                align-items: center;
                margin-bottom: 8%;
              `}
            >
              <Thunder
                width={'35%'}
                src={
                  require('../../assets/image/ui/6c2320839283c1b9bb8eee52b64c9f5a.png')
                    .default
                }
                alt={'thunder'}
              />
              <Typography
                className={`textshadow-purple ${classes.thunderText}`}
              >
                {item.staminaCost}
              </Typography>
            </FlexBox>
            <ImageContainer
              status={item.status}
              onClick={() => onClickItem(item)}
            >
              <img
                alt={''}
                src={
                  item.status === 'clear'
                    ? require('../../assets/image/stage/blue-stage.png').default
                    : item.status === 'current'
                    ? require('../../assets/image/stage/pink-stage.png').default
                    : require('../../assets/image/stage/grey-stage.png').default
                }
                width={'100%'}
                draggable={'false'}
              />
              <Typography
                className={
                  item.status === 'clear'
                    ? `textshadow-blue ${classes.stageNumber}`
                    : item.status === 'current'
                    ? `textshadow-purple ${classes.stageNumber}`
                    : `textshadow-light-gray ${classes.stageNumber}`
                }
                sx={{
                  color: 'text.primary',
                }}
              >
                {item.number}
              </Typography>
            </ImageContainer>
          </Stage>
        );
      })}
    </div>
  );
};

interface StyledImageContainerProps {
  status?: string;
}

const ImageContainer = styled.button<StyledImageContainerProps>`
  position: relative;
  cursor: ${(props) => (props.status === '' ? 'not-allowed' : 'pointer')};
  border: unset;
  background-color: transparent;

  &:hover {
    transform: ${(props) => (props.status === '' ? 'none' : 'scale(1.1)')};
    transition: ${(props) =>
      props.status === '' ? 'none' : 'transform 100ms linear'};
  }

  &:active {
    transform: ${(props) => (props.status === '' ? 'none' : 'scale(0.9)')};
    transition: ${(props) =>
      props.status === '' ? 'none' : 'transform 100ms linear'};
  }
`;

interface StyledStageProps {
  number: string;
}

const Stage = styled(FlexBoxEffect)<StyledStageProps>`
  width: 10vw;
  align-items: center;
  position: absolute;
  bottom: ${(props) => {
    switch (props.number) {
      case '1':
        return '12%;';
      case '2':
        return '30%;';
      case '3':
        return '12%;';
      default:
        return '12%;';
    }
  }}
  left: ${(props) => {
    switch (props.number) {
      case '1':
        return '9%;';
      case '2':
        return '40%;';
      case '3':
        return '71%;';
      default:
        return '9%;';
    }
  }}
`;

const Thunder = styled.img`
  width: 35% !important;
`;

export default CarouselItem;
import { Box, Card, CardMedia, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import assets from 'constants/GameAssets';
import { filter, findIndex, isNull, map } from 'lodash';
import React, { Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import ButtonEffect from './ButtonEffect';
import FlexBox from './FlexBox';
import Carousel from './shop/carousel';


const useStyles = makeStyles(
  ({}: { xs: boolean; sm: boolean; md: boolean; lg: boolean }) => ({
    titleText: {
      top: '24.5% !important',
      position: 'absolute',
      zIndex: 2,
    },
    cardContainer: {
      width: '100%',
      height: '100%',
    },
    cardGem: {
      position: 'relative',
      userSelect: 'none',
      background: `url(${
        require('../assets/image/ui/1114f97b356eead12a4f6785b9ecad39.png')
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
    },
    btnCard: {
      background: `url(${
        require('../assets/image/ui/a2280d0a9e8bb1b509fbd5b4738cfa84.png')
          .default
      })`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'contain',
      backgroundColor: 'transparent',
      position: 'absolute',
      width: '58%',
      '&:hover': { backgroundColor: 'transparent' },
      '&:disabled': {
        color: 'white',
      },
    },
    cardMedia: {
      width: 'auto',
      height: '39%',
      objectFit: 'fill',
      objectPosition: 'center center',
    },
  }),
);

interface IGem {
  id: string;
  name: string;
  hero: string | null;
  source: string;
  level_needed: boolean;
  attribute: {
    name: string;
  };
  attribute_value: number;
  attribute_is_percentage: boolean;
  nft_id: string;
}

interface ISelectGem {
  id: number;
  gem_slot: number;
  gem: IGem | null;
  hero: string;
}

interface IGemList {
  id: number;
  gem: IGem | null;
  gem_slot: number;
  hero: string;
  source: string;
}

interface IModalSelectGems {
  onClose: () => void;
  setSlot: () => void;
  setGemSlot: any;
  gemSlot: ISelectGem[];
  slot: number | null;
  show: boolean;
  data: IGemList[] | [];
  setData: Dispatch<React.SetStateAction<IGemList[] | []>>;
  hero: any;
}

const ModalSelectGems = (props: IModalSelectGems) => {
  const { onClose, show, data, setData, slot, setSlot, gemSlot, setGemSlot } =
    props;
  const classes = useStyles();

  const handleClose = async () => {
    onClose();
    setSlot();
  };
  const handleRemove = (index: number) => {
    setGemSlot({ ...gemSlot, [`slot${index + 1}`]: { gem: null } });
    onClose();
  };

  const handleSelect = async (index: number, gem: any) => {
    const slot = gemSlot[index];
    let gemEl;
    if (slot && slot.gem) {
      const nft_id = slot.gem?.nft_id;
      const assetGroups = Object.entries(assets);
      const source = filter(
        map(assetGroups, (asset: any[]) => {
          const items = asset[1];
          const item = filter(items, (item) => item.id === nft_id)[0] || '';
          return item.image;
        }),
        (url) => url,
      )[0];
      gemEl = { ...slot, source };
    }
    setGemSlot({ ...gemSlot, [`slot${index + 1}`]: gem });
    const idx = findIndex(
      data,
      ({ gem: { nft_id: id } }: any) => id === gem?.gem?.nft_id,
    );
    setData(data.splice(idx, 1));
    if (gemEl) {
      setData([...data, gemEl].sort((a, b) => a.id - b.id));
      return onClose();
    }
    setData([...data].sort((a, b) => a.id - b.id));
    onClose();
  };

  useEffect(() => {
    // @ts-ignore
    if (!show && data.find((gem) => gem?.gem?.id === -1)) {
      data.shift();
      setData([...data]);
      return;
    }

    if (
      show &&
      slot &&
      // @ts-ignore
      gemSlot[`slot${slot}`] &&
      // @ts-ignore
      gemSlot[`slot${slot}`].gem &&
      // @ts-ignore
      !data.find((gem) => gem?.gem?.id === -1)
    ) {
      data.unshift({
        // @ts-ignore
        gem: { id: -1 },
      });
      setData([...data]);
    }
  }, [slot, show, setData]);

  return (
    <>
      <Modal show={show}>
        <Container>
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
            Equipments
          </Title>
          <Card
            className={`card-select-gems ${classes.cardContainer}`}
            elevation={0}
          >
            {/* @ts-ignore */}
            <Content>
              <Carousel show={4}>
                {data &&
                  map(
                    // @ts-ignore
                    filter(data, ({ gem }) => {
                      if (isNull(gem)) return;
                      const gemSlotIds = filter(
                        map(Object.values(gemSlot), ({ gem }: { gem: any }) => {
                          if (isNull(gem)) return;
                          return new BigNumber(gem.nft_id, 16).toString();
                        }),
                        Boolean,
                      );
                      return !gemSlotIds.includes(gem?.nft_id);
                    }),
                    (gem: any, i) => {
                      return (
                        <Box
                          key={i}
                          className={classes.cardGem}
                          sx={{
                            color: '$text-secondary',
                          }}
                        >
                          <ItemName
                            className={'textshadow'}
                            gutterBottom
                            sx={{
                              color: 'text.primary',
                            }}
                          >
                            {gem?.gem?.id === -1
                              ? 'Remove Gem'
                              : gem?.gem?.name}
                          </ItemName>
                          {gem?.gem?.id !== -1 && (
                            <CardMedia
                              className={classes.cardMedia}
                              component="img"
                              image={gem.source}
                              alt={''}
                            />
                          )}
                          {gem?.gem?.id !== -1 && (
                            <>
                              <ItemDetail>{`${gem?.gem?.attribute.name} + ${
                                gem?.gem?.attribute_value
                              }${
                                gem?.gem?.attribute_is_percentage ? '%' : ''
                              },`}</ItemDetail>
                              <ItemDetail>{`Require lv ${gem?.gem?.level_needed}`}</ItemDetail>
                            </>
                          )}
                          <ButtonSelect
                            className={`${classes.btnCard} textshadow-primary`}
                            variant="text"
                            disableRipple
                            sx={{
                              color: 'text.primary',
                            }}
                            onClick={() =>
                              gem?.gem?.id === -1
                                ? handleRemove(slot! - 1)
                                : handleSelect(slot! - 1, gem)
                            }
                          >
                            {gem?.gem?.id === -1 ? 'Remove' : 'Select'}
                          </ButtonSelect>
                        </Box>
                      );
                    },
                  )}
              </Carousel>
            </Content>
          </Card>
        </Container>
      </Modal>
    </>
  );
};

interface IModalSelectGemsStyleProps {
  show: boolean;
}

const Modal = styled.div<IModalSelectGemsStyleProps>`
  aspect-ratio: 16 / 9;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 2000;
  overflow: hidden;
`;

const Container = styled.div`
  width: 60%;
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  position: absolute;
  left: 0;
  right: 0;
  top: -15%;
  bottom: 0;
  margin: auto;
  box-sizing: border-box;
`;

const BtnClose = styled(ButtonEffect)`
  position: absolute;
  right: -3%;
  top: 24.5%;
  background-color: transparent;
  background-size: 70% auto;
  border: none;
  z-index: 1;
  height: 18% !important;
  width: 11%;

  @media (min-width: 280px) and (max-width: 1279px) {
    top: 23%;
  }

  @media all and (display-mode: fullscreen) {
    top: 14%;
  }
`;

const Title = styled(Typography)`
  @media screen and (max-width: 1920px) {
    top: 24.5%;
  }

  @media screen and (max-width: 1279px) {
    top: 21%;
  }

  @media all and (display-mode: fullscreen) {
    top: 16%;
  }

  @media (orientation: portrait) {
    font-size: 2vh;
  }

  @media (orientation: landscape) {
    font-size: 2vw;
  }
`;

const Content = styled(FlexBox)`
  position: absolute;
  top: 33%;
  left: 6%;
  width: 88%;
  height: 42%;
`;

const ItemName = styled(Typography)`
  margin-top: 14%;
  margin-bottom: 15%;
  text-align: center;

  @media (min-width: 280px) and (max-width: 1279px) {
    margin-top: 12%;
    margin-bottom: 15%;
  }

  @media all and (display-mode: fullscreen) {
  }

  @media (orientation: portrait) {
    font-size: 1.4vh;
  }

  @media (orientation: landscape) {
    font-size: 1.4vw;
  }
`;

const ItemDetail = styled(Typography)`
  color: #8e1b1b;
  line-height: 1.2;

  @media (orientation: portrait) {
    font-size: 1.35vh;
  }

  @media (orientation: landscape) {
    font-size: 1.35vw;
  }
`;

interface IBlendingStyleProps {
  blending?: boolean;
}

const ButtonSelect = styled(ButtonEffect)<IBlendingStyleProps>`
  bottom: 2.5%;
  ${(props) =>
    props.blending &&
    'mix-blend-mode: luminosity;'} @media(min-width: 280 px) and (max-width: 1279 px) {
    bottom: -2%;
  }

  @media all and (display-mode: fullscreen) {
  }

  @media (orientation: portrait) {
    font-size: 1.4vh;
  }

  @media (orientation: landscape) {
    font-size: 1.4vw;
  }

  &:hover {
    transform: scale(1.02);
    transition: transform 100ms linear;
  }

  &:active {
    transform: translateY(3px);
    transition: transform 100ms linear;
  }
`;

export default ModalSelectGems;
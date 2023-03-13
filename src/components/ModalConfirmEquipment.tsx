import { Card, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import { forEach, map } from 'lodash';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useGetGemSlots from 'hooks/useGemSlots';
import slotGemBG from '../assets/image/ui/slot-gems.png';
import ButtonEffect from './ButtonEffect';
import FlexBox from './FlexBox';


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
      top: '25.5% !important',
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
    cardMedia: {
      width: 'auto',
      height: '39%',
      objectFit: 'fill',
      objectPosition: 'center center',
      marginBottom: '3%',
    },
  }),
);

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

interface ISelectGem {
  name: any;
  id: number;
  gem_slot: number;
  gem: IGem | null;
  hero: string;
}

interface IModalConfirmEquipment {
  id: string;
  onClose: () => void;
  show: boolean;
  data: ISelectGem[];
}

const ModalConfirmEquipment = (props: IModalConfirmEquipment) => {
  const { id, onClose, show, data } = props;
  const theme = useTheme();
  const [gemSlot, setGemSlot] = useState<ISelectGem[] | []>([]);

  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();

  const { onUpdateGemSlots } = useGetGemSlots();

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    (async () => {
      const idList = map(gemSlot, ({ nft_id }: any) => nft_id);
      const gemList = {};
      forEach(idList, (id, i) => {
        const _id = new BigNumber(id).toString(16);
        // @ts-ignore
        gemList[`slot${i + 1}`] = !isNaN(id)
          ? _id
            ? _id.length < 64
              ? `${'0'.repeat(39)}${_id}`
              : _id
            : null
          : null;
      });
      await onUpdateGemSlots(id, gemList);
      onClose();
    })();
  };

  useEffect(() => {
    if (!data) return;
    const gemSlot = map(data, (gem) => {
      // @ts-ignore
      return { ...gem.gem, gem: { source: gem.source } };
    });
    // @ts-ignore
    setGemSlot([...gemSlot]);
  }, [data]);

  return (
    <>
      <Modal show={show}>
        <Container>
          <Title
            className={`textshadow ${classes.titleText}`}
            gutterBottom
            sx={{
              color: 'text.primary',
            }}
          >
            Confirmation
          </Title>
          <Card
            className={`card-confirm-equipments ${classes.cardContainer}`}
            elevation={0}
          >
            {/*@ts-ignore*/}
            <Content>
              {/*@ts-ignore*/}
              {gemSlot.map((d, i) => {
                return (
                  // @ts-ignore
                  <HodlerItem key={i}>
                    {/*@ts-ignore*/}
                    <HolderImage>
                      <img alt={''} src={d?.gem?.source} width={'83%'} />
                    </HolderImage>
                    <ItemName
                      className={'textshadow'}
                      gutterBottom
                      sx={{
                        color: 'text.primary',
                      }}
                    >
                      {d?.name ? d.name : 'Empty'}
                    </ItemName>
                  </HodlerItem>
                );
              })}
            </Content>
            <ButtonsContainer>
              <ButtonModal
                onClick={handleClose}
                className={'btn secondary-sm'}
                disableRipple
                sx={{
                  color: 'text.primary',
                }}
              >
                Cancel
              </ButtonModal>
              <ButtonModal
                className={'btn primary-sm'}
                onClick={handleConfirm}
                disableRipple
                sx={{
                  color: 'text.primary',
                }}
              >
                Confirm
              </ButtonModal>
            </ButtonsContainer>
          </Card>
        </Container>
      </Modal>
    </>
  );
};

interface IModalConfirmEquipmentStyleProps {
  show: boolean;
}

const Modal = styled.div<IModalConfirmEquipmentStyleProps>`
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
  width: 55%;
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  position: absolute;
  left: 0;
  right: 0;
  top: -18%;
  bottom: 0;
  margin: auto;
  box-sizing: border-box;
`;

const Title = styled(Typography)`
  @media screen and (max-width: 1920px) {
    top: 26.2%;
  }

  @media screen and (max-width: 1279px) {
    top: 25.5%;
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
  top: 35%;
  left: 7%;
  width: 86%;
  height: 36%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  grid-row: 5;
  column-gap: 3%;
`;

const HodlerItem = styled(FlexBox)`
  ${({ key }: { key: string }) => key}
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  padding-top: 15%;
`;

const HolderImage = styled(FlexBox)`
  width: 100%;
  height: 40%;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  background: url(${slotGemBG}) no-repeat;
  background-size: contain;
  background-position: center;
  margin-bottom: 15%;
`;

const ItemName = styled(Typography)`
  text-align: center;

  @media (orientation: portrait) {
    font-size: 1.4vh;
  }

  @media (orientation: landscape) {
    font-size: 1.4vw;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  bottom: 10%;
  column-gap: 2%;

  @media screen and (max-width: 1920px) {
    bottom: 15%;
  }

  @media screen and (max-width: 1279px) {
    bottom: 12%;
  }
`;

const ButtonModal = styled(ButtonEffect)`
  width: 20%;
  height: 100%;

  @media screen and (max-width: 1920px) {
    padding: 1%;
  }

  @media (orientation: portrait) {
    font-size: 1.8vh;
  }

  @media (orientation: landscape) {
    font-size: 1.8vw;
  }
`;

export default ModalConfirmEquipment;
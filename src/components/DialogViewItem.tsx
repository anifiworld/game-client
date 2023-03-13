import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ButtonEffect from './ButtonEffect';

interface IDialogItem {
  onClose: () => void;
  open: boolean;
  title?: string;
  description?: string;
  subtitle?: string;
  image?: any;
  images?: any[];
  imageComponents?: any[];
  img?: any;
  imageLabel?: string;
  imageLabels?: string[];
  selected?: any[];
  hero?: boolean;
  inventory?: boolean;
  amount?: number;
  onOpen?: (type: number, amount: number) => void;
  onClaim?: () => void;
  getGachaHero?: boolean;
  claimable?: boolean;
  category?: string;
}

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
      bottom: '5%',
      height: '10%',
      width: '80%',
      '&:hover': { backgroundColor: 'transparent' },
      fontSize: xs ? '1.5vh' : '1.5vw',
      '&:disabled': {
        color: 'rgba(255, 255, 255, 0.692)',
        background: `url(${
          require('../assets/image/ui/db04ff30924719e791085dd40b241d88.png')
            .default
        })`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
        backgroundColor: 'transparent',
      },
    },
  }),
);

const DialogViewItem = (props: IDialogItem) => {
  const {
    onClose,
    open,
    title,
    description,
    subtitle,
    image,
    images,
    imageComponents,
    img,
    imageLabel,
    imageLabels,
    selected,
    hero,
    inventory,
    amount = 1,
    onOpen,
    onClaim,
    getGachaHero,
    claimable,
    category,
  } = props;

  const [pendingTx, setPendingTx] = useState<boolean>(false);
  const [pendingBatchTx, setPendingBatchTx] = useState<boolean>(false);
  const chainId = process.env.REACT_APP_CHAIN_ID;
  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPendingBatchTx(false);
      setPendingTx(false);
    }, 500);
  };

  const onClick = (_amount = 1) => {
    _amount > 1 ? setPendingBatchTx(true) : setPendingTx(true);
    if (claimable && onClaim) return onClaim();
    if (!onOpen) return;
    const type = title?.includes('Basic')
      ? 1
      : title?.includes('Uncommon')
      ? 2
      : title?.includes('Rare')
      ? 3
      : 4;
    onOpen(type, _amount);
  };

  const classes = useStyles({ xs });
  useEffect(() => {
    if (!open)
      setTimeout(() => {
        setPendingTx(false);
        setPendingBatchTx(false);
      }, 500);
  }, [open]);

  return (
    <>
      <Dialog
        sx={{ backgroundColor: 'transparent' }}
        onClose={handleClose}
        open={open}
      >
        <ButtonEffect
          className="btn-close-dialog"
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            backgroundColor: 'transparent',
            border: 'none',
          }}
          onClick={handleClose}
        ></ButtonEffect>
        <Box
          className="dialog-container"
          sx={{ width: sm ? '440px' : '824px', height: sm ? '440px' : '622px' }}
        >
          <Typography
            className="textshadow-secondary"
            gutterBottom
            component="div"
            sx={{
              mt: sm ? 10 : 6,
              textAlign: 'center',
              fontSize: sm ? '1.4em' : '2em',
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              mt: image || (images && images.length > 3) ? 0 : sm ? 8 : 10,
              position: 'relative',
              backgroundColor: '#DAC1C5',
              width:
                images && images.length === 2
                  ? sm
                    ? '320px'
                    : '440px'
                  : images && images.length >= 3
                  ? sm
                    ? '340px'
                    : '684px'
                  : sm
                  ? '180px'
                  : '340px',
              height:
                images && images.length === 2
                  ? sm
                    ? '160px'
                    : '280px'
                  : images && images.length >= 3
                  ? sm
                    ? '200px'
                    : '400px'
                  : sm
                  ? '120px'
                  : getGachaHero
                  ? '390px'
                  : '245px',
              borderRadius: sm ? '20px' : '40px',
            }}
          >
            {image ? (
              image
            ) : imageComponents ? (
              imageComponents
            ) : images && imageLabels ? (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{
                  width:
                    images.length === 2
                      ? sm
                        ? '320px'
                        : '420px'
                      : images.length >= 3
                      ? sm
                        ? '340px'
                        : '684px'
                      : sm
                      ? '180px'
                      : '340px',
                  height:
                    images.length === 2
                      ? sm
                        ? '160px'
                        : '280px'
                      : images.length >= 3
                      ? sm
                        ? '200px'
                        : '400px'
                      : sm
                      ? '120px'
                      : '245px',
                }}
              >
                {_.map(images, (image, index) => (
                  <Grid
                    key={image}
                    container
                    item
                    xs={images.length <= 3 ? 12 / images.length : 4}
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <img
                      src={image}
                      alt="hero-dust"
                      style={{
                        maxHeight: images.length === 1 ? 300 : sm ? 100 : 200,
                        marginTop: images.length === 1 ? -30 : 0,
                      }}
                    />
                    <Typography
                      className="textshadow-secondary"
                      variant="button"
                      display="block"
                      gutterBottom
                      sx={{
                        alignSelf: 'flex-end',
                        fontSize:
                          images.length === 1
                            ? sm
                              ? '1.8em'
                              : '3em'
                            : sm
                            ? '0.6em'
                            : '1.6em',
                        ml: -3,
                      }}
                    >
                      {`x${imageLabels[index]}`}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ) : (
              img && (
                <Box
                  sx={{
                    m: 0,
                    mt: 5,
                    position: 'absolute',
                    left: '50%',
                    top: sm ? '-25px' : '-80px',
                    transform: ' translateX(-50%)',
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL + img}`}
                    alt="hero-dust"
                    style={{
                      maxHeight: sm ? 150 : 300,
                    }}
                  />
                </Box>
              )
            )}
            <Typography
              className="textshadow-secondary"
              variant="button"
              display="block"
              gutterBottom
              sx={{
                m: 0,
                position: 'absolute',
                right: '15px',
                bottom: 0,
                fontSize: sm ? '1.8em' : '3em',
              }}
            >
              {imageLabel}
            </Typography>
          </Box>
          <Typography
            variant="button"
            display="block"
            gutterBottom
            sx={{
              color: '#7B359B',
              mt: 2,
              textAlign: 'center',
              fontSize: sm ? '1.1em' : '1.5em',
            }}
          >
            {subtitle}
          </Typography>
          <Typography
            gutterBottom
            component="div"
            sx={{
              textAlign: 'center',
              color: '#7B359B',
              fontSize: sm ? '1.1em' : '1.4em',
              width: '60%',
              wordBreak: 'break-word',
            }}
          >
            {description}
          </Typography>
          {(hero || inventory || category === 'Packs' || claimable) && (
            <>
              <ButtonEffect
                className={`${classes.btnCard} textshadow-primary`}
                onClick={() => onClick(1)}
                variant="text"
                disabled={pendingTx || pendingBatchTx}
                disableRipple
                sx={{
                  width: '20% !important',
                  color: 'text.primary',
                  mb: sm ? 7 : 1,
                  ml: amount > 1 && !claimable ? -30 : 0,
                }}
              >
                {claimable
                  ? pendingTx
                    ? 'Claiming...'
                    : 'Claim'
                  : pendingTx
                  ? 'Opening...'
                  : 'Open'}
              </ButtonEffect>
              {amount > 1 && !claimable && (
                <ButtonEffect
                  className={`${classes.btnCard} textshadow-primary`}
                  onClick={() => onClick(amount)}
                  variant="text"
                  disabled={pendingBatchTx || pendingTx}
                  disableRipple
                  sx={{
                    width: '20% !important',
                    color: 'text.primary',
                    mb: sm ? 7 : 1,
                    ml: 30,
                  }}
                >
                  {pendingBatchTx ? 'Opening...' : `Open x${amount}`}
                </ButtonEffect>
              )}
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default DialogViewItem;

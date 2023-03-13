import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ButtonEffect from '../ButtonEffect';

type shopItem = {
  name: string;
  image: string;
  price: string;
};

const responsive = {
  desktop: {
    breakpoint: { max: 4000, min: 768 },
    items: 4,
    partialVisibilityGutter: 0,
  },
  tablet: {
    breakpoint: { max: 768, min: 600 },
    items: 4,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 4,
    partialVisibilityGutter: 30,
  },
};

const useStyles = makeStyles(() => ({
  customInput: {
    background: `url(${
      require('../../assets/image/ui/d22a1892b142cb444669ecba7cdee0e3.png')
        .default
    })`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'fill',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    textAlign: 'center',
    color: '#8E1B1B',
  },
}));

const ShopCarousel = React.memo(({ shopItems }: { shopItems: shopItem[] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [munus, setMunus] = useState<shopItem[]>([]);
  const [testValue, setValue] = useState<number>(1);

  useEffect(() => {
    setMunus(shopItems);
    // return () => {
    //     cleanup
    // }
  }, [munus, shopItems]);

  const classes = useStyles();

  return (
    // @ts-ignore
    <Carousel
      responsive={responsive}
      arrows
      additionalTransfrom={0}
      itemClass={'react-carousel-item'}
      minimumTouchDrag={80}
      partialVisible
      renderButtonGroupOutside
    >
      {munus?.map((item, index) => (
        <Card key={index} className="card-shop">
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{ fontSize: { xs: '16px', md: '20px', minHeight: '24px' } }}
              className="textshadow"
              color="text.primary"
              variant="button"
              display="block"
              gutterBottom
            >
              {item.name}
            </Typography>
            <Box
              sx={{
                mt: 2,
                height: '225px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CardMedia
                sx={{
                  width: '180px',
                  height: 'auto',
                  maxHeight: '225px',
                  objectFit: 'fill',
                  objectPosition: 'center',
                }}
                component="img"
                image={item.image}
                alt={item.name}
              />
            </Box>
            <Typography
              sx={{ color: '#8E1B1B', fontSize: { xs: '1em', md: '1.2em' } }}
              display="block"
              gutterBottom
            >
              Price: {item.price} ANIFI
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <ButtonEffect
                onClick={() => {
                  setValue(testValue + 1);
                }}
                sx={{
                  backgroundColor: 'transparent',
                  '&:hover': { backgroundColor: 'transparent' },
                }}
                variant="text"
                disableRipple
              >
                <img
                  width={isMobile ? '25px' : '42px'}
                  src={
                    require('../../assets/image/ui/97e904d8428149bd936a5315d18bd264.png')
                      .default
                  }
                  alt="plus-btn"
                />
              </ButtonEffect>
              <input
                type="number"
                style={{ fontSize: isMobile ? '1.2em' : '1em' }}
                className={classes.customInput}
                value={testValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setValue(parseInt(e.target.value));
                }}
              ></input>
              <ButtonEffect
                onClick={() => {
                  setValue(testValue - 1);
                }}
                sx={{
                  backgroundColor: 'transparent',
                  '&:hover': { backgroundColor: 'transparent' },
                }}
                variant="text"
                disableRipple
              >
                <img
                  width={isMobile ? '25px' : '42px'}
                  src={
                    require('../../assets/image/ui/4ef6eede10d432137b93f44d7e94797d.png')
                      .default
                  }
                  alt="plus-btn"
                />
              </ButtonEffect>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Carousel>
  );
});

export default ShopCarousel;

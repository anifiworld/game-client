import React, { useRef } from 'react';
import {
  withStyles,
  makeStyles,
  Theme,
  createStyles,
  useTheme
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Slider from '@material-ui/core/Slider';
import { Typography } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginBottom: '5%',
    },
    margin: {
      height: theme.spacing(3)
    }
  })
);

const ImageSlider = withStyles({
  root: {
    height: '100%',
    padding: '0'
  },
  thumb: {
    top: '25%',
    height: '100%',
    backgroundImage: `url(${
      require('../assets/image/ui/play-icon.png')
        .default
    })`,
    backgroundSize: 'cover',
    width: '14%',
    backgroundColor: 'transparent !important',
    marginTop: -20,
    marginLeft: -16,
    '&:hover': {
      boxShadow: 'none'
    },
    '&:active': {
      boxShadow: 'none'
    },
    '&:focus-visible': {
      boxShadow: 'none'
    },
    '@media (min-width: 280px) and (max-width: 1279px)' : {
      top: '60%',
    }
  },
  track: {
    //styles the line between thumbs
    height: '55%',
    color: '#ED61E3',
    border: '3px solid #BF30BC',
    borderRadius: '50px',
    '&::before': {
      height: '25%',
      width: '100%',
      content: '""',
      display: 'block',
      backgroundColor: '#F7AFED',
      borderRadius: '50px',
      position: 'absolute',
      top: '1px',
      left: '12px',
      '@media (min-width: 280px) and (max-width: 1279px)' : {
        width: '90%',
      }
    }
  },
  rail: {
    //styles line outside of thumbs
    color: '#EED4D0',
    opacity: 1,
    height: '55%',
    border: '3px solid #EED4D0',
    borderRadius: '50px',
  }
})(Slider);

interface ICustomizedSlider {
  title: string;
  value: number;
  onChange: (value: any) => any;
}

const CustomizedSlider = (props: ICustomizedSlider) => {
  const { title, value, onChange } = props;

  const classes = useStyles();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <Typography
        sx={{
          textAlign: 'left',
          color: '#7B359B',
          fontSize: xs ? '1.8vh' : '1.8vw',
          width: '50%',
        }}
      >
        {title}
      </Typography>
      <ImageSlider
        value={value}
        onChange={(event, coordinates ) => {
          onChange(coordinates);
        }}
      />
    </div>
  );
}

export default CustomizedSlider;

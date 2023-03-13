import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { orderBy } from 'lodash';
import { useNavigate } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import StageCarousel from 'components/stageCarousel';
import useGetStageList from 'hooks/useStageList';
import ButtonEffect from 'components/ButtonEffect';

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
      top: '13.6%',
      position: 'absolute',
      fontSize: xs ? '2vh' : '2vw',
      zIndex: 2,
    },
    cardContainer: {
      position: 'absolute',
      top: '11%',
      marginTop: '0',
      paddinTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      width: '75%',
      height: '70%',
    },
    setTeamButton: {
      paddingLeft: '3%',
      paddingRight: '3%',
      paddingTop: '1%',
      paddingBottom: '1%',
      fontSize: xs ? '2.25vh' : '2.25vw',
      display: 'flex',
      alignItems: 'center',
    },
    setTeamImage: {
      position: 'absolute',
      left: '-15%',
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

const StageSelection = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const { onGetStageList } = useGetStageList();

  const navigate = useNavigate();
  const classes = useStyles();
  
  const [stageData, setStageData] = useState<any>({});

  // wait for the component to be mounted
  useEffect(() => {
    const rootStyle = document.getElementById('container')!.style;
    rootStyle.backgroundImage = `url(${
      require('../../assets/image/bg/bg-stage.png').default
    })`;
    rootStyle.backgroundRepeat = 'no-repeat';
    rootStyle.backgroundColor = '#FAFAFA';
    rootStyle.backgroundPosition = 'center center';
    rootStyle.backgroundSize = 'cover';
  }, []);

  useEffect(() => {
    (async () => {
      let stageList = await onGetStageList();
      stageList = orderBy(stageList, (row) => parseInt(row.name), ['asc', 'desc']);
      setStageData({
        id: '1',
        world: '1',
        stageList: stageList
      })
    })();
  }, [onGetStageList]);

  return (
    <>
      <Grid container rowSpacing={0}>
        <Grid item xs={12} className={classes.gridCard}>
          <Stack spacing={0} className={classes.stack}>
            <Typography
              className={`textshadow ${classes.titleText}`}
              gutterBottom
              sx={{
                color: 'text.primary',
              }}
            >
              {`World ${stageData.world} : Stage Selection`}
            </Typography>

            <Card className={`card-stage-selection ${classes.cardContainer}`} elevation={0}>
              <StageCarousel data={stageData} />
            </Card>
          </Stack>
        </Grid>
      </Grid>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          <Box className={classes.buttonsContainer}>
            <ButtonEffect
              className={`btn secondary ${classes.setTeamButton}`}
              sx={{ color: 'text.primary' }}
              onClick={() => navigate('/team')}
              disableRipple
            >
              <img
                alt="img-left-home"
                src={
                  require('../../assets/image/ui/aa4ea707fbbf8a1388362297a96a60ba.png')
                    .default
                }
                width="30%"
                className={classes.setTeamImage}
              />
              Set Team
            </ButtonEffect>
            <ButtonEffect
              className={`btn primary ${classes.backButton}`}
              onClick={() => navigate('/select-world')}
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
    </>
  );
};

export default StageSelection;
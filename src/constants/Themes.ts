import { createTheme } from '@mui/material/styles';
import { DefaultTheme } from 'styled-components';

export const theme = createTheme({
  typography: {
    fontFamily: "'LuckiestGuy', 'OpenSans', sans-serif",
  },
  palette: {
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(112, 10, 10, 1)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    common: {
      black: '#000000',
      white: '#ffffff',
    },
    // guiBar: {
    //   backgroundColor: '#000000',
    //   borderColor: '#000000',
    //   borderWidth: '3px',
    //   topBarHeight: '0px',
    //   bottomBarHeight: '50px',
    // },
  },
});

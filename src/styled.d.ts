import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;
    palette: {
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      common: {
        black: string;
        white: string;
      };
      guiBar: {
        backgroundColor: string;
        borderWidth: string;
        borderColor: string;
        topBarHeight: string;
        bottomBarHeight: string;
      };
    };
  }
}

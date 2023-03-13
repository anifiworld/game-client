import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { theme } from '../constants/Themes';

const Theme: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;

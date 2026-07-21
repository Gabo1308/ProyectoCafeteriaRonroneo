import { createTheme } from '@mui/material/styles';
export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#A9764F',
      light: '#C39A72',
      dark: '#6E4A2E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C97F3E',
      dark: '#9C5F28',
      contrastText: '#FFFFFF',
    },
    primaryLight: {
      main: '#D9C3A0',
      contrastText: '#5C3A21',
    },
    background: {
      default: '#EDE4D6',
      paper: '#F7F1E7',
    },
  },
  shape: {
    borderRadius: 10,
  },
});
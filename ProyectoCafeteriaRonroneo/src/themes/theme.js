import { createTheme } from '@mui/material/styles'; 
export const appTheme= createTheme  ({ 
  palette: { 
    mode: 'light', 
    primary: { 
      main: '#C08552',
      light: '#D9A876',
      dark: '#8B5E3C',
      contrastText: '#c7a477',
    }, 
    secondary: { 
      main: '#f3b987',
      contrastText: '#000000',
    }, 
    primaryLight: { 
      main: '#E8D5B5',
      contrastText: '#6b3c19',
    },
    background: {
      default: '#eeddc9',
    },
  }, 
  shape: {
    borderRadius: 10,
  },
});
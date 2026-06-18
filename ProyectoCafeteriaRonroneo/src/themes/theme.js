import { createTheme } from '@mui/material/styles'; 
export const appTheme= createTheme  ({ 
  palette: { 
    mode: 'light', 
    primary: { 
      main: '#8B5E3C', 
    }, 
    secondary: { 
      main: '#D4A574', 
    }, 
    primaryLight: { 
        main: "#E8D5B5", 
        contrastText: "#5C3A21"  
      } 
  }, 
});
import { createTheme } from '@mui/material/styles';


export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        // primary: {
        //     main: '#632f83',
        // },
        // secondary: {
        //     main: '#324393',
        // },
        // background: {
        //     default: '#f8f9fa',
        //     paper: '#f1ecef',
        // },
    },

});


export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        // secondary: {
        //     main: '#582079',
        // },
    }


});

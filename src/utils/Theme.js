import {createTheme} from '@mui/material/styles';

export const lightTheme = createTheme({

    palette: {
        mode: 'light',
        primary: {
            main: '#f1ecef',
        },
        secondary: {
            main: '#2f4f4f',
        },
        background: {
            default: '#f2f2f2',
        }

    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: '#2f4f4f',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#2f4f4f',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#2f4f4f',
                        },
                    }
                }
            }
        }
    },
});

export const darkTheme = createTheme({

    palette: {
        mode: 'dark',
        secondary: {
            main: '#b0c4de',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    input: {
                        "&:-webkit-autofill": {
                            WebkitBoxShadow: "0 0 0 100px #616161 inset",
                            WebkitTextFillColor: "default",
                        },
                    },
                },
            },
        },
    },

});

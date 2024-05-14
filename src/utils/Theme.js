import {createTheme, styled} from '@mui/material/styles';

const commonOverrides = {
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    height: '40px',
                    '& .MuiInputBase-root': {
                        height: '100%',
                    },
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    height: '40px'
                }
            }
        }
    }
};

export const lightTheme = createTheme({

    ...commonOverrides,
    palette: {
        mode: 'light',
        primary: {
            main: '#989191',
        },
        secondary: {
            main: '#2f4f4f',
            //681f4a maybe?
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
    ...commonOverrides
});

export const CustomLink = styled('a')(({theme}) => ({
    marginRight: '10px',
    color: theme.palette.secondary.main,
}));

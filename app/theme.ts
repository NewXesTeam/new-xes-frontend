import { createTheme } from '@mui/material/styles';
import { red, blue, teal, grey, amber } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            light: blue[300],
            main: blue[600],
            dark: blue[800],
            contrastText: '#fff',
        },
        secondary: {
            light: teal[300],
            main: teal[500],
            dark: teal[700],
            contrastText: '#fff',
        },
        error: {
            light: red[300],
            main: red[500],
            dark: red[700],
            contrastText: '#fff',
        },
        warning: {
            main: amber[500],
            contrastText: '#000',
        },
        success: {
            main: teal[600],
        },
        info: {
            main: blue[500],
        },
        background: {
            default: '#f9fafb',
            paper: '#ffffff',
        },
        text: {
            primary: grey[900],
            secondary: grey[600],
            disabled: grey[400],
        },
    },

    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 14,

        h1: {
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '0.5em',
        },
        h2: {
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '0.5em',
        },
        h3: {
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '0.5em',
        },
        h4: {
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '0.5em',
        },
        h5: {
            fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: '0.5em',
        },
        h6: {
            fontSize: 'clamp(1.1rem, 1.8vw, 1.25rem)',
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: '0.5em',
        },

        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '1em',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
            marginBottom: '1em',
        },

        button: {
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.02em',
        },

        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.5,
            color: grey[500],
        },
        overline: {
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
    },

    spacing: 8,

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '7px 9px',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none',

                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-1px)',
                    },

                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                contained: {
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                },
                outlined: {
                    borderWidth: '1px',
                    '&:hover': {
                        borderWidth: '1px',
                    },
                },
                sizeSmall: {
                    padding: '6px 16px',
                },
                sizeLarge: {
                    padding: '14px 32px',
                    fontSize: '1rem',
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    overflow: 'hidden',
                    zIndex: 0,

                    '&:hover': {
                        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '& fieldset': {
                            borderColor: grey[200],
                        },
                        '&:hover fieldset': {
                            borderColor: blue[300],
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: blue[500],
                            borderWidth: 2,
                        },
                    },
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fff',
                    color: grey[900],
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(8px)',
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    padding: '0 12px',
                    height: 32,
                    fontSize: '0.75rem',
                },
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: grey[100],
                    height: 1,
                },
            },
        },

        MuiSwitch: {
            styleOverrides: {
                root: {
                    '& .MuiSwitch-thumb': {
                        borderRadius: '50%',
                    },
                    '& .MuiSwitch-track': {
                        borderRadius: 20,
                    },
                },
            },
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {
                    marginBottom: 3,
                    minHeight: 'unset',
                },
            },
        },
    },
});

export default theme;

const theme = {
	palette: {
        primary: {
            main: '#cbb09c'
        },
        secondary: {
            main: '#ffffff'
        },
        text: {
            primary: '#212121',
            secondary: '#9e9e9e',
        },
    },
    // closer to materialize's font (looks nicer than material-ui)
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    overrides: {
        // white button text - Button "color" only changes background color
        MuiButton: {
            containedPrimary: {
                color: '#ffffff'
            },
            textPrimary: {
                color: '#cbb09c',
                // '&:hover': {
                //     backgroundColor: '#fafafa'
                // }
            },
        },
        // font size for a TextField label
        MuiInputLabel: {
            root: {
                fontSize: 14
            }
        },
        // background color for a Snackbar
        MuiSnackbarContent: {
            root: {
                backgroundColor: '#00e676'
                // backgroundColor: '#00c853'
            }
        },
        // hotdog grid item size
        MuiCard: {
            root: {
                // maxWidth: 300,
            }
        },
        // height has to be specified for cardmedia, otherwise image invisible
        MuiCardMedia: {
            root: {
                height: 0,
                paddingTop: '100%',
            }
        },
        // capitalize ListItemText (hotdog card ingredients list)
        MuiListItem: {
            root: {
                textTransform: 'capitalize'
            }
        },
        // appbar color same as text.primary
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: '#212121',
            }
        },
        // remove margin from dialogcontenttext
        MuiDialogContentText: {
            root: {
                marginBottom: 0
            }
        },
        // remove ripple around iconbuttons, default color on hover same as primary
        MuiIconButton: {
            root: {
                '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#cbb09c'
                }
            }
        }
    }
}

export default theme;
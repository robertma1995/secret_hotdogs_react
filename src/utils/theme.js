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
                color: '#ffffff',
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
        // capitalize ListItemText
        MuiListItem: {
            root: {
                textTransform: "capitalize"
            }
        },
    }
}

export default theme;
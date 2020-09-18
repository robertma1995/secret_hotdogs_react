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
        // appbar color same as text.primary
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: '#212121',
            }
        },
        MuiButton: {
            root: {
                textTransform: 'none'
            },
            // white button text - contained Button "color" material ui attribute only changes background color
            containedPrimary: {
                color: '#ffffff'
            },
            // change color from lighter text.primary to primary.main, remove text transformation
            textPrimary: {
                color: 'rgba(0, 0, 0, 0.54)',
                '&:hover': {
                    color: '#cbb09c',
                    backgroundColor: 'transparent'
                }
            },
            // change color from secondary to primary on hover, and remove the button outline effect
            textSecondary: {
                '&:hover': {
                    color: '#cbb09c',
                    backgroundColor: 'transparent'
                }
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
        // disable padding between bottom of image and ingredients list
        MuiCardContent: {
            root: {
                paddingTop: 'unset'
            }
        },
        // custom maxwidth (smaller than default) for a dialog with maxWidth="xs"
        MuiDialog: {
            paperWidthXs: {
                maxWidth: '400px'
            }
        },
        // unset excessive padding in dialog content
        MuiDialogContent: {
            root: {
                paddingTop: 'unset!important',
                padding: 'unset!important'
            }
        },
        // move dialog buttons to left instead of right (only used in photoUploadDialog for now)
        MuiDialogActions: {
            root: {
                justifyContent: 'flex-start'
            }
        },
        // remove margin from dialogcontenttext
        MuiDialogContentText: {
            root: {
                marginBottom: 0
            }
        },
        // remove hover ripple around iconbuttons, default color on hover same as primary
        MuiIconButton: {
            root: {
                '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#cbb09c'
                }
            }
        },
        // font size for a TextField label
        MuiInputLabel: {
            root: {
                fontSize: 14
            }
        },
        // capitalize ListItemText (hotdog card ingredients list)
        MuiListItem: {
            root: {
                textTransform: 'capitalize'
            }, 
        },
        // avatar menu minimum width
        MuiPopover: {
            paper: {
                minWidth: 150
            }
        },
        // background color for a Snackbar
        MuiSnackbarContent: {
            root: {
                backgroundColor: '#00e676'
                // backgroundColor: '#00c853'
            }
        },
    }
}

export default theme;
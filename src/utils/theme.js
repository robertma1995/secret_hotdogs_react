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
    overrides: {
        // white button text - contained Button "color" only changes background color
        MuiButton: {
            containedPrimary: {
                color: '#ffffff'
            }
        }
    }
}

export default theme;
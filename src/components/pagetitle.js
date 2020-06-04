import React from 'react';
// material ui
import { Typography } from '@material-ui/core';

function PageTitle(props) {
	return (
		<Typography variant="h4" color="textSecondary" align="center">
            {props.text}
        </Typography>
	);
}

export default PageTitle;
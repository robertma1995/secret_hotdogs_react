import React from 'react';
import Link from '@material-ui/core/Link';
import { Link as LinkBase } from 'react-router-dom';

/*
    react-router-dom Link with styling options of material-ui Link
    optional additional onclick functionality
*/
function RouterLink(props) {
    const { color, underline, onClick, to } = props;
    return (
        <Link
            component={LinkBase}
            color={color}
            underline={underline}
            onClick={onClick ? () => onClick() : undefined }
            to={to}
        >
            {props.children}
        </Link>
    );
}

export default RouterLink;

import React from 'react';
import Link from '@material-ui/core/Link';
import { Link as LinkBase } from 'react-router-dom';

// react-router-dom Link with styling options of material-ui Link
function RouterLink(props) {
    const { color, underline, to } = props;
    return (
        <Link
            component={LinkBase}
            color={color}
            underline={underline}
            to={to}
        >
            {props.children}
        </Link>
    );
}

export default RouterLink;

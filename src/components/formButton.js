import React from 'react';
import Box from '@material-ui/core/Box';
import ProgressButton from './progressButton';

// ProgressButton wrapper - to be wrapped in a Form
function FormButton(props) {
    const { text, loading, handleClick } = props;
    return (
        <Box display="flex" justifyContent="center" p={1}>
            <ProgressButton text={text} loading={loading} handleClick={handleClick}/>
        </Box>
    );
}

export default FormButton;
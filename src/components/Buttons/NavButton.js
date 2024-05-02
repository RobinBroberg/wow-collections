import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavButton = ({ to, label }) => {
    return (
        <Button component={Link} to={to} variant="contained" color={"secondary"}>
            {label}
        </Button>
    );
};

export default NavButton;

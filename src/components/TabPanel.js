import {Box, Grid} from "@mui/material";
import React from "react";

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <Grid
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </Grid>
    );
};
export default TabPanel;

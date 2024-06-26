import React from "react";
import {Box, CircularProgress} from "@mui/material";


export function Spinner() {
    return (
    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
        <CircularProgress disableShrink color={"secondary"}/>
    </Box>
    );
}

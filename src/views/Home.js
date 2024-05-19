import React from 'react';

import {Grid, Typography} from "@mui/material";


function Home() {



    return (
        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant={"h4"} sx={{ marginBottom: 1, marginTop: 3, marginLeft: 1, fontWeight: "bold" }}>Home</Typography>
        </Grid>
    );
}

export default Home;

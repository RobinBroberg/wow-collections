import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Grid, List, ListItem, Paper} from "@mui/material";
import {refreshWowheadTooltips} from "../utils/utils";

function CollectedMounts() {
    const [mounts, setMounts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/mounts/collected')
        .then(response => {
            if (response.status === 200 && response.data && response.data.mounts) {
                setMounts(response.data.mounts);
                refreshWowheadTooltips();
            } else {
                throw new Error('Failed to fetch mounts');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setError('Failed to load mounts: ' + error.message);
        });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Grid container style={{display: "flex", justifyContent: "center"}}>
            <Grid item xs={8}>
                <h1>Mounts</h1>
                <Paper elevation={3} style={{padding: '20px'}}>
                    <List>
                        {mounts.map((mount) => (
                            <ListItem key={mount.mount.id}>
                                <a href={`https://www.wowhead.com/mount/${mount.mount.id}`} target="_blank"
                                   rel="noopener noreferrer">
                                </a>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default CollectedMounts;


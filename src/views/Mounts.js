import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Grid, List, ListItem, Paper} from "@mui/material";
import {refreshWowheadTooltips} from "../utils/utils";
import IGNORE_MOUNT_ID from "../data/mountData/mountData";


function Mounts() {
    const [mounts, setMounts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {

        const characterName = window.localStorage.getItem("character");
        const realm = window.localStorage.getItem("realm");

        if (!characterName || !realm) {
            setError("User name and realm are required.");
            return;
        }


        Promise.all([
            axios.get('http://localhost:5000/mounts'),
            axios.get(`http://localhost:5000/mounts/collected?characterName=${encodeURIComponent(characterName)}&realm=${encodeURIComponent(realm)}`)
        ]).then(([allMountsResponse, collectedMountsResponse]) => {
            if (!allMountsResponse.data || !collectedMountsResponse.data) {
                throw new Error("Invalid data structure from API");
            }

            const validMounts = allMountsResponse.data.mounts.filter(mount =>
                !IGNORE_MOUNT_ID.includes(mount.id)
            );


            const collectedIds = new Set(collectedMountsResponse.data.mounts.map(mount => mount.mount.id));

            const updatedMounts = validMounts.map(mount => ({
                ...mount,
                collected: collectedIds.has(mount.id)
            }));

            setMounts(updatedMounts);
            refreshWowheadTooltips();
        }).catch(error => {
            console.error('There was a problem fetching mount data:', error);
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
                            <ListItem key={mount.id}>
                                <a href={`https://www.wowhead.com/mount/${mount.id}`} target="_blank"
                                   rel="noopener noreferrer" style={{ marginRight: '10px' }}>
                                    {mount.name}
                                </a>
                                {mount.collected ? '✅' : ''}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Mounts;


import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Grid, Paper} from "@mui/material";
import {refreshWowheadTooltips} from "./AllAchievements";

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
        <Grid style={{ margin: '0 auto', maxWidth: '800px'}}>
            <h1>Mounts</h1>
            <Paper elevation={3} style={{padding: '20px'}}>
                <ul>
                    {mounts.map((item) => (
                        <li key={item.mount.id}>
                            <a href={`https://www.wowhead.com/mount/${item.mount.id}`} target="_blank"
                               rel="noopener noreferrer">
                            </a>
                        </li>
                    ))}
                </ul>
            </Paper>
        </Grid>

    );

}

export default CollectedMounts;


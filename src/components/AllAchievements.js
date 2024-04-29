import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Grid, Paper} from "@mui/material";

function AllAchievements() {
    const [achievements, setAchievements] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/achievements')
        .then(response => {
            console.log("API Response", response.data)
            if (response.status === 200 && response.data) {
                setAchievements(response.data.achievements);
                refreshWowheadTooltips();
            } else {
                throw new Error('Failed to fetch achievements');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setError('Failed to load achievements: ' + error.message);
        });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Grid style={{ margin: '0 auto', maxWidth: '800px' }}>
            <h1>Achievements!</h1>
            <Paper elevation={3} style={{ padding: '20px' }}>
            <ul>
                {achievements.map(achievement => (
                    <li key={achievement.id}>
                        <a href={`https://www.wowhead.com/achievement/${achievement.id}`} target="_blank"
                           rel="noopener noreferrer">
                        </a>


                    </li>
                ))}
            </ul>
            </Paper>
        </Grid>
    );
}

export function refreshWowheadTooltips() {
    // eslint-disable-next-line no-undef
    if (typeof $WowheadPower !== 'undefined' && typeof $WowheadPower.refreshLinks === 'function') {
        // eslint-disable-next-line no-undef
        $WowheadPower.refreshLinks();
    }
}

export default AllAchievements;

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Grid, List, ListItem, Paper} from "@mui/material";
import {refreshWowheadTooltips} from "../utils/utils";
import {CustomLink} from "../utils/Theme";

function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/achievements')
        .then(response => {
            console.log("API Response", response.data)
            if (response.status === 200 && response.data && response.data.achievements) {
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
        <Grid container style={{display: "flex", justifyContent: "center"}}>
            <Grid item xs={8}>
                <h1>Achievements!</h1>
                <Paper elevation={2} style={{padding: '20px'}}>
                    <List>
                        {achievements.map(achievement => (
                            <ListItem key={achievement.id}>
                                <CustomLink href={`https://www.wowhead.com/achievement=${achievement.id}`} target="_blank"
                                   rel="noopener noreferrer">
                                </CustomLink>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Achievements;

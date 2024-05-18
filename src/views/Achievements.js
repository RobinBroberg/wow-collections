import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Grid,  Paper, Typography} from "@mui/material";
import {refreshWowheadTooltips} from "../utils/Utils";
import {Spinner} from "../components/Spinner";
import AchievementList from "../components/AchievementList";


function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const characterName = window.localStorage.getItem("character");
        const realm = window.localStorage.getItem("realm");

        if (!characterName || !realm) {
            setError("User name and realm are required.");
            setLoading(false);
            return;
        }

        Promise.all([
            axios.get('http://localhost:5000/achievements'),
            axios.get(`http://localhost:5000/achievements/completed?characterName=${encodeURIComponent(characterName)}&realm=${encodeURIComponent(realm)}`)
        ]).then(([allAchievementsResponse, completedAchievementsResponse]) => {
            if (!allAchievementsResponse.data || !completedAchievementsResponse.data) {
                throw new Error("Invalid data structure from API");
            }

            const completedIds = new Set(completedAchievementsResponse.data.achievements.map(achievement => achievement.achievement.id));
            const updatedAchievements = allAchievementsResponse.data.map(achievement => ({
                ...achievement,
                collected: completedIds.has(achievement.id)
            }));

            setAchievements(updatedAchievements);
            refreshWowheadTooltips();
            setLoading(false);
        })
        .catch(error => {
            console.error('There was a problem fetching achievements:', error);
            setError('Failed to load achievements: ' + error.message);
            setLoading(false);
        });
    }, [])

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading){
        return (
            <Spinner/>
        )
    }

    return (
        <Grid container style={{display: "flex", justifyContent: "center"}}>
            <Grid item xs={8}>
                <Typography variant={"h4"} sx={{marginBottom: 1, marginTop: 3}}>Achievements</Typography>
                <Paper elevation={2} sx={{ padding: '20px'}}>
                    <AchievementList achievements={achievements} />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Achievements;

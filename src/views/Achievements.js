import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Box, Grid, ImageList, ImageListItem, Paper, Typography} from "@mui/material";
import {refreshWowheadTooltips} from "../utils/Utils";
import {CustomLink} from "../utils/Theme";
import {Spinner} from "../components/Spinner";


function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('http://localhost:5000/achievements')
        .then(response => {
            console.log("API Response", response.data)
            if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
                setAchievements(response.data);
                setLoading(false)
                refreshWowheadTooltips();
            } else {
                throw new Error('Failed to fetch achievements');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            setError('Failed to load achievements: ' + error.message);
            setLoading(false)
        });
    }, []);

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
                    <ImageList sx={{
                        marginLeft: 4,
                        marginBottom: 10,
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}>
                        {achievements.map(achievement => (
                            <ImageListItem key={achievement.id}>
                                <CustomLink href={`https://www.wowhead.com/achievement=${achievement.id}`} target="_blank"
                                   rel="noopener noreferrer">
                                    <Box component="img" src={achievement.iconUrl} alt="Icon" sx={{width: "40px", height: "auto"}}/>
                                </CustomLink>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Achievements;

import React, {useEffect, useState} from 'react';
import {Grid, Typography, Card, Box} from "@mui/material";
import MuiGauge from "../components/MuiGauge";
import {Spinner} from "../components/Spinner";
import axios from "axios";
import {IGNORE_MOUNT_ID, LEGACY} from "../data/mountData/mountData";

function Home() {

    const [totalAchievements, setTotalAchievements] = useState(0);
    const [completedAchievements, setCompletedAchievements] = useState(0);
    const [totalMounts, setTotalMounts] = useState(0);
    const [collectedMounts, setCollectedMounts] = useState(0);
    const [totalToys, setTotalToys] = useState(0)
    const [collectedToys, setCollectedToys] = useState(0)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLoggedIn = window.localStorage.getItem("character") && window.localStorage.getItem("realm");

    useEffect(() => {
        const characterName = window.localStorage.getItem("character");
        const realm = window.localStorage.getItem("realm");

        if (!characterName || !realm) {
            setError("User name and realm are required.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [allAchievementsResponse, completedAchievementsResponse, allMountsResponse, collectedMountsResponse, allToysResponse, collectedToysResponse] = await Promise.all(
                    [
                        axios.get('http://localhost:5000/achievements'),
                        axios.get(`http://localhost:5000/achievements/completed?characterName=${encodeURIComponent(
                            characterName)}&realm=${encodeURIComponent(realm)}`),
                        axios.get('http://localhost:5000/mounts'),
                        axios.get(`http://localhost:5000/mounts/collected?characterName=${encodeURIComponent(
                            characterName)}&realm=${encodeURIComponent(realm)}`),
                        axios.get('http://localhost:5000/toys'),
                        axios.get(`http://localhost:5000/toys/collected?characterName=${encodeURIComponent(
                            characterName)}&realm=${encodeURIComponent(realm)}`)
                    ]);

                if (!allAchievementsResponse.data || !completedAchievementsResponse.data || !allMountsResponse.data
                    || !collectedMountsResponse.data) {
                    throw new Error("Invalid data structure from API");
                }
                const {faction, collectedMounts} = collectedMountsResponse.data;
                const totalMounts = allMountsResponse.data.filter(
                    mount => !IGNORE_MOUNT_ID.includes(mount.id) && !LEGACY.includes(mount.id) &&
                        (!mount.faction || mount.faction === faction));

                const totalAchievements = allAchievementsResponse.data.filter(
                    achievement => !achievement.category.name.includes("Feats of Strength")
                        && !achievement.category.name.includes("Legacy"))

                setTotalAchievements(totalAchievements.length);
                setCompletedAchievements(completedAchievementsResponse.data.total_quantity);
                setTotalMounts(totalMounts.length);
                setCollectedMounts(collectedMounts.mounts.length);
                setTotalToys(allToysResponse.data.length)
                setCollectedToys(collectedToysResponse.data.toys.length)

                setLoading(false);
            } catch (error) {
                console.error('There was a problem fetching data:', error);
                setError('Failed to load data: ' + error.message);
                setLoading(false);
            }
        };

        fetchData().catch(error => {
            console.error('There was an error in the async function:', error);
        });
    }, []);

    if (!isLoggedIn) {
        return <Typography variant="h4" sx={{textAlign: 'center', marginTop: '30vh'}}>Login to see your World of
            Warcraft collections.</Typography>;
    }

    if (loading) {
        return <Spinner/>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Grid container sx={{display: "flex", justifyContent: "center", height: "80vh", alignItems: "center"}}>
            <Card sx={{padding: 2, margin: 2}}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant="h5">Achievements completed</Typography>
                    <MuiGauge value={completedAchievements} valueMax={totalAchievements}/>
                </Box>
            </Card>
            <Card sx={{padding: 2, margin: 2}}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant="h5">Mounts collected</Typography>
                    <MuiGauge value={collectedMounts} valueMax={totalMounts}/>
                </Box>
            </Card>
            <Card sx={{padding: 2, margin: 2}}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant="h5">Toys Collected</Typography>
                    <MuiGauge value={collectedToys} valueMax={totalToys}/>
                </Box>
            </Card>
        </Grid>
    );
}

export default Home;


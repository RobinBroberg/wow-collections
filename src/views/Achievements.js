import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {AppBar, Box, Grid, Paper, Tab, Tabs, Typography} from "@mui/material";
import {refreshWowheadTooltips} from "../utils/Utils";
import {Spinner} from "../components/Spinner";
import AchievementList from "../components/Lists/AchievementList";
import TabPanel from "../components/TabPanel";
import GroupAchievementsByCategory from "../utils/GroupAchievementsByCategory";

function Achievements() {
    const [categories, setCategories] = useState([]);
    const [groupedAchievements, setGroupedAchievements] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [points, setPoints] = useState("")

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
                const [allAchievementsResponse, completedAchievementsResponse, categoriesResponse] = await Promise.all([
                    axios.get('http://localhost:5000/achievements'),
                    axios.get(`http://localhost:5000/achievements/completed?characterName=${encodeURIComponent(
                        characterName)}&realm=${encodeURIComponent(realm)}`),
                    axios.get('http://localhost:5000/achievements/category')
                ]);

                const completedIds = new Set(
                    completedAchievementsResponse.data.achievements
                    .filter(achievement => achievement.completed_timestamp)
                    .map(achievement => achievement.achievement.id)
                );

                const updatedAchievements = allAchievementsResponse.data.map(achievement => ({
                    ...achievement,
                    collected: completedIds.has(achievement.id)
                }));

                setCategories(categoriesResponse.data);
                const grouped = GroupAchievementsByCategory(updatedAchievements, categoriesResponse.data);
                setGroupedAchievements(grouped);
                setPoints(completedAchievementsResponse.data.total_points)
                refreshWowheadTooltips();
                setLoading(false);
            } catch (error) {
                console.error('There was a problem fetching achievements:', error);
                setError('Failed to load achievements: ' + error.message);
                setLoading(false);
            }
        };

        fetchData().catch(error => {
            console.error('There was an error in the async function:', error);
        });
    }, []);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    if (loading) {
        return (
            <Spinner/>
        )
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Grid container sx={{display: "flex", justifyContent: "center"}}>
            <Grid item xs={8}>
                <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h4" sx={{marginBottom: 1, marginTop: 3, marginRight: 1}}>
                        Achievements
                    </Typography>
                    <Typography variant="h6" sx={{marginBottom: 1, marginTop: 3}}>
                        Total points: {points}
                    </Typography>
                </Grid>
                <Paper elevation={2}>
                    <AppBar position="static">
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            aria-label="scrollable wrapped tabs"

                        >
                            {categories.map((category, index) => (
                                <Tab key={category.id} label={category.name} wrapped sx={{fontSize: 13}}/>
                            ))}
                        </Tabs>
                    </AppBar>
                    {categories.map((category, index) => (
                        <TabPanel key={category.id} value={selectedTab} index={index}>
                            <Typography variant="h5" sx={{marginBottom: 4, marginLeft: 1}}>{category.name}</Typography>
                            {Object.entries(groupedAchievements[category.id].subcategories).map(
                                ([subCategoryId, subcategory]) => (
                                    subCategoryId === 'General' ? (
                                        <Box key={subcategory.id}>
                                            <Typography variant="h6"
                                                        sx={{marginLeft: 3}}>{subcategory.name}</Typography>
                                            <AchievementList achievements={subcategory.achievements}/>
                                        </Box>
                                    ) : null
                                ))}
                            {Object.entries(groupedAchievements[category.id].subcategories).map(
                                ([subCategoryId, subcategory]) => (
                                    subCategoryId !== 'General' ? (
                                        <Box key={subcategory.id}>
                                            <Typography variant="h6"
                                                        sx={{marginLeft: 3}}>{subcategory.name}</Typography>
                                            <AchievementList achievements={subcategory.achievements}/>
                                        </Box>
                                    ) : null
                                ))}
                        </TabPanel>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Achievements;

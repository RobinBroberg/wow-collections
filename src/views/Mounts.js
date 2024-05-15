import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Box, Grid, ImageList, ImageListItem, Paper, Typography} from "@mui/material";
import {refreshWowheadTooltips} from "../utils/Utils";
import {IGNORE_MOUNT_ID, EXPANSIONS, LEGACY} from "../data/mountData/mountData";
import {CustomLink} from "../utils/Theme";
import './Styles.css';
import {Spinner} from "../components/Spinner";

function Mounts() {
    const [mounts, setMounts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const characterName = window.localStorage.getItem("character");
        const realm = window.localStorage.getItem("realm");

        if (!characterName || !realm) {
            setError("User name and realm are required.");
            setLoading(false)
            return;
        }

        Promise.all([
            axios.get('http://localhost:5000/mounts'),
            axios.get(`http://localhost:5000/mounts/collected?characterName=${encodeURIComponent(
                characterName)}&realm=${encodeURIComponent(realm)}`)
        ]).then(([allMountsResponse, collectedMountsResponse]) => {
            if (!allMountsResponse.data || !collectedMountsResponse.data) {
                throw new Error("Invalid data structure from API");
            }

            const validMounts = allMountsResponse.data.mounts.filter(mount => !IGNORE_MOUNT_ID.includes(mount.id));
            const collectedIds = new Set(collectedMountsResponse.data.mounts.map(mount => mount.mount.id));
            const updatedMounts = validMounts.map(mount => ({
                ...mount,
                collected: collectedIds.has(mount.id)
            }));

            setMounts(updatedMounts);
            setLoading(false)
            refreshWowheadTooltips();
        }).catch(error => {
            console.error('There was a problem fetching mount data:', error);
            setError('Failed to load mounts: ' + error.message);
            setLoading(false)
        });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const groupedMounts = EXPANSIONS.map(expansion => {
        if (expansion.name === 'Legacy') {
            return {
                name: expansion.name,
                mounts: mounts.filter(mount => LEGACY.includes(mount.id)),
            };
        } else {
            return {
                name: expansion.name,
                mounts: mounts.filter(
                    mount => mount.id >= expansion.range[0] && mount.id <= expansion.range[1] && !LEGACY.includes(
                        mount.id)),
            };
        }
    });

    if (loading) {
        return (
            <Spinner/>
        )
    }

    return (
        <Grid container sx={{display: "flex", justifyContent: "center"}}>
            <Grid item xs={8}>
                <Typography variant={"h4"} sx={{marginBottom: 1, marginTop: 3}}>Mounts</Typography>
                <Paper elevation={2} sx={{padding: '20px'}}>
                    {groupedMounts.map(expansion => (
                        <Grid key={expansion.name}>
                            <Typography variant="h4" sx={{marginTop: '20px', marginLeft: 4, marginBottom: 1}}>
                                {expansion.name}
                            </Typography>
                            <ImageList sx={{
                                marginLeft: 4,
                                marginBottom: 10,
                                display: 'flex',
                                flexWrap: 'wrap',
                            }} cols={15}>
                                {expansion.mounts.map(mount => (
                                    <ImageListItem key={mount.id}>
                                        <CustomLink
                                            href={`https://www.wowhead.com/mount/${mount.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Box
                                                component="img"
                                                src={`https://render.worldofwarcraft.com/eu/npcs/zoom/creature-display-${mount.display_id}.jpg`}
                                                alt="Icon"
                                                className={`mountDisplay ${!mount.collected ? 'grayscale' : ''}`}/>
                                        </CustomLink>
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Grid>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Mounts;


import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Grid, Paper, Typography} from "@mui/material";
import {refreshWowheadTooltips} from "../utils/Utils";
import {IGNORE_MOUNT_ID, EXPANSIONS, LEGACY} from "../data/mountData/mountData";
import {Spinner} from "../components/Spinner";
import MountList from "../components/MountList";

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


    if (loading) {
        return (
            <Spinner/>
        )
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const excludedSources = new Set(['TRADINGPOST', 'TCG', 'PETSTORE', 'PROMOTION', 'WORLDEVENT', 'PROFESSION']);
    const legacyMounts = mounts.filter(mount => LEGACY.includes(mount.id));

    const categoryFilters = {
        'World Event': mount => mount.source === 'WORLDEVENT',
        'Profession': mount => mount.source === 'PROFESSION',
        'Trading Post': mount => mount.source === 'TRADINGPOST',
        'TCG': mount => mount.source === 'TCG',
        'Pet Store': mount => mount.source === 'PETSTORE' || mount.source === 'PROMOTION',

    };

    const categorizedMounts = Object.entries(categoryFilters).map(([name, filter]) => ({
        name,
        mounts: mounts.filter(filter),
    }));

    const expansionMounts = EXPANSIONS.map(expansion => {
        const mountsBySource = mounts
        .filter(mount =>
            mount.id >= expansion.range[0] &&
            mount.id <= expansion.range[1] &&
            !LEGACY.includes(mount.id) &&
            !excludedSources.has(mount.source)
        )
        .reduce((acc, mount) => {
            if (!acc[mount.source]) {
                acc[mount.source] = [];
            }
            acc[mount.source].push(mount);
            return acc;
        }, {});

        return {
            name: expansion.name,
            mounts: Object.keys(mountsBySource).map(source => ({
                source,
                mounts: mountsBySource[source],
            })),
        };
    });

    const groupedMounts = [
        ...expansionMounts.filter(expansion => expansion.name !== 'Legacy'),
        ...categorizedMounts,
        { name: 'Legacy', mounts: legacyMounts }
    ];


    return (
        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
            <Grid item xs={8}>
                <Typography variant={"h4"} sx={{ marginBottom: 1, marginTop: 3, marginLeft: 1, fontWeight: "bold" }}>Mounts</Typography>
                <Paper elevation={2} sx={{ padding: '20px' }}>
                    {groupedMounts.map((category, index) => (
                        <Grid key={category.name} sx={{ marginTop: index === 0 ? 0 : 10 }}>
                            <Typography variant="h4" sx={{ marginTop: 2, marginLeft: 3, marginBottom: 3 }}>
                                {category.name}
                            </Typography>
                            {Array.isArray(category.mounts[0]?.mounts) ? (
                                category.mounts.map(sourceGroup => (
                                    <Grid key={sourceGroup.source} sx={{ marginLeft: 4, marginRight: 4 }}>
                                        <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                                            {sourceGroup.source}
                                        </Typography>
                                        <MountList mounts={sourceGroup.mounts} />
                                    </Grid>
                                ))
                            ) : (
                                <Grid sx={{ marginLeft: 4, marginRight: 4 }}>
                                    <MountList mounts={category.mounts} />
                                </Grid>
                            )}
                        </Grid>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Mounts;


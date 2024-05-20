import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Grid, Paper, Typography} from "@mui/material";
import {refreshWowheadTooltips} from "../utils/Utils";
import {Spinner} from "../components/Spinner";
import ToyList from "../components/Lists/ToyList";

function Toys() {
    const [toys, setToys] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const characterName = window.localStorage.getItem("character");
        const realm = window.localStorage.getItem("realm");

        if (!characterName || !realm) {
            setError("User name and realm are required.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [allToysResponse, collectedToysResponse] = await Promise.all([
                    axios.get('http://localhost:5000/toys'),
                    axios.get(`http://localhost:5000/toys/collected?characterName=${encodeURIComponent(
                        characterName)}&realm=${encodeURIComponent(realm)}`)
                ]);

                const collectedIds = new Set(collectedToysResponse.data.toys.map(toy => toy.toy.id));
                const updatedToys = allToysResponse.data.map(toy => ({
                    ...toy,
                    collected: collectedIds.has(toy.id)
                }));

                setToys(updatedToys);
                refreshWowheadTooltips();
                setLoading(false);
            } catch (error) {
                console.error('There was a problem fetching toys:', error);
                setError('Failed to load toys: ' + error.message);
                setLoading(false);
            }
        };

        fetchData().catch(error => {
            console.error('There was an error in the async function:', error);
        });
    }, []);

    const groupToysBySource = (toys) => {
        const grouped = toys.reduce((acc, toy) => {
            const source = toy.source.name;
            if (!acc[source]) {
                acc[source] = [];
            }
            acc[source].push(toy);
            return acc;
        }, {});
        return Object.keys(grouped).map(source => ({source, toys: grouped[source]}));
    };

    const groupedToys = groupToysBySource(toys);

    if (loading) {
        return <Spinner/>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Grid container sx={{display: "flex", justifyContent: "center"}}>
            <Grid item xs={8}>
                <Typography variant={"h4"} sx={{marginBottom: 1, marginTop: 3, marginLeft: 1}}>Toys</Typography>
                <Paper elevation={2} sx={{padding: '20px'}}>
                    {groupedToys.map((group, index) => (
                        <Grid key={group.source} sx={{marginTop: index === 0 ? 0 : 10}}>
                            <Typography variant="h5" sx={{marginTop: 2, marginLeft: 5, marginBottom: 3}}>
                                {group.source}
                            </Typography>
                            <Grid sx={{marginLeft: 4, marginRight: 4}}>
                                <ToyList toys={group.toys}/>
                            </Grid>
                        </Grid>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Toys;



require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000' // Only allow this origin to access the resources
}));

async function getBlizzardAccessToken() {
    const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
    });
    try {
        const response = await axios.post('https://oauth.battle.net/token', params);
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to retrieve Blizzard access token:', error);
        throw new Error('Failed to retrieve access token');
    }
}

app.get('/mounts', async (req, res) => {
    try {
        const accessToken = await getBlizzardAccessToken();
        const response = await axios.get(`https://eu.api.blizzard.com/data/wow/mount/index?namespace=static-eu&locale=en_GB&access_token=${accessToken}`);
        res.json(response.data);
    } catch (error) {
        console.error('Failed to retrieve mounts:', error);
        res.status(500).json({ message: "Failed to retrieve mount data" });
    }
});

app.get('/mount/:id', async (req, res) => {
    try {
        const accessToken = await getBlizzardAccessToken();
        const { id } = req.params; // Extract the mount ID from the URL parameter
        const response = await axios.get(`https://eu.api.blizzard.com/data/wow/mount/${id}?namespace=static-eu&locale=en_GB&access_token=${accessToken}`);
        res.json(response.data);
    } catch (error) {
        console.error('Failed to retrieve mount:', error);
        res.status(500).json({ message: "Failed to retrieve mount data" });
    }
});


app.get('/achievements', async (req, res) => {
    try {
        const accessToken = await getBlizzardAccessToken();
        const response = await axios.get(`https://eu.api.blizzard.com/data/wow/achievement/index?namespace=static-eu&locale=en_GB&access_token=${accessToken}`);
        res.json(response.data);
        console.log(accessToken)
    } catch (error) {
        console.error('Failed to retrieve achievement data:', error);
        res.status(500).json({ message: "Failed to retrieve achievement data" });
    }
});

app.get('/mounts/collected', async (req, res) => {
    try {
        const accessToken = await getBlizzardAccessToken();
        const realmSlug = "tarren-mill";
        const characterName = "loriene"
        const response = await axios.get(`https://eu.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}/collections/mounts?namespace=profile-eu&locale=en_GB&access_token=${accessToken}`);
        res.json(response.data);
    } catch (error) {
        console.error('Failed to retrieve mounts:', error);
        res.status(500).json({ message: "Failed to retrieve mount data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



require('dotenv').config();
const express = require('express');
const axios = require('axios');
const getMountsData = require("./src/services/blizzardApi");
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', async (req, res) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', process.env.REACT_APP_CLIENT_ID);
    params.append('client_secret', process.env.REACT_APP_CLIENT_SECRET);

    try {
        const response = await axios.post('https://oauth.battle.net/token', params);

        const { access_token, expires_in } = response.data;

        console.log("Access Token:", access_token);
        console.log("Expires In:", expires_in);


        const mountsData = await getMountsData(access_token)
        res.json(mountsData)
    } catch (error) {
        console.error('Failed to retrieve access token:', error);
        res.status(500).json({ message: "Failed to retrieve access token" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

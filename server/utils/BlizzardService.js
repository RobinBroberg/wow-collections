const axios = require("axios");

async function getBlizzardAccessToken() {
    const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.BLIZZARD_CLIENT_ID,
        client_secret: process.env.BLIZZARD_CLIENT_SECRET,
    });
    try {
        const response = await axios.post('https://oauth.battle.net/token', params);
        console.log(response.data.access_token)
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to retrieve Blizzard access token:', error);
        throw new Error('Failed to retrieve access token');
    }
}

module.exports = {
    getBlizzardAccessToken
};

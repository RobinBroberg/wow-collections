const express = require('express');
const router = express.Router();
const { getBlizzardAccessToken } = require('./blizzardService');

async function fetchCharacterId(characterName, realm) {
    const accessToken = await getBlizzardAccessToken();
    const apiUrl = `https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}/status?namespace=profile-eu&locale=en_GB&access_token=${accessToken}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error("Failed to fetch character ID:", error);
        return null;
    }
}

router.get('/', async (req, res) => {
    const { characterName, realm } = req.query;
    if (!characterName || !realm) {
        return res.status(400).json({ message: 'Character name and realm are required' });
    }
    const characterId = await fetchCharacterId(characterName, realm);
    if (characterId) {
        res.json({ characterId });
    } else {
        res.status(404).json({ message: 'Character not found' });
    }
});

module.exports = router;


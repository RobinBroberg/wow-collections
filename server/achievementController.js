const express = require("express");
const axios = require("axios");
const {getBlizzardAccessToken} = require("./blizzardService");
const {writeFileSync, readFileSync, existsSync} = require("fs");

const router = express.Router();  // Create a router object for mounting


async function fetchAchievementData() {
    try {
        const accessToken = await getBlizzardAccessToken();
        const response = await axios.get(
            `https://eu.api.blizzard.com/data/wow/achievement/index?namespace=static-eu&locale=en_GB&access_token=${accessToken}`);
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve achievements:', error);
        throw error;
    }
}


function saveAchievementDataToFile(data) {
    try {
        writeFileSync('data/achievementData.json', JSON.stringify(data));
        console.log('Achievements data saved to file.');
    } catch (error) {
        console.error('Failed to save achievements data to file:', error);
        throw error;
    }
}

function readAchievementDataFromFile() {
    try {
        const data = readFileSync('data/achievementData.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read mounts data from file:', error);
        throw error;
    }
}

router.get('/', async (req, res) => {
    let achievementData;
    if (existsSync('data/achievementData.json')) {
        achievementData = readAchievementDataFromFile();
    } else {
        achievementData = await fetchAchievementData();
        saveAchievementDataToFile(achievementData);
    }
    res.json(achievementData);
});


module.exports = router;

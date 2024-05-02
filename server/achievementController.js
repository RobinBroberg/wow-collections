const express = require("express");
const axios = require("axios");
const {getBlizzardAccessToken} = require("./blizzardService");
const {writeFileSync, readFileSync, existsSync} = require("fs");
const {RateLimiter} = require("limiter");
const limiter = new RateLimiter({ tokensPerInterval: 50, interval: "second" });

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

async function fetchAchievementIcon(achievementId) {
    try {
        const accessToken = await getBlizzardAccessToken();
        await limiter.removeTokens(1);
        const response = await axios.get(
            `https://eu.api.blizzard.com/data/wow/media/achievement/${achievementId}?namespace=static-eu&access_token=${accessToken}`
        );
        console.log(response.data.assets.find(asset => asset.key === 'icon')?.value)
        console.log(accessToken)
        return response.data.assets.find(asset => asset.key === 'icon')?.value;
    } catch (error) {
        console.error(`Failed to retrieve icon for achievement ID ${achievementId}:`, error);
        return null;
    }
}


async function enrichAchievementsWithIcons() {
    try {
        const basicAchievements = await fetchAchievementData();
        const accessToken = await getBlizzardAccessToken();

        return await Promise.all(basicAchievements.achievements.map(async achievement => {
            const iconUrl = await fetchAchievementIcon(achievement.id, accessToken);
            return {...achievement, iconUrl};
        }));
    } catch (error) {
        console.error('Failed to enrich achievements with icons:', error);
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

router.get('/test', async (req, res) => {
    try {
        const achievementsWithIcons = await fetchAchievementIcon(5501);
        res.json(achievementsWithIcons);
    } catch (error) {
        console.error('Failed to serve achievements:', error);
        res.status(500).json({ message: 'Failed to retrieve achievements data' });
    }
});


module.exports = router;

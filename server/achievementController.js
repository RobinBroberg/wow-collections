const express = require("express");
const axios = require("axios");
const {getBlizzardAccessToken} = require("./blizzardService");
const {writeFileSync, readFileSync, existsSync} = require("fs");
const router = express.Router();


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

        const response = await axios.get(
            `https://eu.api.blizzard.com/data/wow/media/achievement/${achievementId}?namespace=static-eu&access_token=${accessToken}`
        );
        console.log(response.data.assets.find(asset => asset.key === 'icon')?.value);
        return response.data.assets.find(asset => asset.key === 'icon')?.value;
    } catch (error) {
        console.error(`Failed to retrieve icon for achievement ID ${achievementId}:`, error);
        return null;
    }

}




async function enrichAchievementsWithIcons() {
    try {
        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(1);
        const basicAchievements = await fetchAchievementData();
        const promises = basicAchievements.achievements.map(achievement =>
            limit(() => fetchAchievementIcon(achievement.id))
        );

        const results = await Promise.allSettled(promises);

        const enrichedAchievements = results.map((result, index) => {
            if (result.status === 'fulfilled' && result.value !== null) {
                return { ...basicAchievements.achievements[index], iconUrl: result.value };
            } else {

                console.error(`Failed to retrieve icon for achievement ID ${basicAchievements.achievements[index].id}:`, result.reason);
                return { ...basicAchievements.achievements[index], iconUrl: null };
            }
        });

        return enrichedAchievements;
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
        console.error('Failed to read achievment data from file:', error);
        throw error;
    }
}

router.get('/', async (req, res) => {
    let achievementData;
    if (existsSync('data/achievementData.json')) {
        achievementData = readAchievementDataFromFile();
        // console.log(getBlizzardAccessToken())
    } else {
        achievementData = await enrichAchievementsWithIcons();
        saveAchievementDataToFile(achievementData);
    }
    res.json(achievementData);
});


module.exports = router;

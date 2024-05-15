const express = require("express");
const axios = require("axios");
const {getBlizzardAccessToken} = require("./BlizzardService");
const {existsSync} = require("fs");
const {readDataFromFile, saveDataToFile} = require("./utils/Utils");
const router = express.Router();



function delay(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

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
        const delayTime = 100;
        await delay(delayTime);
        console.log(response.data.assets.find(asset => asset.key === 'icon')?.value);
        return response.data.assets.find(asset => asset.key === 'icon')?.value;
    } catch (error) {
        console.error(`Failed to retrieve icon for achievement ID ${achievementId}:`, error);
        return null;
    }

}

async function fetchAchievementCategory(achievementId) {
    try {
        const accessToken = await getBlizzardAccessToken();

        const response = await axios.get(
            `https://eu.api.blizzard.com/data/wow/achievement/${achievementId}?namespace=static-eu&locale=en_GB&access_token=${accessToken}`
        );
        const delayTime = 100;
        await delay(delayTime);
        const categoryData = {
            id: response.data.category.id,
            name: response.data.category.name,
        };

        console.log("Category Data:", categoryData);
        return categoryData;
    } catch (error) {
        console.error(`Failed to retrieve icon for achievement ID ${achievementId}:`, error);
        return null;
    }

}

async function addCategoryAndIconToAchievement() {
    try {
        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(1);
        const basicAchievements = await fetchAchievementData();

        const promises = basicAchievements.achievements.map(achievement =>
            limit(async () => {
                const iconUrl = await fetchAchievementIcon(achievement.id);
                const categoryData = await fetchAchievementCategory(achievement.id);
                return { ...achievement, iconUrl, category: categoryData };
            })
        );

        const results = await Promise.allSettled(promises);
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                console.error(`Failed to enrich achievement with ID ${basicAchievements.achievements[index].id}:`,
                    result.reason);
                return {...basicAchievements.achievements[index], iconUrl: null, category: null};
            }
        });
    } catch (error) {
        console.error('Failed to enrich achievements:', error);
        throw error;
    }
}

router.get('/', async (req, res) => {
    try {
        const filePath = 'data/achievementData.json';
        let achievementData;

        if (existsSync(filePath)) {
            achievementData = readDataFromFile(filePath);
        } else {
            achievementData = await addCategoryAndIconToAchievement();
            saveDataToFile(achievementData, filePath);
        }
        res.json(achievementData);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;

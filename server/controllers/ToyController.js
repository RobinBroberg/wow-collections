const express = require("express");
const axios = require("axios");
const { getBlizzardAccessToken } = require("../utils/BlizzardService");
const { existsSync } = require("fs");
const { readDataFromFile, saveDataToFile } = require("../utils/ReadAndSaveDataToFile");
const router = express.Router();

async function fetchToyData() {
    try {
        const accessToken = await getBlizzardAccessToken();
        const response = await axios.get(
            `https://eu.api.blizzard.com/data/wow/toy/index?namespace=static-eu&locale=en_GB&access_token=${accessToken}`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve toys:', error);
        throw error;
    }
}

async function fetchToyDetails(toyId) {
    try {
        const accessToken = await getBlizzardAccessToken();
        const toyResponse = await axios.get(
            `https://eu.api.blizzard.com/data/wow/toy/${toyId}?namespace=static-eu&locale=en_GB&access_token=${accessToken}`
        );

        const itemId = toyResponse.data.item?.id;
        const sourceType = toyResponse.data.source?.type;
        const sourceName = toyResponse.data.source?.name;

        let iconUrl = null;
        if (itemId) {
            const iconResponse = await axios.get(
                `https://eu.api.blizzard.com/data/wow/media/item/${itemId}?namespace=static-eu&access_token=${accessToken}`
            );
            iconUrl = iconResponse.data.assets.find(asset => asset.key === 'icon')?.value;
        }

        return {
                id: toyId,
                iconUrl: iconUrl,
                source: {
                    type: sourceType,
                    name: sourceName,
                },
                item_id: itemId
        };
    } catch (error) {
        console.error(`Failed to retrieve details for toy ID ${toyId}:`, error);
        return null;
    }
}


async function addDetailsToToys() {
    try {
        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(1);
        const basicToys = await fetchToyData();

        const promises = basicToys.toys.map(toy =>
            limit(async () => {
                const details = await fetchToyDetails(toy.id);
                return { ...toy, ...details.toy };
            })
        );

        const results = await Promise.allSettled(promises);
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                console.error(`Failed to enrich toy with ID ${basicToys.toys[index].id}:`, result.reason);
                return { ...basicToys.toys[index], iconUrl: null, source: null, item_id: null };
            }
        });
    } catch (error) {
        console.error('Failed to enrich toys:', error);
        throw error;
    }
}


router.get('/', async (req, res) => {
    try {
        const filePath = 'data/toysData.json';
        let toyData;

        if (existsSync(filePath)) {
            toyData = readDataFromFile(filePath);
        } else {
            toyData = await addDetailsToToys();
            saveDataToFile(toyData, filePath);
        }
        res.json(toyData);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/collected', async (req, res) => {
    try {
        const accessToken = await getBlizzardAccessToken();
        const { characterName, realm } = req.query;
        const response = await axios.get(
            `https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}/collections/toys?namespace=profile-eu&locale=en_GB&access_token=${accessToken}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Failed to retrieve collected toys:', error);
        res.status(500).json({ message: "Failed to retrieve collected toy data" });
    }
});

module.exports = router;



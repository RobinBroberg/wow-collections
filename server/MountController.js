const express = require("express");
const axios = require("axios");
const {existsSync} = require("fs");
const {getBlizzardAccessToken} = require("./BlizzardService");
const {readDataFromFile, saveDataToFile} = require("./utils/Utils");

const router = express.Router();

async function fetchMountsData() {
    try {
        const accessToken = await getBlizzardAccessToken();
        const response = await axios.get(
            `https://eu.api.blizzard.com/data/wow/mount/index?namespace=static-eu&locale=en_GB&access_token=${accessToken}`);
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve mounts:', error);
        throw error;
    }
}

async function fetchMountDetails(mountId) {
    try {
        const accessToken = await getBlizzardAccessToken();
        const response = await axios.get(
            `https://eu.api.blizzard.com/data/wow/mount/${mountId}?namespace=static-eu&locale=en_GB&access_token=${accessToken}`
        );
        const displayId = response.data.creature_displays[0]?.id;
        const sourceType = response.data.source?.type;
        const faction = response.data.faction?.type;
        return {
            display_id: displayId,
            source: sourceType,
            faction: faction,
        };
    } catch (error) {
        console.error(`Failed to retrieve details for mount ID ${mountId}:`, error);
        return null;
    }
}

async function addDetailsToMounts() {
    try {
        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(1);
        const basicMounts = await fetchMountsData();

        const promises = basicMounts.mounts.map(mount =>
            limit(async () => {
                const details = await fetchMountDetails(mount.id);
                return { ...mount, ...details };
            })
        );

        const results = await Promise.allSettled(promises);
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                console.error(`Failed to enrich mount with ID ${basicMounts[index].id}:`, result.reason);
                return { ...basicMounts[index], display_id: null, source: null };
            }
        });
    } catch (error) {
        console.error('Failed to enrich mounts:', error);
        throw error;
    }
}

router.get('/', async (req, res) => {
    try {
        const filePath = 'data/mountsData.json';
        let mountsData;

        if (existsSync(filePath)) {
            mountsData = readDataFromFile(filePath);
        } else {
            mountsData = await addDetailsToMounts();
            saveDataToFile(mountsData, filePath);
        }
        res.json(mountsData);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/collected', async (req, res) => {
    try {
        const accessToken = await getBlizzardAccessToken();
        const { characterName, realm } = req.query;
        const characterResponse = await axios.get(
            `https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}?namespace=profile-eu&locale=en_GB&access_token=${accessToken}`
        );
        const mountsResponse = await axios.get(
            `https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}/collections/mounts?namespace=profile-eu&locale=en_GB&access_token=${accessToken}`
        );
        const faction = characterResponse.data.faction.type;
        const collectedMounts = mountsResponse.data;
        res.json({
            faction,
            collectedMounts,
        });
    } catch (error) {
        console.error('Failed to retrieve collected mounts:', error);
        res.status(500).json({ message: "Failed to retrieve collected mount data" });
    }
});


module.exports = router;


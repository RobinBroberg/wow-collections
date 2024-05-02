const express = require("express");
const axios = require("axios");
const { writeFileSync, readFileSync, existsSync } = require("fs");
const {getBlizzardAccessToken} = require("./blizzardService");

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

function saveMountsDataToFile(data) {
    try {
        writeFileSync('data/mountsData.json', JSON.stringify(data));
        console.log('Mounts data saved to file.');
    } catch (error) {
        console.error('Failed to save mounts data to file:', error);
        throw error;
    }
}

function readMountsDataFromFile() {
    try {
        const data = readFileSync('data/mountsData.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read mounts data from file:', error);
        throw error;
    }
}

router.get('/', async (req, res) => {
    let mountsData;
    if (existsSync('data/mountsData.json')) {
        mountsData = readMountsDataFromFile();
    } else {
        mountsData = await fetchMountsData();
        saveMountsDataToFile(mountsData);
    }
    res.json(mountsData);
});

router.get('/collected', async (req, res) => {
    try {
        const accessToken = await getBlizzardAccessToken();
        const {characterName, realm} = req.query;
        const response = await axios.get(`https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}/collections/mounts?namespace=profile-eu&locale=en_GB&access_token=${accessToken}`);
        res.json(response.data);
    } catch (error) {
        console.error('Failed to retrieve collected mounts:', error);
        res.status(500).json({ message: "Failed to retrieve collected mount data" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const accessToken = await getBlizzardAccessToken();
        const { id } = req.params;
        const response = await axios.get(`https://eu.api.blizzard.com/data/wow/mount/${id}?namespace=static-eu&locale=en_GB&access_token=${accessToken}`);
        res.json(response.data);
    } catch (error) {
        console.error('Failed to retrieve mount:', error);
        res.status(500).json({ message: "Failed to retrieve mount data" });
    }
});

module.exports = router;


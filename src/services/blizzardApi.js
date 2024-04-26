const axios = require("axios");

async function getToken()  {
    return fetch('http://localhost:5000')
    .then(response => response.json())
    .then(data => data.access_token)
    .catch(error => {
        throw new Error(error);
    });
}

async function getMountsData(accessToken) {
    try {
       //const accessToken = await getToken();

        const res = await axios.get(
            `https://eu.api.blizzard.com/data/wow/mount/index?namespace=static-eu&locale=en_GB&access_token=${accessToken}`);
        return res.data
    } catch (error) {
        console.error('Error fetching Blizzard data:', error);
    }
}
module.exports = getMountsData;

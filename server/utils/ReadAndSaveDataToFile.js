const { readFileSync, writeFileSync } = require('fs');

function saveDataToFile(data, filePath) {
    try {
        writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('Data saved to file.');
    } catch (error) {
        console.error('Failed to save data to file:', error);
        throw error;
    }
}

function readDataFromFile(filePath) {
    try {
        const data = readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read data from file:', error);
        throw error;
    }
}

module.exports = {
    saveDataToFile,
    readDataFromFile,
};


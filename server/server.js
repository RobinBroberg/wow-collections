require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const mountController = require('./mountController');
const achievementController = require('./achievementController')
const characterController = require('./characterController')

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/mounts', mountController);
app.use('/achievements', achievementController)
app.use('/character', characterController);

app.use((req, res) => {
    res.status(404).send('Endpoint not found');
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


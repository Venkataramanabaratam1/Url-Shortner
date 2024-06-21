const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Use the PORT environment variable or default to 3000
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const urlDatabase = {};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/shorten', (req, res) => {
    const originalUrl = req.body.url;
    const shortId = Math.random().toString(36).substring(2, 8);
    urlDatabase[shortId] = originalUrl;
    res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortId}` });
});

app.get('/:shortId', (req, res) => {
    const shortId = req.params.shortId;
    const originalUrl = urlDatabase[shortId];
    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

// Listen on the port specified by Heroku
app.listen(port, () => {
    console.log(`URL Shortener service running at http://localhost:${port}`);
});

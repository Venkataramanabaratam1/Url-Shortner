const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory storage for simplicity
const urlDatabase = {};

// Serve the frontend HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to shorten a URL
app.post('/shorten', (req, res) => {
    const originalUrl = req.body.url;
    const shortId = Math.random().toString(36).substring(2, 8);
    urlDatabase[shortId] = originalUrl;
    res.json({ shortUrl: `http://localhost:${port}/${shortId}` });
});

// Endpoint to redirect to the original URL
app.get('/:shortId', (req, res) => {
    const shortId = req.params.shortId;
    const originalUrl = urlDatabase[shortId];
    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

app.listen(port, () => {
    console.log(`URL Shortener service running at http://localhost:${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define URL Schema
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String
});

const Url = mongoose.model('Url', urlSchema);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('Public'));

// Function to generate short URL using crypto
function generateShortUrl(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// Create Short URL
app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortUrl = generateShortUrl(6);

    const newUrl = new Url({ originalUrl, shortUrl });
    await newUrl.save();

    res.send(`Short URL is: <a href="/${shortUrl}">${shortUrl}</a>`);
});

// Redirect to Original URL
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const urlData = await Url.findOne({ shortUrl });

    if (urlData) {
        res.redirect(urlData.originalUrl);
    } else {
        res.send('URL not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    const gamertag = req.query.username;
    const profileData = await fetchProfile(gamertag);

    res.json(profileData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

async function fetchProfile(gamertag) {
  try {
    const url = `https://www.xboxgamertag.com/search/${gamertag}`;
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const gamerscoreElement = $('.col-auto.profile-detail-item:contains("Gamerscore")');
    const gamesPlayedElement = $('.col-auto.profile-detail-item:contains("Games Played")');

    const gamerscore = gamerscoreElement.text().replace('Gamerscore', '').trim();
    const gamesPlayed = gamesPlayedElement.text().replace('Games Played', '').trim();

    // Get the profile picture URL
    const profilePictureElement = $('.img-thumbnail.rounded');
    const profilePictureUrl = profilePictureElement.attr('src');

    return {
      gamertag,
      gamerscore,
      gamesPlayed,
      profilePictureUrl,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

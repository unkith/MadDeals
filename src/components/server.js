//web scraping logic server

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/api/deals', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const grouponURL = `https://www.groupon.com/local?lat=${latitude}&lng=${longitude}`;

    const response = await axios.get(grouponURL);
    const html = response.data;
    const $ = cheerio.load(html);
    const deals = [];


    $('.cui-content').each((index, element) => {
        const title = $(element).find('.cui-content-title').text().trim();
        const description = $(element).find('.cui-description').text().trim();
        const deal = { title, description };
        deals.push(deal);
      });

    /*
    $('div.deal-title').each((index, element) => {
      deals.push({
        title: $(element).text().trim(),
      });
    });
    */

    res.json(deals);
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

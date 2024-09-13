const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Define the URL of the Ministry of Testing events page
const url = 'https://www.ministryoftesting.com/events/list';

// Function to scrape event data
async function scrapeEvents() {
    try {
        // Send a GET request to the webpage
        console.log(`Sending GET request to ${url}`);
        const { data } = await axios.get(url);
        console.log('Received response from the website.');

        // Load the HTML into cheerio to parse and extract data
        const $ = cheerio.load(data);
        console.log('Loaded HTML into cheerio.');

        // Array to hold the scraped event data
        const events = [];

        // Select and loop through each event card - remember to inspect the page to check the name of the section you're looking for
        const eventCards = $('.summary-card');
        console.log(`Found ${eventCards.length} event cards on the page.`);

        eventCards.each((index, element) => {
            // Extract event name
            const eventName = $(element).find('.title').text().trim();
            console.log(`Event ${index + 1}: Name - ${eventName}`);

            // Extract event date
            const eventDate = $(element).find('.fs-6').text().trim();
            console.log(`Event ${index + 1}: Date - ${eventDate}`);

            // Extract event image
            const eventImage = $(element).find('.card-img-top').attr('src');
            console.log(`Event ${index + 1}: Image - ${eventImage}`);

            // Extract event link and construct full URL
            const eventLink = `https://www.ministryoftesting.com${$(element).find('.stretched-link').attr('href')}`;
            console.log(`Event ${index + 1}: Link - ${eventLink}`);

            // Add the event data to the array
            events.push({
                eventName,
                eventDate,
                eventLink,
                eventImage,
            });
        });

        // Check if events array is populated
        if (events.length > 0) {
            // Write the event data to a JSON file at the root level
            const rootDir = path.resolve(__dirname, '../');
            fs.writeFileSync(`${rootDir}/ministry_of_testing_events.json`, JSON.stringify(events, null, 2), 'utf-8');
            console.log('Event data successfully saved to "ministry_of_testing_events.json"');
        } else {
            console.log('No events found to save.');
        }
    } catch (error) {
        console.error(`Error occurred while scraping: ${error.message}`);
    }
}

// Run the scrape function
scrapeEvents();

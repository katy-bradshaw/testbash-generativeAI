require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { OpenAI } = require('openai');

// Load the JSON data from the file
const events = JSON.parse(fs.readFileSync('../ministry_of_testing_events.json'));
// Set root dir dor additional file uploads
const rootDir = path.resolve(__dirname, '../');

// Set up the OpenAI API credentials from environment variables
const openai = new OpenAI({
  organization: "org-vY7tM3UIjTngQwOdvuh7sGoi",
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a descriptive prompt based on the events data
function generatePrompt(events) {
  let prompt = 'Create a visually appealing event poster with the following details:\n\n';
  
  events.forEach(event => {
    prompt += `Event: ${event.eventName}\n`;
    prompt += `Date: ${event.eventDate}\n`;
    prompt += `Image: ${event.eventImage}\n\n`;
  });

  prompt += 'The poster should have a professional design with appropriate imagery and text layout. The color scheme should match the theme of the events, and the text should be clearly readable.';

  return prompt;
}

// Function to request an image generation from DALL-E
async function generatePosterImage(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024"
    });

    return response.data[0].url;
  } catch (error) {
    console.error('Error generating image with DALL-E:', error.message);
    throw error;
  }
}

// Function to download the generated image
async function downloadImage(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    fs.writeFileSync(`${rootDir}/eventsPoster.png`, imageBuffer);
    console.log('Poster saved as poster.png');
  } catch (error) {
    console.error('Error downloading image:', error.message);
    throw error;
  }
}

// Main function to generate the poster
async function generatePoster() {
  try {
    const prompt = generatePrompt(events);
    fs.writeFileSync(`${rootDir}/generated_prompt.txt`, prompt);
    const imageUrl = await generatePosterImage(prompt);
    fs.writeFileSync(`${rootDir}/generated_image_url.txt`, imageUrl);
    await downloadImage(imageUrl);
  } catch (error) {
    console.error('Failed to generate poster:', error.message);
  }
}

// Call the generatePoster function
generatePoster();

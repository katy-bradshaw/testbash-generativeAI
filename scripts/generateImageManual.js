const fs = require('fs');
const puppeteer = require('puppeteer');

// Load the JSON data from the file
const events = JSON.parse(fs.readFileSync('../ministry_of_testing_events.json'));

// Function to generate the HTML content based on events data
function generateHTML(events) {
  let eventSections = events.map(event => `
    <div class="event">
      <h2>${event.eventName}</h2>
      <p><strong>Date:</strong> ${event.eventDate}</p>
      <p><img src="${event.eventImage}" alt="${event.eventName}"/></p>
    </div>
  `).join('');

  return `
    <html>
    <head>
      <style>
        body {
          width: 1024px;
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          color: #000000;
        }
        img {
            width: 100%;
            height: auto;
            margin-bottom: 10px;
        }
        .event {
          margin-bottom: 30px;
        }
        h2 {
          font-size: 24px;
          margin: 0;
        }
        p {
          font-size: 18px;
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <h1>Upcoming Events</h1>
      ${eventSections}
    </body>
    </html>
  `;
}

// Function to generate the poster using Puppeteer
async function generatePoster() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Generate HTML content  
  const htmlContent = generateHTML(events);

  // Set the content of the page
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Set viewport to match the poster size
  await page.setViewport({ width: 1024, height: 768 });

  // Generate screenshot
  fs.writeFileSync(`${rootDir}/generated_image_url.txt`, imageUrl);
  await page.screenshot({ path: '../eventsPoster.png', fullPage: true });

  console.log('Poster saved as eventsPoster.png');

  // Close the browser
  await browser.close();
}

// Call the function to generate the poster
generatePoster();

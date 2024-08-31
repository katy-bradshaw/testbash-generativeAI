# testbash-generativeAI

This repo will help show how to gather text and images from websites and collate them into one source with example test scenarios
These scripts can be customised or extended based on the structure of the webpage and the specific data you want to extract.

## JavaScript Specific Information

### Pre-requisites for JavaScript

- npm
- Node

### Getting Started with JavaScript

for JavaScript rums:

- If you haven't already, make sure you have the required packages installed:
  - `npm install axios cheerio`
  - `npm install puppeteer fs`
  - `npm install axios dotenv`
- To scrape the website, run the script: `node scrapeEvents.js`
- To generate an image based on the data scarped, run the script: `node generateImage.js`

Note: DALL-E doesn't currently have it's API exposed to the public, you need to pay for access but the script `generateDalleImage.js` is an example of what that could look like if you had access.

## Python Specific Imformation

### Pre-requisites for Python

- Python 3
- beautifulsoup4
- requests

### Getting Started with Python

for Python runs:

- If you haven't already, make sure you have the required packaged installed:

```py
    python3 -m venv testbash-generativeAI
    testbash-generativeAI/bin/pip install beautifulsoup4
    testbash-generativeAI/bin/pip install requests
    testbash-generativeAI/bin/pip install requests python-dotenv
```

- To scrape the website, run the script: `testbash-generativeAI/bin/python scrapeEvents.py`
- To generate an image based on the data scarped, run the script: `testbash-generativeAI/bin/python generateAiImage.py`

## Additional Information

General steps to obtain API keys for OpenAI services:

1. Create an Account:
    - If you don't already have an account, you'll need to sign up at OpenAI's website.
2. Access the API Dashboard:
    - After logging in, go to the API dashboard.
3. Generate an API Key:
    - On the API keys page, you can create a new API key by clicking the "Create new secret key" button.
4. Save the Key:
    - Once the key is generated, copy it immediately and store it securely. You won't be able to view it again from the dashboard.

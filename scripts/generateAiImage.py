import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

# Load the JSON data from the file
with open('../ministry_of_testing_events.json', 'r') as f:
    events = json.load(f)

# Function to generate a descriptive prompt based on the events data
def generate_prompt(events):
    prompt = 'Create a visually appealing event poster with the following details:\n\n'
    
    for event in events:
        prompt += f"Event: {event['eventName']}\n"
        prompt += f"Date: {event['eventDate']}\n"
        prompt += f"Image: {event['eventImage']}\n\n"

    prompt += ("The poster should have a professional design with appropriate imagery and text layout. "
               "The color scheme should match the theme of the events, and the text should be clearly readable.")
    
    return prompt

# Function to request an image generation from DALL-E
def generate_poster_image(prompt):
    url = 'https://api.openai.com/v1/images/generations'
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'prompt': prompt,
        'n': 1,
        'size': "1024x1024"
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()['data'][0]['url']
    else:
        raise Exception(f"Error generating image with DALL-E: {response.status_code} {response.text}")

# Function to download the generated image
def download_image(image_url):
    response = requests.get(image_url, stream=True)
    
    if response.status_code == 200:
        with open('../eventsPoster.png', 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        print('Poster saved as eventsPoster.png')
    else:
        raise Exception(f"Error downloading image: {response.status_code} {response.text}")

# Main function to generate the poster
def generate_poster():
    try:
        prompt = generate_prompt(events)
        image_url = generate_poster_image(prompt)
        download_image(image_url)
    except Exception as e:
        print(f"Failed to generate poster: {e}")

# Call the generate_poster function
generate_poster()

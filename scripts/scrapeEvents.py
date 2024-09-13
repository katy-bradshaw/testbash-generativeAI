import json
import requests
from bs4 import BeautifulSoup
import os

def scrape_events(url):
    # Send a GET request to the URL
    response = requests.get(url)

    # If the GET request is successful, the status code will be 200
    if response.status_code == 200:
        # Get the content of the response
        page_content = response.content

        # Create a BeautifulSoup object and specify the parser
        soup = BeautifulSoup(page_content, 'html.parser')

        # Find all event cards on the page
        eventCards = soup.find_all('div', class_='card')

        # Create an empty list to store the events
        events = []

        # Loop through each event card
        for index, card in enumerate(eventCards):
            # Extract the event name
            eventName = card.find('h2', class_='title').text.strip()

            # Extract the event date
            eventDate = card.find('div', class_='fs-6').text.strip()

            # Extract the event link
            eventLink = card.find('a')['href']

            # Extract the event image
            eventImage = card.find('img', class_='card-img-top')['src']

            # Add the event to the list
            events.append({
                'eventName': eventName,
                'eventDate': eventDate,
                'eventLink': eventLink,
                'eventImage': eventImage
            })

        # Return the events
        return events

    else:
        print(f"Failed to retrieve page. Status code: {response.status_code}")
        return None

# Usage
url = "https://www.ministryoftesting.com/events/list"
events = scrape_events(url)

if events is not None:
    # Print the events
    for event in events:
        print(f"Event {event['eventName']}:")
        print(f"  Date: {event['eventDate']}")
        print(f"  Link: {event['eventLink']}")
        print(f"  Image: {event['eventImage']}")
        print()

    # Write the events to a JSON file and store at the root level
    root_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(root_dir, '../ministry_of_testing_events.json'), 'w') as f:
        json.dump(events, f)
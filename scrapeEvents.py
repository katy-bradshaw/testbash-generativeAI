import requests
from bs4 import BeautifulSoup

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
        event_cards = soup.find_all('div', class_='card')

        # Create an empty list to store the events
        events = []

        # Loop through each event card
        for index, card in enumerate(event_cards):
            # Extract the event name
            event_name = card.find('h2', class_='title').text.strip()

            # Extract the event date
            event_date = card.find('div', class_='fs-6').text.strip()

            # Extract the event link
            event_link = card.find('a')['href']

            # Extract the event image
            event_image = card.find('img', class_='card-img-top')['src']

            # Add the event to the list
            events.append({
                'event_name': event_name,
                'event_date': event_date,
                'event_link': event_link,
                'event_image': event_image
            })

        # Print the events
        for event in events:
            print(f"Event {event['event_name']}:")
            print(f"  Date: {event['event_date']}")
            print(f"  Link: {event['event_link']}")
            print(f"  Image: {event['event_image']}")
            print()

    else:
        print(f"Failed to retrieve page. Status code: {response.status_code}")

# Usage
url = "https://www.ministryoftesting.com/events/list"
scrape_events(url)
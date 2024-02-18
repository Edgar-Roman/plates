import requests

API_KEY = 'FmpIZiUz_dOYjUVcMNX62wD1Hvzv-EOLrgcpzlFqKjKl0icOPpzwAyEpksXOGwIyonqKB18SsXetQ2DM12UXAiNsvI4xseFYfzBfF6yxt4vQpApJd5rKS9IvdvfQZXYx'
ENDPOINT = 'https://api.yelp.com/v3/businesses/search'
HEADERS = {'Authorization': 'bearer %s' % API_KEY}

# # Define your parameters of the search
# PARAMETERS = {
#     'term': 'food',
#     'limit': 10,
#     'radius': 10000,
#     'location': 'San Francisco'
# }

# # Make a request to the Yelp API
# response = requests.get(url = ENDPOINT, params = PARAMETERS, headers = HEADERS)

# # Convert the JSON string to a dictionary
# business_data = response.json()

# # Print the response
# print(business_data["businesses"][0])


url = "https://api.yelp.com/v3/categories"
response = requests.get(url, headers=HEADERS).json()
categories = response['categories']

for category in categories:
    if 'restaurants' in category['parent_aliases']:
        print(category['title'])
        
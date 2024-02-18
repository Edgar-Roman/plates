from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import requests

API_KEY = 'FmpIZiUz_dOYjUVcMNX62wD1Hvzv-EOLrgcpzlFqKjKl0icOPpzwAyEpksXOGwIyonqKB18SsXetQ2DM12UXAiNsvI4xseFYfzBfF6yxt4vQpApJd5rKS9IvdvfQZXYx'
ENDPOINT = 'https://api.yelp.com/v3/businesses/search'
HEADERS = {'Authorization': 'bearer %s' % API_KEY}

from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

from flask import Flask, redirect, render_template, jsonify, request, send_from_directory
import stripe
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = 'your-secret-key'  # Add a secret key for sessions and Flask-Login

stripe.api_version = '2020-08-27'
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Database configuration (using SQLite for simplicity)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hackathon.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class LocationTimePair(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100))
    time = db.Column(db.String(100))

    def set_location(self, location):
        self.location = location
    
    def set_time(self, time):
        self.time = time

    def get_pair(self):
        return {"location": self.location, "time": self.time}

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    cuisines = db.Column(db.String(300), default="")
    distance = db.Column(db.Integer, default=-1)
    price = db.Column(db.String(100), default="")
    groupSize = db.Column(db.String(100), default="")
    password_hash = db.Column(db.String(128))
    locations = db.Column(db.String(300), default="")
    date = db.Column(db.String(300), default="")
    completePref = db.Column(db.String(50), default="false") 

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_preferences(self, data):
        # Adjusted to check and join only if the key exists in data
        self.cuisines = " ".join(data["cuisines"]) if "cuisines" in data else self.cuisines
        self.distance = int(data["distance"]) if "distance" in data else self.distance
        self.price = " ".join(data["price"]) if "price" in data else self.price
        self.groupSize = " ".join(data["groupSize"]) if "groupSize" in data else self.groupSize
        db.session.commit()

    def get_preferences(self):
        return {"cuisines": self.cuisines, "distance": self.distance,
                "price": self.price, "groupSize": self.groupSize}
    
    def add_locationPairs(self, locationPairs):
        self.locations += " " + str(locationPairs)
        db.session.commit()
    
    def delete_locationPairs(self, locationPairs):
        locationList = self.locations.split(" ")
        locationList = list(filter(lambda a: a != locationPairs, self.locations))
        self.locations = " ".join(locationList)
        db.session.commit()
    
    def getLocationPairs(self):
        return self.locations.split(" ")

    def set_date(self, date):
        self.date = date

    def setCompletePref(self, val):
        self.completePref = val

    def getCompletePref(self):
        return self.completePref

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.query.filter_by(username=data['username']).count() != 0:
        return jsonify({'message': 'Username taken'}), 401

    user = User(username=data['username'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({'message': 'Login successful!'}), 200
    return jsonify({'message': 'Invalid username or password'}), 401

# @app.route('/preferences', methods=['POST'])
# def preferences():
#     data = request.get_json()
#     user = User.query.filter_by(username=data['username']).first()
#     print(data)
#     if user:
#         user.set_preferences(data)
#         db.session.commit()
#         return jsonify({'message': 'Preferences updated successfully'}), 200
#     return jsonify({'message': 'User not found'}), 404

@app.route('/preferences', methods=['GET'])
def get_preferences():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user:
        return jsonify(user.get_preferences()), 200
    else:
        return jsonify({'message': 'User not found'}), 404

@app.route('/locationChoose', methods=['POST'])
def locationChoose():
    data = request.get_json()

    user = User.query.filter_by(username=data['username']).first()

    user.add_locationPairs(data["id"])
    db.session.commit()
    return jsonify({'message': 'Location preferences updated successfully'}), 200
    #     return jsonify({'message': 'Location preferences updated successfully'}), 200
    # else:
    #     return jsonify({'message': 'User not found or not logged in'}), 404
@app.route('/locationRemove', methods=['POST'])
def locationRemove():
    data = request.get_json()

    user = User.query.filter_by(username=data['username']).first()

    user.delete_locationPairs(data["id"])
    db.session.commit()
    return jsonify({'message': 'Location preferences updated successfully'}), 200

@app.route('/locationPair', methods=['GET'])
def locationPair():
    data = request.get_json()
    loc_pair_values = LocationTimePair.query.filter_by(id=data["id"]).first()
    if loc_pair_values:
        return jsonify(loc_pair_values.get_pair()), 200
    else:
        return jsonify({'message': 'Location-Time pair not found'}), 404

@app.route('/date', methods=['POST'])
def date():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    print(data)
    if user:
        user.set_date(data["date"])
        db.session.commit()
        return jsonify({'message': 'date updated successfully'}), 200
    return jsonify({'message': 'User not found'}), 404


@app.route('/completePref', methods=['POST'])
def completePref():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if data["change"] == "":
        return jsonify({'message': user.getCompletePref()}), 200
    else:
        user.setCompletePref(data["change"])
        db.session.commit()
        print(user.getCompletePref())
        return jsonify({'message': 'change completion status'}), 200







#########################################################
    
# @app.route('/config', methods=['GET'])
# def get_config():
#     return jsonify({'publishableKey': os.getenv('STRIPE_PUBLISHABLE_KEY')})


# @app.route('/create-verification-session', methods=['POST'])
# def create_verification_session():
#     #print("STUFF", data)
#     try:
#         data = request.form
#         print("STUFF", data)
#         verification_session = stripe.identity.VerificationSession.create(
#             type='document',
#             metadata={
#                 'user_id': data
#             }
#         )
#         return redirect(verification_session.url, code=303)
#     except stripe.error.StripeError as e:
#         return jsonify({'error': {'message': str(e)}}), 400
#     except Exception as e:
#         return jsonify({'error': {'message': str(e)}}), 400


# @app.route('/webhook', methods=['POST'])
# def webhook_received():
#     print("AHHH")
#     # You can use webhooks to receive information about asynchronous payment events.
#     # For more about our webhook events check out https://stripe.com/docs/webhooks.
#     webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
#     request_data = json.loads(request.data)

#     if webhook_secret:
#         # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
#         signature = request.headers.get('stripe-signature')
#         try:
#             event = stripe.Webhook.construct_event(
#                 payload=request.data, sig_header=signature, secret=webhook_secret)
#             data = event['data']
#         except Exception as e:
#             return e
#         # Get the type of webhook event sent - used to check the status of PaymentIntents.
#         event_type = event['type']
#     else:
#         data = request_data['data']
#         event_type = request_data['type']
#     data_object = data['object']


#     if event['type'] == 'identity.verification_session.verified':
#         print("All the verification checks passed")
#         verification_session = data_object

#     elif event['type'] == 'identity.verification_session.requires_input':
#         print("At least one verification check failed")
#         verification_session = data_object

#         if verification_session.last_error.code == 'document_unverified_other':
#             print("The document was invalid")
#         elif verification_session.last_error.code == 'document_expired':
#             print("The document was expired")
#         elif verification_session.last_error.code == 'document_type_not_suported':
#             print("The document type was not supported")
#         else:
#             print("other error code")
#     return jsonify({'status': 'success'})


@app.route('/preferences', methods=['POST'])
def preferences():
    data = request.get_json()
    location, distance, cuisines = data['location'], data['distance'], data['cuisines']
    
    """
    Perform the Yelp API request
    """
    # Define your parameters of the search
    PARAMETERS = {
        'term': 'restaurants',
        'latitude': location['latitude'],
        'longitude': location['longitude'],
        'radius': int(distance * 1609.34),  # Convert miles to meters
        'categories': cuisines,
        'limit': 10,
    }

    response = requests.get(url = ENDPOINT, params = PARAMETERS, headers = HEADERS)
    business_data = response.json()
    
    locations = business_data["businesses"]

    print(locations)

    parsedLocations = []
    for val in locations:
        if val.get("name", None) and val.get("image_url", None) and val.get("rating", None) and val.get("address1", None) and val.get("url", None):
            print("adding a value")
            parsedLocations.append({"name": val["name"],
                  "image": val["image_url"],
                  "rating": val["rating"],
                  "address": val["address1"] + ", " + val["city"] + ", " + val["state"],
                  "yelp": val["url"]})

    print("here")
    print(len(parsedLocations))
    print(parsedLocations)

    return jsonify({'message': 'Preferences saved successfully!'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)

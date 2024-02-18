from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import requests

API_KEY = 'FmpIZiUz_dOYjUVcMNX62wD1Hvzv-EOLrgcpzlFqKjKl0icOPpzwAyEpksXOGwIyonqKB18SsXetQ2DM12UXAiNsvI4xseFYfzBfF6yxt4vQpApJd5rKS9IvdvfQZXYx'
ENDPOINT = 'https://api.yelp.com/v3/businesses/search'
HEADERS = {'Authorization': 'bearer %s' % API_KEY}


app = Flask(__name__)
CORS(app)

# Database configuration (using SQLite for simplicity)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hackathon.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data)
    user = User(username=data['username'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'}), 201

    #return jsonify({'message': 'Registration bypassed for now'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        return jsonify({'message': 'Login successful!'}), 200
    return jsonify({'message': 'Invalid username or password'}), 401

    #return jsonify({'message': 'Login bypassed for now'}), 200

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
    print(business_data)

    return jsonify({'message': 'Preferences saved successfully!'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
        app.run(debug=True)


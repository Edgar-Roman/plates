from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Database configuration (using SQLite for simplicity)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hackathon.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

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

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    cuisines = db.Column(db.String(300))
    distance = db.Column(db.Integer(30))
    price = db.Column(db.Integer(80))
    groupSize = db.Column(db.String(100))
    password_hash = db.Column(db.String(128))
    locations = db.Column(db.String(300))
    # cuisine, willing to travel miles 0-20, price range ($, $$, $$$, $$$), 
    # preferred group size 1-2, 3-4, 5-6, 7+


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_preferences(self, data):
        self.cuisines = data["cuisines"].join(" ")
        self.distance = int(data["distance"])
        self.price = data["price"].join(" ")
        self.groupSize = data["groupSize"].join(" ")

    def get_preferences(self):
        return {"cuisines": self.cuisines, "distance": self.distance,
                "price": self.price, "groupSize": self.groupSize}
    
    def add_locationPairs(self, locationPairs):
        self.locations += " " + locationPairs
    
    def getLocationPairs(self):
        return self.locations.split(" ")

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
    user = User.query.filter_by(username=data['username']).first()
    user.set_preferences(data)

    return jsonify({'message': 'set preferences for ' + data['username']}), 200

@app.route('/preferences', methods=['GET'])
def preferences():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    return jsonify(user.get_preferences()), 200

@app.route('/locationChoose', methods=['POST'])
def preferences():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    locationPair = LocationTimePair.query.filter_by(id=data['id']).first()

    user.add_locationPairs(data["locationPairs"])

    return jsonify({'message': 'set preferences for ' + data['username']}), 200

@app.route('/locationPair', methods=['GET'])
def preferences():
    data = request.get_json()

    loc_pair_values = LocationTimePair.query.filter_by(id=data["id"].first()).get_pair()

    return jsonify(loc_pair_values), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
        app.run(debug=True)


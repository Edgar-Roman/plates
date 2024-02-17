from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = 'your-secret-key'  # Add a secret key for sessions and Flask-Login

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

@app.route('/preferences', methods=['POST'])
def preferences():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    print(data)
    if user:
        user.set_preferences(data)
        db.session.commit()
        return jsonify({'message': 'Preferences updated successfully'}), 200
    return jsonify({'message': 'User not found'}), 404

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)

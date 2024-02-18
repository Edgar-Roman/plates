class User:
    def __init__(self, name, preferences):
        self.name = name
        self.preferences = preferences  # List of restaurant names
        self.availabilities = {}  # Dict with date as key and list of time ranges as value

class MeetingScheduler:
    def __init__(self):
        self.users = {}  # Map user names to User objects
        self.scheduled_meetings = {}  # Keyed by date, then a list of (time, restaurant, list of user names)

    def add_user(self, user):
        self.users[user.name] = user

    def update_availability(self, user_name, date, time_range):
        if user_name in self.users:
            if date not in self.users[user_name].availabilities:
                self.users[user_name].availabilities[date] = []
            self.users[user_name].availabilities[date].append(time_range)
            self.check_for_meeting_opportunities(user_name, date, time_range)
            self.recommend_existing_meeting(user_name, date, time_range)

    def check_for_meeting_opportunities(self, user_name, date, time_range):
        # Check for overlaps with other users' availabilities and preferences
        for other_user_name, other_user in self.users.items():
            if other_user_name != user_name:
                for other_time_range in other_user.availabilities.get(date, []):
                    if self.time_overlap(time_range, other_time_range):
                        common_restaurants = set(self.users[user_name].preferences) & set(other_user.preferences)
                        if common_restaurants:
                            self.schedule_meeting(date, time_range, list(common_restaurants)[0], [user_name, other_user_name])

    def time_overlap(self, time_range1, time_range2):
        # Simplified time overlap check for this example
        start1, end1 = time_range1.split('-')
        start2, end2 = time_range2.split('-')
        return max(start1, start2) < min(end1, end2)

    def schedule_meeting(self, date, time_range, restaurant, user_names):
        if date not in self.scheduled_meetings:
            self.scheduled_meetings[date] = []
        self.scheduled_meetings[date].append((time_range, restaurant, user_names))

    def recommend_existing_meeting(self, user_name, date, time_range):
        if date in self.scheduled_meetings:
            for meeting_time, restaurant, attendees in self.scheduled_meetings[date]:
                if self.time_overlap(time_range, meeting_time) and user_name not in attendees:
                    # Check if the user prefers this restaurant
                    if restaurant in self.users[user_name].preferences:
                        # Recommend this meeting
                        attendees.append(user_name)  # Add user to the meeting
                        print(f"Recommended meeting at {restaurant} on {date} at {meeting_time} to user {user_name}.")

# Example Usage
scheduler = MeetingScheduler()
user_a = User('A', ['Restaurant1', 'Restaurant2'])
user_b = User('B', ['Restaurant2', 'Restaurant3'])
user_c = User('C', ['Restaurant2', 'Restaurant1'])  # New user

scheduler.add_user(user_a)
scheduler.add_user(user_b)
scheduler.add_user(user_c)  # Adding the new user

# Set initial availabilities and schedule meetings
scheduler.update_availability('A', '2023-02-20', '18:00-20:00')
scheduler.update_availability('B', '2023-02-20', '19:00-21:00')

# Now, let's add availability for User C that overlaps with the existing meeting
scheduler.update_availability('C', '2023-02-20', '19:00-21:00')

print(scheduler.scheduled_meetings)

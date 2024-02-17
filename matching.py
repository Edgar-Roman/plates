def calculate_distance(user_loc, restaurant_loc):
    pass # TODO: implement calculating user distance to restaurant
    return 0

def match_users_and_restaurants(users, restaurants, current_user):
    matched_groups = []

    for user in users:
        for other_user in users:
            if user.id != other_user.id and user.groupSize == other_user.groupSize:
                # Check for common cuisine preference
                if user.cuisines == other_user.cuisines:
                    # Check for overlapping price range
                    if user.upper_price_range == other_user.upper_price_range:
                        # Find restaurants that match the criteria
                        for restaurant in restaurants:
                            if (restaurant.cuisine == user.cuisines and
                                    restaurant.price_range == user.upper_price_range and
                                    calculate_distance(user.location, restaurant.location) <= user.distance):
                                matched_groups.append({
                                    "users": [user.id, other_user.id],
                                    "restaurant": restaurant.id
                                })
    return matched_groups
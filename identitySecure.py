#! /usr/bin/env python3.6
import stripe
import json
import os

from flask import Flask, redirect, render_template, jsonify, request, send_from_directory
from dotenv import load_dotenv
from pathlib import Path

# example adapted from https://docs.stripe.com/samples/identity/redirect

with open(".env") as file:
    data = file.read()

STRIPE_SECRET_KEY = data.split("=")[1]

stripe.api_version = '2020-08-27'
# os.environ["STRIPE_SECRET_KEY"] =
stripe.api_key = STRIPE_SECRET_KEY

app = Flask(__name__, static_url_path="")

@app.route('/config', methods=['GET'])
def get_config():
    return jsonify({'publishableKey': os.getenv('STRIPE_PUBLISHABLE_KEY')})


@app.route('/create-verification-session', methods=['POST'])
def create_verification_session():
    print(request)
    #print(request.args.get("username"))
    try:
        verification_session = stripe.identity.VerificationSession.create(
            type='document',
            metadata={
                'user_id': request.args.get("username")
            }
        )
        return redirect(verification_session.url, code=303)
    except stripe.error.StripeError as e:
        return jsonify({'error': {'message': str(e)}}), 400
    except Exception as e:
        return jsonify({'error': {'message': str(e)}}), 400

if __name__ == '__main__':
    app.run(port=4242, debug=True)
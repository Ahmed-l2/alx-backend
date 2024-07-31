#!/usr/bin/env python3
"""Basic flask app"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config:
    """Configuration class for babel localization"""
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """Determine the best match with our supported languages"""
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    if g.user:
        locale = g.user['locale']
    if locale in app.config['LANGUAGES']:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone():
    """Determine the timezone"""
    timezone = request.args.get('timezone')
    if timezone in pytz.all_timezones:
        return timezone

    if g.user and g.user['timezone'] in pytz.all_timezones:
        return g.user['timezone']

    return app.config['BABEL_DEFAULT_TIMEZONE']


def get_user():
    """Returns user information from the mock database"""
    user_id = request.args.get('login_as', type=int)
    return users.get(user_id)


@app.before_request
def before_request():
    """Set user information as global before each request"""
    g.user = get_user()


@app.route('/')
def hello():
    """Route to index"""
    return render_template('7-index.html')


if __name__ == '__main__':
    app.run(debug=True)

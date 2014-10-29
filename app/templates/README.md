# django-kaiju-pack
A Django 1.7 project template with a few conventions implemented, as well as basic Heroku configuration.

Includes:
- Post-compile hook script for heroku-buildpack-python
- Script to install Node.JS on Heroku (for front-end dependency management and compilation)
- Multiple requirement files for different environments
- Multiple settings files for different environments
- A few additional sane default settings (logging, Heroku database, staticfiles, etc.)
- Uses waitress instead of gunicorn for its server
- Sane project folder structure


## How to use django-kaiju-pack
All you really need to do is start a django project as you normally would, and use this project as scaffolding. Replace all instances of kaiju with the name of your django project and you should be up and running.

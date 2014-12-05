# generator-django-kaiju [![Build Status](https://travis-ci.org/mixxorz/generator-django-kaiju.svg?branch=master)](https://travis-ci.org/mixxorz/generator-django-kaiju)

> [Yeoman](http://yeoman.io) generator for Django that includes a live reloading development server, sass support, Foundation 5 and Heroku integration.


## Getting Started

### What does it do?
This generator...

* Scaffolds your Django app with good conventions. (core app, multiple settings, etc.)
* Sets up `sass`
* Sets up live reloading development server via grunt
* Configures a `build` task that minifies and concatenates your css/js/images.
* Sets up Foundation 5
* Sets up Font Awesome
* Sets up project for Heroku hosting (Procfile, post-compile scripts)

### Usage

Install `generator-django-kaiju`:
```
npm install -g generator-django-kaiju
```

Make a new directory, and `cd` into it:
```
mkdir mydjangoproject && cd mydjangoproject
```

Make a new `virtualenv` and activate it (Optional)
```
virtulenv venv
source venv/bin/activate
```
Or if you're using virtualenvwrapper
```
mkvirtualenv myvenv
```

Run `yo django-kaiju`, optionally passing your project's name
```
yo django-kaiju [appname]
```

### Grunt tasks

* `grunt [default]`  - starts the Django development server and the live reloading server.
* `grunt build` - concatenates, copies and minifies css/js/images into `core/assets/dist`

### Heroku
A few things need to be setup in your Heroku app

Initialize a git repo
```
git init
```

Add everything and commit
```
git add -A
git commit -m "Initial commit for mydjangoproject"
```

If you don't have one yet, create your app
```
heroku create
```

Set DJANGO_SETTINGS_MODULE to `<your_app_name>.settings.prod`
```
heroku config:set DJANGO_SETTINGS_MODULE='<your_app_name>.settings.prod'
```

Set DJANGO_SECRET_KEY to a django secret key. (You can generate one [here](http://www.miniwebtool.com/django-secret-key-generator/))
```
heroku config:set DJANGO_SECRET_KEY='<secret key>'
```

Finally, explicitly set your buildpack to use Heroku's Multi Buildpack
```
heroku config:set BUILDPACK_URL='https://github.com/heroku/heroku-buildpack-multi'
```

You can now push your app to heroku
```
git push heroku master
```

## Changelog

**1.2**
- Switched over to using multi buildpacks for faster deployment

**1.1**
- Removed the need for django-admin to be in PATH during scaffolding

**1.0**
- Initial release


## License

MIT

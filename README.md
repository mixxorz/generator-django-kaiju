# generator-django-kaiju [![Build Status](https://secure.travis-ci.org/mixxorz/generator-django-kaiju.png?branch=master)](https://travis-ci.org/mixxorz/generator-django-kaiju)

> [Yeoman](http://yeoman.io) generator for Django that includes a live reloading development server, sass support, Foundation 5 and Heroku integration.


## Getting Started

### Usage

Install `generator-django-kaiju`:
```
npm install -g generator-django-kaiju
```

Make a new directory, and `cd` into it:
```
mkdir mydjangoproject && cd mydjangoproject
```

Make a new `virtualenv` and activate it
```
virtulenv venv
source venv/bin/activate
```
Or if you're using virtualenvwrapper
```
mkvirtualenv myvenv
```

Install Django
```
pip install django
```

Run `yo django-kaiju`, optionally passing your project's name
```
yo django-kaiju [appname]
```

Run `grunt` to start the django development server with live reloading css/js

### What does it do?
This generator...

* Scaffolds your Django app with good conventions. (core app, multiple settings, etc.)
* Sets up `sass`
* Sets up live reloading development server via grunt
* Configures a `build` task that minifies and conatenates your css/js/images.
* Sets up Foundation 5
* Sets up Font Awesome
* Sets up project for Heroku hosting (Procfile, post-compile scripts)


## License

MIT

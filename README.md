# Web Manifest Validator

Try it live: [https://manifest-validator.appspot.com/](https://manifest-validator.appspot.com/)

Tip: You can prepopulate a website URL with [https://manifest-validator.appspot.com/#https://example.com](https://manifest-validator.appspot.com/#https://example.com)

## How to contribute?

We are using travis for continuous integration and Google App Engine to host the website. In order to test your changes locally, you will need to have the [Google Cloud SDK](https://cloud.google.com/sdk/) installed and use `dev_appserver.py`.

Changes will only be accepted if they pass the tests. Changes merged to the master branch will automatically be deployed to the app engine instance.

## What's with the gh-pages branch?

This project used to be hosted with GitHub Pages. We moved over to Google App Engine but we kept a _gh-pages_ branch that redirects to the new URL in order to not break existing links.

[![Build Status](https://travis-ci.org/mounirlamouri/manifest-validator.svg)](https://travis-ci.org/mounirlamouri/manifest-validator)

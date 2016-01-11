from lxml import etree
from urlparse import urljoin
import json
import os
import webapp2

from google.appengine.api import urlfetch
from google.appengine.ext.webapp import template


class CheckWebsiteHandler(webapp2.RequestHandler):
  def post(self):
    website_url = self.request.get('websiteUrl')
    response = {}
    try:
      # Fetch website URL.
      website_result = urlfetch.fetch(website_url)
      if website_result.status_code == 200:
        # Parse the content
        parser = etree.HTMLParser(encoding='utf-8')
        # TODO Handle more encoding.
        htmltree = etree.fromstring(website_result.content, parser)
        # Try to find web manifest <link rel="manifest" href="...">.
        value = htmltree.xpath("//link[@rel='manifest']/attribute::href")
        if (len(value) > 0):
          # Fetch web manifest.
          manifest_url = value[0]
          if "://" not in manifest_url:
            manifest_url = urljoin(website_url, manifest_url)
          try:
            manifest_result = urlfetch.fetch(manifest_url)
            if manifest_result.status_code == 200:
              response['websiteUrl'] = website_url
              response['manifestUrl'] = manifest_url
              response['content'] = manifest_result.content
              # TODO Check CORS headers
            else:
              response['error'] = 'Manifest %s is not HTTP 200.' % manifest_url
          except (urlfetch.InvalidURLError, urlfetch.DownloadError) as e:
            response['error'] = repr(e)
      else:
        response['error'] = 'Website %s is not HTTP 200.' % website_url
    except (urlfetch.InvalidURLError, urlfetch.DownloadError) as e:
      response['error'] = repr(e)
    finally:
      self.response.headers['Content-Type'] = 'application/json'
      self.response.out.write(json.dumps(response))

class MainHandler(webapp2.RequestHandler):
  def get(self):
    self.response.write(template.render(
        os.path.join(os.path.dirname(__file__), 'index.html'), {}))

app = webapp2.WSGIApplication([
  ('/', MainHandler),
  ('/check', CheckWebsiteHandler),
], debug=True)

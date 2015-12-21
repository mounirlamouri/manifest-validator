import os
import webapp2

from google.appengine.ext.webapp import template

class MainHandler(webapp2.RequestHandler):
  def get(self):
    self.response.write(template.render(
      os.path.join(os.path.dirname(__file__),
                   'index.html'), {}))

app = webapp2.WSGIApplication([
  ('/', MainHandler),
], debug=True)

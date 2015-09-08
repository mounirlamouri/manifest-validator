"use strict";

var ManifestParser = (function() {

  var _json_input = {};
  var _manifest = {};
  var _logs = [];
  var _success = true;

  var ALLOWED_DISPLAY_VALUES = [ 'fullscreen',
                                 'standalone',
                                 'minimal-ui',
                                 'browser' ];

  var ALLOWED_ORIENTATION_VALUES = [ 'any',
                                     'natural',
                                     'landscape',
                                     'portrait',
                                     'portrait-primary',
                                     'portrait-secondary',
                                     'landscape-primary',
                                     'landscape-secondary' ];

  function _parseString(args) {
    var object = args.object;
    var property = args.property;
    if (!(property in object))
      return undefined;

    if (typeof object[property] != 'string') {
      _logs.push('ERROR: "' + property + '" expected to be a string but is not.');
      return undefined;
    }

    if (args.trim)
      return object[property].trim();
    return object[property];
  }

  function _parseBoolean(args) {
    var object = args.object;
    var property = args.property;
    var defaultValue = args.defaultValue;
    if (!(property in object))
      return defaultValue;

    if (typeof object[property] != 'boolean') {
      _logs.push('ERROR: "' + property + '" expected to be a boolean but is not.');
      return defaultValue;
    }

    return object[property];
  }

  function _parseURL(args) {
    var object = args.object;
    var property = args.property;
    var baseURL = args.baseURL;

    var str = _parseString({ object: object, property: property, trim: false });
    if (str === undefined)
      return undefined;

    // TODO: resolve url using baseURL
    // new URL(object[property], baseURL);
    return object[property];
  }

  function _parseColor(args) {
    var object = args.object;
    var property = args.property;
    if (!(property in object))
      return undefined;

    if (typeof object[property] != 'string') {
      _logs.push('ERROR: "' + property + '" expected to be a string but is not.');
      return undefined;
    }

    // If style.color changes when set to the given color, it is valid. Testing
    // against 'white' and 'black' in case of the given color is one of them.
    var dummy = document.createElement('div');
    dummy.style.color = 'white';
    dummy.style.color = object[property];
    if (dummy.style.color != 'white')
      return object[property];
    dummy.style.color = 'black';
    dummy.style.color = object[property];
    if (dummy.style.color != 'black')
      return object[property];
    return undefined;
  }

  function _parseName() {
    return _parseString({ object: _json_input, property: 'name', trim: true });
  }

  function _parseShortName() {
    return _parseString({ object: _json_input,
                          property: 'short_name',
                          trim: true });
  }

  function _parseStartUrl() {
    // TODO: parse url using manifest_url as a base (missing).
    return _parseURL({ object: _json_input, property: 'start_url' });
  }

  function _parseDisplay() {
    var display = _parseString({ object: _json_input,
                                 property: 'display',
                                 trim: true });
    if (display === undefined)
      return display;

    if (ALLOWED_DISPLAY_VALUES.indexOf(display.toLowerCase()) == -1) {
      _logs.push('ERROR: "display" has an invalid value, will be ignored.');
      return undefined;
    }

    return display;
  }

  function _parseOrientation() {
    var orientation = _parseString({ object: _json_input,
                                     property: 'orientation',
                                     trim: true });
    if (orientation === undefined)
      return orientation;

    if (ALLOWED_ORIENTATION_VALUES.indexOf(orientation.toLowerCase()) == -1) {
      _logs.push('ERROR: "orientation" has an invalid value, will be ignored.');
      return undefined;
    }

    return orientation;
  }

  function _parseIcons() {
    var property = 'icons';
    var icons = [];

    if (!(property in _json_input))
      return icons;

    if (!Array.isArray(_json_input[property])) {
      _logs.push('ERROR: "' + property + '" expected to be an array but is not.');
      return icons;
    }

    _json_input[property].forEach(function(object) {
      var icon = {};
      if (!('src' in object))
        return;
      // TODO: pass manifest url as base.
      icon.src = _parseURL({ object: object, property: 'src' });
      icon.type = _parseString({ object: object,
                                 property: 'type',
                                 trim: true });

      icon.density = parseFloat(object['density']);
      if (isNaN(icon.density) || !isFinite(icon.density) || icon.density <= 0)
        icon.density = 1.0;

      if ('sizes' in object) {
        var set = new Set();
        var link = document.createElement('link');
        link.sizes = object['sizes'];

        for (var i = 0; i < link.sizes.length; ++i)
          set.add(link.sizes.item(i).toLowerCase());

        if (set.size != 0)
          icon.sizes = set;
      }

      icons.push(icon);
    });

    return icons;
  }

  function _parseRelatedApplications() {
    var property = 'related_applications';
    var applications = [];

    if (!(property in _json_input))
      return applications;

    if (!Array.isArray(_json_input[property])) {
      _logs.push('ERROR: "' + property + '" expected to be an array but is not.');
      return applications;
    }

    _json_input[property].forEach(function(object) {
      var application = {};
      application.platform = _parseString({ object: object,
                                            property: 'platform',
                                            trim: true });
      application.id = _parseString({ object: object,
                                      property: 'id',
                                      trim: true });
      // TODO: pass manfiest url as base.
      application.url = _parseURL({ object: object, property: 'url' });
      applications.push(application);
    });

    return applications;
  }

  function _parsePreferRelatedApplications() {
    return _parseBoolean({ object: _json_input,
                           property: 'prefer_related_applications',
                           defaultValue: false });
  }

  function _parseThemeColor() {
    return _parseColor({ object: _json_input, property: 'theme_color' });
  }

  function _parseBackgroundColor() {
    return _parseColor({ object: _json_input, property: 'background_color' });
  }

  function _parse(string) {
    try {
      _json_input = JSON.parse(string);
    } catch (e) {
      _logs.push("File isn't valid JSON: " + e);
      _success = false;
    }

    _logs.push("JSON parsed successfuly.");

    _manifest.name = _parseName();
    _manifest.short_name = _parseShortName();
    _manifest.start_url= _parseStartUrl();
    _manifest.display = _parseDisplay();
    _manifest.orientation = _parseOrientation();
    _manifest.icons = _parseIcons();
    _manifest.related_applications = _parseRelatedApplications();
    _manifest.prefer_related_applications = _parsePreferRelatedApplications();
    _manifest.theme_color = _parseThemeColor();
    _manifest.background_color = _parseBackgroundColor();

    _logs.push('Parsed `name` property is: ' + _manifest.name);
    _logs.push('Parsed `short_name` property is: ' + _manifest.short_name);
    _logs.push('Parsed `start_url` property is: ' + _manifest.start_url);
    _logs.push('Parsed `display` property is: ' + _manifest.display);
    _logs.push('Parsed `orientation` property is: ' + _manifest.orientation);
    _logs.push('Parsed `icons` property is: ' + _manifest.icons);
    _logs.push('Parsed `related_applications` property is: ' + _manifest.related_applications);
    _logs.push('Parsed `prefer_related_applications` property is: ' + _manifest.prefer_related_applications);
    _logs.push('Parsed `theme_color` property is: ' + _manifest.theme_color);
    _logs.push('Parsed `background_color` property is: ' + _manifest.background_color);
  }

  return {
    parse: _parse,
    manifest: function() { return _manifest; },
    logs: function() { return _logs; },
    success: function() { return _success; }
  };
})();

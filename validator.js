"use strict";

var ManifestValidator = (function() {

  var _json_input = {};
  var _manifest = {};
  var _logs = [];

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
    var property = args.property;
    if (!(property in _json_input))
      return undefined;

    if (typeof _json_input[property] != 'string') {
      _logs.push('ERROR: "' + property + '" expected to be a string but is not.');
      return undefined;
    }

    if (args.trim)
      return _json_input[property].trim();
    return _json_input[property];
  }

  function _parseBoolean(args) {
    var property = args.property;
    var defaultValue = args.defaultValue;
    if (!(property in _json_input))
      return defaultValue;

    if (typeof _json_input[property] != 'boolean') {
      _logs.push('ERROR: "' + property + '" expected to be a boolean but is not.');
      return defaultValue;
    }

    return _json_input[property];
  }

  function _parseName() {
    return _parseString({ property: 'name', trim: true });
  }

  function _parseShortName() {
    return _parseString({ property: 'short_name', trim: true });
  }

  function _parseStartUrl() {
    // TODO: parse url using manifest_url as a base (missing).
    return _parseString({ property: 'start_url', trim: false });
  }

  function _parseDisplay() {
    var display = _parseString({ property: 'display', trim: true });
    if (display === undefined)
      return display;

    if (ALLOWED_DISPLAY_VALUES.indexOf(display.toLowerCase()) == -1) {
      _logs.push('ERROR: "display" has an invalid value, will be ignored.');
      return undefined;
    }

    return display;
  }

  function _parseOrientation() {
    var orientation = _parseString({ property: 'orientation', trim: true });
    if (orientation === undefined)
      return orientation;

    if (ALLOWED_ORIENTATION_VALUES.indexOf(orientation.toLowerCase()) == -1) {
      _logs.push('ERROR: "orientation" has an invalid value, will be ignored.');
      return undefined;
    }

    return orientation;
  }

  function _parseRelatedApplications() {
    var property = 'related_applications';
    if (!(property in _json_input))
      return [];

    if (!Array.isArray(_json_input.property)) {
      _logs.push('ERROR: "' + property + '" expected to be an array but is not.');
      return [];
    }

    // TODO: finish

    return [];
  }

  function _parsePreferRelatedApplications() {
    return _parseBoolean({ property: 'prefer_related_applications', defaultValue: false });
  }

  function _check(string) {
    try {
      _json_input = JSON.parse(string);
    } catch (e) {
      _logs.push("File isn't valid JSON: " + e);
      return [ false, _logs ];
    }

    _logs.push("JSON parsed successfuly.");

    _manifest.name = _parseName();
    _manifest.short_name = _parseShortName();
    _manifest.start_url= _parseStartUrl();
    _manifest.display = _parseDisplay();
    _manifest.orientation = _parseOrientation();

    // TODO: parse icons

    // TODO: finish related_applications
    _manifest.related_applications = _parseRelatedApplications();
    _manifest.prefer_related_applications = _parsePreferRelatedApplications();

    // TODO: parse theme_color
    // TODO: parse background_color

    _logs.push('Parsed `name` property is: ' + _manifest.name);
    _logs.push('Parsed `short_name` property is: ' + _manifest.short_name);
    _logs.push('Parsed `start_url` property is: ' + _manifest.start_url);
    _logs.push('Parsed `display` property is: ' + _manifest.display);
    _logs.push('Parsed `orientation` property is: ' + _manifest.orientation);
    _logs.push('Parsed `related_applications` property is: ' + _manifest.related_applications);
    _logs.push('Parsed `prefer_related_applications` property is: ' + _manifest.prefer_related_applications);

    return [ true, _logs ];
  }

  return {
    check: _check,
  };
})();

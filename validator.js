"use strict";

var ManifestValidator = (function() {

  var _manifest = {};
  var _logs = [];

  function _checkName(manifest) {
    if (!_manifest.name) {
      _logs.push('Manifest has no `name` property.')
      return;
    }

    if (typeof _manifest.name != "string") {
      _logs.push('ERROR: Manifest\'s `name` property type is invalid.');
      return;
    }

    _manifest.name = _manifest.name.trim();
    _logs.push('Parsed `name` property is: ' + _manifest.name);
  }

  function _checkShortName(manifest) {
    if (!_manifest.short_name) {
      _logs.push('Manifest has no `short_name` property.')
      return;
    }

    if (typeof _manifest.short_name != "string") {
      _logs.push('ERROR: Manifest\'s `short_name` property type is invalid.');
      return;
    }

    _manifest.short_name = _manifest.short_name.trim();
    _logs.push('Parsed `short_name` property is: ' + _manifest.short_name);
  }

  function _check(string) {
    try {
      _manifest = JSON.parse(string);
    } catch (e) {
      _logs.push("File isn't valid JSON: " + e);
      return [ false, _logs ];
    }

    _logs.push("JSON parsed successfuly.");

    _checkName();
    _checkShortName();

    return [ true, _logs ];
  }

  return {
    check: _check,
  };
})();

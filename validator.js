"use strict";

var ManifestValidator = (function() {

  function _check(string) {
    var json = "";
    var logs = [];
    try {
      json = JSON.parse(string);
    } catch (e) {
      logs.push("File isn't valid JSON.");
      return [ false, logs ];
    }

    logs.push("JSON parsed successfuly.");

    return [ true, logs ];
  }

  return {
    check: _check,
  };
})();

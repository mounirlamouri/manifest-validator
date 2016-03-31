function _clearLogs() {
  document.querySelector('#log').innerHTML = '';
}

function _log(str, className) {
  var line = document.createElement('div');
  line.textContent = str;
  if (className) {
    line.classList.add(className);
  }
  document.querySelector('#log').appendChild(line);
}

function _showParserLogs(options) {
  if (!ManifestParser.success()) {
    _log('Error: Manifest is invalid!', 'error');
  } else {
    _log('Success: Manifest is valid!', 'success');
  }
  if (options && options.manifestUrl) {
    _log('Manifest URL: ' + options.manifestUrl);
  }

  ManifestParser.logs().forEach(function(log) {
    _log(log);
  });
}

function _clearTips() {
  document.querySelector('#tip').innerHTML = '';
}

function _tip(str) {
  var line = document.createElement('div');
  line.innerHTML = str;
  document.querySelector('#tip').appendChild(line);
}

function _showParserTips() {
  if (!ManifestParser.tips().length) {
    return;
  }
  document.querySelector('#tip').innerHTML = '<hr/>';
  ManifestParser.tips().forEach(function(tip) {
    _tip(tip);
  });
}

document.querySelector('input[type=file]').onchange = function() {
  if (!this.files || !this.files.length)
    return;
  _clearLogs();
  _clearTips();

  var reader = new FileReader();
  reader.readAsText(this.files[0], "UTF-8");
  reader.onerror = function() {
    _log('Error: Cannot read the file.', 'error');
  };
  reader.onload = function() {
    ManifestParser.parse(this.result);
    _showParserLogs();
    _showParserTips();
  };
}

document.querySelector('#check-website-url').onclick = function(e) {
  _clearLogs();
  _clearTips();

  var websiteUrl = document.querySelector('#website-url').value;
  var data = new FormData();
  data.append('websiteUrl', websiteUrl);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/check');
  xhr.responseType = 'json';
  xhr.onload = function() {
    if (this.response.error) {
      _log(this.response.error, 'error');
      if (this.response.manifestUrl) {
        _log('Manifest URL: ' + this.response.manifestUrl);
      }
    } else {
      var manifestUrl = new URL(this.response.manifestUrl);
      var websiteUrl = new URL(this.response.websiteUrl);
      if (manifestUrl.origin == websiteUrl.origin ||
          (this.response.originHeader &&
           (this.response.originHeader.includes(websiteUrl.origin) ||
           this.response.originHeader == '*'))) {
        ManifestParser.parse(this.response.content);
        _showParserLogs({manifestUrl : this.response.manifestUrl});
        _showParserTips();
      } else {
        _log('Access-Control-Allow-Origin HTTP header is not properly set.', 'error');
        _log('Manifest URL: ' + this.response.manifestUrl);
      }
    }
    document.querySelector('#log').scrollIntoView(true);
  }
  xhr.onerror = function() {
    _log('Error: Cannot check website URL.', 'error');
  };
  xhr.send(data);
}

document.querySelector('#check-source').onclick = function(e) {
  _clearLogs();
  _clearTips();

  ManifestParser.parse(document.querySelector('#manifest-source').value);
  _showParserLogs();
  _showParserTips();
  document.querySelector('#log').scrollIntoView(false);
}

window.addEventListener('mdl-componentupgraded', function() {
  var websiteUrl = location.hash.substr(1);
  var websiteUrlInput = document.querySelector('#website-url').parentElement.MaterialTextfield;
  if (websiteUrl && websiteUrlInput) {
    websiteUrlInput.change(websiteUrl);
  }
});

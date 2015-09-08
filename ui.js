function _clearLogs() {
  document.querySelector('#log').innerHTML = '';
}

function _log(str) {
  var line = document.createElement('div');
  line.textContent = str;
  document.querySelector('#log').appendChild(line);
}

function _showParserLogs() {
  ManifestParser.logs().forEach(function(log) {
    _log(log);
  });

  if (!ManifestParser.success())
    _log('ERROR: Manifest is invalid, see errors above.');
  else
    _log('SUCCESS: Manifest is valid!');
}

document.querySelector('input[type=file]').onchange = function() {
  if (!this.files)
    return;
  _clearLogs();

  for (var i = 0, f; f = this.files[i]; ++i) {
    _log('Checking ' + this.files[i].name);

    var reader = new FileReader();
    reader.readAsText(this.files[i], "UTF-8");
    reader.onerror = function() {
      _log('ERROR: cannot read the file.');
    };
    reader.onload = function() {
      ManifestParser.parse(this.result);
      _showParserLogs();
    };
  }
}

document.querySelector('#check-source').onclick = function(e) {
  _clearLogs();

  ManifestParser.parse(document.querySelector('#manifest-source').value);
  _showParserLogs();
}

var ManifestParser = require('../static/manifest-parser.js');
var assert = require('assert');

describe('Manifest Parser', function() {
  it('should not parse empty string input', function() {
    ManifestParser.parse('');
    assert.equal(false, ManifestParser.success());
  });

  it('has empty values when parsing empty manifest', function() {
    ManifestParser.parse('');
    assert.equal(null, ManifestParser.manifest().name);
    assert.equal(null, ManifestParser.manifest().short_name);
    assert.equal(null, ManifestParser.manifest().start_url);
    assert.equal(null, ManifestParser.manifest().display);
    assert.equal(null, ManifestParser.manifest().orientation);
    assert.equal(null, ManifestParser.manifest().theme_color);
    assert.equal(null, ManifestParser.manifest().background_color);
  });

  it('accepts empty dictionary', function() {
    ManifestParser.parse('{}');
    assert.equal(true, ManifestParser.success());
    assert.equal(null, ManifestParser.manifest().name);
    assert.equal(null, ManifestParser.manifest().short_name);
    assert.equal(null, ManifestParser.manifest().start_url);
    assert.equal(null, ManifestParser.manifest().display);
    assert.equal(null, ManifestParser.manifest().orientation);
    assert.equal(null, ManifestParser.manifest().theme_color);
    assert.equal(null, ManifestParser.manifest().background_color);
    // TODO:
    // icons
    // related_applications
    // prefer_related_applications
  });

  it('accepts unknown values', function() {
    ManifestParser.parse('{}');
    assert.equal(true, ManifestParser.success());
    assert.equal(null, ManifestParser.manifest().name);
    assert.equal(null, ManifestParser.manifest().short_name);
    assert.equal(null, ManifestParser.manifest().start_url);
    assert.equal(null, ManifestParser.manifest().display);
    assert.equal(null, ManifestParser.manifest().orientation);
    assert.equal(null, ManifestParser.manifest().theme_color);
    assert.equal(null, ManifestParser.manifest().background_color);
  });

  describe('name parsing', function() {
    it('it parses basic string', function() {
      ManifestParser.parse('{"name":"foo"}')
      assert.equal(true, ManifestParser.success());
      assert.equal('foo', ManifestParser.manifest().name);
    });

    it('it trims whitespaces', function() {
      ManifestParser.parse('{"name":" foo "}')
      assert.equal(true, ManifestParser.success());
      assert.equal('foo', ManifestParser.manifest().name);
    });

    it('doesn\'t parse non-string', function() {
      ManifestParser.parse('{"name": {} }')
      assert.equal(true, ManifestParser.success());
      assert.equal(null, ManifestParser.manifest().name);

      ManifestParser.parse('{"name": 42 }')
      assert.equal(true, ManifestParser.success());
      assert.equal(null, ManifestParser.manifest().name);
    });
  });

  describe('short_name parsing', function() {
    it('it parses basic string', function() {
      ManifestParser.parse('{"short_name":"foo"}')
      assert.equal(true, ManifestParser.success());
      assert.equal('foo', ManifestParser.manifest().short_name);
    });

    it('it trims whitespaces', function() {
      ManifestParser.parse('{"short_name":" foo "}')
      assert.equal(true, ManifestParser.success());
      assert.equal('foo', ManifestParser.manifest().short_name);
    });

    it('doesn\'t parse non-string', function() {
      ManifestParser.parse('{"short_name": {} }')
      assert.equal(true, ManifestParser.success());
      assert.equal(null, ManifestParser.manifest().short_name);

      ManifestParser.parse('{"short_name": 42 }')
      assert.equal(true, ManifestParser.success());
      assert.equal(null, ManifestParser.manifest().short_name);
    });
  });

  describe('dir parsing', function(){
    it('defaults to auto when value is missing', function(){
      ManifestParser.parse('{}');
      assert.equal(true, ManifestParser.success());
      assert.equal('auto', ManifestParser.manifest().dir);
    });

    it("defaults to auto when value is invalid", function(){
      ManifestParser.parse('{"dir": "invalid string"}');
      assert.equal(true, ManifestParser.success());
      assert.equal('auto', ManifestParser.manifest().dir);
      ManifestParser.parse('{"dir": ["invalid value"]}');
      assert.equal(true, ManifestParser.success());
      assert.equal('auto', ManifestParser.manifest().dir);
      ManifestParser.parse('{"dir": {"ltr": "rtl"}}');
      assert.equal(true, ManifestParser.success());
      assert.equal('auto', ManifestParser.manifest().dir);
      ManifestParser.parse('{"dir": "RTL"}');
      assert.equal(true, ManifestParser.success());
      assert.equal('auto', ManifestParser.manifest().dir);
      ManifestParser.parse('{"dir": "lTr"}');
      assert.equal(true, ManifestParser.success());
      assert.equal('auto', ManifestParser.manifest().dir);
      ManifestParser.parse('{"dir": "AuTo"}');
      assert.equal(true, ManifestParser.success());
      assert.equal('auto', ManifestParser.manifest().dir);
    });

    it("parses auto as a value", function(){
      ManifestParser.parse('{"dir": "auto"}');
      assert.equal(true, ManifestParser.success());
      assert.equal('auto', ManifestParser.manifest().dir);
      ManifestParser.parse(JSON.stringify({"dir": "\n\t\t\n auto \n\n\t\t\t\t" }));
      assert.equal(true, ManifestParser.success());
      assert.equal('auto', ManifestParser.manifest().dir);
    });

    it("parses rtl as a value", function(){
      ManifestParser.parse('{"dir": "rtl"}');
      assert.equal(true, ManifestParser.success());
      assert.equal('rtl', ManifestParser.manifest().dir);
      ManifestParser.parse(JSON.stringify({"dir": "\n\t\t\n rtl \n\n\t\t\t\t" }));
      assert.equal(true, ManifestParser.success());
      assert.equal('rtl', ManifestParser.manifest().dir);
    });

    it("parses ltr as a value", function(){
      ManifestParser.parse('{"dir": "ltr"}');
      assert.equal(true, ManifestParser.success());
      assert.equal('ltr', ManifestParser.manifest().dir);
      ManifestParser.parse(JSON.stringify({"dir": "\n\t\t\n ltr \n\n\t\t\t\t" }));
      assert.equal(true, ManifestParser.success());
      assert.equal('ltr', ManifestParser.manifest().dir);
    });

  });
});

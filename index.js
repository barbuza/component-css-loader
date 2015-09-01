var fs = require('fs');
var path = require('path');
var loaderUtils = require('loader-utils');
var sourceMap = require('source-map');

var makeIdentitySourceMap = require('./lib/makeIdentitySourceMap');

var SourceNode = sourceMap.SourceNode;
var SourceMapConsumer = sourceMap.SourceMapConsumer;


module.exports = function (source, map) {
  if (this.cacheable) {
    this.cacheable();
  }

  var callback = this.async();

  var query = loaderUtils.parseQuery(this.query);

  var resourcePath = this.resourcePath;
  var componentName = path.basename(resourcePath, path.extname(resourcePath));

  var styleFileName = componentName + '.' + (query.ext || 'styl');
  var stylePath = path.resolve(resourcePath, '..', styleFileName);

  var makeSourceMap = this.sourceMap;

  fs.stat(stylePath, function (err, stats) {
    if (stats && stats.isFile()) {
      var header;

      if (query.varName) {
        header = "var " + query.varName + " = require('./" + styleFileName + "');";
      } else {
        header = "require('./" + styleFileName + "');";
      }

      if (makeSourceMap) {

        if (!map) {
          map = makeIdentitySourceMap(source, resourcePath);
        }

        var node = new SourceNode(null, null, null, [
          new SourceNode(null, null, resourcePath, header),
          SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map))
        ]).join("\n");

        var result = node.toStringWithSourceMap();

        callback(null, result.code, result.map.toString());

      } else {

        callback(null, [header, source].join("\n"));

      }
    } else {
      callback(null, source, map);
    }
  });
};

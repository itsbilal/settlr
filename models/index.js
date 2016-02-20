"use strict";
// Include all models in this folder

var fs = require("fs");

module.exports = function() {
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file === "index.js"){
      return;
    }
    var name = file.substr(0, file.indexOf('.'));
    require('./' + name)();
  });
};

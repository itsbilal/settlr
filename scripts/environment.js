
var mongoose = require("mongoose");
var promisify = require("../helpers/promisify");
var fs = require("fs");
var path = require("path");
var parse = require("csv-parse");

mongoose.connect("mongodb://localhost/settlr");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.once('open', function(){

  require("../models")();
  var Hood = mongoose.model("Hood");

  function get_neighbourhood_if_exists(nid){
    return promisify.m(Hood, 'find', {nid: nid})
      .then(function(results){
        if (results.length === 0) {
          throw "Ayy lmao neighbourhood doesn't exist";
        }
        return Promise.resolve(results[0]);
      })
  };

  promisify.m(fs, 'readFile', path.join(__dirname, "./environment.csv"))
    .then((rawCsv) => {
      return promisify.f(parse, rawCsv)
    })
    .then((csv) => {
      return Promise.all(csv.map((hood) => {
        var nid = hood[1];
        var green_spaces = hood[7];
        return get_neighbourhood_if_exists(nid)
          .then((hood) => {
            hood.scores.push({category: "green_spaces", value: green_spaces});
            hood.scores.push({category: "pollutants", value: hood[6]});
            return promisify.m(hood, 'save');
          });
      }));
    })
    .then(() => {
      process.exit();
    })
    .catch((err) => {
      console.error(err);
    });
});


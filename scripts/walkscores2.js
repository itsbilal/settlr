
var neighbourhoods = require("./walkscores.json");

var request = require("request");
var mongoose = require("mongoose");
var promisify = require("../helpers/promisify");

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

  var promises = neighbourhoods.map(function(neighbourhood){
    var parts = neighbourhood.nid.match(/^(.+)\s\(([0-9]+)\)$/);
    var _hood = null;
    return get_neighbourhood_if_exists(parts[2])
      .then((hood) => {
        _hood = hood;
        hood.centroid = {
          x: neighbourhood.x,
          y: neighbourhood.y
        };
        return promisify.m(hood, 'save');
      })
      .then((hood) => {
        return promisify.f(request, "https://www.walkscore.com/auth/_pv/overview/loc/lat=" + hood.centroid.x + "/lng=" + hood.centroid.y + "?d=current");
      })
      .then((response) => {
        body = JSON.parse(response.body);
        _hood.scores.push({category: "walkscore", value: body.walkscore});
        console.log("Neighbourhood: %s, %d", _hood.title, body.walkscore);
        return promisify.m(_hood, 'save');
      });
  })

  Promise.all(promises)
    .then(function(results){
      process.exit();
    })
    .catch(function(err){
      console.error(err);
    });
});


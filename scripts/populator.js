
var neighbourhoods = require("./neighbourhoods.json");

var mongoose = require("mongoose");
var promisify = require("../helpers/promisify");

mongoose.connect("mongodb://localhost/settlr");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.once('open', function(){

  require("../models")();

  var Hood = mongoose.model("Hood");

  var promises = neighbourhoods.features.map(function(neighbourhood){
    var hood = new Hood();
    var name = neighbourhood.attributes.AREA_NAME;
    var parts = name.match(/^(.+)\s\(([0-9]+)\)$/);

    hood.nid = parts[2];
    hood.title = parts[1];
    hood.geometry = neighbourhood.geometry;

    return promisify.m(hood, 'save');
  })

  Promise.all(promises)
    .then(function(results){
      process.exit();
    })
    .catch(function(err){
      console.error(err);
    });
});


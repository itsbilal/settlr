
// var requirejs = require("requirejs");

// var neighbourhoods = require("./neighbourhoods.json");
// var mongoose = require("mongoose");
// var promisify = require("../helpers/promisify");

// mongoose.connect("mongodb://localhost/settlr");
// mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// mongoose.connection.once('open', function(){

//   require("../models")();

//   var Hood = mongoose.model("Hood");

//   var jsdom = require("jsdom").jsdom;
//   var doc = jsdom(markup, options);
//   var window = doc.defaultView;

//   requirejs(["./esri"], function(esri) {
//     neighbourhoods.features.forEach((hood) => {
//       var x = hood.centroid.x, y = hood.centroid.y;
//       console.log(esri.geometry.xyToLngLat(x,y));
//     });
//   });
// });


function walkscores(hoods) {
  require(["esri/geometry/webMercatorUtils"], function(webMercatorUtils){
    ans = hoods.features.map((hood) => {
      var x = hood.centroid.x, y = hood.centroid.y;
      yx = esri.geometry.xyToLngLat(x,y);
      x = yx[1], y = yx[0];
      return {
        nid: hood.attributes.AREA_NAME,
        x: x,
        y: y
      };
    });
    console.log(JSON.stringify(ans));
  })
};

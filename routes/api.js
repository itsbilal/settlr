var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model('User');
var Hood = mongoose.model('Hood');

var _ = require ("underscore");
var request = require("request");
var geoLib = require("geolib");
var promisify = require("../helpers/promisify");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Connected');
});

router.post('/registerUser', function(req, res) {
  var address = req.body.officeLocation;

  var options = {
      uri : "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text="+ address +"&f=json",
      method : 'GET',
  };
  
  promisify.f(request, options)
    .then(function(response,body){
     if (response.statusCode == 200) {
        var obj = JSON.parse(response.body);
        var lat = obj.locations[0].feature.geometry.y;
        var lon = obj.locations[0].feature.geometry.x;
        console.log(lat + " " + lon);
        
        var newUser = new User({
          age: req.body.age,
          minBudget: req.body.minBudget,
          maxBudget: req.body.maxBudget,
          officeLocation: {
            lat: lat,
            lon: lon
          },
          household: {
            children: req.body.household_children,
            adults: req.body.household_adults
          },
          transportation: req.body.transportation
        });

        return computeTopNeighbourhood(lat, lon, req, res);
        // newUser.save(function (err) {
        //   if (err) {
        //     res.send('Error');
        //   }
        // });
     } else {
      return null;
     }
  })
  .then(function(hoods){
    res.render("results", { results: JSON.stringify(hoods) });
  })
  .catch(function(err) {
    console.error(err);
    res.send('Error');
  });
});

function getFactors(body) {
  var f = {};

  switch (body.transportation) {
    case "car":
      f.walkscore = 0.50;
      break;
    case "transit":
      f.walkscore = 1.20;
      break;
    case "walk":
      f.walkscore = 1.50;
      break;
    case "bike":
      f.walkscore = 1.00;
    default:
      f.walkscore = 0.80;
  }

  f.crime = 1.00 + (parseInt(body.children)*0.10);
  f.pollutants = 0.85;
  f.density = (-1 * ((parseInt(body.adults) + parseInt(body.children)) - 2.5)) + (1 - 0.05*(Math.abs(27-body.age)));
  f.green_spaces = 0.85 + (0.15 * parseInt(body.children));

  // capping
  f = _.mapObject(f, (val) => {
    if (val < -1.5) {
      return -1.5;
    } else if (val > 1.5) {
      return 1.5;
    } else {
      return val;
    }
  });

  return f;
}

function computeTopNeighbourhood(workLat, workLon, req, res){
  return promisify.m(Hood, 'find').then(function(result){
    var hoods = [];
    var keys = _.pluck(result[0].scores, "category");
    var values = keys.map((category) => {
      return _.max(result.map((hood) => {
        return _.find(hood.scores, (score) => { return score.category === category }).value;
      }));
    });

    var maxMap = _.object(keys, values);

    for (var i = 0; i < result.length; i++){
      var hoodLat = result[i].centroid.x;
      var hoodLon = result[i].centroid.y;
      var hoodName = result[i].title;

      hoods[i] = {title: hoodName, 
                  geometry: result[i].geometry,
                  nid: result[i].nid,
                  scores: result[i].scores,
                  centroid: result[i].centroid,
                  dist: geoLib.getDistance({latitude: workLat, longitude: workLon},{latitude: hoodLat, longitude: hoodLon})
                };
    };

    var factors = getFactors(req.body);

    hoods = hoods.map((hood) => {
      hood.score = hood.scores.reduce((prev, curr) => {
        var value = curr.value / maxMap[curr.category];
        if (factors[curr.category] < 0) {
          value = (maxMap[curr.category] - curr.value) / maxMap[curr.category];
        }
        // console.log(curr.category);
        // console.log(value);
        // console.log(factors[curr.category]);
        // console.log(" ")
        return prev + (value * Math.abs(factors[curr.category]));
      }, 0);
      return hood;
    });

    hoods.sort(function(a,b){return a.dist > b.dist });

    // Make this only run for 5 hoods
    var promises = hoods.slice(0,20).map(function(hood){
      return Promise.all([Promise.resolve(hood), promisify.f(request, "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?token=nnGUflOKPrchILM9MlMcaVVIoXauPlcylUvZnNtcyibzfAAWGkrgaN2Om3dRJOGrrfJhUCPbRU-JCarVlswkSysRa21bqZttl7WICTAEJ4i1G_i6GxfWo5ZU9HTedSGqguniW2ebenCn8lMc3SFTIA..&stops="+
                          workLon+","+workLat+";"+hood.centroid.y+","+hood.centroid.x+"&f=pjson")]);
    });

    return Promise.all(promises)
  })
  .then(function(value) { 
    //console.log(value);

    var hoods = value.map(function(obj){
      var hood = obj[0];
      var time = JSON.parse(obj[1].body).directions[0].summary.totalTime;
      hood['timeToWork'] = time;
      return hood;
    })
    .sort(function(a,b){return a.timeToWork - b.timeToWork }).slice(0,15);

    return Promise.resolve(hoods);
  })
  .catch(function(reason) {
    console.error(reason);
  });
};

module.exports = router;

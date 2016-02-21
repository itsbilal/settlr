var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model('User');
var Hood = mongoose.model('Hood');

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
  request(options, function(error,response,body){
       if (!error && response.statusCode == 200) {
          var obj = JSON.parse(body);
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

          newUser.save(function (err) {
            if (err) {
              console.log('Error');
              res.send('Error');
            }

            var topHoods = computeTopNeighbourhood(lat, lon, res);

            
          });
       }   
  }).on('error', function(err) {
    console.log(err);
    res.send('Error');
  });   
});

function computeTopNeighbourhood(workLat, workLon, res){
  promisify.m(Hood, 'find').then(function(result){
    var hoods = [];
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

    hoods.sort(function(a,b){return a.dist > b.dist });

    // Make this only run for 5 hoods
    var promises = hoods.slice(0,20).map(function(hood){
      return Promise.all([Promise.resolve(hood), promisify.f(request, "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?token=nnGUflOKPrchILM9MlMcaVVIoXauPlcylUvZnNtcyibzfAAWGkrgaN2Om3dRJOGrrfJhUCPbRU-JCarVlswkSysRa21bqZttl7WICTAEJ4i1G_i6GxfWo5ZU9HTedSGqguniW2ebenCn8lMc3SFTIA..&stops="+
                          workLon+","+workLat+";"+hood.centroid.y+","+hood.centroid.x+"&f=pjson")]);
    });

    Promise.all(promises).then(function(value) { 
      console.log(value);

      var hoods = value.map(function(obj){
        var hood = obj[0];
        var time = JSON.parse(obj[1].body).directions[0].summary.totalTime;
        hood['timeToWork'] = time;
        return hood;
      }).sort(function(a,b){return a.timeToWork > b.timeToWork}).slice(0,15);

      res.send(JSON.stringify(hoods));
    }).catch(function(reason) {
      console.log(reason);
    });
  });
};

module.exports = router;

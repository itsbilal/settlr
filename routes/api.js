var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model('User');
var bodyParser = require('body-parser');
var request = require("request");

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

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
          console.log(body);
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
            res.send(JSON.stringify(newUser));
          });
       }   
  }).on('error', function(err) {
    console.log(err);
    res.send('Error');
  });   
});

module.exports = router;

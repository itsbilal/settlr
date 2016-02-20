var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model('User');
var bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Connected');
});

router.post('/registerUser', function(req, res) {
  var newUser = new User({
    age: req.body.age,
    minBudget: req.body.minBudget,
    maxBudget: req.body.maxBudget,
    officeLocation: {
      lat: req.body.officeLocation_lat,
      lon: req.body.officeLocation_lon
    },
    household: {
      children: req.body.household_children,
      adults: req.body.household_adults
    },
    transportation: {
      car: req.body.transportation_car,
      transit: req.body.transportation_transit,
      bike: req.body.transportation_bike
    }
  });

  newUser.save(function (err) {
  	if (err) {
  		console.log('Error');
  	}
  });

  res.send(JSON.stringify(newUser));
});

module.exports = router;

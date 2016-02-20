"use strict";

var mongoose = require("mongoose");

module.exports = function(){
  var user = {
    name: String,
    age: int,
    minBudget: int,
    maxBudget: int,
    officeLocation {
      lat: Number,
      lon: Number
    },
    household {
      children: int,
      adults: int
    },
    transportation {
      car: int,
      transit: int,
      bike: int
    }
  };

  // Register the model
  mongoose.model("User", user); 
};

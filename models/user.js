"use strict";

var mongoose = require("mongoose");

module.exports = function(){
  var user = {
    name: String,
    age: Number,
    minBudget: Number,
    maxBudget: Number,
    officeLocation: {
      lat: Number,
      lon: Number
    },
    household: {
      children: Number,
      adults: Number
    },
    transportation: {
      car: Number,
      transit: Number,
      bike: Number
    }
  };

  // Register the model
  mongoose.model("User", user); 
};

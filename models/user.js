"use strict";

var mongoose = require("mongoose");

module.exports = function(){
  var user = {
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
    transportation: String
  };

  // Register the model
  mongoose.model("User", user); 
};

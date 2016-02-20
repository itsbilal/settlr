"use strict";

var mongoose = require("mongoose");

module.exports = function(){
  var hood = {
    title: String,
    vertices: [
      {
        lat: Number,
        lon: Number
      }
    ],
    scores: [
      {
        category: String,
        value: Number,
      }
    ]
  };

  // Register the model
  mongoose.model("Hood", hood); 
};

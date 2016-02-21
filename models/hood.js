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
    ]
  };

  // Register the model
  mongoose.model("Hood", hood); 
};

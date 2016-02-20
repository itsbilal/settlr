"use strict";

var mongoose = require("mongoose");

module.exports = function(){
  var hood = {
    title: String,
    geometry: mongoose.Schema.Types.Mixed,
    nid: Number,
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

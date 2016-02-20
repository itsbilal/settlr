
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/settlr");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.once('open', function(){

  require("./models")();

  function get
});


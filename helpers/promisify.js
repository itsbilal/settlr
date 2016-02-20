"use strict";

module.exports = {
  m: function(thisObj, callable){ // For object methods
    var args = [];
    for (var i=0; i<arguments.length; i++) {
      args.push(arguments[i]);
    }

    var promise = new Promise(function(resolve, reject){
      args.push(function(err, result){
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      thisObj[callable].apply(thisObj, args.slice(2));
    });

    return promise;
  },

  f: function(callable){ // For functions
    var args = [];
    for (var i=0; i<arguments.length; i++) {
      args.push(arguments[i]);
    }

    var promise = new Promise(function(resolve, reject){
      args.push(function(err, result){
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      callable.apply(null, args.slice(1));
    });

    return promise;
  },
};

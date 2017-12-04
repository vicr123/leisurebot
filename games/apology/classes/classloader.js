structuredir.forEach(function(filename) {
    var data = require('./structures/'+filename);
    Object.keys(data).forEach(function(thing) {
      exports[thing] = data[thing]
    })
});

exports.Games = {}
exports.Players = {}
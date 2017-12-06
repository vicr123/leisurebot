var fs = require('fs');
var structuredir = fs.readdirSync('./games/apology/classes/structures/');

structuredir.forEach(function(filename) {
    var data = require('./structures/'+filename);
    Object.keys(data).forEach(function(thing) {
      exports[thing] = data[thing]
    })
});

exports.Games = {}
exports.Players = {}
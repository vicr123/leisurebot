var Go = require('../boarditems/go.js').Go;
var Property = require('../boarditems/property.js').Property;
var Station = require('../boarditems/station.js').Station;
var Utility = require('../boarditems/utility.js').Utility;
var Chance = require('../boarditems/chance.js').Chance;
var Chest = require('../boarditems/chest.js').Chest;
var Jail = require('../boarditems/jail.js').Jail;
var Parking = require('../boarditems/parking.js').Parking;
var Tax = require('../boarditems/tax.js').Tax;
var ToJail = require('../boarditems/tojail.js').ToJail;
class Board {
  constructor(boardid) {
    if (require("fs").existsSync('games/dm/'+boardid+'.json')) {
      var boardData = require('../../'+boardid+'.json');
      this.Chance = boardData.Chance
      this.Chest = boardData.Chest
      var fieldData = [];
      boardData.Fields.forEach(function(item) {
        if (item.Type == "Go") {
          var boardField = new Go(boardData.Misc.PassGoCash);
          fieldData[0] = boardField;
        } else if (item.Type == "Property") {
          var boardField = new Property(item.Name, item.Price, item.Color, item.HouseCost, item.Cost, item.CostSet, item.CostHouse, item.CostHouse2, item.CostHouse3, item.CostHouse4, item.CostHotel, item.MortgageCost, item.UnmortgageCost);
          fieldData[fieldData.length] = boardField
        } else if (item.Type == "Chest") {
          var boardField = new Chest(item.Name)
          fieldData[fieldData.length] = boardField
        } else if (item.Type == "Tax") {
          var boardField = new Tax(item.Name, item.Cost)
          fieldData[fieldData.length] = boardField
        } else if (item.Type == "Station") {
          var boardField = new Station(item.Name, item.Price)
          fieldData[fieldData.length] = boardField
        } else if (item.Type == "Chance") {
          var boardField = new Chance(item.Name)
          fieldData[fieldData.length] = boardField
        } else if (item.Type == "Jail") {
          var boardField = new Jail(item.Name)
          fieldData[fieldData.length] = boardField
        } else if (item.Type == "Utility") {
          var boardField = new Utility(item.Name, item.Price)
          fieldData[fieldData.length] = boardField
        } else if (item.Type == "Parking") {
          var boardField = new Parking(item.Name, boardData.Misc.FreeParkingReward)
          fieldData[fieldData.length] = boardField
        } else if (item.Type == "ToJail") {
          var boardField = new ToJail(item.Name);
          fieldData[fieldData.length] = boardField
        }
      })
      this.Fields = fieldData
    }
  }
  getInfo(fieldResolve) {
    var fields = this.Fields
    var returnValue = null;
    if (parseInt(fieldResolve)) {
      return fields[parseInt(fieldResolve)][info]
    } else {
      this.Fields.forEach(function(elem, index) {
        if (elem.name == fieldResolve) {
          returnValue = elem
        }
      })
    }
    return returnValue
  }
}

exports.Board = Board;

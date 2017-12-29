// ===============================================================================
// set up global variables
// ===============================================================================

var friendData = require("../data/friendData");
var express = require("express");
var serve = require('express-static');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json()
var app = express();
app.use(serve(__dirname + '/public'));
var minScore = [];


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" the api/friends page
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function (req, res) {
    res.json(friendData);
  });


  // API POST Request
  // Below code handles when a user submits a new friend and thus submits data to the server.
  // the data is loaded into the friendData JavaScript array
  // ---------------------------------------------------------------------------
  app.post("/api/friends", function (req, res) {
    var newFriendScores = req.body.scores.split(",");
    var newFriend = {
      "name": req.body.name,
      "photo": req.body.photo,
      "scores": newFriendScores
    }
    compareFriendsForCompatibility(newFriend);
    friendData.push(newFriend);
  });


  // compare the new friend with the friendData array to find the closest match
  // then post the closest match data back to the survey html page
  function compareFriendsForCompatibility(newFriend) {
    var difference = [];
    minScore.name = friendData[0].name;
    minScore.photo = friendData[0].photo;
    minScore.total = 9999;
    for (let i = 0; i < friendData.length; i++) {
      difference.name = friendData[i].name;
      difference.photo = friendData[i].photo;
      difference.total = 0;
      for (let j = 0; j < friendData[i].scores.length; j++) {
        difference.total += (Math.abs(parseInt(friendData[i].scores[j]) -
          parseInt(newFriend.scores[j])));
      }
      if (difference.total < minScore.total) {
        minScore.name = difference.name;
        minScore.photo = difference.photo;
        minScore.total = difference.total;
      }
    }
    // when the differences are calculated and the closest match has been found,
    // send the closest match results back to the survey page
    app.post("/survey", function (req, res) {
      res.json({
        name: minScore.name,
        photo: minScore.photo
      });
    });
  }

};
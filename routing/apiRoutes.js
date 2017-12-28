// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friendData = require("../data/friendData");
var express = require("express");
var serve   = require('express-static');
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
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function (req, res) {
    res.json(friendData);
  });


  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/friends", function (req, res) {
    //   // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    //   // It will do this by sending out the value "true" have a table
    //   // req.body is available since we're using the body-parser middleware
    console.log(req.body);
    var newFriendScores = req.body.scores.split(",");
    console.log(newFriendScores);
    var newFriend = {
      "name": req.body.name,
      "photo": req.body.photo,
      "scores": newFriendScores
    }
    console.log("newFriend: " + JSON.stringify(newFriend));
    compareFriendsForCompatibility(newFriend);
    friendData.push(newFriend);

  });
 

  function compareFriendsForCompatibility(newFriend) {
    var difference = [];
   
    minScore.name = friendData[0].name;
    minScore.photo = friendData[0].photo;
    minScore.total = 9999;
    console.log("minScore1: " + minScore.name + " " + minScore.total);

    console.log("difference: " + difference.toString());
    for (let i = 0; i < friendData.length; i++) {
      console.log("minScore2: " + minScore.name + " " + minScore.total);
      difference.name = friendData[i].name;
      difference.photo = friendData[i].photo;
      difference.q1 = Math.abs(parseInt(friendData[i].scores[0]) - parseInt(newFriend.scores[0]));
      difference.q2 = Math.abs(parseInt(friendData[i].scores[1]) - parseInt(newFriend.scores[1]));
      difference.q3 = Math.abs(parseInt(friendData[i].scores[2]) - parseInt(newFriend.scores[2]));
      difference.q4 = Math.abs(parseInt(friendData[i].scores[3]) - parseInt(newFriend.scores[3]));
      difference.q5 = Math.abs(parseInt(friendData[i].scores[4]) - parseInt(newFriend.scores[4]));
      difference.q6 = Math.abs(parseInt(friendData[i].scores[5]) - parseInt(newFriend.scores[5]));
      difference.q7 = Math.abs(parseInt(friendData[i].scores[6]) - parseInt(newFriend.scores[6]));
      difference.q8 = Math.abs(parseInt(friendData[i].scores[7]) - parseInt(newFriend.scores[7]));
      difference.q9 = Math.abs(parseInt(friendData[i].scores[8]) - parseInt(newFriend.scores[8]));
      difference.q10 = Math.abs(parseInt(friendData[i].scores[9]) - parseInt(newFriend.scores[9]));
      difference.total = difference.q1 +
        difference.q2 +
        difference.q3 +
        difference.q4 +
        difference.q5 +
        difference.q6 +
        difference.q7 +
        difference.q8 +
        difference.q9 +
        difference.q10;
      if (difference.total < minScore.total) {
        minScore.name = difference.name;
        minScore.photo = difference.photo;
        minScore.total = difference.total;
        console.log("minScoreXX: " + minScore.name + " " + minScore.total);
      }
      console.log("minScoreXXX: " + minScore.name + " " + minScore.total);
      console.log("difference: " + difference.name + " " + difference.total);

      if (i === (friendData.length - 1)) {
        console.log("the winner is: " + minScore.name + " " + minScore.total);
        // displayWinner(minScore);
       
        app.post("/survey", function (req, res) {
          console.log("im about to post to /survey");
          console.log("posting: " + minScore.name + " " + minScore.photo);
          res.json({
            name: minScore.name,
            photo: minScore.photo
          });
          console.log("post posting: " + minScore.name + " " + minScore.photo);
         
          console.log("i did it!");
        });
      }
    }
  }

  // function displayWinner(minScore) {
  //   app.post("/survey", function (req, res) {
  //     console.log("im about to post to /survey");
  //     console.log(minScore);
  //     res.json({
  //       name: minScore.name,
  //       photo: minScore.photo
  //     });
  //   });
  // }

  // ---------------------------------------------------------------------------
  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!

  // app.post("/api/clear", function() {
  //   // Empty out the arrays of data
  //   friendData = [];
  //   console.log(friendData);
  // });
};
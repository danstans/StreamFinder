"use strict";

const moment = require('moment-timezone'),
{MinToMilli, GetSubreddit} = require('./utils/helper'),
{streamFinder} = require('./utils/snoowrap'),
{LeaguesRef, CommentIDRef, DailyGamesRef, GameIDRef} = require('./utils/firebase'),
{RetrieveGameTimes} = require('./api/gametime'),
{RetrieveComments} = require('./api/comments'),
{SendPrivateMessage} = require('./api/privatemessage');

const SUBREDDITS = ['nbastreams'];

async function GetGameIDs() {
  var IDList = [];
  GameIDRef.once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        IDList.push(childSnapshot.val());
      });
    });
  return await (IDList);
};

async function GetCommentIDs() {
  var IDList = [];
  CommentIDRef.once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        IDList.push(childSnapshot.val());
      });
    });
  return await (IDList);
};

async function GetGameTimes(subreddit) {
  var validGames = []
  DailyGamesRef.child(subreddit).once("value")
    .then((snapshot) => {
      snapshot.forEach(postIDSnapshot => {
        var gameTime = postIDSnapshot.child('gametime').val();
        var gameEasternMoment = moment.tz(gameTime, "MM-DD-YYYY HH:mm", 'America/New_York');
        var gameLocalMoment = gameEasternMoment.clone().tz("America/Los_Angeles");
        var diff = moment().diff(gameLocalMoment);
        if (diff > 0) validGames.push(postIDSnapshot.key);
      })
    });
  return await (validGames);
}

if (require.main === module) {
  // Check if there are new Game Threads, if there is; parse the post information and store the post ID.
  setInterval(() => {
    console.log("RETREIEVING GAME TIMES");
    SUBREDDITS.forEach((subreddit, index, array) => {
      var games = GetGameIDs();
      RetrieveGameTimes(subreddit, games);
    })
  }, MinToMilli(.1));
  // Call frequently maybe every 10 minutes
  setInterval(() => {
    console.log("RETREIEVING COMMENTS");
    SUBREDDITS.forEach((subreddit, index, array) => {
      var comments = GetCommentIDs();
      RetrieveComments(subreddit, comments);
    });
  }, MinToMilli(.1));
  //console.log("Checking every 5 minutes to see if game time has passed, if so, mail out the link to everyone");
  setInterval(() => {
    console.log("SENDING MESSAGES");
    // TODO RETREIVE AND SEND THE COMMENT
    SUBREDDITS.forEach(subreddit => {
      var checkGames = GetGameTimes(subreddit);
      SendPrivateMessage(subreddit, checkGames);
    });
  }, MinToMilli(.10));
}

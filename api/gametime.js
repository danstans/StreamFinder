const {
    streamFinder
} = require('../utils/snoowrap');
const {
    LeaguesRef,
    CommentIDRef,
    DailyGamesRef,
    GameIDRef
} = require('../utils/firebase');
const moment = require('moment');

var ParsePostTitle = (
    (title, subreddit) => {
        var currentDate = moment().format("MM-DD-YYYY");
        if (subreddit == "nbastreams") {
            var indexColon = title.indexOf(':'),
                indexAt = title.indexOf('@'),
                indexLeftParen = title.indexOf('('),
                indexET = title.indexOf('ET'),
                gameTime = currentDate + " " + title.substring(indexLeftParen + 1, indexET - 1),
                teamA = title.substring(indexColon + 2, indexAt - 1).toLowerCase(),
                teamB = title.substring(indexAt + 2, indexLeftParen - 1).toLowerCase();
                console.log(`teamA is ${teamA}, teamB is ${teamB}`);
        } else if (subreddit == "nhlstreams" || subreddit == "mlbstreams") {
            var indexColon = title.indexOf(':'),
                indexAt = title.indexOf('at '),
                indexPM = title.indexOf('PM'),
                gameTime = currentDate + " " +
                title.substring(indexPM - 6, indexPM + 2);
                teamA = title.substring(indexColon + 2, indexAt - 1).toLowerCase(),
                teamB = title.substring(indexAt + 3, indexPM - 6).toLowerCase();
        }
        if (gameTime[0] == " ") {
            gameTime = gameTime.substring(1);
        }
        return {
            'GameTime': gameTime,
            'Teams': [teamA, teamB]
        }
    }
);

async function SetDailyGames(snapshot, post, subreddit) {
    var containsGameAlready = false;
    await snapshot.forEach(childSnapshot => {
        console.log(`childSnapshot.key is ${childSnapshot.key}`);
        if (childSnapshot.key == post.id) {
            containsGameAlready = true;
        }
    });

    if (!containsGameAlready) {
      var parsedPost = ParsePostTitle(post.title, subreddit);
      DailyGamesRef.child(subreddit).child(post.id).set({
        "gametime": parsedPost.GameTime,
        "teams": [parsedPost.Teams[0], parsedPost.Teams[1]]
      });
    }
};

module.exports.RetrieveGameTimes = (
    (subreddit, gameIDs) => {
        streamFinder
            .getSubreddit(subreddit)
            .getHot()
            .then((posts) => {
                gameIDs.then(gameIds => {
                    for (let post of posts) {
                        if ((gameIds.indexOf(post.id) == -1) && (post.title.toLowerCase().includes("game thread"))) {
                            DailyGamesRef.child(subreddit).once("value").then(snapshot => {
                                SetDailyGames(snapshot, post, subreddit);
                            });
                            GameIDRef.push(post.id);
                        }
                    }
                });
            });
    });

const {
    streamFinder
} = require('../utils/snoowrap');
const {
    LeaguesRef,
    CommentIDRef,
    DailyGamesRef,
    GameIDRef
} = require('../utils/firebase');

var ParsePostTitle = (
    (title, subreddit) => {
        var currentDate = moment().format("MM-DD-YYYY");
        if (subreddit == "nbastreams") {
            var indexColon = title.indexOf(':'),
                indexAt = title.indexOf('vs'),
                indexLeftParen = title.indexOf('('),
                indexET = title.indexOf('ET'),
                gameTime = currentDate + " " + title.substring(indexLeftParen + 1, indexET - 1),
                teamA = title.substring(indexColon + 2, indexAt - 1).toLowerCase(),
                teamB = title.substring(indexAt + 3, indexLeftParen - 1).toLowerCase();
        } else if (subreddit == "nhlstreams") {
            var indexColon = title.indexOf(':'),
                indexAt = title.indexOf('at '),
                indexPM = title.indexOf('PM'),
                gameTime = currentDate + " " +
                title.substring(indexPM - 6, indexPM + 2);
            teamA = title.substring(indexColon + 2, indexAt - 1).toLowerCase(),
                teamB = title.substring(indexAt + 3, indexPM - 6).toLowerCase();
        } else if (subreddit == "mlbstreams") {
            console.log("parse mlbstreams");
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

var SetDailyGames = ((snapshot, post) => {
    var containsGameAlready = false;
    snapshot.forEach(childSnapshot => {
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
});

module.exports.RetrieveGameTimes = (
    (subreddit, gameIDs) => {
        streamFinder
            .getSubreddit(subreddit)
            .getHot()
            .then((posts) => {
                gameIDs.then(gameIds => {
                    for (let post of posts) {
                        if ((gameIds.indexOf(post.id) == -1) && (post.title.toLowerCase().includes("game thread")) && (post.author.name.toLowerCase() == "nbastreamsbotv2")) {
                            DailyGamesRef.child(subreddit).once("value").then(snapshot => {
                                SetDailyGames(snapshot, post);
                            });
                            GameIDRef.push(post.id);
                        }
                    }
                });
            });
    });

const {streamFinder} = require('../utils/snoowrap');
const {LeaguesRef, CommentIDRef, DailyGamesRef, GameIDRef} = require('../utils/firebase');



module.exports.SendPrivateMessage = ((subreddit, postIDs) => {
  DailyGamesRef.child(subreddit).once("value")
    .then((snapshot) => {
      postIDs.then((postIDs) => {
        postIDs.forEach(postID => {
          var pass = 0;
          var teams, users = [];
          snapshot.child(postID).child('teams').val().forEach(team => {
            teams.push(team);
          });
          teams.forEach(teamName => {
            LeaguesRef.child(subreddit).child(teamName).child('usernames').once("value")
              .then((usernames) => {
                usernames.forEach(username => {
                  if (!users.includes(username.val())) users.push(username.val());
                });
                if (pass++ % 2) {
                  streamFinder.getSubmission(postID).expandReplies({
                    limit: Infinity,
                    depth: Infinity
                  }).comments.then((val) => {
                    var highestVotes = 0;
                    var highestText = "";
                    val.forEach(comment => {
                      if (comment.score > highestVotes) {
                        highestVotes = comment.score;
                        highestText = comment.body
                      }
                    });
                    users.forEach(user => {
                      streamFinder.composeMessage({
                        to: user,
                        subject: subreddit + '\'s stream for ' + teamName,
                        text: highestText
                      });
                    });
                  });
                }
                DailyGamesRef.child(subreddit).child(postID).remove();
              });
          });
        });
      });
    });
});

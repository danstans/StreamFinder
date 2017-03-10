const {streamFinder} = require('../utils/snoowrap');
const {LeaguesRef, CommentIDRef, DailyGamesRef, GameIDRef} = require('../utils/firebase');
const {GetSubreddit} = require('../utils/helper')

const NBATEAMS = ['atlanta hawks', 'boston celtics', 'brooklyn nets', 'charlotte hornets', 'chicago bulls', 'cleveland cavaliers', 'dallas mavericks',
  'denver nuggets', 'detroit pistons', 'golden state warriors', 'houston rockets', 'indiana pacers', 'la clippers', 'los angeles lakers',
  'memphis grizzlies', 'miami heat', 'milwaukee bucks', 'minnesota timberwolves', 'new orleans pelicans', 'new york knicks', 'oklahoma city thunder',
  'orlando magic', 'philadelphia 76ers', 'phoenix suns', 'portland trail blazers', 'sacramento kings', 'san antonio spurs', 'toronto raptors', 'utah jazz', 'washington wizards'
]

var ParseComment = (
  (comment) => {
    var teams = [],
      errorTeams = [];
    comment.body.toLowerCase().split(' ').forEach((commentArg) => {
      if (commentArg !== '/u/streamfinder') {
        var termPushed = false;
        NBATEAMS.forEach((team) => {
          if (team.includes(commentArg)) {
            teams.push(team);
            termPushed = true;
          }
        });
        if (!termPushed) errorTeams.push(commentArg);
      }
    });
    return {
      'commentID': comment.id,
      'CommentAuthor': comment.author.name,
      'Teams': teams,
      'ErrorTeams': errorTeams
    }
  });


module.exports.RetrieveComments = ((subreddit, commentIDs) => {
  streamFinder
    .getNewComments(subreddit)
    .then((comments) => {
      commentIDs.then((ids) => {
        for (let comment of comments) {
          var parsedComment = ParseComment(comment);
          if (comment.body.toLowerCase().includes('/u/streamfinder') && (ids.indexOf(parsedComment.commentID) == -1)) {
            CommentIDRef.push(parsedComment.commentID);
            parsedComment.Teams.forEach((teamName) => {
              LeaguesRef.child(GetSubreddit(teamName)).child(teamName).child('usernames').push(parsedComment.CommentAuthor);
            });
          }
        }
      })
    })
});

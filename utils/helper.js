const NBATEAMS = ['atlanta hawks', 'boston celtics', 'brooklyn nets', 'charlotte hornets', 'chicago bulls', 'cleveland cavaliers', 'dallas mavericks',
  'denver nuggets', 'detroit pistons', 'golden state warriors', 'houston rockets', 'indiana pacers', 'la clippers', 'los angeles lakers',
  'memphis grizzlies', 'miami heat', 'milwaukee bucks', 'minnesota timberwolves', 'new orleans pelicans', 'new york knicks', 'oklahoma city thunder',
  'orlando magic', 'philadelphia 76ers', 'phoenix suns', 'portland trail blazers', 'sacramento kings', 'san antonio spurs', 'toronto raptors', 'utah jazz', 'washington wizards'
]

// const NHLTEAMS = ['adsf'];
// cons MLBTEAMS = ['adf'];


module.exports.MinToMilli = (
  (minutes) => {
    return minutes * 60000
  });


module.exports.GetSubreddit = (
  (teamName) => {
    if (NBATEAMS.includes(teamName)) {
      return 'nbastreams'
    } else if (NHLTEAMS.includes(teamName)) {
      return 'nhlstreams'
    }
  });

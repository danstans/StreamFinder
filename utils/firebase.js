const firebase = require('firebase');
const FIREBASECONF = {
  apiKey: "AIzaSyD5VOW9aK6Uv_zGIlhuAJtt1lyBebDYvSQ",
  authDomain: "streamfinder-36c66.firebaseapp.com",
  databaseURL: "https://streamfinder-36c66.firebaseio.com",
  storageBucket: "streamfinder-36c66.appspot.com",
};

firebase.initializeApp(FIREBASECONF);

const database = firebase.database();
module.exports.LeaguesRef = database.ref('/Leagues')
module.exports.CommentIDRef = database.ref('/CommentIDs/');
module.exports.DailyGamesRef = database.ref('/DailyGames/');
module.exports.GameIDRef = database.ref('/GameIDs/');

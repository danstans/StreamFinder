var snoowrap = require('snoowrap');
const config = require('./config');

module.exports.streamFinder = new snoowrap({
  userAgent: config.userAgent,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  username: config.username,
  password: config.password
});

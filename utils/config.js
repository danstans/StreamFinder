"use strict"

var config = {}

config.userAgent = process.env.USER_AGENT
config.clientId = process.env.CLIENTID
config.clientSecret = process.env.CLIENT_SECRET
config.username = process.env.USERNAME
config.password = process.env.PASSWORD

module.exports = config;

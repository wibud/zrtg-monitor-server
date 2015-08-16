var mongo = require('mongoskin');
var config = require('../config');
var helper = require('./helper');

var log = helper.getLogger('db');

try {

	var db = mongo.db('mongodb://'
		+ config.db.host
		+ ':'
		+ config.db.port
		+ config.db.dbName
		+ '?auto_reconnect=true&poolSize=3', {native_parser: true});

	log.debug('success connect to mongodb');

} catch(err) {
	log.error(err);
}


module.exports = db;

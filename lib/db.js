var mongo = require('mongoskin');
var config = require('../config');
var helper = require('./helper');

var log = helper.getLogger('db');

/**
 * 连接并有可能初始化数据库
 */
function init(db, callback) {

	db.bind('users');

	db.users.find({}).toArray(function(err, data) {

		log.info('数据库连接成功');

		if (data && data.length > 0) {
			log.debug('数据库已经初始化');
			return callback(null, db);
		}

		log.debug('初始化数据库');

		db.users.insert({
			name: config.adminName,
			password: config.adminPwd,
			role: 'admin'
		}, function(err) {

			if (err) {
				err.message = '数据库初始化失败：' + err.message;
				callback(err);
			} else {
				log.debug('数据库初始化完成');
				callback(null, db);
			}

		});

	});

}

exports.connect = function(callback) {

	if (helper.db) {
		callback(null, helper.db);
	}

	log.info('连接数据库', config.db.dbName);

	var db = mongo.db('mongodb://'
		+ config.db.host
		+ ':'
		+ config.db.port + '/'
		+ config.db.dbName
		+ '?auto_reconnect=true&poolSize=3', {native_parser: true});

	init(db, callback);

};

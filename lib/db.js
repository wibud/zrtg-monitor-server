var mongo = require('mongoskin');
var Promise = require('bluebird');
var config = require('../config');
var helper = require('./helper');

var log = helper.getLogger('db');

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

  init(db)
    .then(function() {
      callback(null, db);
    })
    .catch(function(err) {
      callback(err);
    });

};


/**
 * 初始化资源表
 */
function init(db, callback) {

  WrapperDbMethodByPromise(db);

  return db
    .find('users', {})
    .then(function(data) {

      log.info('数据库连接成功');

      if (data && data.length > 0) {

        log.debug('users 已经初始化');
        return;

      } else {

        log.debug('初始化 users');
        return db.insert('users', {
                  name: config.adminName,
                  password: config.adminPwd,
                  role: 'admin'
                });
      }

    });
}

function WrapperDbMethodByPromise(db) {

  db.find = function(dbName, query) {

    if (query._id) {
      query._id = helper.toObjectID(query._id);
    }

    return new Promise(function(resolve, reject) {

      db.collection(dbName).find(query).toArray(function(err, data) {
        return err ? reject(err) : resolve(data);
      });

    });

  };

   db.insert = function(dbName, rowData) {

    return new Promise(function(resolve, reject) {

      db.collection(dbName).insert(rowData, function(err, data) {
        return err ? reject(err) : resolve(data);
      });

    });

  };


  db.update = function(dbName, query, newData) {

    if (query._id) {
      query._id = helper.toObjectID(query._id);
    }

    return new Promise(function(resolve, reject) {

      db.collection(dbName).update(query, newData, function(err) {
        return err ? reject(err) : resolve();
      });

    });
  };

  db.remove = function(dbName, query) {

    if (query._id) {
      query._id = helper.toObjectID(query._id);
    }

    return new Promise(function(resolve, reject) {

      db.collection(dbName).remove(query, function(err) {
        err ? reject(err): resolve();
      });
    });

  };

}

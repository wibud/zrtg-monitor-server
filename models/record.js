'use strict';

var Promise = require('bluebird');

var helper = require('../lib/helper');
var _ = helper._;
var log = helper.getLogger('Record');
var db = helper.db;

var dbName = 'records';

exports.create = function(data) {

  return db.insert(dbName, JSON.parse(data));
}

exports.update = function(data) {

  var id = data.id;

  delete data.id;

  return db.update(dbName, {_id: helper.toObjectID(id)}, {$set: data});
}

exports.list = function(param, cPage, pageSize) {

  var cPage = Number(cPage) || 1;
  var pageSize = Number(pageSize) || 12;

  return new Promise(function(resolve, reject) {

    db.collection('records')
      .find(param)
      .skip((cPage - 1) * pageSize)
      .limit(pageSize)
      .sort({date: -1, time: -1})
      .toArray(function(err, data) {

        if(err) reject(err);

        resolve(data);
      });
  }).then(function(list) {

    return new Promise(function(resolve, reject) {

      db.collection('records').count(param, function(err, count) {

        if(err) reject(err);

        resolve({

          totalPage: count % pageSize == 0 ? parseInt(count / pageSize) : parseInt(count / pageSize) + 1,
          totalCount: count,
          list: list
        });
      })
    });
  });
};

exports.listAll = function(param) {

  return new Promise(function(resolve, reject) {

    db.collection('records')
      .find(param)
      .sort({date: -1, time: -1})
      .toArray(function(err, data) {

        if(err) reject(err);

        resolve(data);
      });
  });
};

exports.count = function(param) {

  return new Promise(function(resolve, reject) {

    db.collection('records').count(param, function(err, count) {

      if(err) reject(err);

      resolve(count);
    })
  });
}

exports.countGroupByDate = function(param) {

  return new Promise(function(resolve, reject) {

    db.collection('records').group(['date'],  param, {"count":0}, "function (obj, prev) { prev.count++; }", true, function(err, result) {

      if(err) reject(err);

      resolve(result);
    });
  });
}

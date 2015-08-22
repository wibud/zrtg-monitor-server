/**
 * 资源管理
 *
 * model 格式：
 * [{
 *   // 错误
 *   type: 'error',
 *   list: []
 * }, {
 *   // 频道
 *   type: 'channel'
 *   list: []
 * }, {
 *   // 科组
 *   type: 'group',
 *   list: []
 * }, {
 *   // 节目类型
 *   type: 'program',
 *   list: []
 * }]
 *
 */
'use strict';

var Promise = require('bluebird');

var helper = require('../lib/helper');
var _ = helper._;
var log = helper.getLogger('Resource');
var db = helper.db;

var dbName = 'resources';


/**
 * 获取所有的资源信息
 */
exports.find = function(query) {
  return db.find(dbName, query);
};

/**
 * 为某个类型的增加数据
 *
 * @param  {String} type
 * @param  {String} name
 * @return {Promise}
 */
exports.new = function(type, name) {

  var legalTypes = ['error', 'channel', 'program', 'group'];

  if (legalTypes.indexOf(type) === -1) {
    throw new Error('不合法的资源类型，目前可接受的类型有：' + legalTypes.join());
  }

  log.debug('新增 resource, type: %s, name: %s', type, name);

  return this
    .find({type: type})
    .then(function(result) {

      if (result.length === 0) {

        // 类型数据为空
        return db.insert(dbName, {type: type,list: [{name: name}]});

      } else {

        var list = result[0].list;

        log.debug(JSON.stringify(list), name)

        var index = _.findIndex(list, function(item) {
          return item.name === name;
        });

        if (index !== -1) {
          throw new Error(type + '类型下已存在名称为' + name);
        }

        list.push({name: name});

        return db.update(dbName, {type: type}, {$set: {
          list: list
        }});

      }

    });

};


/**
 * 删除某个类型的一个标签
 *
 * @param  {[type]} type [description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
exports.remove = function(type, name) {


  return db
    .find(dbName, {type, type})
    .then(function(result) {

      if (result.length === 0) {
        throw new Error('该条数据不存在');
      }

      var list = result[0].list;

      _.remove(list, function(item) {
        return item.name === name;
      });

      return db.update(dbName, {type: type}, {$set: {list: list}});

    });

}

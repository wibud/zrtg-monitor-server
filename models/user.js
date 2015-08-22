/**
 * 账户管理
 *
 * model:
 * [
 *   // 管理员
 *   {role: 'admin', name: 'xxx', password: 'xxx'},
 *   // 值班长
 *   {role: 'monitors', name: 'xxx', password: 'xxx'},
 *   // 值班员
 *   {role: 'watchers', name: 'xxx', password: 'xxx'},
 *   // 技术人员
 *   {role: 'tecs', name: 'xxx', password: 'xxx'},
 * ]
 */
'use strict';

var Promise = require('bluebird');

var helper = require('../lib/helper');
var _ = helper._;
var log = helper.getLogger('Account');
var db = helper.db;

var dbName = 'users';

/**
 * 获取所有的账户数据
 */
exports.find = function(query) {
  return db.find(dbName, query);
};


/**
 * 新增用户
 */
exports.new = function(user) {

	var self = this;

	user.name = _.isString(user.name) ? user.name.trim() : user.name;
	user.password = _.isString(user.password) ? user.password.trim() : user.password;

	if (!user || !user.name || user.name === '' || !user.password || user.password === '') {
		throw new Error('参数不全：name, password, role');
	}

  return self
            .isExist(user.name)
            .then(function(isExist) {

              if (isExist) {
                resolve(new Error('用户名已存在'));
              }

              return db.insert(dbName, user);
            });

};


/**
 * 编辑用户的账户名或密码
 */
exports.edit = function(name, newName, newPwd, newRole) {

	var self = this;
	var newData = {};

	newName = _.isString(newName) ? newName.trim() : newName;
	newPwd = _.isString(newPwd) ? newPwd.trim() : newPwd;
  newRole = _.isString(newRole) ? newRole.trim() : newRole;

	var promise = new Promise(function(resolve, reject) {
		resolve(1);
	});

	if ((!newName || newName === '') && (!newPwd || newPwd === '') && (!newRole || newRole === '')) {

		promise.then(function() {
			throw new Error('参数不全：用户名/密码/职位');
		});

	}

	var newData = {};

	if (newName && newName.length > 0) {
		newData.name = newName;
	}

	if (newPwd && newPwd.length > 0) {
		newData.password = newPwd;
	}

  if (newRole && newRole.length > 0) {
    newData.newRole = newRole;
  }


	promise
		.then(function(datas) {
			return newName ? self.isExist(newData.name) : false;
		})
		.then(function(isExist) {

			if (isExist) {
				throw new Error('该用户名已存在');
			}

			return db.update(dbName, {name: name}, {$set: newData});

		});

};


/**
 * 删除用户
 */
exports.remove = function(query) {
  return db.remove(dbName, query);
};


exports.isExist = function(name) {

	this
		.find({})
		.then(function(users) {

			var index = _.findIndex(users, {name: name});

			return index !== -1;

		});

};

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

  log.debug('新增用户：', user);

	user.name = _.isString(user.name) ? user.name.trim() : user.name;
	user.password = _.isString(user.password) ? user.password.trim() : user.password;
  user.dept = _.isString(user.dept) ? user.dept.trim() : '';

	if (!user || !user.name || user.name === '' || !user.password || user.password === '') {
		throw new Error('参数不全：name, password, role');
	}

  return self
            .isExist(user.name)
            .then(function(isExist) {

              if (isExist) {
                throw new Error('用户名已存在');
              }

              return db.insert(dbName, user);
            });

};


/**
 * 编辑用户的账户名或密码
 */
exports.edit = function(data) {

	var self = this;
	var newData = {};
  var name = data.name;
  var newName = data.newName;
  var newPwd = data.newPwd;
  var newRole = data.newRole;
  var newDept = data.newDept;

	newName = _.isString(newName) ? newName.trim() : newName;
	newPwd = _.isString(newPwd) ? newPwd.trim() : newPwd;
  newRole = _.isString(newRole) ? newRole.trim() : newRole;
  newDept = _.isString(newDept) ? newDept.trim() : '';

	var promise = new Promise(function(resolve, reject) {
		resolve(1);
	});

	if ((!newName || newName === '') && (!newPwd || newPwd === '') && (!newRole || newRole === '')) {

		promise.then(function() {
			throw new Error('参数不全：用户名/密码/身份');
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
    newData.role = newRole;
  }

  if(newDept && newDept.length > 0) {
    newData.dept = newDept;
  }


	return promise
		.then(function(datas) {
			return newName && name !== newName ? self.isExist(newData.name) : false;
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

	return this
      		.find({})
      		.then(function(users) {

      			var index = _.findIndex(users, {name: name});

      			return index !== -1;

      		});

};

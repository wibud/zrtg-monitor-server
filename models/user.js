/**
 * 账户管理
 */
'use strict';

var Promise = require('bluebird');

var helper = require('../lib/helper');
var _ = helper._;
var log = helper.getLogger('Account');
var db = helper.db;

db.bind('users');

/**
 * 获取所有的账户数据
 */
exports.find = function(query) {

	var self = this;

	if (query._id) {
		query._id = helper.toObjectID(query._id);
	}

	return new Promise(function(resolve, reject) {

		db.users.find(query).toArray(function(err, data) {
			return err ? reject(err) : resolve(data);
		});

	});

};


/**
 * 更新
 */
exports.update = function(query, newData) {

	if (query._id) {
		query._id = helper.toObjectID(query._id);
	}

	return new Promise(function(resolve, reject) {

		db.users.update(query, newData, function(err) {
			return err ? reject(err) : resolve(data);
		});

	});

};


/**
 * 新增用户
 */
exports.new = function(user) {

	var self = this;

	return new Promise(function(resolve, reject) {

		user.name = _.isString(user.name) ? user.name.trim() : user.name;
		user.password = _.isString(user.password) ? user.password.trim() : user.password;

		if (!user || !user.name || user.name === '' || !user.password || user.password === '') {
			return reject(new Error('参数不全：name, password, role'));
		}

		self
			.isExist(user.name)
			.then(function(isExist) {

				if (isExist) {
					resolve(new Error('用户名已存在'));
				}

				db.users.insert(user, function(err) {
					err? reject(err): resolve();
				});
			});

	});

};


/**
 * 编辑用户的账户名或密码
 */
exports.edit = function(name, newName, newPwd) {

	var self = this;
	var newData = {};

	newName = _.isString(newName) ? newName.trim() : newName;
	newPwd = _.isString(newPwd) ? newPwd.trim() : newPwd;

	var promise = new Promise(function(resolve, reject) {
		resolve(1);
	});

	if ((!newName || newName === '') && (!newPwd || newPwd === '')) {

		promise.then(function() {
			throw new Error('参数不全：用户名/密码');
		});

	}

	var newData = {};

	if (newData) {
		newData.name = newName;
	}

	if (newPwd) {
		newData.password = newPwd;
	}

	promise
		.then(function(datas) {
			return newName ? self.isExist(newData.name) : false;
		})
		.then(function(isExist) {

			if (isExist) {
				throw new Error('该用户名已存在');
			}

			return self.update({name: name}, {$set: newData});

		});

};


/**
 * 删除用户
 */
exports.remove = function(query) {

	if (query._id) {
		query._id = helper.toObjectID(query._id);
	}

	db.users.remove(query, function(err) {
		err ? reject(err): resolve();
	});

};


exports.isExist = function(name) {

	this
		.find({})
		.then(function(users) {

			var index = _.findIndex(users, {name: name});

			return index !== -1;

		});

};
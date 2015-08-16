/**
 * 账户管理
 */
'use strict';

var Promise = require('bluebird');

var db = require('../lib/db');
var helper = require('../lib/helper');
var log = helper.getLogger('Account');

db.bind('account');

/**
 * 获取所有的账户数据
 */
exports.getAll = function() {

	return new Promise(function(resolve, reject) {

		db.account.find({}).toArray(function(err, data) {
			err ? reject(err) : resolve(data);
		});

	});

};
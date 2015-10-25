/**
 * 记录管理
 */

'use strict';

var record = require('../models/record');
var helper = require('../lib/helper');
var log = helper.getLogger('record');
var Resource = require('../models/resource');
var _ = helper._;
var User = require('../models/user');


/**
 * 展示记录
 */
exports.show = function* () {

	try {

		yield this.render('record_show', {
			page: 'record_show'
		});

	} catch(err) {
		yield helper.handleError(this, err);
	};

};

/**
 * 新增记录
 */
exports.new = function* () {

	try {

		// 获取用户，按科组分组
    var users = yield User.find({});

		// 获取所有资源
		var resource = yield Resource.find({});
    var result = {
      channels: [],
      errors: [],
      programs: [],
      groups: [],
      users: {}
    };

    resource.forEach(function(item) {
      result[item.type + 's'] = item.list;
    });

    result.groups.forEach(function(item) {

    	result.users[item.name] = _.filter(users, {dept: item.name});
    });

		yield this.render('record_new', _.assign({
			page: 'record_new',
			stringify: JSON.stringify
		}, result));

	} catch(err) {
		yield helper.handleError(this, err);
	};


};

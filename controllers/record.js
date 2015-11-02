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

    // 获取用户，按科组分组
    var users = yield User.find({});

    // 获取所有资源
    var resource = yield Resource.find({});
    var result = {
      channels: [],
      errors: [],
      programs: [],
      groups: [],
      users: {
        '无': users
      },
      usersByRole: {}
    };

    resource.forEach(function(item) {
      result[item.type + 's'] = item.list;
    });

    result.errors.forEach(function(item) {

      item.children.forEach(function(_item) {

        _item.children.unshift({name: '无'});
      });

      item.children.unshift({name: '无', children: [{name: '无'}]});
    });

    result.errors.unshift({name: '无', children: [{name: '无', children: [{name: '无'}]}]});

    result.groups.forEach(function(item) {

      result.users[item.name] = _.filter(users, {dept: item.name});
    });

    _.each(result.users, function(item, index) {

      item.unshift({name: '无'});
    });

    result.usersByRole = {

      admins: _.filter(users, {role: 'admin'}),
      monitors: _.filter(users, {role: 'monitor'}),
      watchers: _.filter(users, {role: 'watcher'}),
      tecs: _.filter(users, {role: 'tec'})
    };

    yield this.render('record_show', _.assign({
      page: 'record_show',
      stringify: JSON.stringify
    }, result));

	} catch(err) {
		yield helper.handleError(this, err);
	};

};

exports.list = function* () {

  try {

    var param = JSON.parse(this.query.param);
    var cPage = this.query.cPage;
    var pageSize = this.query.pageSize;

    var result = yield record.list(param, cPage, pageSize);

    this.body = {
      status: 1,
      totalPage: result.totalPage,
      totalCount: result.totalCount,
      cPage: cPage,
      list: result.list
    };
  } catch(err) {
    yield helper.handleError(this, err, 'json');
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
      users: {},
      usersByRole: {}
    };

    resource.forEach(function(item) {
      result[item.type + 's'] = item.list;
    });

    result.groups.forEach(function(item) {

    	result.users[item.name] = _.filter(users, {dept: item.name});
    });

    result.usersByRole = {

    	admins: _.filter(users, {role: 'admin'}),
			monitors: _.filter(users, {role: 'monitor'}),
			watchers: _.filter(users, {role: 'watcher'}),
			tecs: _.filter(users, {role: 'tec'})
    };

		yield this.render('record_new', _.assign({
			page: 'record_new',
			stringify: JSON.stringify
		}, result));

	} catch(err) {
		yield helper.handleError(this, err);
	};
};

/**
 * 创建记录
 */
exports.create = function* () {

	try {

    yield record.create(this.request.body.data);

    this.body = {
      status: 1
    };
	} catch(err) {
		yield helper.handleError(this, err, 'json');
	};
}

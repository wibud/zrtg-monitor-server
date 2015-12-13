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
var iconv = require('iconv-lite');
var moment = require('moment');

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

exports.showFeedback = function* () {

  try {

    // 获取用户，按科组分组
    var users = yield User.find({});

    var tec = _.filter(users, {role: 'tec'});

    yield this.render('record_feedback', {
      page: 'record_feedback',
      tec: tec
    });
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

/**
 * 导出记录
 */
exports.export = function* () {

  try {

    var param = JSON.parse(this.query.param);
    var type = this.query.type;

    var result = yield record.listAll(param);
    var resultArray = [];

    var filename = '值班记录表' + moment().format('YYYY-MM-DD_HH:mm:ss');

    var content = '序号,科组,发现人,班次,发现日期,发现时间,频道,节目类型,栏目名称,事件性质,错误类别,具体问题,描述补充,错误入点,持续时长,技术科反馈,技术值班,上报,重播,备注\n';

    _.each(result, function(item, index) {

      resultArray = [
        index + 1,
        item.dept || '',
        item.finder || '',
        item.clas || '',
        item.date || '',
        item.time || '',
        item.channel || '',
        item.program || '',
        item.section || '',
        item.event || '',
        item.error || '',
        item.question || '',
        item.desc || '',
        item.playtime || '',
        item.duration || '',
        item.feedback || '',
        item.duty || '',
        item.report || '',
        item.replay || '',
        item.remark || ''
      ];

      content += resultArray.join(',') + '\n';
    });

    if(type == 0) {

      content = iconv.encode(new Buffer(content),'gbk');
      filename = iconv.encode(new Buffer(filename+'(gbk)'),'gbk').toString('binary');
      this.response.set('Content-Type', 'text/csv; charset=GBK');
    } else {
      filename = filename+'(utf8)';
      this.response.set('Content-Type', 'text/csv');
    }

    this.response.set('Content-Disposition', 'attachment; filename="' + filename + '.csv"');

    this.body = content;

  } catch(err) {
    yield helper.handleError(this, err, 'json');
  };
}

exports.feedback = function* () {

  try {

    yield record.update(this.request.body);

    this.body = {
      status: 1
    };
  } catch(err) {
    yield helper.handleError(this, err, 'json');
  };
}

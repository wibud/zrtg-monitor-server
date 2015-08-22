/**
 * 资源管理：如频道，出错类型等
 */

'use strict';

var Resource = require('../models/resource');
var helper = require('../lib/helper');
var log = helper.getLogger('resource');


/**
 * 获取所有资源
 */
exports.manage = function* () {

	try {

    var resource = Resource.find({});

		yield this.render('resource_manage', {
			page: 'resource_manage',
      resources: resource
		});

	} catch(err) {
		yield helper.handleError(this, err);
	};

};

/**
 * 获取某个类型的资源
 */
exports.get = function* () {

  try {

    var type = this.query.type;
    var typeData = yield Resource.find({type: type});
    var list = typeData.list;

    this.body = {
      status: 1,
      list: list
    };

  } catch(err) {
    yield helper.handleError(this, err, json);
  };

};


/**
 * 为某个类型的资源增加一个字段
 */
exports.new = function* () {

  try {

    yield Resource.new(this.query.type, this.query.name);

    this.body = {
      status: 1
    };

  } catch(err) {
    yield helper.handleError(this, err, json);
  };

};

/**
 * 删除某个类型的一个标签
 */
exports.remove = function* () {

  try {

    yield Resource.remove(this.query.type, this.query.name);

    this.body = {
      status: 1
    };

  } catch(err) {
    yield helper.handleError(this, err, json);
  };

};




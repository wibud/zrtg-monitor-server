/**
 * 资源管理：如频道，出错类型等
 */

'use strict';

var user = require('../models/resource');
var helper = require('../lib/helper');
var log = helper.getLogger('resource');


/**
 * 用户管理
 */
exports.manage = function* () {

	try {

		yield this.render('resource_manage', {
			page: 'resource_manage'
		});

	} catch(err) {
		yield helper.handleError(this, err);
	};


};
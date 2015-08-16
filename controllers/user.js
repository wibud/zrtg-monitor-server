/**
 * 帐号管理
 */

'use strict';

var user = require('../models/user');
var helper = require('../lib/helper');
var log = helper.getLogger('user');


/**
 * 账户管理首页
 */
exports.login = function* () {

	try {

		yield this.render('user_login', {
			page: 'user_login'
		});

	} catch(err) {
		yield helper.handleError(this, err);
	};

};

/**
 * 用户管理
 */
exports.manage = function* () {

	try {

		yield this.render('user_manage', {
			page: 'user_manage'
		});

	} catch(err) {
		yield helper.handleError(this, err);
	};


};
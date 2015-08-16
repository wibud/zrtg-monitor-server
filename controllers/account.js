/**
 * 帐号管理
 */

'use strict';

var account = require('../models/account');
var helper = require('../lib/helper');
var log = helper.getLogger('account');


/**
 * 账户管理首页
 */
exports.index = function* (next) {

	try {

		var accounts = yield account.getAll();

		log.debug(accounts);

		yield this.render('account', {
		});

	} catch(err) {
		yield helper.handleError(this, err);
	};

};
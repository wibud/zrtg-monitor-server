/**
 * 帐号管理
 */

'use strict';

var helper = require('../lib/helper');
var log = helper.getLogger('account');


/**
 * 账户管理首页
 */
exports.index = function* () {

	yield this.render('account', {

	});

};
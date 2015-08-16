/**
 * 记录管理
 */

'use strict';

var record = require('../models/record');
var helper = require('../lib/helper');
var log = helper.getLogger('record');


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

		yield this.render('record_new', {
			page: 'record_new'
		});

	} catch(err) {
		yield helper.handleError(this, err);
	};


};
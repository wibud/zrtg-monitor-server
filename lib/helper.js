/**
 * helper methods
 */

'use strict';

var log4js = require('log4js');
var log = log4js.getLogger('hepler');

var helper = {

	getLogger: function(name) {
		return log4js.getLogger(name);
	},

	/**
	 * 异常处理
	 */
	handleError: function* (context, err) {

		if (err) {
			log.error(err);
			context.status = 500;
			yield context.render('error', {err: err});
		}

	}

};


module.exports = helper;
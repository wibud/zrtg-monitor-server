/**
 * helper methods
 */

'use strict';

var log4js = require('log4js');

var helper = {

	getLogger: function(name) {
		return log4js.getLogger(name);
	}

};


module.exports = helper;
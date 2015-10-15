/**
 * config
 */

module.exports = (function() {

	return {

		port: 8801,
		key: ['session key'],


		adminName: 'zrgtAdmin',
		adminPwd: 'zrgtAdminPwd',

		db: {
			host: '127.0.0.1',
			port: '27017',
			dbName: 'zrtg'
		}

	};

})();

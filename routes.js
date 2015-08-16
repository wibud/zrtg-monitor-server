/**
 * app routes
 */

'use strict';


var common = require('./controllers/common');
var account = require('./controllers/account');

module.exports = function(router) {

	router.get('/', common.home);

  router.get('/account/', account.index);

  router.get('*', common.notFound);

};

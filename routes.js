/**
 * app routes
 */

'use strict';


var common = require('./controllers/common');
var user = require('./controllers/user');
var record = require('./controllers/record');
var resource = require('./controllers/resource');


module.exports = function(router) {

	router.get('/', common.home);

  router.get('/user/login', user.login);
  router.get('/user/logout', user.logout);
  router.post('/user/loginCheck', user.loginCheck);
  router.get('/user/manage', user.manage);
  router.post('/user/new', user.new);
  router.delete('/user/remove', user.remove);
  router.get('/user/edit', user.edit);

  router.get('/record/show', record.show);
  router.get('/record/new', record.new);

  router.get('/resource/manage', resource.manage);

  router.get('*', common.notFound);

};

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

  // 用户相关
  router.get('/user/login', user.login);
  router.get('/user/logout', user.logout);
  router.post('/user/loginCheck', user.loginCheck);
  router.get('/user/manage', user.manage);
  router.post('/user/new', user.new);
  router.get('/user/remove', user.remove);
  router.get('/user/edit', user.edit);

  router.get('/record/show', record.show);
  router.get('/record/new', record.new);

  // 资源相关：如增加错误类型，频道等
  router.get('/resource/manage', resource.manage);
  router.get('/resource/get', resource.get);
  router.get('/resource/new', resource.new);
  router.get('/resource/remove', resource.remove);

  // 404
  router.get('*', common.notFound);

};

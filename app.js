/**
 * 项目入口文件
 */

'use strict';

var path = require('path');
var fs = require('fs');
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var router = require('koa-router')();
var koaLogger = require('koa-logger');
var session = require('koa-session');
var serve = require('koa-static');
var favicon = require('koa-favicon')
var mount = require('koa-mount');

var helper = require('./lib/helper');
var db = require('./lib/db');

var app = require('xtpl/lib/koa')(koa(), {
  views: path.resolve(__dirname, './views')
});

db.connect(function(err, db) {

	if (err) {
		throw err;
	}

	helper.db = db;

	var config = require('./config');
	var routes = require('./routes');
	var log = helper.getLogger('app.js');
	// init XTemplate helper methods
	require('./lib/xtemplate');

	app.use(mount('/assets', serve('./assets/')));

	routes(router);

	app.use(koaLogger());
	app.keys = config.key;
	app.use(session(app));
	app.use(bodyParser());
	app.use(favicon(__dirname + '/assets/favicon.ico'));

	// 登录
	app.use(function* (next) {

		if (/assets|user\/login|loginCheck/.test(this.path)) {
			// 静态资源和登录页面不需要验证 session
			return yield next;
		}

		if (this.session.user && this.session.user.name) {

			// session 存在，已登录
			this.state.user = this.session.user

			return yield next;
		}

		return this.redirect('/user/login');

	});

	app.use(router.routes());

	app.listen(config.port, function() {
		log.info('Server started on port %d', config.port);
	});

});

module.exports = app;

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

var config = require('./config');
var routes = require('./routes');
var helper = require('./lib/helper');
var log = helper.getLogger('app.js');

// init XTemplate helper methods
require('./lib/xtemplate');

var app = require('xtpl/lib/koa')(koa(), {
  views: path.resolve(__dirname, './views')
});


routes(router);

app.use(koaLogger());
app.keys = config.key;
app.use(session(app));
app.use(bodyParser());
app.use(favicon(__dirname + '/asserts/favicon.ico'));

app.use(serve(__dirname + '/asserts/'));
app.use(router.routes());

app.listen(config.port, function() {
	log.info('Server started on port %d', config.port);
});

module.exports = app;

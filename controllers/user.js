/**
 * 帐号管理
 */

'use strict';

var User = require('../models/user');
var helper = require('../lib/helper');
var log = helper.getLogger('user');
var _ = helper._;

/**
 * 账户管理首页
 */
exports.login = function* () {

	try {

		if (this.session.user && this.session.user.name) {
			this.redirect('/');
		}

		yield this.render('user_login', {
			page: 'user_login'
		});

	} catch(err) {
		yield helper.handleError(this, err);
	}

};

/**
 * 登出
 */
exports.logout = function* () {

	try {

		this.session = null;
		this.body = {status: 1};

	} catch(err) {
		yield helper.handleError(this, err, 'json');
	}

};


/**
 * 登录验证
 */
exports.loginCheck = function* () {

	try {

		var name = this.request.body.name.trim();
		var password = this.request.body.password.trim();

		var users = yield User.find({name: name});

		if (users.length === 0) {
			this.body = {status: -1, message: '该用户帐号不存在'};
		} else {

			var user = users[0];

			if (password.trim() === user.password) {

				this.session.user = {
					name: user.name,
					role: user.role
				};

				// views 里可以直接访问
				this.state.user = {
					name: user.name,
					role: user.role
				};

				// this.
				this.body = {status: 1};

			} else {

				this.body = {status: -1, message: '密码错误'};

			}

		}

	} catch(err) {
		log.error(err);
		yield helper.handleError(this, err, 'json');
	}

};

/**
 * 用户管理
 */
exports.manage = function* () {

	try {

		var users = yield User.find({}),
			admins = _.filter(users, {role: 'admin'}),
			monitors = _.filter(users, {role: 'monitor'}),
			watchers = _.filter(users, {role: 'watcher'}),
			tecs = _.filter(users, {role: 'tec'});

		yield this.render('user_manage', {
			page: 'user_manage',
			admins: admins,
			monitors: monitors,
			watchers: watchers,
			tecs: tecs,
			whole: admins.concat(monitors, watchers, tecs)
		});

	} catch(err) {
		yield helper.handleError(this, err);
	}


};


/**
 * 新增用户
 */
exports.new = function* () {

	try {

		yield User.new({
			name: this.query.name,
			password: this.query.password,
			role: this.query.role
		});

		this.body = {status: 1};

	} catch(err) {
		yield helper.handleError(this, err, 'json');
	}

};


/**
 * 删除用户
 */
exports.remove = function* () {

	try {

		yield User.remove({
			name: this.query.name
		});

		this.body = {status: 1};

	} catch(err) {
		yield helper.handleError(this, err, 'json');
	}

};

/**
 * 编辑用户
 */
exports.edit = function* () {

	try {

		yield User.edit(this.query.name, this.query.newName, this.query.newPwd, this.query.newRole);

		this.body = {status: 1};

	} catch(err) {
		yield helper.handleError(this, err, 'json');
	}

};

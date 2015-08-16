(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


var login = {

	init: function() {

		this.bindEvent();

	},


	bindEvent: function() {

		var $form = $('.J_LoginForm');


		// 点击登录按钮
		$form.find('.J_GoLogin').on('click', function() {

			var name = $form.find('[name="name"]').val().trim();
			var password = $form.find('[name="password"]').val().trim();

			if (name === '') {
				alert('名字不能为空');
			} else if (password === '') {
				alert('密码不能为空');
			} else {

				$.ajax({
					type: 'POST',
					url: '/user/loginCheck',
					data: {
						name: name,
						password: password
					},
					dataType: 'json',
					success: function(res) {

						if (res.status != 1) {
							alert(res.message);
						} else {
							location.href = '/';
						}
					},
					error: function(err) {
						// alert(err.message);
						console.error(err);
					}
				});
			}

		});

	}


}

login.init();

module.exports = login;
},{}]},{},[1]);

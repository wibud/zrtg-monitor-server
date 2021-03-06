

var login = {

	init: function() {

		this.bindEvent();

	},

	bindEvent: function() {

		var $form = $('.J_LoginForm');
		var self = this;

		// 点击登录按钮
		$form.find('.J_GoLogin').on('click', function(e) {

			e && e.preventDefault();

			self.submit();
		});

		// 回车按钮
		$(document).keypress(function(e) {

			if(e.which == 13) self.submit();
		});
	},

	submit: function() {

		var $form = $('.J_LoginForm');

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
	}
}

login.init();

module.exports = login;

var helper = require('../lib/helper');
var log = helper.getLogger('user');
var _ = helper._;

exports.home = function* (){

	yield this.render('home', {
        page: 'home'
    });
};

exports.notFound = function* () {

	this.status = 404;
	yield this.render('404');

};


exports.home = function* (){
	yield this.render('home', {
        page: 'home'
    });
};

exports.notFound = function* () {

	this.status = 404;
	yield this.render('404');

};

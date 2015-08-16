

exports.home = function* (){
	yield this.render('home');
};

exports.notFound = function* () {

	this.status = 400;
	yield this.render('404');

};

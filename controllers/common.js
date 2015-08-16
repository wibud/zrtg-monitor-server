

exports.home = function* (){
	this.body = 'Home';
};

exports.notFound = function* () {

	this.status = 400;
	yield this.render('404');

};

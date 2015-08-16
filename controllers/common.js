

exports.home = function* (){
	this.body = 'Home';
};

exports.notFound = function* () {

	yield this.render('404');

};

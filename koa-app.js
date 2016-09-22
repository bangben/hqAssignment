'use strict';
//Node global :

global.globReq = function(p) {
    return require(__dirname + '/' + p);
};

global.globRootPath = __dirname + '/';


var config = require(__dirname + '/config/config.json');


var koa = require('koa');
var mount = require('koa-mount');
var bouncer = require('koa-bouncer');

var port = process.env.PORT || 3002;
var app = module.exports = koa();
var server;

app.context.DB = require('./models');

app.use(bouncer.middleware());


app.use(function *(next){
try{
    yield next; //pass on the execution to downstream middlewares
} catch (err) { //executed only when an error occurs & no other middleware responds to the request
	console.log('top level default error handler executed');
	console.log(err);
    this.status = err.status || 500;
    this.body = err.message;
}
});


app.use(require('./apps/www/routes/wwwRoutes.js'));
app.use(mount('/admin', require('./apps/admin/routes/adminRoutes.js')));


app.use(function* notFound(next) {
    yield next; // actually no next...
    this.status = 404;
    this.body = 'Sorry, Page not found.';
});


app.context.DB.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true})
.then(function(r){


  app.context.DB.sequelize.sync({force:config.sequelize.dropTable, logging:false})
	.then(function() {
		server = require('http').Server(app.callback());

		server.listen(port, function() {
			console.log('Koa server listening on port ' + port);
		});
	});

});
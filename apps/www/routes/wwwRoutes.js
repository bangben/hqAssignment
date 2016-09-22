/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  www routes                                                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

var router = require('koa-router')(); // router middleware for koa
var www = globReq('apps/www/handlers/www.js');
var koaBody = require('koa-body');


router.get('/', www.orderIPG);
router.post('/orderIPG', koaBody(),  www.doPlaceOrderIPG);


module.exports = router.middleware();


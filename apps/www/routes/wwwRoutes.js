/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  www routes                                                                                  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa
const www = globReq('apps/www/handlers/www.js');
var koaBody = require('koa-body');


router.get('/', www.orderIPG);
router.post('/orderIPG', koaBody(),  www.doPlaceOrderIPG);


module.exports = router.middleware();


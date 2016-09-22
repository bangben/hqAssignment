/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  admin routes -- mounted under /admin                                                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

var router = require('koa-router')(); // router middleware for koa
var admin = ojoReq('apps/admin/handlers/admin.js');

//this route should be protected. To make it simple, i have not implemented authentication feature.
router.get('/populateDB', admin.populateDB);


module.exports = router.middleware();
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Admin handlers (invoked by router to populate currency and orderStatus database table)         */
/* hO = handler Object																			  */
/* hO.populateDB = to fill initial data on currency and orderStatus table                         */
/*                                         														  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


var hO = module.exports = {};


hO.populateDB = function *(next){
	yield this.DB.currency.bulkCreate([
		{name: 'US Dollar', shortName: 'USD', setDefault:  1},
		{name: 'Euro', shortName: 'EUR'},
		{name: 'Thai Baht', shortName: 'THB'},
		{name: 'Hongkong Dollar', shortName: 'HKD'},
		{name: 'Singapore Dollar', shortName: 'SGD'},
		{name: 'Australian Dollar', shortName: 'AUD'}
	]);

	yield this.DB.orderStatus.bulkCreate([
		{orderStatus: 'unpaid', activeStatus: 1},
		{orderStatus: 'paid', activeStatus: 1},
		{orderStatus: 'refunded', activeStatus: 1},
		{orderStatus: 'canceled', activeStatus: 1},
	]);
};


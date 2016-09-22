/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* www handlers (invoked by router to render templates and to run paypal & braintree node SDK)    */
/* hO = handler Object																			  */
/* hO.orderIPG = get request to display the form									              */
/* hO.doPlaceOrderIPG = post request to handle form submitted 									  */
/* hO.ppCharge = make paypal payment method 			 									      */
/* hO.btCharge = make braintree payment method 													  */
/* 															 									  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

var marko		= require('marko'); //template library
var helpers		= globReq('helpers'); //helper functions
var templateDir	= globRootPath + 'apps/www/templates/'; //path to template files
var config		= globReq('config/config.json'); //parse config file
var bouncer 	= require('koa-bouncer'); //validator library
var shortIdGen	= globReq('shortIdGenerator'); //shortId Generator module


var hO = module.exports = {};



//make paypal payment method
hO.ppCharge = function *(obj, next)
{
	//console.log('ppCharge obj: ' + helpers.jsonStringLog(obj));
	// AMEX & USD  + !AMEX & (USD || EUR || AUD)
	var paypal = require('paypal-rest-sdk');
	var o = obj.paymentObj;
	var nameObj = helpers.splitFullName(o.custName);
	var status = 0;
	var responseObj = null;
	var errMsg = '';

	//configure paypal
	paypal.configure({
	    'mode': config.paypal.mode,
	    'client_id': config.paypal.clientId,
	    'client_secret': config.paypal.secret
	});


	//convert callback to promise
	var bluebird = require("bluebird");
	var ppCreditCardPromise = bluebird.promisify(paypal.creditCard.create, {context: paypal.payment});

	//console.log(helpers.jsonStringLog(ppCreditCardPromise));

	var ppCreditCardPromiseRes = yield ppCreditCardPromise({
		"intent": "sale",
	    "payer": {
	        "payment_method": "credit_card",
	        "funding_instruments": [
	            {
	                "credit_card": {
	                    "number": o.ccNumber.toString(),
	                    "type": obj.ccType,
	                    "expire_month": o.ccExpMonth,
	                    "expire_year": o.ccExpYear,
	                    "cvv2": o.ccCVV,
	                    "first_name": nameObj.custNameFirst,
	                    "last_name": nameObj.custNameLast,
	                }
	            }
	        ]
	    },
	    "transactions": [
	        {
	            "amount": {
	                "total": o.price,
	                "currency": o.currency,
	            },
	            "description": "This is the payment transaction for Order Number " + obj.orderNumber

	        }
	    ]

	});

	//console.log('ppCreditCardPromiseRes : ' + helpers.jsonStringLog(ppCreditCardPromiseRes));


//I have not implemented the handling of response because i kept getting paypal sandbox api response : 'internal server error'
//need more information of response object properties to implement response handling
/*
	if(typeof ppCreditCardPromiseRes !== 'undefined' && ppCreditCardPromiseRes !== null)
	{
		if(ppCreditCardPromiseRes.success === true)
		{
			//status = (btSalePromiseRes.success === true) ? 1 : 0;
			status = 1;
	        responseObj = btSalePromiseRes;
	        errMsg = '';
	    }
	    else
	    {
	    	status = 0;
		    responseObj = btSalePromiseRes;

	    	if(btSalePromiseRes.transaction.status === 'processor_declined')
		        errMsg = 'Transaction Declined' + ' ' + '(' + btSalePromiseRes.transaction.status + ', ' + btSalePromiseRes.message + ')';
	    	else
	    		errMsg = 'Credit card transaction Failed';
	    }

	}
	else
	{
        status = 0;
        responseObj = null;
        errMsg = 'Error Making Credit Card Payment';
	}
*/

	return {status: status, responseObj: responseObj, errMsg:errMsg, paymentGW: config.paypal.gwName}
};


//make braintree payment method
hO.btCharge = function *(obj, next)
{

	// !AMEX : THB, HKD, SGD
	var bt = require("braintree");
	var o = obj.paymentObj;
	var nameObj = helpers.splitFullName(o.custName);
	var status = 0;
	var responseObj = null;
	var errMsg = '';

	var gw = bt.connect({
	  environment: bt.Environment.Sandbox,
	  merchantId: config.braintree.merchantId,
	  publicKey: config.braintree.publicKey,
	  privateKey: config.braintree.privateKey
	});

	//convert callback to promise
	var bluebird = require("bluebird");
	var btSalePromise = bluebird.promisify(gw.transaction.sale, {context: gw.transaction});

	var btSalePromiseRes = yield btSalePromise({
		amount: o.price,
		orderId: o.orderNumber,
		merchantAccountId: o.currency,

		creditCard: {
			cardholderName : o.ccHolderName,
			number: o.ccNumber,
			expirationMonth: o.ccExpMonth,
			expirationYear: o.ccExpYear,
			cvv: o.ccCVV
		},
		customer: {
			firstName: nameObj.custNameFirst,
			lastName: nameObj.custNameLast
		},
		//direct settlement request :
		options: {
			submitForSettlement: config.braintree.submitForSettlement
		}
	});

	//console.log('btSalePromiseRes : ' + helpers.jsonStringLog(btSalePromiseRes));

	if(typeof btSalePromiseRes !== 'undefined' && btSalePromiseRes !== null)
	{
		if(btSalePromiseRes.success === true)
		{
			//status = (btSalePromiseRes.success === true) ? 1 : 0;
			status = 1;
	        responseObj = btSalePromiseRes;
	        errMsg = '';
	    }
	    else
	    {
	    	status = 0;
		    responseObj = btSalePromiseRes;
	    	
	    	if(typeof btSalePromiseRes.transaction !== 'undefined')
	    	{
		    	if(btSalePromiseRes.transaction.status === 'processor_declined')
			        errMsg = 'Transaction Declined' + ' ' + '(' + btSalePromiseRes.transaction.status + ', ' + btSalePromiseRes.message + ')';
		    	else
		    		errMsg = 'Credit card transaction Failed';
		    }
		    else
		    {
		    	errMsg = 'Transaction Failed' + ' ' + btSalePromiseRes.message;

		    }
	    }
	}
	else
	{
        status = 0;
        responseObj = null;
        errMsg = 'Error Making Credit Card Payment';
	}

	return {status: status, responseObj: responseObj, errMsg:errMsg, paymentGW: config.braintree.gwName}
};


//get request to display the form
hO.orderIPG = function *(next){

	//fetch currency from db table
	var currencyRows = null;
	var currencytData = [];

	var currencyRows = yield this.DB.currency.findAll({attributes: ['id', 'name', 'shortName', 'setDefault'], where: {activeStatus: 1}, order: [['setDefault', 'DESC']]});
	if(currencyRows.length > 0)
		currencytData = currencyRows;

	//template variable(s)
    var templateData = {
    					currencytData: currencytData
    				};

    this.type = 'html';
    this.body = marko.load(templateDir + 'orderIPG.marko').stream(templateData);
    this.status = 200;

}

//post request to handle form submitted
hO.doPlaceOrderIPG = function *(next){

	//console.log(this.request.body);

	var curDate = new Date();
	var currencyRows = null;
	var currencyShortNameArr = [];
	var response = null;
	var templateData = null;
	var currencyId = null;

	//User Input Validations (using koa-bouncer):
	this.validateBody('price')
  	.required('Price parameter is required')
  	.isString()
  	.trim()
  	.isLength(1, 8, 'Price length : minimum 1 digit and maximum 8 digits (including decimal)')
	.match(/^[0-9\.]+$/i, 'Price : Invalid character. Allowed character(s) : 0-9 and .')

	//fetch currency shortName and id from db table. shortName for validating currency select option and id for inserting data into db table order.
	currencyRows = yield this.DB.currency.findAll({attributes: ['shortName'], where: {activeStatus: 1}});
	if(currencyRows.length > 0)
	{
		currencyShortNameArr = currencyRows.map(function(c){
			return c.shortName;
		});
	}

	this.validateBody('currency')
  	.required('Currency parameter is required')
  	.isString()
  	.trim()
  	.isLength(3, 3, 'Currency length: minimum 3 characters and maximum 3 characters')
  	.isIn(currencyShortNameArr, 'Invalid Currency')

	this.validateBody('custName')
	.required('Customer Name parameter is required')
	.isString()
	.trim()
	.isLength(2, 100, 'Customer Name length : minimum 2 characters and maximum 100 characters')
	.match(/^[a-z0-9_\-\.,\(\)\'\"\s]+$/i, 'Currency id : Invalid character. Allowed character(s) : a-z, 0-9, _, -, ., (), \', \", and space');

	this.validateBody('ccHolderName')
	.required('Card Holder Name parameter is required')
	.isString()
	.trim()
	.isLength(2, 100, 'Card Holder Name length : minimum 2 characters and maximum 100 characters')
	.match(/^[a-z0-9_\-\.,\(\)\'\"\s]+$/i, 'Currency id : Invalid character. Allowed character(s) : a-z, 0-9, _, -, ., (), \', \", and space');

	//cc number validation : visa, mastercard, amex
	this.validateBody('ccNumber')
  	.required('Card Number parameter is required')
  	.isString()
  	.trim()
  	.isLength(13, 16, 'Card Number length : minimum 13 characters and maximum 16 characters');

	this.validateBody('ccExpMonth')
  	.required('Card Expiry Month parameter is required')
  	.isString()
  	.trim()
  	.isLength(2, 2, 'Card Expiry Month length: minimum 2 digits and maximum 2 digits')
	.match(/^[0-9]+$/i, 'Card Expiry Month : Invalid character. Allowed character(s) : 0-9')
	.tap(function(x) {return parseInt(x, 10)})
	.isIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'Invalid Card Expiry Month')

	this.validateBody('ccExpYear')
  	.required('Card Expiry Year parameter is required')
  	.isString()
  	.trim()
  	.isLength(4, 4, 'Card Expiry Year length: minimum 4 digits and maximum 4 digits')
  	.match(/^[0-9]+$/i, 'Card Expiry Year : Invalid character. Allowed character(s) : 0-9')
  	.tap(function(x) {return parseInt(x, 10)})
  	.gte(curDate.getFullYear(), 'Invalid Card Expiry Year, you entered a Year that is less than current Year');

	this.validateBody('ccCVV')
  	.required('CVV Number parameter is required')
  	.isString()
  	.trim()
  	.isLength(3, 4, 'CVV Number length: minimum 3 digits and maximum 4 digits')
  	.match(/^[0-9]+$/i, 'CVV Number : Invalid character. Allowed character(s) : 0-9')
  	.tap(function(x) {return parseInt(x, 10)});


  	var orderNumber = shortIdGen.generate();
  	var ccType = '';

	if(/^3[47][0-9]{13}$/.test(this.vals.ccNumber))
		ccType = 'amex';

  	if(ccType === 'amex')
  	{
		//PAYPAL
		if(this.vals.currency === 'USD') //call paypal method if currency is USD
		{

			//console.log('AMEX & USD');
			//Call paypal method here
			response = yield* hO.ppCharge({paymentObj: this.vals, ccType: ccType});
		}
		else
		{
			//return error msg USD Currency is required for AMEX Card.
			//console.log('ERROR : AMEX & NOT USD');
			response = {status: 0, responseObj: '-', errMsg: 'AMEX Card Payment requires USD currency'}
		}
  	}
  	else //all other cards
  	{
  		if(this.vals.currency === 'USD' || this.vals.currency === 'EUR' || this.vals.currency === 'AUD')
  		{
  			//PAYPAL
  			//console.log('!AMEX & (USD || EUR || AUD)');

  			if(/^4[0-9]{12}(?:[0-9]{3})?$/.test(this.vals.ccNumber))
  				ccType = 'visa';

  			if(/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(this.vals.ccNumber))
  				ccType = 'mastercard';

  			if(/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(this.vals.ccNumber))
  				ccType = 'diners club'; //need to check paypal api howto write cctype for diners club

  			if(/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(this.vals.ccNumber))
  				ccType = 'discover';

  			if(/^(?:2131|1800|35\d{3})\d{11}$/.test(this.vals.ccNumber))
  				ccType = 'jcb';

			//Call paypal method here
  			response = yield* hO.ppCharge({paymentObj: this.vals, orderNumber: orderNumber, ccType: ccType});
  			//console.log(helpers.jsonStringLog(response));


  		}
  		else
  		{
  			//BRAINTREE
  			//console.log('!AMEX & (THB || HKD || SGD)');

  			//Call braintree method here
  			response = yield* hO.btCharge({paymentObj: this.vals, orderNumber: orderNumber, ccType: ccType}); //ccType is not being used on Braintree, ccType pass as obj property for consistency only
			//console.log('response obj : ' + helpers.jsonStringLog(response));

  		}
  	}

  	//fetch currency id of selected currency
  	var selectedCurrencyRow = yield this.DB.currency.findOne({attributes: ['id'], where : {shortName: this.vals.currency}});
  	if(typeof selectedCurrencyRow !== 'undefined' && selectedCurrencyRow !== null)
  	{
  		currencyId = selectedCurrencyRow.id

	  	//save order data and payment gw response into db table
		var orderRows = yield this.DB.order.create({
			orderNumber: orderNumber,
			customerName: this.vals.custName,
			price: this.vals.price,
			transactionResponse: JSON.stringify(response.responseObj),
			currencyId: currencyId,
			orderStatusId: (response.status === 1) ? 2 : 1 //if status === 1 payment success, mark order paid id 2. Else mark order unpaid id 1
		});

		if(typeof orderRows !== 'undefined' && orderRows !== null)
		{
			//mask sensitive data like cc number and cvv to be displayed to client / user
			var toClientData = this.vals;
			toClientData.ccNumber = this.vals.ccNumber.replace(/\d(?=\d{4})/g, '*');
			toClientData.ccCVV = this.vals.ccCVV.toString().replace(/\d/g, '*');
	  		templateData = {
	  			status: response.status,
	  			errMsg: response.errMsg,
	  			paymentGW: response.paymentGW,
	  			clientData: toClientData,
	  			orderNumber: orderNumber,
	  			ccType: ccType,
	  			transactionId : (response.status === 1) ? response.responseObj.transaction.id : null
	  		};
		}
	}

  	this.type = 'html';
    this.body = marko.load(templateDir + 'orderResult.marko').stream(templateData);
    this.status = 200;

};



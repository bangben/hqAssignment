'use strict';
var helpers = module.exports = {};

helpers.jsonStringLog = function(item){
	return JSON.stringify(item, null, '\t');
};

helpers.splitFullName = function splitFullName(custName)
{
    var custNameArr = custName.split(" ");
    var custNameArrLen = custNameArr.length;
    var custNameFirst = '';
    var custNameLast = '';

    if(custNameArrLen > 1)
    {
        custNameFirst = custNameArr[0];
        custNameLast = custNameArr[custNameArrLen - 1];
    }
    else
        custNameFirst = custNameArr[0];

    return {custNameFirst, custNameLast};

}
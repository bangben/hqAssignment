'use strict';
var helpers = module.exports = {};

helpers.jsonStringLog = function(item){
	return JSON.stringify(item, null, '\t');
};

helpers.dateFormat = function(d){
    //var d = new Date;
    return ([ (d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('-')+
                ' ' +
              [ d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':')
            );
};


helpers.dateTimeFormatIndo = function(d, dl){
    //var d = new Date;
    //format: DD/MM/YYY : HH:mm:ss, dl = delimiter (can be : . or / or -)
    return ([ d.getDate().padLeft(),
              (d.getMonth()+1).padLeft(),
              d.getFullYear()].join(dl)+
                ' ' +
              [ d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':')
            );
};

helpers.dateFormatIndo = function(d, delim){
    //var d = new Date;
    //format: DD/MM/YYYY, dl = delimiter (can be : . or / or -)
    return ([d.getDate().padLeft(),
            (d.getMonth()+1).padLeft(),
            d.getFullYear()].join(delim)
            );
};


helpers.tSD = function thousandSepDot(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

helpers.toInt = function returnInt(x) {
  return parseInt(x, 10);
};

helpers.pMN = function plusMonthFromNow(m){
    var myDate = new Date();
    return myDate.setMonth(myDate.getMonth() + m);

};

helpers.pDN = function plusDayFromNow(d){
    var myDate = new Date();
    return myDate.setDate(myDate.getDate() + d);
};

helpers.pHN = function plusHourFromNow(h){
    var myDate = new Date();
    return myDate.setHours(myDate.getHours() + h);
};

helpers.pHN2 = function plusHourFromNow(d, h){
    var myDate = d;
    return myDate.setHours(myDate.getHours() + h);
};

helpers.roundUsing = function roundUsing(func, number, prec) {
    var tempnumber = number * Math.pow(10, prec);
    tempnumber = func(tempnumber);
    return tempnumber / Math.pow(10, prec);
};

/*
> roundUsing(Math.floor, 0.99999999, 3)
0.999
> roundUsing(Math.ceil, 0.1111111, 3)
0.112

*/

helpers.randInt = function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}


helpers.removeLine = function removeLine(s, rep){
    return s.replace(/(\r\n|\n|\r)/gm, rep);
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
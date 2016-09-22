function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      forEach = __helpers.f,
      attr = __helpers.a;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Place Order | HQ - Backend Assignment - Braintree + Paypal IPG</title><link rel=\"stylesheet\" href=\"https://yui-s.yahooapis.com/pure/0.6.0/pure-min.css\"></head><body style=\"margin: 25px 25px\"><form id=\"placeOrderIPGForm\" method=\"POST\" action=\"/orderIPG\" class=\"pure-form pure-form-aligned\"><fieldset><legend><b>Order Section</b></legend><div class=\"pure-control-group\"><label for=\"currency\">Select Currency</label><select name=\"currency\" id=\"currency\">");

    if (data.currencytData.length > 0) {
      forEach(data.currencytData, function(currency) {
        out.w("<option" +
          attr("value", currency.shortName) +
          ">" +
          escapeXml(currency.name) +
          " (" +
          escapeXml(currency.shortName) +
          ")</option>");
      });
    }

    out.w("</select></div><div class=\"pure-control-group\"><label for=\"price\">Price</label><input id=\"price\" name=\"price\" type=\"text\" placeholder=\"Price\"></div><div class=\"pure-control-group\"><label for=\"custName\">Customer Name</label><input id=\"custName\" name=\"custName\" type=\"text\" placeholder=\"Customer Name\"></div></fieldset><fieldset><legend><b>Credit Card Payment Section</b></legend><div class=\"pure-control-group\"><label for=\"ccHolderName\">Card Holder Name</label><input id=\"ccHolderName\" name=\"ccHolderName\" type=\"text\" placeholder=\"Card Holder Name\"></div><div class=\"pure-control-group\"><label for=\"ccNumber\">Card Number</label><input id=\"ccNumber\" name=\"ccNumber\" type=\"text\" placeholder=\"Card Number\" maxlength=\"16\" size=\"16\"></div><div class=\"pure-control-group\"><label for=\"ccExpMonth\">Card Expiry Month (mm)</label><input id=\"ccExpMonth\" name=\"ccExpMonth\" type=\"text\" placeholder=\"mm\" maxlength=\"2\" size=\"2\"></div><div class=\"pure-control-group\"><label for=\"ccExpYear\">Card Expiry Year (yyyy)</label><input id=\"ccExpYear\" name=\"ccExpYear\" type=\"text\" placeholder=\"yyyy\" maxlength=\"4\" size=\"4\"></div><div class=\"pure-control-group\"><label for=\"ccCVV\">CVV Number<br>(3/4 digit at back of card)</label><input id=\"ccCVV\" name=\"ccCVV\" type=\"text\" placeholder=\"CVV\" maxlength=\"4\" size=\"4\"></div><div class=\"pure-controls\"><button type=\"submit\" name=\"payButton\" id=\"payButton\" class=\"pure-button pure-button-primary\">Pay Now</button></div></fieldset></form></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);

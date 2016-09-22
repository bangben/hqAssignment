function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Order Result | HQ - Backend Assignment - Braintree + Paypal IPG</title><link rel=\"stylesheet\" href=\"https://yui-s.yahooapis.com/pure/0.6.0/pure-min.css\"></head><body style=\"margin: 25px 25px\"><div align=\"center\">");

    if (data.status === 1) {
      out.w(" <h1>Order Result : Success</h1><p>Thank You for your order. The order has been successfully paid using credit card. Detail as the following :</p>");
    } else {
      out.w("<h1>Order Result : Fail</h1><p>Thank You for your order. We are sorry, we cannot process your credit card payment. Detail as the following :</p>");
    }

    out.w("<div>");

    if (data.transactionId !== null) {
      out.w("<span>Transaction Id : " +
        escapeXml(data.transactionId) +
        "</span><br>");
    }

    out.w("<span>Order number : " +
      escapeXml(data.orderNumber) +
      "</span><br><span>Currency : " +
      escapeXml(data.clientData.currency) +
      "</span><br><span>Price : " +
      escapeXml(data.clientData.price) +
      "</span><br><span>Customer Name : " +
      escapeXml(data.clientData.custName) +
      "</span><br><span>Card Holder Name : " +
      escapeXml(data.clientData.ccHolderName) +
      "</span><br><span>Card Number : " +
      escapeXml(data.clientData.ccNumber) +
      "</span><br><span>Card Expiry Month : " +
      escapeXml(data.clientData.ccExpMonth) +
      "</span><br><span>Card Expiry Year : " +
      escapeXml(data.clientData.ccExpYear) +
      "</span><br><span>Card CVV : " +
      escapeXml(data.clientData.ccCVV) +
      "</span><br></div>");

    if (data.errMsg !== "") {
      out.w("<div><p><b>Erorr Message : " +
        escapeXml(data.errMsg) +
        "</b></p></div>");
    }

    out.w("<div>Payment Gateway by : " +
      escapeXml(data.paymentGW) +
      "</div></div></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
